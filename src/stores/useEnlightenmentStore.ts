import { create } from 'zustand';

interface SweepDustState {
  isSweepDustActive: boolean;
  selectedDustCognitionId: string | null;
}

interface SweepDustActions {
  enterSweepDust: () => void;
  exitSweepDust: () => void;
  selectDustCognition: (id: string) => void;
  clearSelectedDust: () => void;
  reset: () => void;
}

const initialState: SweepDustState = {
  isSweepDustActive: false,
  selectedDustCognitionId: null,
};

export const useEnlightenmentStore = create<SweepDustState & SweepDustActions>((set) => ({
  ...initialState,

  enterSweepDust: () => set({ isSweepDustActive: true, selectedDustCognitionId: null }),
  exitSweepDust: () => set(initialState),
  selectDustCognition: (id: string) => set({ selectedDustCognitionId: id }),
  clearSelectedDust: () => set({ selectedDustCognitionId: null }),
  reset: () => set(initialState),
}));
