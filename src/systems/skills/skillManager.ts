import { useGameStore } from '../../stores/useGameStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useSceneStore } from '../../stores/useSceneStore';
import type { Memory, DreamVision } from '../../types/skill';
import { RECALL_COOLDOWN, DREAM_COOLDOWN } from '../../types/skill';
import { DREAM_SYMBOLS } from '../../data/dreams/dreamSymbols';

export function useRecallSkill() {
  const recallCooldown = useGameStore((s) => s.recallCooldown);
  const memories = useGameStore((s) => s.memories);

  const canUse = recallCooldown === 0;

  const useRecall = (type: 'good' | 'painful', memoryId: string) => {
    if (!canUse) return false;

    const memory = memories.find((m) => m.id === memoryId);
    if (!memory) return false;

    if (type === 'good') {
      useWillpowerStore.getState().recover(20);
      const categoryLabels: Record<string, string> = {
        name: '名', emotion: '情', resentment: '怨',
        fear: '惧', obsession: '我执', beauty: '光', special: '悟',
      };
      const label = categoryLabels[memory.category] || '';
      useSceneStore.getState().addNarrativeLog(
        `【${label}】${memory.title}`
      );
      useSceneStore.getState().addNarrativeLog(
        `一段温暖的记忆浮上心头——${memory.content}`
      );
      useSceneStore.getState().addNarrativeLog(
        `——"${memory.innerVoice}"`
      );
    } else {
      const keywordMatch = checkKeywordMatch(memory);
      if (keywordMatch > 0.3) {
        useGameStore.setState((state) => ({
          memories: state.memories.map((m) =>
            m.id === memoryId ? { ...m, isHealed: true } : m
          ),
        }));
        useWillpowerStore.getState().recover(10);
        const categoryLabels: Record<string, string> = {
          name: '名', emotion: '情', resentment: '怨',
          fear: '惧', obsession: '我执', beauty: '光', special: '悟',
        };
        const label = categoryLabels[memory.category] || '';
        useSceneStore.getState().addNarrativeLog(
          `【${label}】${memory.title}`
        );
        useSceneStore.getState().addNarrativeLog(
          `那个伤痛的记忆，似乎没那么刺痛了。`
        );
        useSceneStore.getState().addNarrativeLog(
          `——"${memory.innerVoice}"`
        );
      } else {
        useWillpowerStore.getState().consume(15);
        useSceneStore.getState().addNarrativeLog(
          `试图面对那段记忆，但还做不到。心更痛了。`
        );
        useSceneStore.getState().addNarrativeLog(
          `——"${memory.innerVoice}"`
        );
      }
    }

    useGameStore.setState({ recallCooldown: RECALL_COOLDOWN });
    return true;
  };

  const checkKeywordMatch = (memory: Memory): number => {
    const influences = usePlayerStore.getState().getRecentInfluences();
    if (influences.length === 0) return 0;

    let totalMatch = 0;
    for (const influence of influences) {
      const textLower = influence.text.toLowerCase();
      let matchCount = 0;
      for (const keyword of memory.keywords) {
        if (textLower.includes(keyword.toLowerCase())) matchCount++;
      }
      totalMatch += matchCount / memory.keywords.length;
    }
    return totalMatch / influences.length;
  };

  const tickCooldown = () => {
    const current = useGameStore.getState().recallCooldown;
    if (current > 0) {
      useGameStore.setState({ recallCooldown: current - 1 });
    }
  };

  return { canUse, recallCooldown, useRecall, tickCooldown, memories };
}

export function useDreamSkill() {
  const dreamCooldown = useGameStore((s) => s.dreamCooldown);

  const canUse = dreamCooldown === 0;

  const useDream = (): DreamVision | null => {
    if (!canUse) return null;

    const connectionLevel = usePlayerStore.getState().getConnectionLevel();
    const beliefRate = calculateBeliefRate(connectionLevel);

    const selectedSymbol = DREAM_SYMBOLS[Math.floor(Math.random() * DREAM_SYMBOLS.length)];

    const vision: DreamVision = {
      id: selectedSymbol.id,
      content: selectedSymbol.symbol,
      relatedEventId: undefined,
      beliefRate,
      timestamp: Date.now(),
      ...(usePlayerStore.getState().xinYinLevel > 50 ? { interpretationHint: selectedSymbol.interpretation } : {}),
    };

    const isBelieved = Math.random() < beliefRate;

    if (isBelieved) {
      useGameStore.setState((state) => ({
        believedVisions: [...state.believedVisions, vision],
      }));
      const hint = vision.interpretationHint ? `\n你隐约感到——${vision.interpretationHint}` : '';
      const connectionDesc = connectionLevel >= 60 ? '他认真地思索了这个梦。' : '他似乎相信了这个梦。';
      useSceneStore.getState().addNarrativeLog(
        `入梦：${vision.content}（${connectionDesc}）${hint}`
      );
    } else {
      useGameStore.setState((state) => ({
        rejectedVisions: [...state.rejectedVisions, vision],
      }));
      const hint = vision.interpretationHint ? `\n你隐约感到——${vision.interpretationHint}` : '';
      const rejectDesc = connectionLevel < 20 ? '他根本没把这个梦当回事。' : '他摇了摇头，不信这个。';
      useSceneStore.getState().addNarrativeLog(
        `入梦：${vision.content}（${rejectDesc}）${hint}`
      );
    }

    useGameStore.setState({ dreamCooldown: DREAM_COOLDOWN });
    return vision;
  };

  const tickCooldown = () => {
    const current = useGameStore.getState().dreamCooldown;
    if (current > 0) {
      useGameStore.setState({ dreamCooldown: current - 1 });
    }
  };

  return { canUse, dreamCooldown, useDream, tickCooldown };
}

function calculateBeliefRate(connectionLevel: number): number {
  const baseRate = 0.15;
  const connectionBonus = (connectionLevel / 100) * 0.55;
  return Math.min(baseRate + connectionBonus, 0.70);
}
