import { create } from 'zustand';
import { useTimeStore } from './useTimeStore';
import type { TimeOfDay } from '../types/time';

interface DayPhaseState {
  currentDay: number;
  morningRitualDone: boolean;
}

interface DayPhaseActions {
  checkDayPhaseTransition: () => TimeOfDay | null;
  markMorningRitualDone: () => void;
  resetForNewDay: () => void;
  reset: () => void;
}

const initialState: DayPhaseState = {
  currentDay: -1,
  morningRitualDone: false,
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

      return null;
    },

    markMorningRitualDone: () => {
      set({ morningRitualDone: true });
    },

    resetForNewDay: () => {
      set({
        morningRitualDone: false,
      });
    },

    reset: () => {
      set(initialState);
    },
  })
);
