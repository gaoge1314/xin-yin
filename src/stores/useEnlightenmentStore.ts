import { create } from 'zustand';
import { DUST_TEXTS } from '../data/enlightenment/dustTexts';
import { INNER_MONOLOGUES } from '../data/enlightenment/innerMonologues';
import { useWillpowerStore } from './useWillpowerStore';
import { useGameStore } from './useGameStore';
import { useTimeStore } from './useTimeStore';
import { usePlayerStore } from './usePlayerStore';
import { useSceneStore } from './useSceneStore';
import { INITIAL_WILLPOWER_MAX } from '../types/willpower';

interface DustParticle {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  isFading: boolean;
}

interface EnlightenmentState {
  isActive: boolean;
  currentPhase: 'idle' | 'falling' | 'sweeping' | 'awakening';
  clickCount: number;
  dustParticles: DustParticle[];
  shownMonologues: number[];
  currentMonologue: string | null;
  isEnlightenmentComplete: boolean;
  hasTriggeredEnlightenment: boolean;
  isPartialExperience: boolean;
}

interface EnlightenmentActions {
  startEnlightenment: () => void;
  setPhase: (phase: 'falling' | 'sweeping' | 'awakening') => void;
  clickDust: (dustId: number) => void;
  spawnDust: () => void;
  setCurrentMonologue: (text: string | null) => void;
  completeEnlightenment: () => void;
  checkTriggerConditions: () => boolean;
  reset: () => void;
}

let nextDustId = 0;

const initialState: EnlightenmentState = {
  isActive: false,
  currentPhase: 'idle',
  clickCount: 0,
  dustParticles: [],
  shownMonologues: [],
  currentMonologue: null,
  isEnlightenmentComplete: false,
  hasTriggeredEnlightenment: false,
  isPartialExperience: false,
};

function getRandomPosition(): { x: number; y: number } {
  return {
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  };
}

function getRandomText(existingTexts: string[]): string {
  const available = DUST_TEXTS.filter((t) => !existingTexts.includes(t));
  const pool = available.length > 0 ? available : DUST_TEXTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const useEnlightenmentStore = create<EnlightenmentState & EnlightenmentActions>(
  (set, get) => ({
    ...initialState,

    startEnlightenment: () => {
      const connectionLevel = usePlayerStore.getState().getConnectionLevel();
      const isPartial = connectionLevel < 30;

      const particleCount = isPartial
        ? Math.floor(Math.random() * 2) + 4
        : Math.floor(Math.random() * 3) + 8;

      const particles: DustParticle[] = [];
      const usedTexts: string[] = [];

      for (let i = 0; i < particleCount; i++) {
        const pos = getRandomPosition();
        const text = getRandomText(usedTexts);
        usedTexts.push(text);
        particles.push({
          id: nextDustId++,
          text,
          x: pos.x,
          y: pos.y,
          opacity: 1,
          isFading: false,
        });
      }

      if (isPartial) {
        useSceneStore.getState().addNarrativeLog(
          '他感到心中有尘，却无法完全看清——他和内心的声音还不够亲近。'
        );
      }

      set({
        isActive: true,
        currentPhase: 'falling',
        clickCount: 0,
        dustParticles: particles,
        shownMonologues: [],
        currentMonologue: null,
        isEnlightenmentComplete: false,
        isPartialExperience: isPartial,
      });
    },

    setPhase: (phase) => {
      set({ currentPhase: phase });
    },

    clickDust: (dustId: number) => {
      const state = get();
      const dust = state.dustParticles.find((d) => d.id === dustId);
      if (!dust || dust.isFading) return;

      const newClickCount = state.clickCount + 1;
      const newShownMonologues = [...state.shownMonologues];
      let newMonologue: string | null = state.currentMonologue;

      if (INNER_MONOLOGUES[newClickCount] && !newShownMonologues.includes(newClickCount)) {
        newMonologue = INNER_MONOLOGUES[newClickCount];
        newShownMonologues.push(newClickCount);
      }

      set({
        dustParticles: state.dustParticles.map((d) =>
          d.id === dustId ? { ...d, isFading: true } : d
        ),
        clickCount: newClickCount,
        shownMonologues: newShownMonologues,
        currentMonologue: newMonologue,
      });

      setTimeout(() => {
        const currentState = get();
        const remaining = currentState.dustParticles.filter((d) => d.id !== dustId);
        const existingTexts = remaining.map((d) => d.text);
        const pos = getRandomPosition();
        const text = getRandomText(existingTexts);

        set({
          dustParticles: [
            ...remaining,
            {
              id: nextDustId++,
              text,
              x: pos.x,
              y: pos.y,
              opacity: 1,
              isFading: false,
            },
          ],
        });
      }, 500);
    },

    spawnDust: () => {
      const state = get();
      const existingTexts = state.dustParticles.map((d) => d.text);
      const pos = getRandomPosition();
      const text = getRandomText(existingTexts);

      set({
        dustParticles: [
          ...state.dustParticles,
          {
            id: nextDustId++,
            text,
            x: pos.x,
            y: pos.y,
            opacity: 1,
            isFading: false,
          },
        ],
      });
    },

    setCurrentMonologue: (text) => {
      set({ currentMonologue: text });
    },

    completeEnlightenment: () => {
      const isPartial = get().isPartialExperience;
      if (isPartial) {
        useSceneStore.getState().addNarrativeLog(
          '他扫去了一些尘，但还有很多看不清。也许，等他更信任内心的声音...'
        );
      } else {
        usePlayerStore.getState().triggerEnlightenment();
      }

      set({
        isEnlightenmentComplete: true,
        hasTriggeredEnlightenment: !isPartial,
        isActive: false,
      });
    },

    checkTriggerConditions: () => {
      const willpowerState = useWillpowerStore.getState();
      const gameState = useGameStore.getState();
      const timeState = useTimeStore.getState();

      const hasBacklash = willpowerState.max < INITIAL_WILLPOWER_MAX;

      const painfulMemories = gameState.memories.filter(
        (m) => m.type === 'painful' && !m.isHealed
      );
      const hasEnoughMemories = painfulMemories.length >= 3;

      const hasUsedDream =
        gameState.dreamCooldown > 0 ||
        gameState.believedVisions.length > 0 ||
        gameState.rejectedVisions.length > 0;

      const isWinter = timeState.season === 'winter';

      return hasBacklash && hasEnoughMemories && hasUsedDream && isWinter;
    },

    reset: () => {
      set(initialState);
    },
  })
);
