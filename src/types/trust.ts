export interface TrustState {
  trustLevel: number;
  isClosed: boolean;
  closedReason?: string;
  consecutiveUtilitarian: number;
}

export const INITIAL_TRUST_LEVEL = 50;
export const TRUST_CLOSED_THRESHOLD = 20;
export const TRUST_LOW_THRESHOLD = 35;
export const TRUST_UTILITARIAN_PENALTY = 8;
export const TRUST_EMPATHY_BONUS = 5;
export const TRUST_RECOVERY_RATE = 1;
