export interface Personality {
  cognitionActionSensitivity: number;
  selfAwareness: number;
  retreatInertia: number;
  xinYinAwakenDifficulty: number;
  meaningObsession: number;
}

export const INITIAL_PERSONALITY: Personality = {
  cognitionActionSensitivity: 0.9,
  selfAwareness: 0.85,
  retreatInertia: 0.8,
  xinYinAwakenDifficulty: 0.4,
  meaningObsession: 0.9,
};

export const PERSONALITY_LABELS: Record<keyof Personality, string> = {
  cognitionActionSensitivity: '知行背离敏感度',
  selfAwareness: '自我觉察力',
  retreatInertia: '退缩惯性',
  xinYinAwakenDifficulty: '心印唤醒难度',
  meaningObsession: '意义执着度',
};

export const PERSONALITY_DESCRIPTIONS: Record<keyof Personality, string> = {
  cognitionActionSensitivity: '对"做不认同的事"极其敏感，消耗意志力倍率高于常人',
  selfAwareness: '认知转变时，能清晰感知到，并能自己说出来',
  retreatInertia: '"向来半途废"是真实历史，习惯形成后中断的概率高',
  xinYinAwakenDifficulty: '一旦被真正触动，转变会比常人深刻',
  meaningObsession: '任何无法赋予意义的行为都是消耗',
};
