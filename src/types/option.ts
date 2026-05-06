export type OptionSource = '心印' | '群则' | '灰尘' | '理性';

export interface GameOption {
  id: string;
  text: string;
  source: OptionSource;
  dustType?: import('./cognition').DustType;
  cognitionId?: string;
  isDangerous: boolean;
  weight: number;
}

export interface OptionPool {
  options: GameOption[];
  eventId: string;
  generatedAt: number;
  sweepDustUsed: boolean;
}

export interface OptionPoolRatio {
  dust: [number, number];
  xinYin: [number, number];
  herd: [number, number];
  rational: [number, number];
}

export const OPTION_POOL_RATIOS: Record<string, OptionPoolRatio> = {
  part1: { dust: [0.40, 0.50], xinYin: [0.15, 0.20], herd: [0.25, 0.30], rational: [0.10, 0.15] },
  part2: { dust: [0.25, 0.40], xinYin: [0.20, 0.30], herd: [0.20, 0.25], rational: [0.15, 0.20] },
  part3: { dust: [0.10, 0.25], xinYin: [0.30, 0.40], herd: [0.15, 0.20], rational: [0.20, 0.25] },
  endgame: { dust: [0.00, 0.15], xinYin: [0.40, 0.60], herd: [0.00, 0.15], rational: [0.20, 0.30] },
};

export const OPTION_SOURCE_STYLES: Record<OptionSource, { borderColor: string; glow?: string; shake?: boolean }> = {
  '心印': { borderColor: 'rgba(255, 215, 0, 0.4)', glow: '0 0 8px rgba(255, 215, 0, 0.3)' },
  '群则': { borderColor: 'rgba(156, 163, 175, 0.5)' },
  '灰尘': { borderColor: 'rgba(139, 0, 0, 0.4)', shake: true },
  '理性': { borderColor: 'transparent' },
};

export const OPTION_SOURCE_STYLES_HIGHLIGHTED: Record<OptionSource, { borderColor: string; glow?: string; shake?: boolean }> = {
  '心印': { borderColor: 'rgba(255, 215, 0, 0.4)', glow: '0 0 8px rgba(255, 215, 0, 0.3)' },
  '群则': { borderColor: 'rgba(156, 163, 175, 0.5)' },
  '灰尘': { borderColor: 'rgba(220, 20, 20, 0.8)', glow: '0 0 12px rgba(220, 20, 20, 0.6)', shake: true },
  '理性': { borderColor: 'transparent' },
};

export const OPTION_SOURCE_LABELS: Record<OptionSource, string> = {
  '心印': '心印',
  '群则': '群则',
  '灰尘': '灰尘‼',
  '理性': '理性',
};

export const MIN_OPTIONS = 4;
export const MAX_OPTIONS = 6;
