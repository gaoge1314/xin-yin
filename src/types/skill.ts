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

export interface SweepDustSkill {
  cooldown: number;
  lastUsedDay: number;
  currentDay: number;
}

export interface VagusNerveSkill {
  available: boolean;
  willpowerThreshold: number;
  maxCostRatio: number;
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

export interface MemoryVersion {
  content: string;
  innerVoice: string;
}

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
  resolution_state: 'unresolved' | 'resolved';
  version_triggered_count: number;
  unresolved_version?: MemoryVersion;
  resolved_version?: MemoryVersion;
}

export const RECALL_COOLDOWN = 1;
export const DREAM_COOLDOWN = 2;
export const MUTEX_PERIOD = 1;
export const SWEEP_DUST_COOLDOWN_DAYS = 1;
export const VAGUS_NERVE_WILLPOWER_THRESHOLD = 20;
export const VAGUS_NERVE_MAX_COST_RATIO = 0.4;
