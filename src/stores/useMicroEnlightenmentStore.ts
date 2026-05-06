import { create } from 'zustand';

interface MicroEnlightenmentState {
  consecutiveCount: number;
  totalCount: number;
  lastTriggeredAt: number | null;
  loosenedCognitionIds: string[];
}

interface MicroEnlightenmentActions {
  incrementConsecutive: () => void;
  resetConsecutive: () => void;
  addLoosenedCognition: (cognitionId: string) => void;
  reset: () => void;
}

export const useMicroEnlightenmentStore = create<MicroEnlightenmentState & MicroEnlightenmentActions>((set) => ({
  consecutiveCount: 0,
  totalCount: 0,
  lastTriggeredAt: null,
  loosenedCognitionIds: [],

  incrementConsecutive: () => set((state) => ({
    consecutiveCount: state.consecutiveCount + 1,
    totalCount: state.totalCount + 1,
    lastTriggeredAt: Date.now(),
  })),

  resetConsecutive: () => set({ consecutiveCount: 0 }),

  addLoosenedCognition: (cognitionId) => set((state) => ({
    loosenedCognitionIds: [...state.loosenedCognitionIds, cognitionId],
  })),

  reset: () => set({
    consecutiveCount: 0,
    totalCount: 0,
    lastTriggeredAt: null,
    loosenedCognitionIds: [],
  }),
}));
