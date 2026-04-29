import { create } from 'zustand';
import type { Npc, NpcKey, NpcEvent, NpcEventFrequency } from '../types/npc';
import { INITIAL_NPCS } from '../data/npcs/initialNpcs';
import { useTimeStore } from './useTimeStore';
import { useSceneStore } from './useSceneStore';
import { usePlayerStore } from './usePlayerStore';
import { useCognitionStore } from './useCognitionStore';
import { useWillpowerStore } from './useWillpowerStore';
import { useOrganStore } from './useOrganStore';
import { getDayOfWeek } from '../types/time';

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
}

export interface InteractionRecord {
  npcId: NpcKey;
  npcName: string;
  content: string;
  eventId: string;
  day: number;
  hour: number;
}

interface NpcActions {
  checkIntroductions: () => Npc[];
  checkEvents: () => NpcEvent[];
  triggerEvent: (event: NpcEvent) => void;
  triggerEventAsDialog: (event: NpcEvent) => void;
  adjustCloseness: (npcId: NpcKey, delta: number) => void;
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
}

export const useNpcStore = create<{
  npcs: Npc[];
  activeNpcDialog: NpcDialogEntry | null;
  pendingDialogs: NpcDialogEntry[];
  interactionHistory: InteractionRecord[];
  mealConsecutiveDays: number;
  mealAutoHandled: boolean;
  daysApartFromMother: number;
} & NpcActions>((set, get) => ({
  npcs: [...INITIAL_NPCS],
  activeNpcDialog: null,
  pendingDialogs: [],
  interactionHistory: [],
  mealConsecutiveDays: 0,
  mealAutoHandled: false,
  daysApartFromMother: 0,

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

    const dialogEntry: NpcDialogEntry = {
      npcId,
      npcName: npc?.name || '未知',
      npcDescription: npc?.description,
      content: event.content,
      eventId: event.id,
      effect: event.effect,
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

    set((s) => ({
      activeNpcDialog: null,
      interactionHistory: [record, ...s.interactionHistory].slice(0, 30),
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
        return {
          ...npc,
          currentCloseness: Math.max(0, Math.min(100, npc.currentCloseness + delta)),
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
    set({ npcs: [...INITIAL_NPCS], activeNpcDialog: null, pendingDialogs: [], interactionHistory: [], mealConsecutiveDays: 0, mealAutoHandled: false, daysApartFromMother: 0 });
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
}));
