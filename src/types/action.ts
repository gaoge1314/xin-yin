import type { CognitionId } from './cognition';

export interface Action {
  id: string;
  name: string;
  category: 'daily' | 'work' | 'social' | 'self' | 'escape';
  cognitionConflict: Partial<Record<CognitionId, number>>;
  baseProbability: number;
  requirements?: ActionRequirement[];
  outcomes: Outcome[];
  organEffects?: Partial<Record<keyof import('./organs').OrganHealth, number>>;
}

export interface ActionRequirement {
  type: 'willpower' | 'cognition' | 'organ';
  targetId?: string;
  minValue?: number;
  maxValue?: number;
}

export interface Outcome {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  probability: number;
  feedback: string;
  effects: StateEffect[];
}

export interface StateEffect {
  target: 'willpower' | 'organ' | 'cognition';
  key?: string;
  value: number;
}

export interface PlayerInfluence {
  text: string;
  timestamp: number;
  weight: number;
  intensity?: 'whisper' | 'normal' | 'earnest' | 'resonance';
  targetActionId?: string;
}

export interface ActionRecord {
  actionId: string;
  timestamp: number;
  outcome: Outcome;
  playerInfluenced: boolean;
}
