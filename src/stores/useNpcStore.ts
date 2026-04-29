import { create } from 'zustand';
import type { Npc, NpcKey, NpcEvent, NpcEventFrequency } from '../types/npc';
import { INITIAL_NPCS } from '../data/npcs/initialNpcs';
import { useTimeStore } from './useTimeStore';
import { useSceneStore } from './useSceneStore';
import { usePlayerStore } from './usePlayerStore';
import { useCognitionStore } from './useCognitionStore';
import { useWillpowerStore } from './useWillpowerStore';
import { useOrganStore } from './useOrganStore';

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
}

export const useNpcStore = create<{
  npcs: Npc[];
  activeNpcDialog: NpcDialogEntry | null;
  pendingDialogs: NpcDialogEntry[];
} & NpcActions>((set, get) => ({
  npcs: [...INITIAL_NPCS],
  activeNpcDialog: null,
  pendingDialogs: [],

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

    const triggered: NpcEvent[] = [];

    get().npcs.forEach((npc) => {
      if (!npc.isIntroduced) return;

      npc.events.forEach((event) => {
        if (day < event.triggerDay) return;

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

    set({ activeNpcDialog: null });
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
    set({ npcs: [...INITIAL_NPCS], activeNpcDialog: null, pendingDialogs: [] });
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
}));
