export interface OrganHealth {
  heart: number;
  liver: number;
  spleen: number;
  lungs: number;
  stomach: number;
}

export interface OrganEffect {
  organ: keyof OrganHealth;
  change: number;
  reason: string;
}

export interface BehaviorModifiers {
  recoveryPenalty: number;
  costPenalty: number;
  progressPenalty: number;
  availableActionsPenalty: number;
  socialResistance: number;
}

export const ORGAN_NAMES: Record<keyof OrganHealth, string> = {
  heart: '心',
  liver: '肝',
  spleen: '脾',
  lungs: '肺',
  stomach: '胃',
};

export const ORGAN_EMOTIONS: Record<keyof OrganHealth, string> = {
  heart: '喜/惊',
  liver: '怒',
  spleen: '思/忧',
  lungs: '悲',
  stomach: '恐/焦虑',
};

export const INITIAL_ORGAN_HEALTH: OrganHealth = {
  heart: 60,
  liver: 55,
  spleen: 50,
  lungs: 65,
  stomach: 45,
};

export const ORGAN_CRITICAL_THRESHOLD = 30;
export const ORGAN_EVENT_THRESHOLD = 20;
