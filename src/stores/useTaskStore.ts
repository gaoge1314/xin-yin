import { create } from 'zustand';
import type { GameTask, PersonalPlan, PersonalPlanTerm, TaskConflict } from '../types/task';
import { usePlayerStore } from './usePlayerStore';
import { useTimeStore } from './useTimeStore';

const INITIAL_PERSONAL_PLANS: PersonalPlan[] = [
  { term: 'short', content: '', isGenerated: false },
  { term: 'medium', content: '搞清楚要不要调剂', isGenerated: true },
  { term: 'long', content: '', isGenerated: false },
  { term: 'eternal', content: '活着的意义是什么', isGenerated: true },
];

interface TaskState {
  worldTasks: GameTask[];
  personalPlans: PersonalPlan[];
  activeConflicts: TaskConflict[];
  worldTaskCompletionCount: number;
  personalTaskCompletionCount: number;
}

interface TaskActions {
  addWorldTask: (task: Omit<GameTask, 'isCompleted' | 'isPostponed' | 'postponeCount' | 'createdAt'>) => void;
  completeTask: (taskId: string) => void;
  postponeTask: (taskId: string) => void;
  rejectTask: (taskId: string) => void;
  addPersonalPlan: (plan: PersonalPlan) => void;
  updatePersonalPlan: (term: PersonalPlanTerm, content: string) => void;
  detectConflicts: () => TaskConflict[];
  resolveConflict: (conflict: TaskConflict, resolution: 'social_first' | 'xinyin_first' | 'third_way') => void;
  generatePersonalPlan: () => void;
  getWorldCompletionRate: () => number;
  getPersonalCompletionRate: () => number;
  getActiveWorldTasks: () => GameTask[];
  reset: () => void;
}

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  worldTasks: [],
  personalPlans: [...INITIAL_PERSONAL_PLANS],
  activeConflicts: [],
  worldTaskCompletionCount: 0,
  personalTaskCompletionCount: 0,

  addWorldTask: (task) => {
    const newTask: GameTask = {
      ...task,
      isCompleted: false,
      isPostponed: false,
      postponeCount: 0,
      createdAt: Date.now(),
    };
    set((state) => ({
      worldTasks: [...state.worldTasks, newTask],
    }));
  },

  completeTask: (taskId) => {
    const state = get();
    const task = state.worldTasks.find((t) => t.id === taskId);
    if (!task || task.isCompleted) return;

    set((state) => ({
      worldTasks: state.worldTasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: true } : t
      ),
      worldTaskCompletionCount:
        task.track === 'world'
          ? state.worldTaskCompletionCount + 1
          : state.worldTaskCompletionCount,
      personalTaskCompletionCount:
        task.track === 'personal'
          ? state.personalTaskCompletionCount + 1
          : state.personalTaskCompletionCount,
    }));
  },

  postponeTask: (taskId) => {
    set((state) => ({
      worldTasks: state.worldTasks.map((t) =>
        t.id === taskId
          ? { ...t, isPostponed: true, postponeCount: t.postponeCount + 1 }
          : t
      ),
    }));
  },

  rejectTask: (taskId) => {
    set((state) => ({
      worldTasks: state.worldTasks.filter((t) => t.id !== taskId),
    }));
  },

  addPersonalPlan: (plan) => {
    set((state) => {
      const existing = state.personalPlans.find((p) => p.term === plan.term);
      if (existing) {
        return {
          personalPlans: state.personalPlans.map((p) =>
            p.term === plan.term ? plan : p
          ),
        };
      }
      return { personalPlans: [...state.personalPlans, plan] };
    });
  },

  updatePersonalPlan: (term, content) => {
    set((state) => ({
      personalPlans: state.personalPlans.map((p) =>
        p.term === term ? { ...p, content } : p
      ),
    }));
  },

  detectConflicts: () => {
    const state = get();
    const conflicts: TaskConflict[] = [];

    for (const task of state.worldTasks) {
      if (task.isCompleted) continue;
      if (!task.conflictWith) continue;

      const matchedPlan = state.personalPlans.find(
        (p) => p.term === task.conflictWith && p.content !== ''
      );
      if (matchedPlan) {
        const alreadyExists = state.activeConflicts.some(
          (c) => c.worldTaskId === task.id && c.personalPlanTerm === matchedPlan.term
        );
        if (!alreadyExists) {
          conflicts.push({
            worldTaskId: task.id,
            personalPlanTerm: matchedPlan.term,
            personalPlanContent: matchedPlan.content,
          });
        }
      }
    }

    if (conflicts.length > 0) {
      set((state) => ({
        activeConflicts: [...state.activeConflicts, ...conflicts],
      }));
    }

    return conflicts;
  },

  resolveConflict: (conflict, resolution) => {
    set((state) => ({
      activeConflicts: state.activeConflicts.map((c) =>
        c.worldTaskId === conflict.worldTaskId &&
        c.personalPlanTerm === conflict.personalPlanTerm
          ? { ...c, resolution }
          : c
      ),
    }));
  },

  generatePersonalPlan: () => {
    const xinYinLevel = usePlayerStore.getState().xinYinLevel;
    const currentYear = useTimeStore.getState().currentYear;

    set((state) => {
      const updatedPlans = [...state.personalPlans];

      if (currentYear >= 2026) {
        const mediumPlan = updatedPlans.find((p) => p.term === 'medium');
        if (mediumPlan && mediumPlan.content.includes('调剂')) {
          const idx = updatedPlans.indexOf(mediumPlan);
          updatedPlans[idx] = {
            ...mediumPlan,
            content: '找一个能养活自己的事',
            isGenerated: true,
          };
        }
      }

      if (xinYinLevel > 50) {
        const shortPlan = updatedPlans.find((p) => p.term === 'short');
        if (shortPlan && shortPlan.content === '') {
          const idx = updatedPlans.indexOf(shortPlan);
          updatedPlans[idx] = {
            ...shortPlan,
            content: '一个人出去走走',
            isGenerated: true,
          };
        }
      }

      if (xinYinLevel > 70) {
        const longPlan = updatedPlans.find((p) => p.term === 'long');
        if (longPlan && longPlan.content === '') {
          const idx = updatedPlans.indexOf(longPlan);
          updatedPlans[idx] = {
            ...longPlan,
            content: '找到自己想做的事',
            isGenerated: true,
          };
        }
      }

      return { personalPlans: updatedPlans };
    });
  },

  getWorldCompletionRate: () => {
    const state = get();
    if (state.worldTasks.length === 0) return 0;
    const completed = state.worldTasks.filter(
      (t) => t.track === 'world' && t.isCompleted
    ).length;
    const total = state.worldTasks.filter((t) => t.track === 'world').length;
    return total === 0 ? 0 : completed / total;
  },

  getPersonalCompletionRate: () => {
    const state = get();
    if (state.worldTasks.length === 0) return 0;
    const completed = state.worldTasks.filter(
      (t) => t.track === 'personal' && t.isCompleted
    ).length;
    const total = state.worldTasks.filter((t) => t.track === 'personal').length;
    return total === 0 ? 0 : completed / total;
  },

  getActiveWorldTasks: () => {
    return get().worldTasks.filter((t) => !t.isCompleted);
  },

  reset: () => {
    set({
      worldTasks: [],
      personalPlans: [...INITIAL_PERSONAL_PLANS],
      activeConflicts: [],
      worldTaskCompletionCount: 0,
      personalTaskCompletionCount: 0,
    });
  },
}));
