import { create } from 'zustand';
import type { DebugSectionId, DebugSectionState } from '../types/debug';
import { DEBUG_SECTION_LABELS } from '../types/debug';

interface DebugState {
  isVisible: boolean;
  sections: DebugSectionState[];
}

interface DebugActions {
  toggleVisibility: () => void;
  toggleSection: (id: DebugSectionId) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

const initialSections: DebugSectionState[] = (Object.entries(DEBUG_SECTION_LABELS) as [DebugSectionId, string][]).map(
  ([id, label]) => ({
    id,
    label,
    isCollapsed: true,
  })
);

export const useDebugStore = create<DebugState & DebugActions>((set) => ({
  isVisible: false,
  sections: initialSections,

  toggleVisibility: () => {
    set((state) => ({ isVisible: !state.isVisible }));
  },

  toggleSection: (id: DebugSectionId) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, isCollapsed: !section.isCollapsed } : section
      ),
    }));
  },

  expandAll: () => {
    set((state) => ({
      sections: state.sections.map((section) => ({ ...section, isCollapsed: false })),
    }));
  },

  collapseAll: () => {
    set((state) => ({
      sections: state.sections.map((section) => ({ ...section, isCollapsed: true })),
    }));
  },
}));
