import { create } from 'zustand';
import type { PlayerInfluence } from '../types/action';
import {
  INITIAL_TRUST_LEVEL,
  TRUST_CLOSED_THRESHOLD,
  TRUST_LOW_THRESHOLD,
  TRUST_UTILITARIAN_PENALTY,
  TRUST_EMPATHY_BONUS,
  TRUST_RECOVERY_RATE,
} from '../types/trust';
import { useCognitionStore } from './useCognitionStore';

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
  adjustTrust: (delta: number) => void;
  markUtilitarian: () => void;
  markEmpathetic: () => void;
  naturalTrustRecovery: () => void;
  isInfluenceReduced: () => boolean;
  triggerEnlightenment: () => void;
  reset: () => void;
}

export const usePlayerStore = create<{
  influences: PlayerInfluence[];
  xinYinLevel: number;
  trustLevel: number;
  isClosed: boolean;
  closedReason?: string;
  consecutiveUtilitarian: number;
  hasEnlightenment: boolean;
} & PlayerActions>((set, get) => ({
  influences: [],
  xinYinLevel: 0,
  trustLevel: INITIAL_TRUST_LEVEL,
  isClosed: false,
  closedReason: undefined,
  consecutiveUtilitarian: 0,
  hasEnlightenment: false,

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

  adjustTrust: (delta: number) => {
    set((state) => {
      const newLevel = Math.max(0, Math.min(100, state.trustLevel + delta));
      let isClosed = state.isClosed;
      let closedReason = state.closedReason;

      if (newLevel < TRUST_CLOSED_THRESHOLD) {
        isClosed = true;
        if (!closedReason) {
          closedReason = '他的心关上了，你的声音再也传不进去。';
        }
      } else if (newLevel > TRUST_CLOSED_THRESHOLD + 10) {
        isClosed = false;
        closedReason = undefined;
      }

      return { trustLevel: newLevel, isClosed, closedReason };
    });
  },

  markUtilitarian: () => {
    const state = get();
    const newConsecutive = state.consecutiveUtilitarian + 1;
    let isClosed = state.isClosed;
    let closedReason = state.closedReason;

    if (newConsecutive >= 3) {
      isClosed = true;
      closedReason = '你太急切了，他需要的是理解，不是指令。';
    }

    set({ consecutiveUtilitarian: newConsecutive, isClosed, closedReason });
    get().adjustTrust(-TRUST_UTILITARIAN_PENALTY);
  },

  markEmpathetic: () => {
    set({ consecutiveUtilitarian: 0 });
    get().adjustTrust(TRUST_EMPATHY_BONUS);
  },

  naturalTrustRecovery: () => {
    get().adjustTrust(TRUST_RECOVERY_RATE);
  },

  isInfluenceReduced: () => {
    return get().trustLevel < TRUST_LOW_THRESHOLD;
  },

  triggerEnlightenment: () => {
    set((state) => ({
      hasEnlightenment: true,
      xinYinLevel: Math.min(state.xinYinLevel + 30, 100),
    }));
  },

  reset: () => {
    set({
      influences: [],
      xinYinLevel: 0,
      trustLevel: INITIAL_TRUST_LEVEL,
      isClosed: false,
      closedReason: undefined,
      consecutiveUtilitarian: 0,
      hasEnlightenment: false,
    });
  },
}));
