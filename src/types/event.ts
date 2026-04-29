export interface WorldEvent {
  id: string;
  type: 'macro' | 'micro';
  category: 'economic' | 'social' | 'personal' | 'family';
  triggerCondition: EventCondition;
  content: string;
  effects: import('./action').StateEffect[];
  choices?: EventChoice[];
  isOneShot?: boolean;
}

export interface EventCondition {
  minAge?: number;
  maxAge?: number;
  minDay?: number;
  maxDay?: number;
  season?: import('./time').Season[];
  minWillpower?: number;
  maxWillpower?: number;
  minConnectionLevel?: number;
  maxConnectionLevel?: number;
  requiredCognition?: string[];
  organThreshold?: Partial<import('./organs').OrganHealth>;
  chance?: number;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: ChoiceRequirement[];
  outcomes: EventOutcome[];
}

export interface ChoiceRequirement {
  type: 'willpower' | 'cognition' | 'organ' | 'connection';
  targetId?: string;
  minValue?: number;
}

export interface EventOutcome {
  probability: number;
  effects: import('./action').StateEffect[];
  narrative: string;
}

export interface EventRecord {
  eventId: string;
  timestamp: number;
  choiceId?: string;
  outcomeIndex: number;
}
