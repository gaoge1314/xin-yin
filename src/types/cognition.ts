export type DustType = '我执' | '名' | '情';

export interface Cognition {
  id: string;
  name: string;
  category: 'core' | 'secondary';
  depth: 'shallow' | 'deep';
  dustType: DustType;
  hasEnlightenment: boolean;
  currentContent: string;
  targetContent: string;
  isUnlocked: boolean;
  progressCount: number;
  isTransformed: boolean;
  lastActionId?: string;
}

export interface CognitionState {
  cognitions: Cognition[];
  unlockedCount: number;
}

export type CognitionId = 
  | 'learning' 
  | 'relationship' 
  | 'self_worth' 
  | 'happiness' 
  | 'failure'
  | 'effort'
  | 'specialness'
  | 'learning_meaning'
  | 'hypocrisy'
  | 'meaninglessness';
