import type { GameOption } from '../../types/option';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useMicroEnlightenmentStore } from '../../stores/useMicroEnlightenmentStore';

export interface MicroEnlightenmentResult {
  triggered: boolean;
  consecutiveCount: number;
  tagLoosened: boolean;
  loosenedCognitionId?: string;
  narrative?: string;
}

export function judgeMicroEnlightenment(
  protagonistChoice: GameOption,
  playerAgrees: boolean
): MicroEnlightenmentResult {
  if (!playerAgrees) {
    return { triggered: false, consecutiveCount: 0, tagLoosened: false };
  }

  if (protagonistChoice.source !== '心印') {
    useMicroEnlightenmentStore.getState().resetConsecutive();
    return { triggered: false, consecutiveCount: 0, tagLoosened: false };
  }

  const microStore = useMicroEnlightenmentStore.getState();
  microStore.incrementConsecutive();
  const newCount = microStore.consecutiveCount;

  const importance = protagonistChoice.isDangerous ? 1.0 : 0.5;
  usePlayerStore.getState().triggerMicroEnlightenment(importance);
  useWillpowerStore.getState().incrementMicroEnlightenmentCount();

  let tagLoosened = false;
  let loosenedCognitionId: string | undefined;

  if (newCount >= 3) {
    const cognitionStore = useCognitionStore.getState();
    const unrelieved = cognitionStore.getUnrelievedCognitions();

    if (unrelieved.length > 0) {
      const target = unrelieved[0];
      cognitionStore.recordPositiveFeedback(target.id as any, 'micro_enlightenment');
      tagLoosened = true;
      loosenedCognitionId = target.id;
    }

    microStore.resetConsecutive();
  }

  const narrative = generateMicroEnlightenmentNarrative(tagLoosened, loosenedCognitionId);

  return {
    triggered: true,
    consecutiveCount: newCount,
    tagLoosened,
    loosenedCognitionId,
    narrative,
  };
}

function generateMicroEnlightenmentNarrative(tagLoosened: boolean, _cognitionId?: string): string {
  if (tagLoosened) {
    return '他在改变，你感觉到了。';
  }

  const narratives = [
    '他看了一眼那个选项。他没有选另一个。不是因为害怕，不是因为逃避。他只是突然觉得：有些路，不必走。',
    '他停了一下。像是听到了什么。然后他做了一个不一样的选择。',
    '他犹豫了一瞬，但最终没有走向那条旧路。',
    '这一次，他没有听从那个声音。',
  ];

  return narratives[Math.floor(Math.random() * narratives.length)];
}

export function checkEndgameCondition(): boolean {
  const cognitionStore = useCognitionStore.getState();
  const playerStore = usePlayerStore.getState();

  const allRelievedOrTransformed = cognitionStore.cognitions
    .filter(c => c.isUnlocked)
    .every(c => c.isRelieved || c.isTransformed);

  return allRelievedOrTransformed && playerStore.xinYinLevel >= 80;
}
