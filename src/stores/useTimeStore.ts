import { create } from 'zustand';
import type { TimeState, Season, TimeOfDay } from '../types/time';
import {
  SEASON_ORDER,
  DAYS_PER_SEASON,
  HOURS_PER_DAY,
  START_AGE,
  START_YEAR,
  getTimeOfDay,
  getYear,
} from '../types/time';

interface TimeActions {
  advanceTime: () => void;
  advanceSeason: () => void;
  setInputFocused: (focused: boolean) => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  togglePause: () => void;
  getTimeOfDay: () => TimeOfDay;
  getCurrentYear: () => number;
  reset: () => void;
}

const initialState: TimeState = {
  age: START_AGE,
  season: 'autumn',
  day: 0,
  hour: 0,
  totalDays: 0,
  speed: 1,
  isPaused: false,
  isInputFocused: false,
  currentYear: START_YEAR,
};

export const useTimeStore = create<TimeState & TimeActions>((set, get) => ({
  ...initialState,

  advanceTime: () => {
    const state = get();
    if (state.isPaused) return;

    const newHour = state.hour + state.speed;

    if (newHour >= HOURS_PER_DAY) {
      const newDay = state.day + 1;
      const newTotalDays = state.totalDays + 1;

      if (newDay >= DAYS_PER_SEASON) {
        set({ day: 0, hour: 0, totalDays: newTotalDays });
        get().advanceSeason();
      } else {
        set({ day: newDay, hour: 0, totalDays: newTotalDays });
      }
    } else {
      set({ hour: newHour });
    }
  },

  advanceSeason: () => {
    const state = get();
    const currentIndex = SEASON_ORDER.indexOf(state.season);

    if (currentIndex === 3) {
      const newAge = state.age + 1;
      if (newAge > 35) {
        set({ age: 35, season: 'winter', day: DAYS_PER_SEASON - 1, currentYear: getYear(35) });
        return;
      }
      set({ age: newAge, season: 'spring', currentYear: getYear(newAge) });
    } else {
      set({ season: SEASON_ORDER[currentIndex + 1] as Season });
    }
  },

  setInputFocused: (focused: boolean) => {
    if (focused) {
      set({ isInputFocused: true, isPaused: true });
    } else {
      set({ isInputFocused: false, isPaused: false });
    }
  },

  setSpeed: (speed: 1 | 2 | 4) => {
    set({ speed });
  },

  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  getTimeOfDay: () => {
    return getTimeOfDay(get().hour);
  },

  getCurrentYear: () => {
    return get().currentYear;
  },

  reset: () => {
    set(initialState);
  },
}));
