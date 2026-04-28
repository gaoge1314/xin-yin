import { create } from 'zustand';
import type { OrganHealth, OrganEffect, BehaviorModifiers } from '../types/organs';
import { INITIAL_ORGAN_HEALTH, ORGAN_CRITICAL_THRESHOLD, ORGAN_EVENT_THRESHOLD } from '../types/organs';

interface OrganActions {
  updateOrgan: (effect: OrganEffect) => void;
  getBehaviorModifiers: () => BehaviorModifiers;
  getOrganHealth: (organ: keyof OrganHealth) => number;
  isOrganCritical: (organ: keyof OrganHealth) => boolean;
  reset: () => void;
}

export const useOrganStore = create<OrganHealth & OrganActions>((set, get) => ({
  ...INITIAL_ORGAN_HEALTH,

  updateOrgan: (effect: OrganEffect) => {
    set((state) => ({
      [effect.organ]: Math.max(0, Math.min(100, state[effect.organ] + effect.change)),
    }));
  },

  getBehaviorModifiers: () => {
    const state = get();
    return {
      recoveryPenalty: state.heart < ORGAN_CRITICAL_THRESHOLD ? 0.5 : 1.0,
      costPenalty: state.liver < ORGAN_CRITICAL_THRESHOLD ? 1.3 : 1.0,
      progressPenalty: state.spleen < ORGAN_CRITICAL_THRESHOLD ? 0.5 : 1.0,
      availableActionsPenalty: state.lungs < ORGAN_CRITICAL_THRESHOLD ? 0.7 : 1.0,
      socialResistance: state.stomach < ORGAN_CRITICAL_THRESHOLD ? 1.5 : 1.0,
    };
  },

  getOrganHealth: (organ: keyof OrganHealth) => {
    return get()[organ];
  },

  isOrganCritical: (organ: keyof OrganHealth) => {
    return get()[organ] < ORGAN_EVENT_THRESHOLD;
  },

  reset: () => {
    set(INITIAL_ORGAN_HEALTH);
  },
}));
