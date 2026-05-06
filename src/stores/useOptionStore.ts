import { create } from 'zustand';
import type { GameOption } from '../types/option';

interface OptionState {
  currentOptions: GameOption[];
  selectedOption: GameOption | null;
  sweepDustUsed: boolean;
  isNonIntervention: boolean;
  vagusNerveWindow: boolean;
}

interface OptionActions {
  setOptions: (options: GameOption[]) => void;
  selectOption: (option: GameOption) => void;
  clearOptions: () => void;
  markSweepDustUsed: () => void;
  setNonIntervention: (value: boolean) => void;
  setVagusNerveWindow: (value: boolean) => void;
  reset: () => void;
}

export const useOptionStore = create<OptionState & OptionActions>((set) => ({
  currentOptions: [],
  selectedOption: null,
  sweepDustUsed: false,
  isNonIntervention: false,
  vagusNerveWindow: false,

  setOptions: (options) => set({ currentOptions: options, sweepDustUsed: false, isNonIntervention: false, vagusNerveWindow: false }),
  selectOption: (option) => set({ selectedOption: option }),
  clearOptions: () => set({ currentOptions: [], selectedOption: null, sweepDustUsed: false, isNonIntervention: false, vagusNerveWindow: false }),
  markSweepDustUsed: () => set({ sweepDustUsed: true }),
  setNonIntervention: (value) => set({ isNonIntervention: value }),
  setVagusNerveWindow: (value) => set({ vagusNerveWindow: value }),
  reset: () => set({ currentOptions: [], selectedOption: null, sweepDustUsed: false, isNonIntervention: false, vagusNerveWindow: false }),
}));
