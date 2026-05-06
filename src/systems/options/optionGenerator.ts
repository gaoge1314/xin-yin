import type { GameOption, OptionSource, OptionPoolRatio } from '../../types/option';
import { OPTION_POOL_RATIOS, MIN_OPTIONS, MAX_OPTIONS } from '../../types/option';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { getYear } from '../../types/time';

function getGamePhase(): string {
  const year = getYear(useTimeStore.getState().age);
  if (year <= 2026) return 'part1';
  if (year <= 2030) return 'part2';
  if (year <= 2035) return 'part3';
  return 'endgame';
}

function getAdjustedRatio(baseRatio: OptionPoolRatio): OptionPoolRatio {
  const cognitionStore = useCognitionStore.getState();

  const totalCognitions = cognitionStore.cognitions.filter(c => c.isUnlocked).length;
  const transformedCognitions = cognitionStore.cognitions.filter(c => c.isTransformed || c.isRelieved).length;
  const healRatio = totalCognitions > 0 ? transformedCognitions / totalCognitions : 0;

  const dustReduction = healRatio * 0.3;
  const xinYinBoost = healRatio * 0.2;

  return {
    dust: [Math.max(0, baseRatio.dust[0] - dustReduction), Math.max(0, baseRatio.dust[1] - dustReduction)],
    xinYin: [baseRatio.xinYin[0] + xinYinBoost, baseRatio.xinYin[1] + xinYinBoost],
    herd: baseRatio.herd,
    rational: baseRatio.rational,
  };
}

function distributeOptions(ratio: OptionPoolRatio, count: number): Map<OptionSource, number> {
  const distribution = new Map<OptionSource, number>();
  const sources: OptionSource[] = ['灰尘', '心印', '群则', '理性'];
  const keys: (keyof OptionPoolRatio)[] = ['dust', 'xinYin', 'herd', 'rational'];

  const midpoints = keys.map(k => (ratio[k][0] + ratio[k][1]) / 2);
  const total = midpoints.reduce((a, b) => a + b, 0);
  const normalized = midpoints.map(m => m / total);

  let assigned = 0;
  for (let i = 0; i < sources.length; i++) {
    const n = i === sources.length - 1 ? count - assigned : Math.round(normalized[i] * count);
    distribution.set(sources[i], n);
    assigned += n;
  }

  return distribution;
}

let optionIdCounter = 0;

export function generateOptionPool(_eventId: string, eventContext: string): GameOption[] {
  const phase = getGamePhase();
  const baseRatio = OPTION_POOL_RATIOS[phase];
  const adjustedRatio = getAdjustedRatio(baseRatio);

  const count = MIN_OPTIONS + Math.floor(Math.random() * (MAX_OPTIONS - MIN_OPTIONS + 1));
  const distribution = distributeOptions(adjustedRatio, count);

  const cognitionStore = useCognitionStore.getState();
  const unrelievedCognitions = cognitionStore.getUnrelievedCognitions();

  const options: GameOption[] = [];

  distribution.forEach((num, source) => {
    for (let i = 0; i < num; i++) {
      const option: GameOption = {
        id: `opt_${++optionIdCounter}_${Date.now()}`,
        text: generateOptionText(source, eventContext, unrelievedCognitions),
        source,
        isDangerous: source === '灰尘' && Math.random() < 0.3,
        weight: 1.0,
      };

      if (source === '灰尘' && unrelievedCognitions.length > 0) {
        const cognition = unrelievedCognitions[Math.floor(Math.random() * unrelievedCognitions.length)];
        option.dustType = cognition.dustType;
        option.cognitionId = cognition.id;
      }

      options.push(option);
    }
  });

  return shuffleArray(options);
}

function generateOptionText(source: OptionSource, context: string, unrelievedCognitions: any[]): string {
  switch (source) {
    case '心印':
      return generateXinYinOptionText(context);
    case '群则':
      return generateHerdOptionText(context);
    case '灰尘':
      return generateDustOptionText(context, unrelievedCognitions);
    case '理性':
      return generateRationalOptionText(context);
  }
}

function generateXinYinOptionText(_context: string): string {
  const templates = [
    '听从内心，走自己的路。',
    '这不是我想要的，我选择不同。',
    '值得为自己争取一次。',
    '也许可以试试，哪怕不确定。',
    '放下别人的期待，做真实的自己。',
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateHerdOptionText(_context: string): string {
  const templates = [
    '大家都这样做，跟着走就好。',
    '别冒险了，稳妥一点。',
    '别人会怎么想？还是按规矩来。',
    '这是最安全的选择。',
    '不要标新立异，随大流吧。',
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateDustOptionText(_context: string, unrelievedCognitions: any[]): string {
  if (unrelievedCognitions.length > 0) {
    const cog = unrelievedCognitions[Math.floor(Math.random() * unrelievedCognitions.length)];
    return cog.currentContent;
  }
  const templates = [
    '不配拥有这些。',
    '一定会失败的，何必挣扎。',
    '都是我的错。',
    '没人在乎我。',
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateRationalOptionText(_context: string): string {
  const templates = [
    '先放一放，看看有没有其他可能。',
    '冷静分析一下利弊。',
    '等一等，不急着做决定。',
    '有没有折中的办法？',
    '先把眼前的事处理好。',
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
