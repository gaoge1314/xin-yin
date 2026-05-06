import { create } from 'zustand';
import type { WorldEvent, EventRecord, EventOutcome, MacroPhase } from '../types/event';
import { WORLD_EVENTS } from '../data/events/worldEvents';
import { MICRO_EVENT_POOL } from '../data/events/microEventPool';
import { useTimeStore } from './useTimeStore';
import { usePlayerStore } from './usePlayerStore';
import { useSceneStore } from './useSceneStore';
import { useWillpowerStore } from './useWillpowerStore';
import { useCognitionStore } from './useCognitionStore';
import { useOrganStore } from './useOrganStore';
import type { Season } from '../types/time';
import type { CognitionId } from '../types/cognition';
import type { OrganHealth } from '../types/organs';

interface WorldEventActions {
  checkEvents: () => WorldEvent[];
  isConditionMet: (event: WorldEvent) => boolean;
  chooseOption: (eventId: string, choiceId: string) => void;
  observeEvent: (eventId: string) => void;
  getActiveEvent: () => WorldEvent | null;
  getEventHistory: () => EventRecord[];
  generateMicroEvents: () => void;
  reset: () => void;
}

export const useWorldEventStore = create<{
  activeEventId: string | null;
  history: EventRecord[];
  pendingMicroEvents: string[];
} & WorldEventActions>((set, get) => ({
  activeEventId: null,
  history: [],
  pendingMicroEvents: [],

  checkEvents: (): WorldEvent[] => {
    const triggered: WorldEvent[] = [];

    for (const event of WORLD_EVENTS) {
      if (!get().isConditionMet(event)) continue;

      if (event.isOneShot && get().history.some((r) => r.eventId === event.id)) {
        continue;
      }

      triggered.push(event);
    }

    return triggered;
  },

  isConditionMet: (event: WorldEvent): boolean => {
    const cond = event.triggerCondition;
    const timeState = useTimeStore.getState();
    const playerState = usePlayerStore.getState();

    if (cond.minDay !== undefined && timeState.totalDays < cond.minDay) return false;
    if (cond.maxDay !== undefined && timeState.totalDays > cond.maxDay) return false;
    if (cond.minAge !== undefined && timeState.age < cond.minAge) return false;
    if (cond.maxAge !== undefined && timeState.age > cond.maxAge) return false;
    if (cond.season && !cond.season.includes(timeState.season as Season)) return false;
    if (cond.year !== undefined && timeState.currentYear !== cond.year) return false;
    if (cond.seasonInYear !== undefined && timeState.season !== cond.seasonInYear) return false;
    if (cond.minConnectionLevel !== undefined && playerState.getConnectionLevel() < cond.minConnectionLevel) return false;
    if (cond.maxConnectionLevel !== undefined && playerState.getConnectionLevel() > cond.maxConnectionLevel) return false;
    if (cond.chance !== undefined && Math.random() >= cond.chance) return false;

    return true;
  },

  chooseOption: (eventId: string, choiceId: string) => {
    const event = WORLD_EVENTS.find((e) => e.id === eventId) || MICRO_EVENT_POOL.find((e) => e.id === eventId);
    if (!event || !event.choices) return;

    const choice = event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const outcome = resolveOutcome(choice.outcomes);
    useSceneStore.getState().addNarrativeLog(outcome.narrative);

    for (const effect of outcome.effects) {
      switch (effect.target) {
        case 'willpower': {
          if (effect.value < 0) {
            useWillpowerStore.getState().consume(Math.abs(effect.value));
          } else {
            useWillpowerStore.getState().recover(effect.value);
          }
          break;
        }
        case 'organ': {
          if (effect.key) {
            useOrganStore.getState().updateOrgan({
              organ: effect.key as keyof OrganHealth,
              change: effect.value,
              reason: eventId,
            });
          }
          break;
        }
        case 'cognition': {
          if (effect.key) {
            const cogId = effect.key as CognitionId;
            if (effect.value > 0) {
              useCognitionStore.getState().recordPositiveFeedback(cogId, eventId);
            } else {
              useCognitionStore.getState().recordNegativeFeedback(cogId);
            }
          }
          break;
        }
      }
    }

    const record: EventRecord = {
      eventId,
      timestamp: Date.now(),
      choiceId,
      outcomeIndex: choice.outcomes.indexOf(outcome),
    };

    set((state) => ({
      activeEventId: null,
      history: [...state.history, record],
    }));

    const pending = get().pendingMicroEvents;
    if (pending.length > 0) {
      const nextEventId = pending[0];
      set((state) => ({
        activeEventId: nextEventId,
        pendingMicroEvents: state.pendingMicroEvents.slice(1),
      }));
    }
  },

  observeEvent: (eventId: string) => {
    const event = WORLD_EVENTS.find((e) => e.id === eventId) || MICRO_EVENT_POOL.find((e) => e.id === eventId);
    if (!event) return;

    useSceneStore.getState().addNarrativeLog(
      `他看着事情发生，什么也没做。`
    );

    const record: EventRecord = {
      eventId,
      timestamp: Date.now(),
      outcomeIndex: 0,
    };

    set((state) => ({
      activeEventId: null,
      history: [...state.history, record],
    }));

    const pending = get().pendingMicroEvents;
    if (pending.length > 0) {
      const nextEventId = pending[0];
      set((state) => ({
        activeEventId: nextEventId,
        pendingMicroEvents: state.pendingMicroEvents.slice(1),
      }));
    }
  },

  getActiveEvent: (): WorldEvent | null => {
    const activeId = get().activeEventId;
    if (!activeId) return null;
    return (WORLD_EVENTS.find((e) => e.id === activeId) || MICRO_EVENT_POOL.find((e) => e.id === activeId)) ?? null;
  },

  getEventHistory: () => {
    return get().history;
  },

  generateMicroEvents: () => {
    const currentYear = useTimeStore.getState().currentYear;

    let macroPhase: MacroPhase;
    if (currentYear <= 2026) {
      macroPhase = 'old_order';
    } else if (currentYear <= 2029) {
      macroPhase = 'cracking';
    } else if (currentYear <= 2032) {
      macroPhase = 'disintegration';
    } else {
      macroPhase = 'new_world';
    }

    const eligible = MICRO_EVENT_POOL.filter((event) => {
      if (event.macroPhase !== macroPhase) return false;
      if (event.isOneShot && get().history.some((r) => r.eventId === event.id)) return false;
      return true;
    });

    if (eligible.length === 0) return;

    const playerState = usePlayerStore.getState();
    const willpowerState = useWillpowerStore.getState();

    const weighted = eligible.map((event) => {
      let weight = event.triggerCondition.chance ?? 1;

      if (playerState.xinYinLevel > 50) {
        if (event.category === 'personal' || event.source === 'inner') {
          weight *= 1 + (playerState.xinYinLevel - 50) / 100;
        }
      }

      if (playerState.herdLevel > 50) {
        if (event.category === 'social' || event.source === 'society' || event.source === 'work') {
          weight *= 1 + (playerState.herdLevel - 50) / 100;
        }
      }

      if (willpowerState.current < 30 && event.importance === 'critical') {
        weight *= 1.5;
      }

      return { event, weight: Math.max(weight, 0.01) };
    });

    const count = Math.floor(Math.random() * 3) + 1;
    const selected: WorldEvent[] = [];
    const available = [...weighted];

    for (let i = 0; i < count && available.length > 0; i++) {
      const totalWeight = available.reduce((sum, w) => sum + w.weight, 0);
      let random = Math.random() * totalWeight;
      let pickedIndex = 0;
      for (let j = 0; j < available.length; j++) {
        random -= available[j].weight;
        if (random <= 0) {
          pickedIndex = j;
          break;
        }
      }
      selected.push(available[pickedIndex].event);
      available.splice(pickedIndex, 1);
    }

    for (const event of selected) {
      useSceneStore.getState().addNarrativeLog(event.content);

      for (const effect of event.effects) {
        switch (effect.target) {
          case 'willpower': {
            if (effect.value < 0) {
              useWillpowerStore.getState().consume(Math.abs(effect.value));
            } else {
              useWillpowerStore.getState().recover(effect.value);
            }
            break;
          }
          case 'organ': {
            if (effect.key) {
              useOrganStore.getState().updateOrgan({
                organ: effect.key as keyof OrganHealth,
                change: effect.value,
                reason: event.id,
              });
            }
            break;
          }
          case 'cognition': {
            if (effect.key) {
              const cogId = effect.key as CognitionId;
              if (effect.value > 0) {
                useCognitionStore.getState().recordPositiveFeedback(cogId, event.id);
              } else {
                useCognitionStore.getState().recordNegativeFeedback(cogId);
              }
            }
            break;
          }
        }
      }

      if (event.choices && event.choices.length > 0) {
        if (!get().activeEventId) {
          set({ activeEventId: event.id });
        } else {
          set((state) => ({
            pendingMicroEvents: [...state.pendingMicroEvents, event.id],
          }));
        }
      } else {
        const record: EventRecord = {
          eventId: event.id,
          timestamp: Date.now(),
          outcomeIndex: 0,
        };
        set((state) => ({
          history: [...state.history, record],
        }));
      }
    }
  },

  reset: () => {
    set({ activeEventId: null, history: [], pendingMicroEvents: [] });
  },
}));

function resolveOutcome(outcomes: EventOutcome[]): EventOutcome {
  let roll = Math.random();
  for (const outcome of outcomes) {
    roll -= outcome.probability;
    if (roll <= 0) return outcome;
  }
  return outcomes[outcomes.length - 1];
}
