import type { GameOption } from '../../types/option';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { getConnectionTier, CONNECTION_TIER_XINYIN_PROBABILITY } from '../../types/trust';

export interface AutonomousChoiceResult {
  chosenOption: GameOption;
  isXinYinAligned: boolean;
  isDustDriven: boolean;
  isDangerous: boolean;
  shouldShowVagusNerveWindow: boolean;
}

export function makeAutonomousChoice(options: GameOption[]): AutonomousChoiceResult {
  const playerStore = usePlayerStore.getState();
  const willpowerStore = useWillpowerStore.getState();
  const cognitionStore = useCognitionStore.getState();

  if (willpowerStore.deepNumbness) {
    const negativeOptions = options.filter(o => o.source === '灰尘' || o.isDangerous);
    const pool = negativeOptions.length > 0 ? negativeOptions : options;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return {
      chosenOption: chosen,
      isXinYinAligned: false,
      isDustDriven: chosen.source === '灰尘',
      isDangerous: chosen.isDangerous,
      shouldShowVagusNerveWindow: false,
    };
  }

  const connectionLevel = playerStore.getConnectionLevel();
  const tier = getConnectionTier(connectionLevel);
  const xinYinProbability = CONNECTION_TIER_XINYIN_PROBABILITY[tier];

  const weightedOptions = options.map(option => {
    let weight = option.weight;

    switch (option.source) {
      case '心印':
        weight *= xinYinProbability;
        break;
      case '群则':
        weight *= (1 - xinYinProbability) * 0.5;
        break;
      case '灰尘':
        const unrelievedCount = cognitionStore.getUnrelievedCognitions().length;
        const dustWeight = Math.min(unrelievedCount * 0.15, 0.6);
        weight *= dustWeight;
        break;
      case '理性':
        weight *= 0.2;
        break;
    }

    if (willpowerStore.current < 30 && option.source === '灰尘') {
      weight *= 1.5;
    }

    return { option, weight };
  });

  const totalWeight = weightedOptions.reduce((sum, wo) => sum + wo.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosenOption = options[0];

  for (const wo of weightedOptions) {
    roll -= wo.weight;
    if (roll <= 0) {
      chosenOption = wo.option;
      break;
    }
  }

  const isXinYinAligned = chosenOption.source === '心印';
  const isDustDriven = chosenOption.source === '灰尘';
  const isDangerous = chosenOption.isDangerous;

  const shouldShowVagusNerveWindow = isDangerous && isDustDriven && willpowerStore.current <= 20;

  return {
    chosenOption,
    isXinYinAligned,
    isDustDriven,
    isDangerous,
    shouldShowVagusNerveWindow,
  };
}
