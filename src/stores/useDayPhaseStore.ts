import { create } from 'zustand';
import { useTimeStore } from './useTimeStore';
import type { TimeOfDay } from '../types/time';

interface DayPhaseState {
  currentDay: number;
  morningRitualDone: boolean;
  eveningMonologueShown: boolean;
  dreamFragmentShown: boolean;
}

interface DayPhaseActions {
  checkDayPhaseTransition: () => TimeOfDay | null;
  markMorningRitualDone: () => void;
  markEveningMonologueShown: () => void;
  markDreamFragmentShown: () => void;
  resetForNewDay: () => void;
  reset: () => void;
}

const initialState: DayPhaseState = {
  currentDay: -1,
  morningRitualDone: false,
  eveningMonologueShown: false,
  dreamFragmentShown: false,
};

export const useDayPhaseStore = create<DayPhaseState & DayPhaseActions>(
  (set, get) => ({
    ...initialState,

    checkDayPhaseTransition: (): TimeOfDay | null => {
      const timeState = useTimeStore.getState();
      const state = get();

      if (timeState.totalDays !== state.currentDay) {
        get().resetForNewDay();
        set({ currentDay: timeState.totalDays });
      }

      const timeOfDay = timeState.getTimeOfDay();

      if (timeOfDay === 'MORNING' && !get().morningRitualDone) {
        return 'MORNING';
      }
      if (timeOfDay === 'EVENING' && !get().eveningMonologueShown) {
        return 'EVENING';
      }
      if (timeOfDay === 'SLEEP' && !get().dreamFragmentShown) {
        return 'SLEEP';
      }

      return null;
    },

    markMorningRitualDone: () => {
      set({ morningRitualDone: true });
    },

    markEveningMonologueShown: () => {
      set({ eveningMonologueShown: true });
    },

    markDreamFragmentShown: () => {
      set({ dreamFragmentShown: true });
    },

    resetForNewDay: () => {
      set({
        morningRitualDone: false,
        eveningMonologueShown: false,
        dreamFragmentShown: false,
      });
    },

    reset: () => {
      set(initialState);
    },
  })
);
