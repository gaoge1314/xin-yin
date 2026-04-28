import { create } from 'zustand';
import type { GamePhase } from '../types/save';

interface SceneActions {
  setPhase: (phase: GamePhase) => void;
  addNarrativeLog: (text: string) => void;
  clearNarrativeLog: () => void;
  reset: () => void;
}

export const useSceneStore = create<{
  phase: GamePhase;
  narrativeLog: string[];
} & SceneActions>((set) => ({
  phase: 'menu',
  narrativeLog: [],

  setPhase: (phase: GamePhase) => {
    set({ phase });
  },

  addNarrativeLog: (text: string) => {
    set((state) => ({
      narrativeLog: [...state.narrativeLog, text],
    }));
  },

  clearNarrativeLog: () => {
    set({ narrativeLog: [] });
  },

  reset: () => {
    set({ phase: 'menu', narrativeLog: [] });
  },
}));
