import { create } from 'zustand';
import type { Npc, NpcKey, NpcEvent, NpcEventFrequency, NpcCategory, ContactType, ContactRecord, ContactInitiator } from '../types/npc';
import { INITIAL_NPCS } from '../data/npcs/initialNpcs';
import { useTimeStore } from './useTimeStore';
import { useSceneStore } from './useSceneStore';
import { usePlayerStore } from './usePlayerStore';
import { useCognitionStore } from './useCognitionStore';
import { useWillpowerStore } from './useWillpowerStore';
import { useOrganStore } from './useOrganStore';
import { useMicroEnlightenmentStore } from './useMicroEnlightenmentStore';
import { getDayOfWeek, getYear, START_YEAR } from '../types/time';
import { calculateDialogueConstraints } from '../systems/dialogue/calculateConstraints';
import { generateProtagonistResponse } from '../systems/dialogue/generateResponse';
import { buildDialogueInputForNpc, detectTriggeredTag } from '../systems/dialogue/buildDialogueInput';
import type { DialogueConstraints } from '../types/dialogue';
import { useDialogueMemoryStore } from '../systems/dialogue/dialogueMemoryCache';
import { getConnectionTier } from '../types/trust';

const FREQUENCY_DAYS: Record<NpcEventFrequency, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  rare: 90,
  trigger: Infinity,
};

export interface NpcDialogEntry {
  npcId: NpcKey;
  npcName: string;
  npcDescription?: string;
  content: string;
  eventId: string;
  effect?: NpcEvent['effect'];
  timestamp?: number;
  protagonistResponse?: string;
  protagonistInnerVoice?: string | null;
  protagonistConstraints?: DialogueConstraints;
  triggeredTag?: string | null;
}

export interface InteractionRecord {
  npcId: NpcKey;
  npcName: string;
  content: string;
  eventId: string;
  day: number;
  hour: number;
}

export type ContactRequestPhase = 'pending' | 'accepted' | 'refused' | 'negotiating' | 'in_progress' | 'completed';

export interface ContactRequest {
  npcId: NpcKey;
  npcName: string;
  accepted: boolean;
  refusalReason?: string;
  contactType?: ContactType;
  phase: ContactRequestPhase;
  protagonistPreference?: string;
}

const NPC_CATEGORY_ORDER: NpcCategory[] = ['家人', '旧识', '故交', '新识'];

const REFUSAL_REASONS_HIGH_CONNECTION = [
  '现在不想……过两天吧。',
  '我需要准备一下，不知道说什么。',
  '让我想想，什么时候合适。',
];

const REFUSAL_REASONS_LOW_CONNECTION = [
  '……',
  '不想。',
  '算了。',
];

const CONTACT_TYPE_PREFERENCES: Record<string, ContactType[]> = {
  low_willpower: ['发消息', '写信', '电话', '上门'],
  high_connection: ['电话', '上门', '写信', '发消息'],
  default: ['发消息', '电话', '写信', '上门'],
};

function formatGameDate(day: number): string {
  const year = getYear(day);
  const seasonIndex = Math.floor((day % 360) / 90);
  const seasonDay = (day % 90) + 1;
  const seasonLabels = ['春', '夏', '秋', '冬'];
  return `${year}年${seasonLabels[seasonIndex]}季第${seasonDay}天`;
}

interface NpcActions {
  checkIntroductions: () => Npc[];
  checkEvents: () => NpcEvent[];
  triggerEvent: (event: NpcEvent) => void;
  triggerEventAsDialog: (event: NpcEvent) => void;
  adjustCloseness: (npcId: NpcKey, delta: number) => void;
  adjustAffection: (npcId: NpcKey, delta: number) => void;
  getIntroducedNpcs: () => Npc[];
  getNpc: (npcId: NpcKey) => Npc | undefined;
  reset: () => void;
  getFamilyMembers: () => Npc[];
  getFamilyEventByFrequency: (frequency: NpcEventFrequency) => NpcEvent[];
  checkConnectionGatedEvents: () => NpcEvent[];
  dismissActiveDialog: () => void;
  processNextDialog: () => void;
  checkHourlyNpcEvents: () => void;
  checkTimeSpecificEvents: () => void;
  getRecentInteractions: (count?: number) => InteractionRecord[];
  updateMealTracking: () => void;
  recordContact: (npcId: NpcKey, record: ContactRecord) => void;
  suggestContact: (npcId: NpcKey) => void;
  calculateAcceptanceProbability: (npcId: NpcKey) => number;
  negotiateContactType: (npcId: NpcKey, playerSuggestion: string) => void;
  confirmContactType: (contactType: ContactType) => void;
  completeContact: (summary: string) => void;
  dismissContactRequest: () => void;
  getNpcsByCategory: (category: NpcCategory) => Npc[];
  getDaysSinceLastContact: (npcId: NpcKey) => number;
  unlockNpcContact: (npcId: NpcKey) => void;
}

export const useNpcStore = create<{
  npcs: Npc[];
  activeNpcDialog: NpcDialogEntry | null;
  pendingDialogs: NpcDialogEntry[];
  interactionHistory: InteractionRecord[];
  mealConsecutiveDays: number;
  mealAutoHandled: boolean;
  daysApartFromMother: number;
  contactRequest: ContactRequest | null;
} & NpcActions>((set, get) => ({
  npcs: [...INITIAL_NPCS],
  activeNpcDialog: null,
  pendingDialogs: [],
  interactionHistory: [],
  mealConsecutiveDays: 0,
  mealAutoHandled: false,
  daysApartFromMother: 0,
  contactRequest: null,

  checkIntroductions: (): Npc[] => {
    const timeState = useTimeStore.getState();
    const day = timeState.totalDays;
    const season = timeState.season;

    const toIntroduce = get().npcs.filter(
      (npc) =>
        !npc.isIntroduced &&
        day >= npc.introductionDay &&
        season === npc.introductionSeason
    );

    if (toIntroduce.length > 0) {
      set((state) => ({
        npcs: state.npcs.map((npc) => {
          if (toIntroduce.some((i) => i.id === npc.id)) {
            return { ...npc, isIntroduced: true };
          }
          return npc;
        }),
      }));

      toIntroduce.forEach((npc) => {
        useSceneStore.getState().addNarrativeLog(
          `【新人物】${npc.name}——${npc.introductionContent}`
        );
      });
    }

    return toIntroduce;
  },

  checkEvents: (): NpcEvent[] => {
    const timeState = useTimeStore.getState();
    const day = timeState.totalDays;
    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const dayOfWeek = getDayOfWeek(day);

    const triggered: NpcEvent[] = [];

    get().npcs.forEach((npc) => {
      if (!npc.isIntroduced) return;

      npc.events.forEach((event) => {
        if (day < event.triggerDay) return;

        if (event.triggerDayOfWeek !== undefined && dayOfWeek !== event.triggerDayOfWeek) return;

        const frequency = event.frequency ?? 'trigger';
        const interval = FREQUENCY_DAYS[frequency];

        if (frequency === 'trigger') {
          const alreadyTriggered = useSceneStore
            .getState()
            .narrativeLog.some((log) =>
              log.includes(event.content.substring(0, 20))
            );
          if (alreadyTriggered) return;
        } else {
          const daysSinceTrigger = day - event.triggerDay;
          if (daysSinceTrigger % interval !== 0) return;
        }

        if (
          event.minConnectionLevel !== undefined &&
          connectionLevel < event.minConnectionLevel
        ) {
          return;
        }

        triggered.push(event);
      });
    });

    return triggered;
  },

  triggerEvent: (event: NpcEvent) => {
    useSceneStore.getState().addNarrativeLog(event.content);

    if (event.effect) {
      if (event.effect.trustChange) {
        usePlayerStore.getState().adjustTrust(
          event.effect.trustChange,
          `npc_event_${event.id}`
        );
      }
      if (event.effect.willpowerChange) {
        const willpowerState = useWillpowerStore.getState();
        if (event.effect.willpowerChange > 0) {
          willpowerState.recover(event.effect.willpowerChange);
        } else {
          willpowerState.consume(Math.abs(event.effect.willpowerChange));
        }
      }
      if (event.effect.cognitionUnlock) {
        useCognitionStore.getState().unlockCognition(
          event.effect.cognitionUnlock as any
        );
      }
      if (event.effect.organChange) {
        const organEntries = Object.entries(event.effect.organChange);
        organEntries.forEach(([organ, change]) => {
          useOrganStore.getState().updateOrgan({
            organ: organ as any,
            change: change ?? 0,
            reason: `npc_event_${event.id}`,
          });
        });
      }
    }
  },

  triggerEventAsDialog: (event: NpcEvent) => {
    const npcId = event.id.split('_')[0] as NpcKey;
    const npc = get().getNpc(npcId);

    const dialogueInput = buildDialogueInputForNpc(npcId, event.id, event.content);
    const constraints = calculateDialogueConstraints(dialogueInput);
    const tagResult = detectTriggeredTag(event.content);
    const responseContext = {
      speakerRole: dialogueInput.speakerRole,
      speakerName: npc?.name || '未知',
      npcContent: event.content,
      eventId: event.id,
      constraints,
    };
    const protagonistResult = generateProtagonistResponse(responseContext, tagResult.tag);

    const dialogEntry: NpcDialogEntry = {
      npcId,
      npcName: npc?.name || '未知',
      npcDescription: npc?.description,
      content: event.content,
      eventId: event.id,
      effect: event.effect,
      protagonistResponse: protagonistResult.text,
      protagonistInnerVoice: protagonistResult.innerVoice,
      protagonistConstraints: protagonistResult.constraints,
      triggeredTag: tagResult.tag,
    };

    const state = get();
    if (!state.activeNpcDialog) {
      set({ activeNpcDialog: dialogEntry });
    } else {
      set((s) => ({
        pendingDialogs: [...s.pendingDialogs, dialogEntry],
      }));
    }
  },

  dismissActiveDialog: () => {
    const state = get();
    const dialog = state.activeNpcDialog;
    if (!dialog) return;

    useSceneStore.getState().addNarrativeLog(dialog.content);

    if (dialog.protagonistInnerVoice) {
      useSceneStore.getState().addNarrativeLog(dialog.protagonistInnerVoice);
    }

    if (dialog.protagonistConstraints) {
      if (dialog.protagonistConstraints.defensePosture === 'closed') {
        useSceneStore.getState().addNarrativeLog('（他把自己封闭起来了。）');
      }

      if (dialog.protagonistConstraints.triggeredReaction) {
        useSceneStore.getState().addNarrativeLog(`（${dialog.protagonistConstraints.triggeredReaction}）`);
      }
    }

    if (dialog.effect) {
      if (dialog.effect.trustChange) {
        usePlayerStore.getState().adjustTrust(
          dialog.effect.trustChange,
          `npc_event_${dialog.eventId}`
        );
      }
      if (dialog.effect.willpowerChange) {
        const willpowerState = useWillpowerStore.getState();
        if (dialog.effect.willpowerChange > 0) {
          willpowerState.recover(dialog.effect.willpowerChange);
        } else {
          willpowerState.consume(Math.abs(dialog.effect.willpowerChange));
        }
      }
      if (dialog.effect.cognitionUnlock) {
        useCognitionStore.getState().unlockCognition(
          dialog.effect.cognitionUnlock as any
        );
      }
      if (dialog.effect.organChange) {
        const organEntries = Object.entries(dialog.effect.organChange);
        organEntries.forEach(([organ, change]) => {
          useOrganStore.getState().updateOrgan({
            organ: organ as any,
            change: change ?? 0,
            reason: `npc_event_${dialog.eventId}`,
          });
        });
      }
    }

    const timeState = useTimeStore.getState();
    const record: InteractionRecord = {
      npcId: dialog.npcId,
      npcName: dialog.npcName,
      content: dialog.content,
      eventId: dialog.eventId,
      day: timeState.totalDays,
      hour: timeState.hour,
    };

    if (dialog.protagonistResponse) {
      useDialogueMemoryStore.getState().addEntry({
        speakerRole: dialog.npcId,
        speakerName: dialog.npcName,
        npcContent: dialog.content,
        protagonistResponse: dialog.protagonistResponse,
        triggeredTag: dialog.triggeredTag ?? null,
        emotionalState: useDialogueMemoryStore.getState().currentEmotionalState,
        day: timeState.totalDays,
        hour: timeState.hour,
      });
    }

    const contactRecord: ContactRecord = {
      gameDay: timeState.totalDays,
      gameDate: formatGameDate(timeState.totalDays),
      type: '电话',
      initiator: 'NPC',
      summary: dialog.content.substring(0, 50),
      keywords: [],
    };

    set((s) => ({
      activeNpcDialog: null,
      interactionHistory: [record, ...s.interactionHistory].slice(0, 30),
      npcs: s.npcs.map((npc) => {
        if (npc.id !== dialog.npcId) return npc;
        return {
          ...npc,
          lastContact: contactRecord,
          contactHistory: [contactRecord, ...npc.contactHistory].slice(0, 50),
        };
      }),
    }));
  },

  processNextDialog: () => {
    const state = get();
    if (state.pendingDialogs.length > 0) {
      const [next, ...rest] = state.pendingDialogs;
      set({ activeNpcDialog: next, pendingDialogs: rest });
    }
  },

  adjustCloseness: (npcId: NpcKey, delta: number) => {
    set((state) => ({
      npcs: state.npcs.map((npc) => {
        if (npc.id !== npcId) return npc;
        const newCloseness = Math.max(0, Math.min(100, npc.currentCloseness + delta));
        return {
          ...npc,
          currentCloseness: newCloseness,
          affection: newCloseness,
        };
      }),
    }));
  },

  adjustAffection: (npcId: NpcKey, delta: number) => {
    set((state) => ({
      npcs: state.npcs.map((npc) => {
        if (npc.id !== npcId) return npc;
        const newAffection = Math.max(0, Math.min(100, npc.affection + delta));
        return {
          ...npc,
          affection: newAffection,
          currentCloseness: newAffection,
        };
      }),
    }));
  },

  getIntroducedNpcs: () => {
    return get().npcs.filter((npc) => npc.isIntroduced);
  },

  getNpc: (npcId: NpcKey) => {
    return get().npcs.find((npc) => npc.id === npcId);
  },

  reset: () => {
    set({
      npcs: [...INITIAL_NPCS],
      activeNpcDialog: null,
      pendingDialogs: [],
      interactionHistory: [],
      mealConsecutiveDays: 0,
      mealAutoHandled: false,
      daysApartFromMother: 0,
      contactRequest: null,
    });
  },

  getFamilyMembers: (): Npc[] => {
    return get().npcs.filter((npc) => npc.role === 'FAMILY');
  },

  getFamilyEventByFrequency: (frequency: NpcEventFrequency): NpcEvent[] => {
    const familyNpcs = get().npcs.filter(
      (npc) => npc.role === 'FAMILY' && npc.isIntroduced
    );
    const events: NpcEvent[] = [];
    familyNpcs.forEach((npc) => {
      npc.events.forEach((event) => {
        if (event.frequency === frequency) {
          events.push(event);
        }
      });
    });
    return events;
  },

  checkConnectionGatedEvents: (): NpcEvent[] => {
    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const timeState = useTimeStore.getState();
    const day = timeState.totalDays;

    const gated: NpcEvent[] = [];

    get().npcs.forEach((npc) => {
      if (!npc.isIntroduced) return;

      npc.events.forEach((event) => {
        if (event.minConnectionLevel === undefined) return;
        if (connectionLevel < event.minConnectionLevel) return;
        if (day < event.triggerDay) return;

        const frequency = event.frequency ?? 'trigger';
        if (frequency === 'trigger') {
          const alreadyTriggered = useSceneStore
            .getState()
            .narrativeLog.some((log) =>
              log.includes(event.content.substring(0, 20))
            );
          if (alreadyTriggered) return;
        }

        gated.push(event);
      });
    });

    return gated;
  },

  checkHourlyNpcEvents: () => {
    const timeState = useTimeStore.getState();
    const hour = timeState.hour;

    if (hour < 7 || hour > 21) return;

    const introducedNpcs = get().npcs.filter((npc) => npc.isIntroduced);
    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const day = timeState.totalDays;

    for (const npc of introducedNpcs) {
      for (const event of npc.events) {
        if (day < event.triggerDay) continue;

        if (event.triggerHour !== undefined) continue;

        const frequency = event.frequency ?? 'trigger';
        if (frequency === 'trigger') continue;

        const interval = FREQUENCY_DAYS[frequency];
        const daysSinceTrigger = day - event.triggerDay;
        if (daysSinceTrigger < 0) continue;
        if (daysSinceTrigger % interval !== 0) continue;

        if (event.minConnectionLevel !== undefined && connectionLevel < event.minConnectionLevel) continue;

        const alreadyInDialog = get().activeNpcDialog?.eventId === event.id;
        const alreadyInPending = get().pendingDialogs.some(d => d.eventId === event.id);
        const alreadyInLog = useSceneStore.getState().narrativeLog.some(
          (log) => log.includes(event.content.substring(0, 20))
        );

        if (alreadyInDialog || alreadyInPending || alreadyInLog) continue;

        if (Math.random() < 0.15) {
          get().triggerEventAsDialog(event);
          break;
        }
      }
    }
  },

  checkTimeSpecificEvents: () => {
    const timeState = useTimeStore.getState();
    const hour = timeState.hour;
    const day = timeState.totalDays;
    const dayOfWeek = getDayOfWeek(day);
    const playerAtHome = usePlayerStore.getState().isAtHome;

    const introducedNpcs = get().npcs.filter((npc) => npc.isIntroduced);
    const connectionLevel = usePlayerStore.getState().getConnectionLevel();

    for (const npc of introducedNpcs) {
      for (const event of npc.events) {
        if (event.triggerHour === undefined) continue;
        if (hour !== event.triggerHour) continue;
        if (day < event.triggerDay) continue;

        if (event.triggerDayOfWeek !== undefined && dayOfWeek !== event.triggerDayOfWeek) continue;

        const frequency = event.frequency ?? 'trigger';
        if (frequency === 'trigger') {
          const alreadyTriggered = useSceneStore.getState().narrativeLog.some(
            (log) => log.includes(event.content.substring(0, 20))
          );
          if (alreadyTriggered) continue;
        } else {
          const interval = FREQUENCY_DAYS[frequency];
          const daysSinceTrigger = day - event.triggerDay;
          if (daysSinceTrigger % interval !== 0) continue;
        }

        if (event.minConnectionLevel !== undefined && connectionLevel < event.minConnectionLevel) continue;

        const alreadyInDialog = get().activeNpcDialog?.eventId === event.id;
        const alreadyInPending = get().pendingDialogs.some(d => d.eventId === event.id);
        const alreadyInLog = useSceneStore.getState().narrativeLog.some(
          (log) => log.includes(event.content.substring(0, 20))
        );

        if (alreadyInDialog || alreadyInPending || alreadyInLog) continue;

        const isMealEvent = event.id.startsWith('mother_') && (event.id.includes('breakfast') || event.id.includes('lunch') || event.id.includes('dinner'));

        if (isMealEvent) {
          if (!playerAtHome) continue;

          if (get().mealAutoHandled) {
            get().triggerEvent(event);
            continue;
          }
        }

        get().triggerEventAsDialog(event);
      }
    }
  },

  getRecentInteractions: (count: number = 10): InteractionRecord[] => {
    return get().interactionHistory.slice(0, count);
  },

  updateMealTracking: () => {
    const playerAtHome = usePlayerStore.getState().isAtHome;
    const state = get();

    if (playerAtHome) {
      const hadMealToday = state.interactionHistory.some(
        (r) => r.npcId === 'mother' && r.day === useTimeStore.getState().totalDays
          && (r.eventId.includes('breakfast') || r.eventId.includes('lunch') || r.eventId.includes('dinner'))
      );

      if (hadMealToday) {
        const newConsecutive = state.mealConsecutiveDays + 1;
        const newAutoHandled = newConsecutive >= 3;
        set({ mealConsecutiveDays: newConsecutive, mealAutoHandled: newAutoHandled, daysApartFromMother: 0 });
      } else {
        set({ daysApartFromMother: 0 });
      }
    } else {
      const newDaysApart = state.daysApartFromMother + 1;
      if (newDaysApart >= 3) {
        set({ daysApartFromMother: newDaysApart, mealAutoHandled: false, mealConsecutiveDays: 0 });
      } else {
        set({ daysApartFromMother: newDaysApart });
      }
    }
  },

  recordContact: (npcId: NpcKey, record: ContactRecord) => {
    set((state) => ({
      npcs: state.npcs.map((npc) => {
        if (npc.id !== npcId) return npc;
        return {
          ...npc,
          lastContact: record,
          contactHistory: [record, ...npc.contactHistory].slice(0, 50),
        };
      }),
    }));
  },

  suggestContact: (npcId: NpcKey) => {
    const npc = get().getNpc(npcId);
    if (!npc) return;

    if (!npc.isContactable) {
      set({
        contactRequest: {
          npcId,
          npcName: npc.name,
          accepted: false,
          refusalReason: npc.contactUnlockCondition || '现在还不能联系她。',
          phase: 'refused',
        },
      });
      return;
    }

    if (!npc.isIntroduced) {
      set({
        contactRequest: {
          npcId,
          npcName: npc.name,
          accepted: false,
          refusalReason: '你还不认识这个人。',
          phase: 'refused',
        },
      });
      return;
    }

    if (npcId === 'niece') {
      set({
        contactRequest: {
          npcId,
          npcName: npc.name,
          accepted: true,
          phase: 'accepted',
        },
      });
      return;
    }

    if (npcId === 'father') {
      const connectionLevel = usePlayerStore.getState().getConnectionLevel();
      const tier = getConnectionTier(connectionLevel);
      const willpowerCurrent = useWillpowerStore.getState().current;

      if (tier === '陌路' || tier === '疏远' || willpowerCurrent < 40) {
        set({
          contactRequest: {
            npcId,
            npcName: npc.name,
            accepted: false,
            refusalReason: willpowerCurrent < 40
              ? '……太累了。不想打。'
              : '……我不知道该跟他说什么。',
            phase: 'refused',
          },
        });
        return;
      }
    }

    if (npcId === 'xinyue') {
      const willpowerCurrent = useWillpowerStore.getState().current;
      const cost = Math.floor(willpowerCurrent * 0.5);
      set({
        contactRequest: {
          npcId,
          npcName: npc.name,
          accepted: true,
          phase: 'accepted',
          protagonistPreference: `联系她需要极大的勇气……（将消耗${cost}点意志力）`,
        },
      });
      return;
    }

    const probability = get().calculateAcceptanceProbability(npcId);
    const accepted = Math.random() * 100 < probability;

    if (accepted) {
      const willpowerCurrent = useWillpowerStore.getState().current;
      const connectionLevel = usePlayerStore.getState().getConnectionLevel();
      const tier = getConnectionTier(connectionLevel);

      let preference = '';
      if (willpowerCurrent <= 15) {
        preference = '发消息吧……打电话太累了。';
      } else if (tier === '信任' || tier === '共生') {
        preference = '也许可以打个电话，或者直接去看看。';
      } else {
        preference = '发个消息吧，先试探一下。';
      }

      set({
        contactRequest: {
          npcId,
          npcName: npc.name,
          accepted: true,
          phase: 'accepted',
          protagonistPreference: preference,
        },
      });
    } else {
      const connectionLevel = usePlayerStore.getState().getConnectionLevel();
      const tier = getConnectionTier(connectionLevel);
      const reasons = tier === '倾听' || tier === '信任' || tier === '共生'
        ? REFUSAL_REASONS_HIGH_CONNECTION
        : REFUSAL_REASONS_LOW_CONNECTION;
      const reason = reasons[Math.floor(Math.random() * reasons.length)];

      set({
        contactRequest: {
          npcId,
          npcName: npc.name,
          accepted: false,
          refusalReason: reason,
          phase: 'refused',
        },
      });
    }
  },

  calculateAcceptanceProbability: (npcId: NpcKey): number => {
    let probability = 50;

    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const tier = getConnectionTier(connectionLevel);
    if (tier === '倾听' || tier === '信任' || tier === '共生') {
      probability += 30;
    }

    const npc = get().getNpc(npcId);
    if (npc && npc.affection >= 70) {
      probability += 25;
    }

    const willpowerCurrent = useWillpowerStore.getState().current;
    if (willpowerCurrent >= 50) {
      probability += 20;
    }
    if (willpowerCurrent <= 15) {
      probability -= 40;
    }

    const isDeepNumbness = useWillpowerStore.getState().deepNumbness;
    if (isDeepNumbness) {
      probability -= 60;
    }

    if (npc) {
      const daysSince = get().getDaysSinceLastContact(npcId);
      if (daysSince > 21) {
        probability += 15;
      }
    }

    const microEnlightenmentConsecutive = useMicroEnlightenmentStore.getState().consecutiveCount;
    if (microEnlightenmentConsecutive >= 3) {
      probability += 20;
    }

    return Math.max(10, Math.min(90, probability));
  },

  negotiateContactType: (npcId: NpcKey, playerSuggestion: string) => {
    const npc = get().getNpc(npcId);
    if (!npc) return;

    const willpowerCurrent = useWillpowerStore.getState().current;
    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const tier = getConnectionTier(connectionLevel);

    let preferences: ContactType[];
    if (willpowerCurrent <= 15) {
      preferences = CONTACT_TYPE_PREFERENCES.low_willpower;
    } else if (tier === '信任' || tier === '共生') {
      preferences = CONTACT_TYPE_PREFERENCES.high_connection;
    } else {
      preferences = CONTACT_TYPE_PREFERENCES.default;
    }

    const suggestedType = detectContactType(playerSuggestion);
    const protagonistPreferred = preferences[0];

    let response = '';
    let agreedType: ContactType | undefined;

    if (suggestedType === protagonistPreferred) {
      response = '……行吧。';
      agreedType = suggestedType;
    } else if (suggestedType === '上门' && willpowerCurrent < 30) {
      response = '上门……太累了。发个消息行不行？';
      agreedType = undefined;
    } else if (suggestedType === '电话' && protagonistPreferred === '发消息') {
      response = '打电话……我怕她又在忙，说两句就挂了。发个消息算了。';
      agreedType = undefined;
    } else {
      response = '……好吧。';
      agreedType = suggestedType || protagonistPreferred;
    }

    set((state) => ({
      contactRequest: state.contactRequest
        ? {
            ...state.contactRequest,
            phase: agreedType ? 'negotiating' : 'negotiating',
            contactType: agreedType,
            protagonistPreference: response,
          }
        : null,
    }));
  },

  confirmContactType: (contactType: ContactType) => {
    set((state) => ({
      contactRequest: state.contactRequest
        ? {
            ...state.contactRequest,
            contactType,
            phase: 'in_progress',
          }
        : null,
    }));
  },

  completeContact: (summary: string) => {
    const request = get().contactRequest;
    if (!request) return;

    const timeState = useTimeStore.getState();

    if (request.npcId === 'xinyue') {
      const willpowerCurrent = useWillpowerStore.getState().current;
      const cost = Math.floor(willpowerCurrent * 0.5);
      useWillpowerStore.getState().consume(cost);
    }

    const contactRecord: ContactRecord = {
      gameDay: timeState.totalDays,
      gameDate: formatGameDate(timeState.totalDays),
      type: request.contactType || '发消息',
      initiator: '主角',
      summary: summary.substring(0, 50),
      keywords: [],
    };

    get().recordContact(request.npcId, contactRecord);

    const affectionDelta = request.npcId === 'niece' ? 3 : 2;
    get().adjustAffection(request.npcId, affectionDelta);

    useSceneStore.getState().addNarrativeLog(
      `你${contactRecord.type}联系了${request.npcName}。${summary}`
    );

    const interactionRecord: InteractionRecord = {
      npcId: request.npcId,
      npcName: request.npcName,
      content: summary.substring(0, 100),
      eventId: `contact_${request.npcId}_${timeState.totalDays}`,
      day: timeState.totalDays,
      hour: timeState.hour,
    };

    set((state) => ({
      contactRequest: null,
      interactionHistory: [interactionRecord, ...state.interactionHistory].slice(0, 30),
    }));
  },

  dismissContactRequest: () => {
    set({ contactRequest: null });
  },

  getNpcsByCategory: (category: NpcCategory): Npc[] => {
    return get().npcs.filter((npc) => npc.category === category && npc.isIntroduced);
  },

  getDaysSinceLastContact: (npcId: NpcKey): number => {
    const npc = get().getNpc(npcId);
    if (!npc || !npc.lastContact) return 999;

    const currentDay = useTimeStore.getState().totalDays;
    return currentDay - npc.lastContact.gameDay;
  },

  unlockNpcContact: (npcId: NpcKey) => {
    set((state) => ({
      npcs: state.npcs.map((npc) => {
        if (npc.id !== npcId) return npc;
        return { ...npc, isContactable: true };
      }),
    }));
  },
}));

function detectContactType(suggestion: string): ContactType | undefined {
  if (suggestion.includes('电话') || suggestion.includes('打给') || suggestion.includes('拨打')) return '电话';
  if (suggestion.includes('上门') || suggestion.includes('去看') || suggestion.includes('见面') || suggestion.includes('去找')) return '上门';
  if (suggestion.includes('信') || suggestion.includes('写') || suggestion.includes('长消息')) return '写信';
  if (suggestion.includes('消息') || suggestion.includes('微信') || suggestion.includes('发') || suggestion.includes('短信')) return '发消息';
  return undefined;
}

export { NPC_CATEGORY_ORDER };
