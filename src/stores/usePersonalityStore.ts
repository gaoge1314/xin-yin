import { create } from 'zustand';
import type { Personality } from '../types/personality';
import { INITIAL_PERSONALITY } from '../types/personality';

interface PersonalityActions {
  decreaseRetreatInertia: (amount: number) => void;
  increaseSelfAwareness: (amount: number) => void;
  decreaseMeaningObsession: (amount: number) => void;
  decreaseCognitionActionSensitivity: (amount: number) => void;
  decreaseXinYinAwakenDifficulty: (amount: number) => void;
  reset: () => void;
}

export const usePersonalityStore = create<Personality & PersonalityActions>(
  (set) => ({
    ...INITIAL_PERSONALITY,

    decreaseRetreatInertia: (amount: number) => {
      set((state) => ({
        retreatInertia: Math.max(0.1, state.retreatInertia - amount),
      }));
    },

    increaseSelfAwareness: (amount: number) => {
      set((state) => ({
        selfAwareness: Math.min(1, state.selfAwareness + amount),
      }));
    },

    decreaseMeaningObsession: (amount: number) => {
      set((state) => ({
        meaningObsession: Math.max(0.3, state.meaningObsession - amount),
      }));
    },

    decreaseCognitionActionSensitivity: (amount: number) => {
      set((state) => ({
        cognitionActionSensitivity: Math.max(0.3, state.cognitionActionSensitivity - amount),
      }));
    },

    decreaseXinYinAwakenDifficulty: (amount: number) => {
      set((state) => ({
        xinYinAwakenDifficulty: Math.max(0.1, state.xinYinAwakenDifficulty - amount),
      }));
    },

    reset: () => {
      set(INITIAL_PERSONALITY);
    },
  })
);
