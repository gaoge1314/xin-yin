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
  pause: (reason: string) => void;
  resume: (reason: string) => void;
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

export const useTimeStore = create<TimeState & TimeActions & { pauseReasons: Record<string, boolean> }>((set, get) => ({
  ...initialState,
  pauseReasons: {},

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
      get().pause('input-focus');
      set({ isInputFocused: true });
    } else {
      set({ isInputFocused: false });
      get().resume('input-focus');
    }
  },

  setSpeed: (speed: 1 | 2 | 4) => {
    set({ speed });
  },

  togglePause: () => {
    const state = get();
    if (state.isPaused) {
      const reasons = Object.keys(state.pauseReasons);
      const hasOnlyManual = reasons.length === 0 || (reasons.length === 1 && reasons[0] === 'manual');
      if (hasOnlyManual) {
        set({ isPaused: false, pauseReasons: {} });
      }
    } else {
      const newReasons = { ...state.pauseReasons, manual: true };
      set({ isPaused: true, pauseReasons: newReasons });
    }
  },

  pause: (reason: string) => {
    set((state) => {
      const newReasons = { ...state.pauseReasons, [reason]: true };
      return { pauseReasons: newReasons, isPaused: true };
    });
  },

  resume: (reason: string) => {
    set((state) => {
      const newReasons = { ...state.pauseReasons };
      delete newReasons[reason];
      const stillPaused = Object.values(newReasons).some((v) => v);
      return { pauseReasons: newReasons, isPaused: stillPaused };
    });
  },

  getTimeOfDay: () => {
    return getTimeOfDay(get().hour);
  },

  getCurrentYear: () => {
    return get().currentYear;
  },

  reset: () => {
    set({ ...initialState, pauseReasons: {} });
  },
}));
