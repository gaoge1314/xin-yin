export interface SocialRule {
  id: string;
  name: string;
  coreBelief: string;
  derivedCommands: string[];
  sourceEvents: string[];
  intensity: number;
  isActive: boolean;
}

export interface SocialRuleState {
  rules: SocialRule[];
  activeIntensity: number;
}

export const INITIAL_SOCIAL_RULE_INTENSITY = 0.85;
