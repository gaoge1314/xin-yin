import { create } from 'zustand';
import type { XinYinAnchor, AnchorState } from '../types/anchor';
import { INITIAL_ANCHORS } from '../data/anchors/initialAnchors';

interface AnchorActions {
  activateAnchor: (anchorId: string) => void;
  checkTrigger: (text: string, triggerType: XinYinAnchor['triggerType']) => XinYinAnchor | null;
  getActivatedAnchors: () => XinYinAnchor[];
  reset: () => void;
}

const initialState: AnchorState = {
  anchors: [...INITIAL_ANCHORS],
  activatedCount: 0,
};

export const useAnchorStore = create<AnchorState & AnchorActions>((set, get) => ({
  ...initialState,

  activateAnchor: (anchorId: string) => {
    set((state) => ({
      anchors: state.anchors.map((anchor) => {
        if (anchor.id !== anchorId) return anchor;
        return {
          ...anchor,
          isActivated: true,
          activationCount: anchor.activationCount + 1,
        };
      }),
      activatedCount: state.activatedCount + 1,
    }));
  },

  checkTrigger: (text: string, triggerType: XinYinAnchor['triggerType']) => {
    const anchors = get().anchors;
    const textLower = text.toLowerCase();

    for (const anchor of anchors) {
      if (anchor.triggerType !== triggerType) continue;
      if (anchor.isActivated && anchor.activationCount >= 3) continue;

      const matchedKeywords = anchor.triggerKeywords.filter((keyword) =>
        textLower.includes(keyword.toLowerCase())
      );

      if (matchedKeywords.length >= 2) {
        return anchor;
      }
    }

    return null;
  },

  getActivatedAnchors: () => {
    return get().anchors.filter((anchor) => anchor.isActivated);
  },

  reset: () => {
    set(initialState);
  },
}));
