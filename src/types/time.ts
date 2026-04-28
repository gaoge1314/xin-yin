export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface TimeState {
  age: number;
  season: Season;
  day: number;
  hour: number;
  totalDays: number;
  speed: 1 | 2 | 4;
  isPaused: boolean;
  isInputFocused: boolean;
}

export const SEASON_ORDER: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const SEASON_LABELS: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export const DAYS_PER_SEASON = 90;
export const HOURS_PER_DAY = 24;
export const START_AGE = 27;
export const END_AGE = 35;
