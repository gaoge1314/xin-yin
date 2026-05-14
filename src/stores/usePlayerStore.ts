import { create } from 'zustand';
import type { PlayerInfluence } from '../types/action';
import {
  INITIAL_TRUST_LEVEL,
  CONNECTION_COLD_THRESHOLD,
  CONNECTION_HIGH_THRESHOLD,
  TRUST_LOW_THRESHOLD,
  TRUST_UTILITARIAN_PENALTY,
  TRUST_EMPATHY_BONUS,
  TRUST_RECOVERY_RATE,
  getConnectionTier,
  CONNECTION_TIER_COLORS,
  CONNECTION_TIER_DESCRIPTIONS,
  CONNECTION_TIER_WEIGHTS,
  CONNECTION_TIER_XINYIN_PROBABILITY,
} from '../types/trust';
import type { ConnectionTier } from '../types/trust';
import { useCognitionStore } from './useCognitionStore';
import { useSocialRuleStore } from './useSocialRuleStore';
import { usePersonalityStore } from './usePersonalityStore';

type Intensity = 'whisper' | 'normal' | 'earnest' | 'resonance';

const INTENSITY_WEIGHT: Record<Intensity, number> = {
  whisper: 0.1,
  normal: 0.2,
  earnest: 0.35,
  resonance: 0.4,
};

const RESONANCE_KEYWORDS = [
  '值得', '价值', '快乐', '幸福', '学习', '成长',
  '温暖', '关心', '失败是', '不怕', '勇气', '尝试', '接纳', '自己',
];

interface PlayerActions {
  addInfluence: (text: string, intensity?: Intensity, targetActionId?: string) => void;
  checkResonance: (text: string) => boolean;
  getRecentInfluences: (withinMs?: number) => PlayerInfluence[];
  clearOldInfluences: (maxAge?: number) => void;
  adjustTrust: (delta: number, reason?: string) => void;
  markUtilitarian: () => void;
  markEmpathetic: () => void;
  naturalTrustRecovery: () => void;
  isInfluenceReduced: () => boolean;
  getConnectionLevel: () => number;
  isColdResponse: () => boolean;
  isHighConnection: () => boolean;
  getConnectionTierInfo: () => { tier: ConnectionTier; color: string; description: string; level: number };
  triggerEnlightenment: () => void;
  triggerMicroEnlightenment: (importance: number) => void;
  getConnectionWeight: () => number;
  getXinYinProbability: () => number;
  setAtHome: (atHome: boolean) => void;
  updateHerdLevel: () => void;
  adjustXinYin: (delta: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<{
  influences: PlayerInfluence[];
  xinYinLevel: number;
  trustLevel: number;
  trustChangeReason?: string;
  consecutiveUtilitarian: number;
  hasEnlightenment: boolean;
  isAtHome: boolean;
  herdLevel: number;
  microEnlightenmentCount: number;
  lastTierChangeNarrative?: string;
  sweepDustSkill: { lastUsedDay: number } | null;
  vagusNerveSkill: { available: boolean } | null;
} & PlayerActions>((set, get) => ({
  influences: [],
  xinYinLevel: 0,
  trustLevel: INITIAL_TRUST_LEVEL,
  trustChangeReason: undefined,
  consecutiveUtilitarian: 0,
  hasEnlightenment: false,
  isAtHome: true,
  herdLevel: 50,
  microEnlightenmentCount: 0,
  lastTierChangeNarrative: undefined,
  sweepDustSkill: { lastUsedDay: -1 },
  vagusNerveSkill: { available: true },

  addInfluence: (text: string, intensity?: Intensity, targetActionId?: string) => {
    const resolvedIntensity = intensity ?? 'normal';
    const influence: PlayerInfluence = {
      text,
      timestamp: Date.now(),
      weight: INTENSITY_WEIGHT[resolvedIntensity],
      intensity: resolvedIntensity,
      targetActionId,
    };

    set((state) => ({
      influences: [...state.influences, influence],
      xinYinLevel: Math.min(state.xinYinLevel + 0.5, 100),
    }));
  },

  checkResonance: (text: string): boolean => {
    const cognitions = useCognitionStore.getState().cognitions;
    const hasUntransformed = cognitions.some(
      (c) => c.isUnlocked && !c.isTransformed
    );
    if (!hasUntransformed) return false;

    return RESONANCE_KEYWORDS.some((keyword) => text.includes(keyword));
  },

  getRecentInfluences: (withinMs: number = 24 * 60 * 60 * 1000) => {
    const now = Date.now();
    return get().influences.filter(
      (i) => now - i.timestamp < withinMs
    );
  },

  clearOldInfluences: (maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
    const cutoff = Date.now() - maxAge;
    set((state) => ({
      influences: state.influences.filter((i) => i.timestamp >= cutoff),
    }));
  },

  adjustTrust: (delta: number, reason?: string) => {
    set((state) => {
      const minTrust = 5;
      const newLevel = Math.max(minTrust, Math.min(100, state.trustLevel + delta));
      return { trustLevel: newLevel, trustChangeReason: reason };
    });
  },

  markUtilitarian: () => {
    const state = get();
    const newConsecutive = state.consecutiveUtilitarian + 1;

    set({ consecutiveUtilitarian: newConsecutive });
    get().adjustTrust(-TRUST_UTILITARIAN_PENALTY, 'utilitarian');
  },

  markEmpathetic: () => {
    set({ consecutiveUtilitarian: 0 });
    get().adjustTrust(TRUST_EMPATHY_BONUS, 'empathetic');
  },

  naturalTrustRecovery: () => {
    get().adjustTrust(TRUST_RECOVERY_RATE, 'natural_recovery');
  },

  isInfluenceReduced: () => {
    return get().trustLevel < TRUST_LOW_THRESHOLD;
  },

  getConnectionLevel: () => {
    return get().trustLevel;
  },

  isColdResponse: () => {
    return get().trustLevel < CONNECTION_COLD_THRESHOLD;
  },

  isHighConnection: () => {
    return get().trustLevel >= CONNECTION_HIGH_THRESHOLD;
  },

  getConnectionTierInfo: () => {
    const level = get().trustLevel;
    const tier = getConnectionTier(level);
    return {
      tier,
      color: CONNECTION_TIER_COLORS[tier],
      description: CONNECTION_TIER_DESCRIPTIONS[tier],
      level,
    };
  },

  triggerEnlightenment: () => {
    set(() => ({
      hasEnlightenment: true,
    }));
  },

  triggerMicroEnlightenment: (importance: number) => {
    const state = get();
    const oldTier = getConnectionTier(state.trustLevel);
    const connectionBoost = Math.floor(8 + importance * 7);
    const newTrustLevel = Math.min(state.trustLevel + connectionBoost, 100);
    const newTier = getConnectionTier(newTrustLevel);
    const newCount = state.microEnlightenmentCount + 1;

    let tierNarrative: string | undefined;
    if (oldTier !== newTier) {
      const tierNarratives: Record<string, string> = {
        '疏远→倾听': '他开始认真听你说话了。',
        '倾听→信任': '他不再只是听，他开始相信了。',
        '信任→共生': '你们之间，已经不需要言语。',
        '陌路→疏远': '他隐约感觉到了什么……',
      };
      const key = `${oldTier}→${newTier}`;
      tierNarrative = tierNarratives[key];
    }

    set({
      microEnlightenmentCount: newCount,
      trustLevel: newTrustLevel,
      xinYinLevel: Math.min(state.xinYinLevel + 5, 100),
      lastTierChangeNarrative: tierNarrative,
    });
  },

  getConnectionWeight: () => {
    const level = get().trustLevel;
    const tier = getConnectionTier(level);
    return CONNECTION_TIER_WEIGHTS[tier];
  },

  getXinYinProbability: () => {
    const level = get().trustLevel;
    const tier = getConnectionTier(level);
    return CONNECTION_TIER_XINYIN_PROBABILITY[tier];
  },

  setAtHome: (atHome: boolean) => {
    set({ isAtHome: atHome });
  },

  updateHerdLevel: () => {
    const socialRuleStore = useSocialRuleStore.getState();
    const personalityStore = usePersonalityStore.getState();

    const activeRules = socialRuleStore.getActiveRules();
    let herdFromRules = 50;

    const oppressiveRule = activeRules.find((r: any) => r.id === 'oppressive_world');
    if (oppressiveRule) {
      herdFromRules += oppressiveRule.intensity * 20;
    }

    const utilitarianRule = activeRules.find((r: any) => r.id === 'utilitarian_relationship');
    if (utilitarianRule) {
      herdFromRules += utilitarianRule.intensity * 10;
    }

    const personalityModifier = personalityStore.meaningObsession * -10 + personalityStore.retreatInertia * 15;

    const newHerd = Math.max(0, Math.min(100, herdFromRules + personalityModifier));
    set({ herdLevel: newHerd });
  },

  adjustXinYin: (delta: number) => {
    set((state) => ({
      xinYinLevel: Math.max(0, Math.min(100, state.xinYinLevel + delta)),
    }));
  },

  reset: () => {
    set({
      influences: [],
      xinYinLevel: 0,
      trustLevel: INITIAL_TRUST_LEVEL,
      trustChangeReason: undefined,
      consecutiveUtilitarian: 0,
      hasEnlightenment: false,
      isAtHome: true,
      herdLevel: 50,
      microEnlightenmentCount: 0,
      lastTierChangeNarrative: undefined,
      sweepDustSkill: { lastUsedDay: -1 },
      vagusNerveSkill: { available: true },
    });
  },
}));
