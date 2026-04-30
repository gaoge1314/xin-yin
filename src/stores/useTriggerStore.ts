import { create } from 'zustand';
import {
  type TriggerType,
  type InputBoxState,
  type PerceptionContent,
  type TriggerCooldown,
  TRIGGER_INFO,
  TRIGGER_PRIORITY_ORDER,
  SILENT_CONSECUTIVE_PENALTY_DAYS,
  SILENT_CONSECUTIVE_PENALTY,
} from '../types/playerTrigger';
import { usePlayerStore } from './usePlayerStore';
import { useTimeStore } from './useTimeStore';

interface TriggerActions {
  triggerEmerging: (triggerType: TriggerType, perception: PerceptionContent) => void;
  triggerUrgent: (triggerType: TriggerType, perception: PerceptionContent) => void;
  dismissToDormant: () => void;
  respondAndClose: (wasSilentCompanion?: boolean) => void;
  enqueueTrigger: (triggerType: TriggerType) => void;
  processQueue: () => void;
  resetDaily: () => void;
  isOnCooldown: (triggerType: TriggerType) => boolean;
  isIgnoredToday: (triggerType: TriggerType) => boolean;
  isDailyUsed: (triggerType: TriggerType) => boolean;
  setPendingMemoryEnd: (value: boolean) => void;
  setPendingSocialTrigger: (tag: string | null) => void;
  updateLastWillpower: (value: number) => void;
  checkWillpowerDrop: (currentWillpower: number) => boolean;
  reset: () => void;
}

export const useTriggerStore = create<{
  inputBoxState: InputBoxState;
  activeTrigger: TriggerType | null;
  activePerception: PerceptionContent | null;
  triggerQueue: TriggerType[];
  cooldowns: TriggerCooldown[];
  dailyTriggersUsed: TriggerType[];
  ignoredToday: TriggerType[];
  silentConsecutiveDays: number;
  lastWillpowerValue: number;
  pendingMemoryEnd: boolean;
  pendingSocialTrigger: string | null;
} & TriggerActions>((set, get) => ({
  inputBoxState: 'dormant',
  activeTrigger: null,
  activePerception: null,
  triggerQueue: [],
  cooldowns: [],
  dailyTriggersUsed: [],
  ignoredToday: [],
  silentConsecutiveDays: 0,
  lastWillpowerValue: 60,
  pendingMemoryEnd: false,
  pendingSocialTrigger: null,

  triggerEmerging: (triggerType: TriggerType, perception: PerceptionContent) => {
    const state = get();
    if (state.isOnCooldown(triggerType)) return;
    if (state.isIgnoredToday(triggerType)) return;
    if (state.inputBoxState === 'urgent') {
      state.enqueueTrigger(triggerType);
      return;
    }

    set({
      inputBoxState: 'emerging',
      activeTrigger: triggerType,
      activePerception: perception,
      dailyTriggersUsed: [...state.dailyTriggersUsed, triggerType],
    });
  },

  triggerUrgent: (triggerType: TriggerType, perception: PerceptionContent) => {
    const state = get();
    if (state.isOnCooldown(triggerType)) return;

    if (state.inputBoxState === 'urgent' && state.activeTrigger !== triggerType) {
      state.enqueueTrigger(triggerType);
      return;
    }

    set({
      inputBoxState: 'urgent',
      activeTrigger: triggerType,
      activePerception: perception,
      dailyTriggersUsed: [...state.dailyTriggersUsed, triggerType],
    });

    useTimeStore.getState().pause('urgent-trigger');
  },

  dismissToDormant: () => {
    const state = get();
    const triggerType = state.activeTrigger;

    if (triggerType) {
      const info = TRIGGER_INFO[triggerType];
      if (info.cooldownHours > 0) {
        const endTime = useTimeStore.getState().totalDays * 24 + useTimeStore.getState().hour + info.cooldownHours;
        set({
          cooldowns: [...state.cooldowns, { triggerType, endTime }],
        });
      }

      set((prev) => ({
        ignoredToday: [...prev.ignoredToday, triggerType],
      }));

      if (triggerType === 'T01') {
        const newSilentDays = prev.silentConsecutiveDays + 1;
        set({ silentConsecutiveDays: newSilentDays });

        usePlayerStore.getState().adjustTrust(-1, 'dismiss_emerging');

        if (newSilentDays >= SILENT_CONSECUTIVE_PENALTY_DAYS) {
          usePlayerStore.getState().adjustTrust(-SILENT_CONSECUTIVE_PENALTY, 'consecutive_silent_penalty');
          set({ silentConsecutiveDays: 0 });
        }
      }
    }

    set({
      inputBoxState: 'dormant',
      activeTrigger: null,
      activePerception: null,
    });

    useTimeStore.getState().resume('urgent-trigger');
    get().processQueue();
  },

  respondAndClose: (wasSilentCompanion?: boolean) => {
    const state = get();
    const triggerType = state.activeTrigger;

    if (triggerType) {
      const info = TRIGGER_INFO[triggerType];
      if (info.cooldownHours > 0) {
        const endTime = useTimeStore.getState().totalDays * 24 + useTimeStore.getState().hour + info.cooldownHours;
        set((prev) => ({
          cooldowns: [...prev.cooldowns, { triggerType, endTime }],
        }));
      }

      if (triggerType === 'T01') {
        set({ silentConsecutiveDays: 0 });
      }

      if (wasSilentCompanion) {
        usePlayerStore.getState().adjustTrust(1, 'silent_companion');
      }
    }

    set({
      inputBoxState: 'dormant',
      activeTrigger: null,
      activePerception: null,
    });

    useTimeStore.getState().resume('urgent-trigger');
    get().processQueue();
  },

  enqueueTrigger: (triggerType: TriggerType) => {
    const state = get();
    if (state.triggerQueue.includes(triggerType)) return;
    set({ triggerQueue: [...state.triggerQueue, triggerType] });
  },

  processQueue: () => {
    const state = get();

    if (state.inputBoxState !== 'dormant') return;
    if (state.triggerQueue.length === 0) return;

    const sorted = [...state.triggerQueue].sort((a, b) => {
      const priorityA = TRIGGER_PRIORITY_ORDER[TRIGGER_INFO[a].priority];
      const priorityB = TRIGGER_PRIORITY_ORDER[TRIGGER_INFO[b].priority];
      return priorityA - priorityB;
    });

    const nextTrigger = sorted[0];
    const remaining = sorted.slice(1);

    if (state.isOnCooldown(nextTrigger) || state.isIgnoredToday(nextTrigger)) {
      set({ triggerQueue: remaining });
      get().processQueue();
      return;
    }

    set({ triggerQueue: remaining });
  },

  resetDaily: () => {
    set({
      dailyTriggersUsed: [],
      ignoredToday: [],
    });
  },

  isOnCooldown: (triggerType: TriggerType) => {
    const state = get();
    const currentGameHour = useTimeStore.getState().totalDays * 24 + useTimeStore.getState().hour;
    return state.cooldowns.some(
      (c) => c.triggerType === triggerType && c.endTime > currentGameHour
    );
  },

  isIgnoredToday: (triggerType: TriggerType) => {
    return get().ignoredToday.includes(triggerType);
  },

  isDailyUsed: (triggerType: TriggerType) => {
    return get().dailyTriggersUsed.includes(triggerType);
  },

  setPendingMemoryEnd: (value: boolean) => {
    set({ pendingMemoryEnd: value });
  },

  setPendingSocialTrigger: (tag: string | null) => {
    set({ pendingSocialTrigger: tag });
  },

  updateLastWillpower: (value: number) => {
    set({ lastWillpowerValue: value });
  },

  checkWillpowerDrop: (currentWillpower: number) => {
    const state = get();
    const drop = state.lastWillpowerValue - currentWillpower;
    set({ lastWillpowerValue: currentWillpower });
    return drop > 40;
  },

  reset: () => {
    set({
      inputBoxState: 'dormant',
      activeTrigger: null,
      activePerception: null,
      triggerQueue: [],
      cooldowns: [],
      dailyTriggersUsed: [],
      ignoredToday: [],
      silentConsecutiveDays: 0,
      lastWillpowerValue: 60,
      pendingMemoryEnd: false,
      pendingSocialTrigger: null,
    });
  },
}));
