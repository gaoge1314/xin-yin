import { create } from 'zustand';
import type { ActionRecord } from '../types/action';
import type { EventRecord } from '../types/event';
import type { TransformationRecord } from '../types/save';
import type { DreamVision, Memory } from '../types/skill';
import type { Cognition } from '../types/cognition';
import type { WillpowerState } from '../types/willpower';
import type { OrganHealth } from '../types/organs';
import type { TimeState } from '../types/time';
import type { PlayerInfluence } from '../types/action';
import { INITIAL_COGNITIONS } from '../data/cognitions/initialCognitions';
import { PROLOGUE_MEMORIES } from '../data/memories/prologueMemories';
import {
  INITIAL_WILLPOWER_MAX,
  INITIAL_WILLPOWER_CURRENT,
  BASE_RECOVERY_RATE,
} from '../types/willpower';
import { INITIAL_ORGAN_HEALTH } from '../types/organs';
import { START_AGE, START_YEAR } from '../types/time';
import { SAVE_VERSION, SAVE_KEY } from '../types/save';
import { useTriggerStore } from './useTriggerStore';

interface GameActions {
  newGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
  hasSave: () => boolean;
  deleteSave: () => void;
  reset: () => void;
}

interface FullGameState {
  time: TimeState;
  willpower: WillpowerState;
  organs: OrganHealth;
  cognitions: Cognition[];
  xinYinLevel: number;
  playerInfluences: PlayerInfluence[];
  believedVisions: DreamVision[];
  rejectedVisions: DreamVision[];
  memories: Memory[];
  recallCooldown: number;
  dreamCooldown: number;
  actionHistory: ActionRecord[];
  eventHistory: EventRecord[];
  transformations: TransformationRecord[];
}

const initialGameState: FullGameState = {
  time: {
    age: START_AGE,
    season: 'autumn',
    day: 0,
    hour: 0,
    totalDays: 0,
    speed: 1,
    isPaused: false,
    isInputFocused: false,
    currentYear: START_YEAR,
  },
  willpower: {
    current: INITIAL_WILLPOWER_CURRENT,
    max: INITIAL_WILLPOWER_MAX,
    recoveryRate: BASE_RECOVERY_RATE,
    isDepressed: false,
    depressedDays: 0,
    consecutiveGoodSleep: 0,
    isRecoveringMax: false,
  },
  organs: { ...INITIAL_ORGAN_HEALTH },
  cognitions: [...INITIAL_COGNITIONS],
  xinYinLevel: 0,
  playerInfluences: [],
  believedVisions: [],
  rejectedVisions: [],
  memories: [...PROLOGUE_MEMORIES],
  recallCooldown: 0,
  dreamCooldown: 0,
  actionHistory: [],
  eventHistory: [],
  transformations: [],
};

export const useGameStore = create<FullGameState & GameActions>((set, get) => ({
  ...initialGameState,

  newGame: () => {
    set({ ...initialGameState, memories: [...PROLOGUE_MEMORIES], cognitions: [...INITIAL_COGNITIONS], organs: { ...INITIAL_ORGAN_HEALTH } });
  },

  saveGame: () => {
    const state = get();
    const triggerState = (() => {
      const ts = useTriggerStore.getState();
      return {
        silentConsecutiveDays: ts.silentConsecutiveDays,
        lastWillpowerValue: ts.lastWillpowerValue,
      };
    })();
    const saveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      phase: 'core-loop' as const,
      state: {
        time: state.time,
        willpower: state.willpower,
        organs: state.organs,
        cognitions: state.cognitions,
        xinYinLevel: state.xinYinLevel,
        playerInfluences: state.playerInfluences,
        believedVisions: state.believedVisions,
        rejectedVisions: state.rejectedVisions,
        memories: state.memories,
        recallCooldown: state.recallCooldown,
        dreamCooldown: state.dreamCooldown,
        triggerState,
      },
      history: {
        actions: state.actionHistory,
        events: state.eventHistory,
        transformations: state.transformations,
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  },

  loadGame: () => {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return false;

    try {
      const saveData = JSON.parse(data);
      const s = saveData.state;
      const h = saveData.history;

      set({
        time: s.time,
        willpower: s.willpower,
        organs: s.organs,
        cognitions: s.cognitions,
        xinYinLevel: s.xinYinLevel,
        playerInfluences: s.playerInfluences,
        believedVisions: s.believedVisions,
        rejectedVisions: s.rejectedVisions,
        memories: s.memories,
        recallCooldown: s.recallCooldown,
        dreamCooldown: s.dreamCooldown,
        actionHistory: h.actions,
        eventHistory: h.events,
        transformations: h.transformations,
      });

      if (s.triggerState) {
        if (s.triggerState.silentConsecutiveDays !== undefined) {
          useTriggerStore.setState({ silentConsecutiveDays: s.triggerState.silentConsecutiveDays });
        }
        if (s.triggerState.lastWillpowerValue !== undefined) {
          useTriggerStore.setState({ lastWillpowerValue: s.triggerState.lastWillpowerValue });
        }
      }

      return true;
    } catch {
      return false;
    }
  },

  hasSave: () => {
    return localStorage.getItem(SAVE_KEY) !== null;
  },

  deleteSave: () => {
    localStorage.removeItem(SAVE_KEY);
  },

  reset: () => {
    set({
      ...initialGameState,
      memories: [...PROLOGUE_MEMORIES],
      cognitions: [...INITIAL_COGNITIONS],
      organs: { ...INITIAL_ORGAN_HEALTH },
    });
  },
}));
