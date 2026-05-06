import { create } from 'zustand';
import type { AlignmentInput, AlignmentOutput } from '../systems/alignment/alignmentTypes';
import { alignmentJudge } from '../systems/alignment/alignmentJudge';
import { fallbackAlignment } from '../systems/alignment/fallbackAlignment';

interface AlignmentActions {
  judgeAlignment: (input: AlignmentInput) => Promise<AlignmentOutput>;
  getCostMultiplier: () => number;
  reset: () => void;
}

type AlignmentStoreState = {
  consecutiveTimeouts: number;
  lastAlignmentResult: AlignmentOutput | null;
  isAlignmentPaused: boolean;
  isJudging: boolean;
} & AlignmentActions;

export const useAlignmentStore = create<AlignmentStoreState>((set, get) => ({
  consecutiveTimeouts: 0,
  lastAlignmentResult: null,
  isAlignmentPaused: false,
  isJudging: false,

  judgeAlignment: async (input: AlignmentInput): Promise<AlignmentOutput> => {
    const state = get();
    if (state.isAlignmentPaused) {
      return fallbackAlignment(input);
    }

    set({ isJudging: true });

    try {
      const result = await alignmentJudge(input);
      set({
        consecutiveTimeouts: 0,
        lastAlignmentResult: result,
        isJudging: false,
      });
      return result;
    } catch {
      const newTimeoutCount = state.consecutiveTimeouts + 1;
      const shouldPause = newTimeoutCount >= 3;

      const fallbackResult = fallbackAlignment(input);
      set({
        consecutiveTimeouts: newTimeoutCount,
        lastAlignmentResult: fallbackResult,
        isAlignmentPaused: shouldPause,
        isJudging: false,
      });
      return fallbackResult;
    }
  },

  getCostMultiplier: (): number => {
    const result = get().lastAlignmentResult;
    if (!result) return 1;

    switch (result.alignment_judgment) {
      case 'high':
        return 0;
      case 'partial':
        return 1;
      case 'low':
        return 1.3;
      case 'conflict':
        return 2;
      default:
        return 1;
    }
  },

  reset: () => {
    set({
      consecutiveTimeouts: 0,
      lastAlignmentResult: null,
      isAlignmentPaused: false,
      isJudging: false,
    });
  },
}));
