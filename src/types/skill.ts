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

export type MemoryCategory =
  | 'name'
  | 'emotion'
  | 'resentment'
  | 'fear'
  | 'obsession'
  | 'beauty'
  | 'special';

export interface Memory {
  id: string;
  type: 'good' | 'painful';
  title: string;
  category: MemoryCategory;
  content: string;
  innerVoice: string;
  season: import('./time').Season;
  age: number;
  isHealed: boolean;
  keywords: string[];
  dustName?: string;
  isCore?: boolean;
}

export const RECALL_COOLDOWN = 1;
export const DREAM_COOLDOWN = 2;
export const MUTEX_PERIOD = 1;
