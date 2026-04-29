export type EndingType = 'ANNIHILATION' | 'DOMESTICATION' | 'TRANSCENDENCE' | 'PREMATURE_DEATH';

export const ENDING_LABELS: Record<EndingType, string> = {
  ANNIHILATION: '心印的湮灭',
  DOMESTICATION: '群则的驯化',
  TRANSCENDENCE: '心印的超越',
  PREMATURE_DEATH: '早夭',
};

export const ENDING_DESCRIPTIONS: Record<EndingType, string> = {
  ANNIHILATION: '心印被群则碾碎，他选择了"成功"，却丢失了自己。',
  DOMESTICATION: '他在群则中找到了位置，学会了和世界共处——虽然内心仍有微小的声音。',
  TRANSCENDENCE: '他扫去了心中的尘，看清了自己。心印不再需要对抗群则，因为他已超越了它。',
  PREMATURE_DEATH: '有些伤口，需要比八年更长的时间。',
};

export interface EndingCriteria {
  xinYinLevel: number;
  socialRuleLevel: number;
  willpowerMax: number;
  healedPainfulCount: number;
  connectionLevel: number;
  hasEnlightenment: boolean;
  positiveHabitCount: number;
}

export interface EndingResult {
  type: EndingType;
  criteria: EndingCriteria;
  narrative: string;
}

export function judgeEnding(criteria: EndingCriteria): EndingResult {
  if (isPrematureDeath(criteria)) {
    return {
      type: 'PREMATURE_DEATH',
      criteria,
      narrative: ENDING_DESCRIPTIONS.PREMATURE_DEATH,
    };
  }

  if (isAnnihilation(criteria)) {
    return {
      type: 'ANNIHILATION',
      criteria,
      narrative: ENDING_DESCRIPTIONS.ANNIHILATION,
    };
  }

  if (isTranscendence(criteria)) {
    return {
      type: 'TRANSCENDENCE',
      criteria,
      narrative: ENDING_DESCRIPTIONS.TRANSCENDENCE,
    };
  }

  return {
    type: 'DOMESTICATION',
    criteria,
    narrative: ENDING_DESCRIPTIONS.DOMESTICATION,
  };
}

function isAnnihilation(c: EndingCriteria): boolean {
  return (
    c.xinYinLevel < 30 &&
    c.socialRuleLevel > 70 &&
    c.willpowerMax < 30 &&
    c.healedPainfulCount === 0 &&
    c.connectionLevel < 20
  );
}

function isTranscendence(c: EndingCriteria): boolean {
  return (
    c.xinYinLevel > 70 &&
    c.healedPainfulCount >= 5 &&
    c.hasEnlightenment &&
    c.connectionLevel > 70 &&
    c.positiveHabitCount >= 2
  );
}

function isPrematureDeath(c: EndingCriteria): boolean {
  return c.willpowerMax <= 0;
}
