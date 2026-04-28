export interface WillpowerState {
  current: number;
  max: number;
  recoveryRate: number;
  isDepressed: boolean;
  depressedDays: number;
  consecutiveGoodSleep: number;
  isRecoveringMax: boolean;
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
