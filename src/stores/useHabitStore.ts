import { create } from 'zustand';
import type { Habit } from '../types/habit';
import {
  HABIT_FORMATION_CONSECUTIVE,
  HABIT_DECAY_INTERVAL,
  HABIT_DECAY_RATE,
  HABIT_STRENGTH_GAIN,
  HABIT_STRENGTH_MAX,
  HABIT_STRENGTH_THRESHOLD,
} from '../types/habit';

interface HabitActions {
  recordAction: (actionId: string, actionCategory: string) => void;
  decayHabits: () => void;
  getPositiveHabits: () => Habit[];
  getNegativeHabits: () => Habit[];
  getPositiveHabitCount: () => number;
  reset: () => void;
}

export const useHabitStore = create<{
  habits: Habit[];
} & HabitActions>((set, get) => ({
  habits: [],

  recordAction: (actionId: string, actionCategory: string) => {
    const habitType = mapCategoryToHabitType(actionCategory);

    set((state) => {
      const existing = state.habits.find((h) => h.relatedActions.includes(actionId));

      if (existing) {
        return {
          habits: state.habits.map((h) => {
            if (h.id !== existing.id) return h;
            const newConsecutive = h.consecutiveCount + 1;
            const newStrength = Math.min(
              h.strength + HABIT_STRENGTH_GAIN,
              HABIT_STRENGTH_MAX
            );
            const isFormed = newConsecutive >= HABIT_FORMATION_CONSECUTIVE || h.strength >= HABIT_STRENGTH_THRESHOLD;
            return {
              ...h,
              strength: isFormed ? newStrength : h.strength,
              consecutiveCount: newConsecutive,
              lastTriggeredAt: Date.now(),
            };
          }),
        };
      }

      const newHabit: Habit = {
        id: `habit_${actionCategory}_${Date.now()}`,
        name: mapCategoryToHabitName(actionCategory),
        type: habitType,
        strength: HABIT_STRENGTH_GAIN,
        relatedActions: [actionId],
        consecutiveCount: 1,
        lastTriggeredAt: Date.now(),
      };

      return { habits: [...state.habits, newHabit] };
    });
  },

  decayHabits: () => {
    const now = Date.now();
    set((state) => ({
      habits: state.habits
        .map((h) => {
          if (!h.lastTriggeredAt) return h;
          const hoursSince = (now - h.lastTriggeredAt) / (1000 * 60 * 60);
          if (hoursSince >= HABIT_DECAY_INTERVAL) {
            const newStrength = Math.max(0, h.strength - HABIT_DECAY_RATE);
            return {
              ...h,
              strength: newStrength,
              consecutiveCount: newStrength < HABIT_STRENGTH_THRESHOLD ? 0 : h.consecutiveCount,
            };
          }
          return h;
        })
        .filter((h) => h.strength > 0),
    }));
  },

  getPositiveHabits: () => {
    return get().habits.filter(
      (h) => h.type === 'positive' && h.strength >= HABIT_STRENGTH_THRESHOLD
    );
  },

  getNegativeHabits: () => {
    return get().habits.filter(
      (h) => h.type === 'negative' && h.strength >= HABIT_STRENGTH_THRESHOLD
    );
  },

  getPositiveHabitCount: () => {
    return get().getPositiveHabits().length;
  },

  reset: () => {
    set({ habits: [] });
  },
}));

function mapCategoryToHabitType(category: string): 'positive' | 'negative' {
  const positiveCategories = ['self', 'social', 'study', 'exercise'];
  const negativeCategories = ['escape', 'work'];

  if (positiveCategories.includes(category)) return 'positive';
  if (negativeCategories.includes(category)) return 'negative';
  return 'negative';
}

function mapCategoryToHabitName(category: string): string {
  const names: Record<string, string> = {
    self: '自我关怀',
    social: '社交习惯',
    study: '学习习惯',
    exercise: '运动习惯',
    escape: '逃避习惯',
    work: '工作惯性',
    daily: '日常节律',
  };
  return names[category] || `${category}习惯`;
}
