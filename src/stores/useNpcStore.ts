import { create } from 'zustand';
import type { Npc, NpcKey, NpcEvent } from '../types/npc';
import { INITIAL_NPCS } from '../data/npcs/initialNpcs';
import { useTimeStore } from './useTimeStore';
import { useSceneStore } from './useSceneStore';
import { usePlayerStore } from './usePlayerStore';
import { useCognitionStore } from './useCognitionStore';
import { useWillpowerStore } from './useWillpowerStore';

interface NpcActions {
  checkIntroductions: () => Npc[];
  checkEvents: () => NpcEvent[];
  triggerEvent: (event: NpcEvent) => void;
  adjustCloseness: (npcId: NpcKey, delta: number) => void;
  getIntroducedNpcs: () => Npc[];
  getNpc: (npcId: NpcKey) => Npc | undefined;
  reset: () => void;
}

export const useNpcStore = create<{
  npcs: Npc[];
} & NpcActions>((set, get) => ({
  npcs: [...INITIAL_NPCS],

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

    const triggered: NpcEvent[] = [];

    get().npcs.forEach((npc) => {
      if (!npc.isIntroduced) return;

      npc.events.forEach((event) => {
        if (day >= event.triggerDay) {
          const alreadyTriggered = useSceneStore.getState().narrativeLog.some(
            (log) => log.includes(event.content.substring(0, 20))
          );
          if (!alreadyTriggered) {
            triggered.push(event);
          }
        }
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
    set({ npcs: [...INITIAL_NPCS] });
  },
}));
