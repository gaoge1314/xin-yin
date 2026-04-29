export interface Habit {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  strength: number;
  relatedActions: string[];
  consecutiveCount: number;
  lastTriggeredAt?: number;
}

export const HABIT_STRENGTH_THRESHOLD = 60;

export const HABIT_FORMATION_CONSECUTIVE = 3;
export const HABIT_DECAY_INTERVAL = 72;
export const HABIT_DECAY_RATE = 10;
export const HABIT_STRENGTH_GAIN = 15;
export const HABIT_STRENGTH_MAX = 100;
