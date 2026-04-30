import { create } from 'zustand';

export type EmotionalState = "烦躁" | "麻木" | "略微放松" | "平静" | "低落" | "焦虑" | "防御" | "脆弱";

export type AttitudeToward = "回避" | "抗拒" | "中立" | "信任" | "依赖";

export interface DialogueMemoryEntry {
  speakerRole: string;
  speakerName: string;
  npcContent: string;
  protagonistResponse: string;
  triggeredTag: string | null;
  emotionalState: EmotionalState;
  day: number;
  hour: number;
  unresolved: boolean;
}

export interface DialogueMemoryState {
  entries: DialogueMemoryEntry[];
  currentEmotionalState: EmotionalState;
  attitudesToward: Record<string, AttitudeToward>;
  unresolvedThreads: string[];
}

export interface DialogueMemoryActions {
  addEntry(entry: Omit<DialogueMemoryEntry, 'unresolved'>): void;
  updateEmotionalState(state: EmotionalState): void;
  updateAttitudeToward(speakerRole: string, attitude: AttitudeToward): void;
  addUnresolvedThread(description: string): void;
  resolveThread(index: number): void;
  getRecentSummaries(count?: number): DialogueMemoryEntry[];
  getAttitudeToward(speakerRole: string): AttitudeToward;
  getUnresolvedThreads(): string[];
  reset(): void;
}

export const useDialogueMemoryStore = create<DialogueMemoryState & DialogueMemoryActions>()((set, get) => ({
  entries: [],
  currentEmotionalState: "麻木",
  attitudesToward: { mother: "回避", father: "回避", sister: "抗拒" },
  unresolvedThreads: [],

  addEntry(entry) {
    const isUnresolved = entry.protagonistResponse.length <= 5;
    const newEntry: DialogueMemoryEntry = {
      ...entry,
      unresolved: isUnresolved,
    };
    set((state) => {
      const updatedEntries = [newEntry, ...state.entries].slice(0, 10);
      const updatedThreads = isUnresolved
        ? [...state.unresolvedThreads, `${newEntry.speakerName}：${newEntry.npcContent.substring(0, 15)}...`]
        : state.unresolvedThreads;
      return {
        entries: updatedEntries,
        unresolvedThreads: updatedThreads,
      };
    });
  },

  updateEmotionalState(state) {
    set({ currentEmotionalState: state });
  },

  updateAttitudeToward(speakerRole, attitude) {
    set((s) => ({
      attitudesToward: { ...s.attitudesToward, [speakerRole]: attitude },
    }));
  },

  addUnresolvedThread(description) {
    set((s) => ({
      unresolvedThreads: [...s.unresolvedThreads, description],
    }));
  },

  resolveThread(index) {
    set((s) => ({
      unresolvedThreads: s.unresolvedThreads.filter((_, i) => i !== index),
    }));
  },

  getRecentSummaries(count = 5) {
    return get().entries.slice(0, count);
  },

  getAttitudeToward(speakerRole) {
    return get().attitudesToward[speakerRole] ?? "中立";
  },

  getUnresolvedThreads() {
    return get().unresolvedThreads;
  },

  reset() {
    set({
      entries: [],
      currentEmotionalState: "麻木",
      attitudesToward: { mother: "回避", father: "回避", sister: "抗拒" },
      unresolvedThreads: [],
    });
  },
}));
