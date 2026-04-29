import type { EndingCriteria, EndingResult } from '../../types/ending';
import { judgeEnding } from '../../types/ending';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useGameStore } from '../../stores/useGameStore';
import { useSocialRuleStore } from '../../stores/useSocialRuleStore';
import { useHabitStore } from '../../stores/useHabitStore';
import { useEnlightenmentStore } from '../../stores/useEnlightenmentStore';
import { useSceneStore } from '../../stores/useSceneStore';

export function gatherCriteria(): EndingCriteria {
  const playerState = usePlayerStore.getState();
  const willpowerState = useWillpowerStore.getState();
  const gameState = useGameStore.getState();
  const socialRuleState = useSocialRuleStore.getState();
  const habitState = useHabitStore.getState();
  const enlightenmentState = useEnlightenmentStore.getState();

  const healedPainfulCount = gameState.memories.filter(
    (m) => m.type === 'painful' && m.isHealed
  ).length;

  return {
    xinYinLevel: playerState.xinYinLevel,
    socialRuleLevel: socialRuleState.getSocialRuleLevel(),
    willpowerMax: willpowerState.max,
    healedPainfulCount,
    connectionLevel: playerState.getConnectionLevel(),
    hasEnlightenment: enlightenmentState.hasTriggeredEnlightenment,
    positiveHabitCount: habitState.getPositiveHabitCount(),
  };
}

export function evaluateEnding(): EndingResult {
  const criteria = gatherCriteria();
  return judgeEnding(criteria);
}

const PREMATURE_DEATH_DAILY_CHANCE = 0.02;
let prematureDeathTrackDays = 0;

export function checkPrematureDeath(): boolean {
  const willpowerState = useWillpowerStore.getState();

  if (willpowerState.current > 0 && willpowerState.max > 0) {
    prematureDeathTrackDays = 0;
    return false;
  }

  prematureDeathTrackDays++;

  if (Math.random() < PREMATURE_DEATH_DAILY_CHANCE) {
    useSceneStore.getState().addNarrativeLog(
      '他再也撑不住了...'
    );
    return true;
  }

  return false;
}

export function resetPrematureDeathTracker() {
  prematureDeathTrackDays = 0;
}
