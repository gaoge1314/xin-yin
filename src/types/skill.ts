export interface RecallSkill {
  cooldown: number;
  currentCooldown: number;
  mutexPeriod: number;
}

export interface DreamSkill {
  cooldown: number;
  currentCooldown: number;
  xinYinLevel: number;
}

export interface DreamVision {
  id: string;
  content: string;
  relatedEventId?: string;
  beliefRate: number;
  timestamp: number;
  interpretationHint?: string;
}

export interface Memory {
  id: string;
  type: 'good' | 'painful';
  content: string;
  season: import('./time').Season;
  age: number;
  isHealed: boolean;
  keywords: string[];
}

export const RECALL_COOLDOWN = 1;
export const DREAM_COOLDOWN = 2;
export const MUTEX_PERIOD = 1;
