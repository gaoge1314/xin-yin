import { create } from 'zustand';
import type { WillpowerState } from '../types/willpower';
import {
  INITIAL_WILLPOWER_MAX,
  INITIAL_WILLPOWER_CURRENT,
  BASE_RECOVERY_RATE,
  DEPRESSION_MAX_PENALTY,
  DEPRESSION_RECOVERY_WEEKS,
  DEPRESSION_RECOVERY_POINTS,
  GOOD_SLEEP_MAX_RECOVERY_BONUS,
  VAGUS_NERVE_MAX_COST_RATIO,
  DEEP_NUMBNESS_THRESHOLD,
  HABIT_RECOVERY_GOOD_SLEEP_DAYS,
  HABIT_RECOVERY_MICRO_ENLIGHTENMENT_COUNT,
  HABIT_RECOVERY_POINTS,
} from '../types/willpower';
import type { OrganHealth } from '../types/organs';
import { ORGAN_CRITICAL_THRESHOLD } from '../types/organs';

interface WillpowerActions {
  consume: (amount: number, organHealth?: OrganHealth) => boolean;
  recover: (amount: number, organHealth?: OrganHealth) => void;
  updateDepression: () => void;
  calculateCost: (cognitionConflict: number, organHealth?: OrganHealth) => number;
  recordGoodSleep: () => void;
  recordBadSleep: () => void;
  interruptRecovery: () => void;
  consumeMaxByVagusNerve: () => boolean;
  recoverMaxByHabit: (method: 'goodSleep' | 'microEnlightenment') => void;
  incrementMicroEnlightenmentCount: () => void;
  checkDeepNumbness: () => boolean;
  reset: () => void;
}

const initialState: WillpowerState = {
  current: INITIAL_WILLPOWER_CURRENT,
  max: INITIAL_WILLPOWER_MAX,
  recoveryRate: BASE_RECOVERY_RATE,
  isDepressed: false,
  depressedDays: 0,
  consecutiveGoodSleep: 0,
  isRecoveringMax: false,
  deepNumbness: false,
  microEnlightenmentCount: 0,
  goodSleepDaysForRecovery: 0,
};

export const useWillpowerStore = create<WillpowerState & WillpowerActions>(
  (set, get) => ({
    ...initialState,

    consume: (amount: number, organHealth?: OrganHealth) => {
      const state = get();
      let adjustedAmount = amount;

      if (organHealth && organHealth.liver < ORGAN_CRITICAL_THRESHOLD) {
        adjustedAmount = Math.ceil(amount * 1.3);
      }

      const newCurrent = state.current - adjustedAmount;

      if (newCurrent <= 0) {
        const newMax = Math.max(state.max - DEPRESSION_MAX_PENALTY, 20);
        set({
          current: 0,
          isDepressed: true,
          max: newMax,
          depressedDays: 0,
          deepNumbness: newMax < DEEP_NUMBNESS_THRESHOLD,
        });
        return false;
      }

      set({ current: newCurrent });
      return true;
    },

    recover: (amount: number, organHealth?: OrganHealth) => {
      const state = get();
      let adjustedAmount = amount;

      if (organHealth && organHealth.heart < ORGAN_CRITICAL_THRESHOLD) {
        adjustedAmount = amount * 0.5;
      }

      if (state.isDepressed) {
        adjustedAmount *= 0.5;
      }

      set({
        current: Math.min(state.current + adjustedAmount, state.max),
      });
    },

    updateDepression: () => {
      const state = get();
      if (!state.isDepressed) return;

      const newDays = state.depressedDays + 1;

      if (newDays >= DEPRESSION_RECOVERY_WEEKS * 7) {
        const newMax = Math.min(state.max + DEPRESSION_RECOVERY_POINTS, 100);
        const stillDepressed = newMax < INITIAL_WILLPOWER_MAX;

        set({
          max: newMax,
          depressedDays: stillDepressed ? 0 : 0,
          isDepressed: stillDepressed,
        });
      } else {
        set({ depressedDays: newDays });
      }
    },

    calculateCost: (cognitionConflict: number, organHealth?: OrganHealth) => {
      const state = get();
      let cost = cognitionConflict * (100 / state.max);

      if (organHealth && organHealth.liver < ORGAN_CRITICAL_THRESHOLD) {
        cost *= 1.3;
      }

      return Math.ceil(cost);
    },

    recordGoodSleep: () => {
      const state = get();
      const newConsecutive = state.consecutiveGoodSleep + 1;
      let recoverAmount: number;
      let newMax = state.max;
      let newIsRecoveringMax = false;

      if (newConsecutive === 1) {
        recoverAmount = state.max * 0.9;
      } else if (newConsecutive === 2) {
        recoverAmount = state.max;
      } else {
        recoverAmount = state.max;
        newMax = Math.min(state.max + GOOD_SLEEP_MAX_RECOVERY_BONUS, INITIAL_WILLPOWER_MAX);
        newIsRecoveringMax = true;
      }

      set({
        consecutiveGoodSleep: newConsecutive,
        current: Math.min(Math.ceil(state.current + recoverAmount), newMax),
        max: newMax,
        isRecoveringMax: newIsRecoveringMax,
      });
    },

    recordBadSleep: () => {
      const state = get();
      const recoverAmount = Math.ceil(state.max * 0.3);

      set({
        consecutiveGoodSleep: 0,
        isRecoveringMax: false,
        current: Math.min(state.current + recoverAmount, state.max),
      });
    },

    interruptRecovery: () => {
      set({
        consecutiveGoodSleep: 0,
        isRecoveringMax: false,
      });
    },

    consumeMaxByVagusNerve: () => {
      const state = get();
      const cost = Math.floor(state.max * VAGUS_NERVE_MAX_COST_RATIO);
      const newMax = Math.max(state.max - cost, 1);
      const newCurrent = Math.min(state.current, newMax);
      const newDeepNumbness = newMax < DEEP_NUMBNESS_THRESHOLD;
      set({ max: newMax, current: newCurrent, deepNumbness: newDeepNumbness });
      return newDeepNumbness;
    },

    recoverMaxByHabit: (method: 'goodSleep' | 'microEnlightenment') => {
      const state = get();
      if (method === 'goodSleep') {
        const newDays = state.goodSleepDaysForRecovery + 1;
        if (newDays >= HABIT_RECOVERY_GOOD_SLEEP_DAYS) {
          const newMax = Math.min(state.max + HABIT_RECOVERY_POINTS, 100);
          const newDeepNumbness = newMax < DEEP_NUMBNESS_THRESHOLD;
          set({ max: newMax, goodSleepDaysForRecovery: 0, deepNumbness: newDeepNumbness });
        } else {
          set({ goodSleepDaysForRecovery: newDays });
        }
      } else {
        const newCount = state.microEnlightenmentCount + 1;
        if (newCount >= HABIT_RECOVERY_MICRO_ENLIGHTENMENT_COUNT) {
          const newMax = Math.min(state.max + HABIT_RECOVERY_POINTS, 100);
          const newDeepNumbness = newMax < DEEP_NUMBNESS_THRESHOLD;
          set({ max: newMax, microEnlightenmentCount: 0, deepNumbness: newDeepNumbness });
        } else {
          set({ microEnlightenmentCount: newCount });
        }
      }
    },

    incrementMicroEnlightenmentCount: () => {
      const state = get();
      const newCount = state.microEnlightenmentCount + 1;
      if (newCount >= HABIT_RECOVERY_MICRO_ENLIGHTENMENT_COUNT) {
        const newMax = Math.min(state.max + HABIT_RECOVERY_POINTS, 100);
        const newDeepNumbness = newMax < DEEP_NUMBNESS_THRESHOLD;
        set({ max: newMax, microEnlightenmentCount: 0, deepNumbness: newDeepNumbness });
      } else {
        set({ microEnlightenmentCount: newCount });
      }
    },

    checkDeepNumbness: () => {
      const state = get();
      const shouldBeNumb = state.max < DEEP_NUMBNESS_THRESHOLD;
      if (shouldBeNumb !== state.deepNumbness) {
        set({ deepNumbness: shouldBeNumb });
      }
      return shouldBeNumb;
    },

    reset: () => {
      set(initialState);
    },
  })
);
