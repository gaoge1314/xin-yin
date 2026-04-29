import { create } from 'zustand';
import type { SocialRule, SocialRuleState } from '../types/socialRule';
import { INITIAL_SOCIAL_RULE_INTENSITY } from '../types/socialRule';
import { INITIAL_SOCIAL_RULES } from '../data/socialRules/initialSocialRules';

interface SocialRuleActions {
  decreaseIntensity: (ruleId: string, amount: number) => void;
  deactivateRule: (ruleId: string) => void;
  activateRule: (ruleId: string) => void;
  getActiveRules: () => SocialRule[];
  getOverallIntensity: () => number;
  getSocialRuleLevel: () => number;
  reset: () => void;
}

const initialState: SocialRuleState = {
  rules: [...INITIAL_SOCIAL_RULES],
  activeIntensity: INITIAL_SOCIAL_RULE_INTENSITY,
};

export const useSocialRuleStore = create<SocialRuleState & SocialRuleActions>(
  (set, get) => ({
    ...initialState,

    decreaseIntensity: (ruleId: string, amount: number) => {
      set((state) => ({
        rules: state.rules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          const newIntensity = Math.max(0, rule.intensity - amount);
          return {
            ...rule,
            intensity: newIntensity,
            isActive: newIntensity > 0.3,
          };
        }),
      }));

      const newActiveIntensity = get().getOverallIntensity();
      set({ activeIntensity: newActiveIntensity });
    },

    deactivateRule: (ruleId: string) => {
      set((state) => ({
        rules: state.rules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          return { ...rule, isActive: false, intensity: 0 };
        }),
      }));

      const newActiveIntensity = get().getOverallIntensity();
      set({ activeIntensity: newActiveIntensity });
    },

    activateRule: (ruleId: string) => {
      set((state) => ({
        rules: state.rules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          return { ...rule, isActive: true, intensity: 0.5 };
        }),
      }));

      const newActiveIntensity = get().getOverallIntensity();
      set({ activeIntensity: newActiveIntensity });
    },

    getActiveRules: () => {
      return get().rules.filter((rule) => rule.isActive);
    },

    getOverallIntensity: () => {
      const activeRules = get().rules.filter((rule) => rule.isActive);
      if (activeRules.length === 0) return 0;
      return activeRules.reduce((sum, rule) => sum + rule.intensity, 0) / activeRules.length;
    },

    getSocialRuleLevel: () => {
      const rules = get().rules;
      if (rules.length === 0) return 0;
      const totalIntensity = rules.reduce((sum, rule) => sum + rule.intensity, 0);
      return Math.min((totalIntensity / rules.length) * 100, 100);
    },

    reset: () => {
      set(initialState);
    },
  })
);
