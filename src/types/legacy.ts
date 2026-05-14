import type { LegacyEntry, LegacyReviewOutput } from './agent';

export type { LegacyEntry, LegacyReviewOutput };

export interface LegacyState {
  entries: LegacyEntry[];
  yearReviews: LegacyReviewOutput[];
  totalScore: number;
  spiritualCount: number;
  relationalCount: number;
  actionalCount: number;
  echoCount: number;
}

export interface EndingJudgment {
  innerDimension: {
    dustHealedRatio: number;
    rating: '内心澄明' | '与灰尘共处' | '仍在挣扎' | '被灰尘吞噬';
  };
  outerDimension: {
    legacyScore: number;
    rating: '丰厚遗产' | '有迹可循' | '微弱回响' | '几乎为零';
  };
  endingType: '心印湮灭' | '薪尽火传' | '死而不亡' | '独善其身';
  endingNarrative: string;
  legacyMontage: LegacyEntry[];
}