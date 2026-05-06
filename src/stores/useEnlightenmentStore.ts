import { create } from 'zustand';
import { DUST_LABEL_MAP, FALLBACK_DUST_TEXTS } from '../data/enlightenment/dustLabelMap';
import { INNER_MONOLOGUES } from '../data/enlightenment/innerMonologues';
import { useCognitionStore } from './useCognitionStore';
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
  sourceLabelId?: string;
  isFallback?: boolean;
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

function getEdgePosition(): { x: number; y: number } {
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: return { x: Math.random() * 80 + 10, y: Math.random() * 10 + 2 };
    case 1: return { x: Math.random() * 80 + 10, y: Math.random() * 10 + 88 };
    case 2: return { x: Math.random() * 10 + 2, y: Math.random() * 80 + 10 };
    default: return { x: Math.random() * 10 + 88, y: Math.random() * 80 + 10 };
  }
}

function getDustTextForLabel(labelId: string, existingTexts: string[]): string {
  const variants = DUST_LABEL_MAP[labelId];
  if (!variants) return FALLBACK_DUST_TEXTS[Math.floor(Math.random() * FALLBACK_DUST_TEXTS.length)];
  const available = variants.filter((t) => !existingTexts.includes(t));
  const pool = available.length > 0 ? available : variants;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getFallbackText(existingTexts: string[]): string {
  const available = FALLBACK_DUST_TEXTS.filter((t) => !existingTexts.includes(t));
  const pool = available.length > 0 ? available : FALLBACK_DUST_TEXTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const useEnlightenmentStore = create<EnlightenmentState & EnlightenmentActions>(
  (set, get) => ({
    ...initialState,

    startEnlightenment: () => {
      const connectionLevel = usePlayerStore.getState().getConnectionLevel();
      const isPartial = connectionLevel < 30;

      const activeLabels = useCognitionStore.getState().cognitions.filter(
        (c) => c.isUnlocked && !c.isTransformed
      );

      const labelIds = activeLabels.map((c) => c.id);
      const needsFallback = labelIds.length < 5;

      const particleCount = isPartial
        ? Math.floor(Math.random() * 2) + 4
        : Math.floor(Math.random() * 4) + 5;

      const particles: DustParticle[] = [];
      const usedTexts: string[] = [];

      for (let i = 0; i < particleCount; i++) {
        const pos = getRandomPosition();
        let text: string;
        let sourceLabelId: string | undefined;
        let isFallback: boolean | undefined;

        if (labelIds.length > 0) {
          const labelId = labelIds[i % labelIds.length];
          text = getDustTextForLabel(labelId, usedTexts);
          sourceLabelId = labelId;
          isFallback = false;
        } else {
          text = getFallbackText(usedTexts);
          isFallback = true;
        }
        usedTexts.push(text);
        particles.push({
          id: nextDustId++,
          text,
          x: pos.x,
          y: pos.y,
          opacity: 1,
          isFading: false,
          sourceLabelId,
          isFallback,
        });
      }

      if (needsFallback) {
        const fallbackCount = 5 - labelIds.length;
        for (let i = 0; i < fallbackCount; i++) {
          const pos = getRandomPosition();
          const text = getFallbackText(usedTexts);
          usedTexts.push(text);
          particles.push({
            id: nextDustId++,
            text,
            x: pos.x,
            y: pos.y,
            opacity: 1,
            isFading: false,
            isFallback: true,
          });
        }
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

      const delay = 1000 + Math.random() * 1000;
      setTimeout(() => {
        const currentState = get();
        const remaining = currentState.dustParticles.filter((d) => d.id !== dustId);
        const existingTexts = remaining.map((d) => d.text);
        const pos = getEdgePosition();
        let text: string;
        let sourceLabelId: string | undefined = dust.sourceLabelId;
        let isFallback: boolean | undefined = dust.isFallback;

        if (sourceLabelId && DUST_LABEL_MAP[sourceLabelId]) {
          text = getDustTextForLabel(sourceLabelId, existingTexts);
        } else if (sourceLabelId) {
          const allLabelIds = useCognitionStore.getState().cognitions
            .filter((c) => c.isUnlocked && !c.isTransformed)
            .map((c) => c.id);
          if (allLabelIds.length > 0) {
            const nextLabelId = allLabelIds[Math.floor(Math.random() * allLabelIds.length)];
            text = getDustTextForLabel(nextLabelId, existingTexts);
            sourceLabelId = nextLabelId;
            isFallback = false;
          } else {
            text = getFallbackText(existingTexts);
            isFallback = true;
          }
        } else {
          text = getFallbackText(existingTexts);
          isFallback = true;
        }

        set({
          dustParticles: [
            ...remaining,
            {
              id: nextDustId++,
              text,
              x: pos.x,
              y: pos.y,
              opacity: 0,
              isFading: false,
              sourceLabelId,
              isFallback,
            },
          ],
        });

        requestAnimationFrame(() => {
          set((s) => ({
            dustParticles: s.dustParticles.map((d) =>
              d.id === nextDustId - 1 && d.opacity === 0
                ? { ...d, opacity: 1 }
                : d
            ),
          }));
        });
      }, delay);
    },

    spawnDust: () => {
      const state = get();
      const existingTexts = state.dustParticles.map((d) => d.text);
      const pos = getEdgePosition();

      const activeLabels = useCognitionStore.getState().cognitions.filter(
        (c) => c.isUnlocked && !c.isTransformed
      );
      const labelIds = activeLabels.map((c) => c.id);

      let text: string;
      let sourceLabelId: string | undefined;
      let isFallback: boolean | undefined;

      if (labelIds.length > 0) {
        const labelId = labelIds[Math.floor(Math.random() * labelIds.length)];
        text = getDustTextForLabel(labelId, existingTexts);
        sourceLabelId = labelId;
        isFallback = false;
      } else {
        text = getFallbackText(existingTexts);
        isFallback = true;
      }

      set({
        dustParticles: [
          ...state.dustParticles,
          {
            id: nextDustId++,
            text,
            x: pos.x,
            y: pos.y,
            opacity: 0,
            isFading: false,
            sourceLabelId,
            isFallback,
          },
        ],
      });

      requestAnimationFrame(() => {
        set((s) => ({
          dustParticles: s.dustParticles.map((d) =>
            d.id === nextDustId - 1 && d.opacity === 0
              ? { ...d, opacity: 1 }
              : d
          ),
        }));
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
