export interface WillpowerState {
  current: number;
  max: number;
  recoveryRate: number;
  isDepressed: boolean;
  depressedDays: number;
  consecutiveGoodSleep: number;
  isRecoveringMax: boolean;
  deepNumbness: boolean;
  microEnlightenmentCount: number;
  goodSleepDaysForRecovery: number;
}

export interface WillpowerEffect {
  type: 'cost' | 'recovery' | 'max_change';
  value: number;
  reason: string;
}

export const INITIAL_WILLPOWER_MAX = 80;
export const INITIAL_WILLPOWER_CURRENT = 60;
export const BASE_RECOVERY_RATE = 2;
export const DEPRESSION_MAX_PENALTY = 5;
export const DEPRESSION_RECOVERY_WEEKS = 3;
export const DEPRESSION_RECOVERY_POINTS = 1;
export const GOOD_SLEEP_MAX_RECOVERY_BONUS = 3;
export const VAGUS_NERVE_MAX_COST_RATIO = 0.4;
export const DEEP_NUMBNESS_THRESHOLD = 5;
export const HABIT_RECOVERY_GOOD_SLEEP_DAYS = 7;
export const HABIT_RECOVERY_MICRO_ENLIGHTENMENT_COUNT = 3;
export const HABIT_RECOVERY_POINTS = 1;
