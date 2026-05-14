import { create } from 'zustand';
import type { Cognition, CognitionId } from '../types/cognition';
import type { EvidenceRecord } from '../types/agent';
import { INITIAL_COGNITIONS } from '../data/cognitions/initialCognitions';
import { usePlayerStore } from './usePlayerStore';
import { useSceneStore } from './useSceneStore';

const COGNITION_TRANSFORM_BASE_RATE = 0.5;

interface DustMeta {
  counter: number;
  evidenceRecords: EvidenceRecord[];
  sweepAttempts: number;
}

interface CognitionActions {
  recordPositiveFeedback: (cognitionId: CognitionId, actionId: string) => void;
  recordNegativeFeedback: (cognitionId: CognitionId) => void;
  transformCognition: (cognitionId: CognitionId) => void;
  unlockCognition: (cognitionId: CognitionId) => void;
  relieveCognition: (cognitionId: CognitionId) => void;
  setEnlightenment: (cognitionId: string) => void;
  setAllDeepEnlightenment: () => void;
  getCognition: (cognitionId: CognitionId) => Cognition | undefined;
  getUnrelievedCognitions: () => Cognition[];
  getRelievedCognitions: () => Cognition[];
  updateDustCounter: (cognitionId: CognitionId, counter: number, evidenceRecords: EvidenceRecord[]) => void;
  recordSweepAttempt: (cognitionId: CognitionId) => void;
  transformDust: (cognitionId: string) => void;
  getDustMeta: (cognitionId: string) => DustMeta;
  reset: () => void;
}

export const useCognitionStore = create<{
  cognitions: Cognition[];
  unlockedCount: number;
  dustMetaMap: Record<string, DustMeta>;
} & CognitionActions>((set, get) => ({
  cognitions: [...INITIAL_COGNITIONS],
  unlockedCount: INITIAL_COGNITIONS.filter((c) => c.isUnlocked).length,
  dustMetaMap: {},

  recordPositiveFeedback: (cognitionId: CognitionId, actionId: string) => {
    const cognition = get().cognitions.find((c) => c.id === cognitionId);
    if (cognition?.isRelieved) return;

    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const connectionBonus = (connectionLevel / 100) * 0.5;
    const transformChance = Math.min(COGNITION_TRANSFORM_BASE_RATE + connectionBonus, 1);

    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.id !== cognitionId || c.isTransformed) return c;
        const newCount = c.progressCount + 1;
        if (newCount >= 3) {
          const roll = Math.random();
          if (roll < transformChance) {
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
          }
          return { ...c, progressCount: 3, lastActionId: actionId };
        }
        return { ...c, progressCount: newCount, lastActionId: actionId };
      }),
    }));

    const updatedCognition = get().cognitions.find((c) => c.id === cognitionId);
    if (updatedCognition?.isTransformed) {
      if (connectionLevel >= 60) {
        useSceneStore.getState().addNarrativeLog(
          '你的声音被他听见了——他愿意相信你说的。'
        );
      }
      get().transformCognition(cognitionId);
    } else if (updatedCognition && updatedCognition.progressCount >= 3 && !updatedCognition.isTransformed) {
      if (connectionLevel < 30) {
        useSceneStore.getState().addNarrativeLog(
          '他似乎有所触动，但还不够信任你，无法接受这种改变。'
        );
      }
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

  relieveCognition: (cognitionId: CognitionId) => {
    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.id !== cognitionId) return c;
        return {
          ...c,
          isRelieved: true,
          isTransformed: true,
          currentContent: c.targetContent,
        };
      }),
    }));
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

  getUnrelievedCognitions: () => {
    return get().cognitions.filter(
      (c) => c.isUnlocked && !c.isTransformed && !c.isRelieved
    );
  },

  getRelievedCognitions: () => {
    return get().cognitions.filter((c) => c.isRelieved);
  },

  updateDustCounter: (cognitionId: CognitionId, counter: number, evidenceRecords: EvidenceRecord[]) => {
    set((state) => ({
      dustMetaMap: {
        ...state.dustMetaMap,
        [cognitionId]: {
          counter,
          evidenceRecords,
          sweepAttempts: state.dustMetaMap[cognitionId]?.sweepAttempts || 0,
        },
      },
    }));
  },

  recordSweepAttempt: (cognitionId: CognitionId) => {
    set((state) => {
      const existing = state.dustMetaMap[cognitionId] || { counter: 0, evidenceRecords: [], sweepAttempts: 0 };
      return {
        dustMetaMap: {
          ...state.dustMetaMap,
          [cognitionId]: {
            ...existing,
            sweepAttempts: existing.sweepAttempts + 1,
          },
        },
      };
    });
  },

  transformDust: (cognitionId: string) => {
    set((state) => ({
      cognitions: state.cognitions.map((c) => {
        if (c.id !== cognitionId) return c;
        return {
          ...c,
          isTransformed: true,
          isRelieved: true,
          currentContent: c.targetContent,
        };
      }),
    }));
  },

  getDustMeta: (cognitionId: string): DustMeta => {
    return get().dustMetaMap[cognitionId] || { counter: 0, evidenceRecords: [], sweepAttempts: 0 };
  },

  reset: () => {
    set({
      cognitions: [...INITIAL_COGNITIONS],
      unlockedCount: INITIAL_COGNITIONS.filter((c) => c.isUnlocked).length,
      dustMetaMap: {},
    });
  },
}));
