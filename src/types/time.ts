export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type TimeOfDay = 'MORNING' | 'DAYTIME' | 'EVENING' | 'SLEEP';

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 8) return 'MORNING';
  if (hour >= 8 && hour < 20) return 'DAYTIME';
  if (hour >= 20 && hour < 23) return 'EVENING';
  return 'SLEEP';
}

export const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  MORNING: '清晨',
  DAYTIME: '白天',
  EVENING: '夜晚',
  SLEEP: '入睡',
};

export interface TimeState {
  age: number;
  season: Season;
  day: number;
  hour: number;
  totalDays: number;
  speed: 1 | 2 | 4;
  isPaused: boolean;
  isInputFocused: boolean;
  currentYear: number;
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
export const START_YEAR = 2025;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  0: '周四',
  1: '周五',
  2: '周六',
  3: '周日',
  4: '周一',
  5: '周二',
  6: '周三',
};

export function getDayOfWeek(totalDays: number): DayOfWeek {
  return (totalDays % 7) as DayOfWeek;
}

export function getYear(age: number): number {
  return START_YEAR + (age - START_AGE);
}
