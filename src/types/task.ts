import type { StateEffect } from './action';

export type TaskTrack = 'world' | 'personal';

export type TaskSource = 'school' | 'work' | 'family' | 'social' | 'society' | 'inner';

export type TaskUrgency = 'mandatory' | 'suggested' | 'spontaneous' | 'crisis';

export type PersonalPlanTerm = 'short' | 'medium' | 'long' | 'eternal';

export interface GameTask {
  id: string;
  track: TaskTrack;
  source: TaskSource;
  urgency: TaskUrgency;
  title: string;
  description: string;
  deadline?: number;
  effects: StateEffect[];
  isCompleted: boolean;
  isPostponed: boolean;
  postponeCount: number;
  createdAt: number;
  conflictWith?: string;
}

export interface PersonalPlan {
  term: PersonalPlanTerm;
  content: string;
  isGenerated: boolean;
}

export interface TaskConflict {
  worldTaskId: string;
  personalPlanTerm: PersonalPlanTerm;
  personalPlanContent: string;
  resolution?: 'social_first' | 'xinyin_first' | 'third_way';
}
