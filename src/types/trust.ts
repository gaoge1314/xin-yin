export interface TrustState {
  trustLevel: number;
  trustChangeReason?: string;
  consecutiveUtilitarian: number;
}

export const INITIAL_TRUST_LEVEL = 15;
export const CONNECTION_COLD_THRESHOLD = 20;
export const CONNECTION_HIGH_THRESHOLD = 80;
export const TRUST_LOW_THRESHOLD = 35;
export const TRUST_UTILITARIAN_PENALTY = 8;
export const TRUST_EMPATHY_BONUS = 5;
export const TRUST_RECOVERY_RATE = 1;
