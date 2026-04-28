import { create } from 'zustand';
import type { Cognition, CognitionId } from '../types/cognition';
import { INITIAL_COGNITIONS } from '../data/cognitions/initialCognitions';

interface CognitionActions {
  recordPositiveFeedback: (cognitionId: CognitionId, actionId: string) => void;
  recordNegativeFeedback: (cognitionId: CognitionId) => void;
  transformCognition: (cognitionId: CognitionId) => void;
  unlockCognition: (cognitionId: CognitionId) => void;
  setEnlightenment: (cognitionId: string) => void;
  setAllDeepEnlightenment: () => void;
  getCognition: (cognitionId: CognitionId) => Cognition | undefined;
  reset: () => void;
}

export const useCognitionStore = create<{
  cognitions: Cognition[];
  unlockedCount: number;
} & CognitionActions>((set, get) => ({
  cognitions: [...INITIAL_COGNITIONS],
  unlockedCount: INITIAL_COGNITIONS.filter((c) => c.isUnlocked).length,

  recordPositiveFeedback: (cognitionId: CognitionId, actionId: string) => {
    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.id !== cognitionId || c.isTransformed) return c;
        const newCount = c.progressCount + 1;
        if (newCount >= 3) {
          if (c.depth === 'shallow') {
            return {
              ...c,
              progressCount: 0,
              isTransformed: true,
              currentContent: c.targetContent,
            };
          }
          if (c.depth === 'deep' && c.hasEnlightenment) {
            return {
              ...c,
              progressCount: 0,
              isTransformed: true,
              currentContent: c.targetContent,
            };
          }
          return { ...c, progressCount: 3, lastActionId: actionId };
        }
        return { ...c, progressCount: newCount, lastActionId: actionId };
      }),
    }));

    const cognition = get().cognitions.find((c) => c.id === cognitionId);
    if (cognition?.isTransformed) {
      get().transformCognition(cognitionId);
    }
  },

  recordNegativeFeedback: (cognitionId: CognitionId) => {
    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.id !== cognitionId || c.isTransformed) return c;
        return { ...c, progressCount: 0 };
      }),
    }));
  },

  transformCognition: (cognitionId: CognitionId) => {
    set((state) => {
      const updated = state.cognitions.map((c) => {
        if (c.id !== cognitionId) return c;
        return {
          ...c,
          isTransformed: true,
          currentContent: c.targetContent,
          progressCount: 0,
        };
      });
      return {
        cognitions: updated,
        unlockedCount: updated.filter((c) => c.isUnlocked).length,
      };
    });
  },

  unlockCognition: (cognitionId: CognitionId) => {
    set((state) => {
      const updated = state.cognitions.map((c) => {
        if (c.id !== cognitionId) return c;
        return { ...c, isUnlocked: true };
      });
      return {
        cognitions: updated,
        unlockedCount: updated.filter((c) => c.isUnlocked).length,
      };
    });
  },

  setEnlightenment: (cognitionId: string) => {
    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.id !== cognitionId) return c;
        return { ...c, hasEnlightenment: true };
      }),
    }));

    const cognition = get().cognitions.find((c) => c.id === cognitionId);
    if (cognition && cognition.progressCount >= 3 && !cognition.isTransformed) {
      get().transformCognition(cognitionId as CognitionId);
    }
  },

  setAllDeepEnlightenment: () => {
    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.depth !== 'deep') return c;
        return { ...c, hasEnlightenment: true };
      }),
    }));

    const deepCognitions = get().cognitions.filter(
      (c) => c.depth === 'deep' && c.progressCount >= 3 && !c.isTransformed
    );
    for (const c of deepCognitions) {
      get().transformCognition(c.id as CognitionId);
    }
  },

  getCognition: (cognitionId: CognitionId) => {
    return get().cognitions.find((c) => c.id === cognitionId);
  },

  reset: () => {
    set({
      cognitions: [...INITIAL_COGNITIONS],
      unlockedCount: INITIAL_COGNITIONS.filter((c) => c.isUnlocked).length,
    });
  },
}));
