import { create } from 'zustand';
import type { WorldEvent, EventRecord, EventOutcome } from '../types/event';
import { WORLD_EVENTS } from '../data/events/worldEvents';
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
  reset: () => void;
}

export const useWorldEventStore = create<{
  activeEventId: string | null;
  history: EventRecord[];
} & WorldEventActions>((set, get) => ({
  activeEventId: null,
  history: [],

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
    const event = WORLD_EVENTS.find((e) => e.id === eventId);
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
  },

  observeEvent: (eventId: string) => {
    const event = WORLD_EVENTS.find((e) => e.id === eventId);
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
  },

  getActiveEvent: (): WorldEvent | null => {
    const activeId = get().activeEventId;
    if (!activeId) return null;
    return WORLD_EVENTS.find((e) => e.id === activeId) ?? null;
  },

  getEventHistory: () => {
    return get().history;
  },

  reset: () => {
    set({ activeEventId: null, history: [] });
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
