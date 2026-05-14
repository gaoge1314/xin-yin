import type { Cognition } from './cognition';

export interface AgentOneInput {
  currentEvent: {
    id: string;
    description: string;
    isTsunami: boolean;
    year: number;
    season: string;
  } | null;
  memories: DecayedMemorySummary[];
  protagonistState: {
    willpowerCurrent: number;
    willpowerMax: number;
    xinYinLevel: number;
    connectionLevel: number;
    organSummary: string;
  };
  dusts: DustSummary[];
  daysSinceLastDesire: number;
}

export interface DecayedMemorySummary {
  id: string;
  title: string;
  detailScore: number;
  remainingDetail: string;
  feelings: string;
  category: string;
  daysAgo: number;
}

export interface DustSummary {
  id: string;
  name: string;
  currentContent: string;
  dustType: string;
  isActive: boolean;
  counter: number;
}

export interface SuggestedDesire {
  text: string;
  type: 'heartSeal' | 'dustRisk';
  description: string;
  relatedDust?: string;
}

export interface AgentOneOutput {
  shouldPrompt: boolean;
  urgency: number;
  urgencyReason: string;
  eventDescription: string;
  suggestedDesires: SuggestedDesire[];
}

export interface AgentTwoInput {
  playerDesire: string;
  isSilent: boolean;
  currentEvent: {
    id: string;
    description: string;
    year: number;
    season: string;
  } | null;
  protagonistState: {
    willpowerCurrent: number;
    willpowerMax: number;
    xinYinLevel: number;
    herdLevel: number;
    connectionLevel: number;
  };
  activeDust: {
    id: string;
    content: string;
    dustType: string;
  } | null;
  environment: {
    season: string;
    year: number;
    timeOfDay: string;
    activeSocialRules: string[];
  };
}

export interface AgentTwoOutput {
  interpretationOfDesire: string;
  plan: string;
  narrative: string;
  dustUsed: string | null;
  emotionalTone: string;
}

export interface AgentThreeInput {
  originalDesire: string;
  executionNarrative: string;
  interpretationOfDesire: string;
  plan: string;
  dustUsed: string | null;
  protagonistState: {
    willpowerCurrent: number;
    willpowerMax: number;
    xinYinLevel: number;
    connectionLevel: number;
  };
  activeDustId: string | null;
  dustCounter: number;
}

export interface LegacyAssessment {
  score: number;
  type: 'spiritual' | 'relational' | 'actional' | 'echo' | null;
  summary: string;
}

export interface AgentThreeOutput {
  matchScore: number;
  innerMonologue: string;
  isDistorted: boolean;
  distortionSummary: string;
  emotionalOutcome: string;
  legacy: LegacyAssessment;
}

export interface SweepingAgentInput {
  dust: {
    id: string;
    content: string;
    dustType: string;
  };
  protagonistState: {
    willpowerCurrent: number;
    xinYinLevel: number;
  };
  counterEvidence: EvidenceRecord[];
  memories: DecayedMemorySummary[];
}

export interface EvidenceRecord {
  date: string;
  description: string;
  matchScore: number;
  legacyScore?: number;
}

export interface SweepingAgentOutput {
  originStory: string;
  counterEvidence: string;
  originMemoryId: string | null;
  counterMemoryId: string | null;
}

export interface LegacyEntry {
  id: string;
  date: string;
  score: number;
  type: 'spiritual' | 'relational' | 'actional' | 'echo' | null;
  summary: string;
  relatedDesire: string;
  relatedEvent: string;
}

export interface LegacyReviewInput {
  year: number;
  entries: LegacyEntry[];
  protagonistState: {
    xinYinLevel: number;
    connectionLevel: number;
    healedDustCount: number;
    totalDustCount: number;
  };
}

export interface LegacyReviewOutput {
  yearSummary: string;
  notableLegacies: string[];
  overallLegacyScore: number;
}