import type { AlignmentInput, AlignmentOutput, AlignmentJudgment } from './alignmentTypes';

const POSITIVE_KEYWORDS = [
  '值得', '价值', '快乐', '成长', '勇气', '尝试', '接纳',
  '温暖', '关心', '幸福', '不怕', '真实', '努力', '坚持',
  '进步', '希望', '相信', '爱', '理解', '支持', '陪伴',
  '做自己', '独特', '特别', '意义', '热爱',
];

const NEGATIVE_KEYWORDS = [
  '废物', '没用', '算了', '放弃', '跳吧', '不配', '做不到',
  '不行', '无所谓', '都一样', '有什么用', '讨厌', '绝望',
  '结束', '消失', '死了', '活着没意思',
];

export function fallbackAlignment(input: AlignmentInput): AlignmentOutput {
  const playerInput = input.player_input;

  let positiveCount = 0;
  let negativeCount = 0;

  for (const keyword of POSITIVE_KEYWORDS) {
    if (playerInput.includes(keyword)) {
      positiveCount++;
    }
  }

  for (const keyword of NEGATIVE_KEYWORDS) {
    if (playerInput.includes(keyword)) {
      negativeCount++;
    }
  }

  let alignmentScore: number;
  let judgment: AlignmentJudgment;
  let reasoningBrief: string;
  let protagonistFeeling: string;

  if (positiveCount > 0 && negativeCount === 0) {
    alignmentScore = 0.6 + Math.min(positiveCount * 0.05, 0.2);
    judgment = 'high';
    reasoningBrief = '降级判定：检测到正面关键词';
    protagonistFeeling = '他感到一丝温暖';
  } else if (negativeCount > 0 && positiveCount === 0) {
    alignmentScore = 0.1 + Math.random() * 0.2;
    judgment = 'conflict';
    reasoningBrief = '降级判定：检测到负面关键词';
    protagonistFeeling = '他感到更加低落';
  } else if (positiveCount > 0 && negativeCount > 0) {
    alignmentScore = positiveCount > negativeCount ? 0.5 + Math.random() * 0.1 : 0.3 + Math.random() * 0.1;
    judgment = 'partial';
    reasoningBrief = '降级判定：检测到正负关键词混合';
    protagonistFeeling = '他感到矛盾';
  } else {
    alignmentScore = 0.4 + Math.random() * 0.1;
    judgment = 'partial';
    reasoningBrief = '降级判定：未检测到关键词';
    protagonistFeeling = '他安静地听着';
  }

  const recommendedTier = judgment === 'high' ? 'resonance'
    : judgment === 'partial' ? 'normal'
    : 'whisper';

  return {
    alignment_score: Math.round(alignmentScore * 100) / 100,
    alignment_judgment: judgment,
    alignment_target: '降级判定无目标',
    reasoning_brief: reasoningBrief,
    recommended_tier: recommendedTier,
    protagonist_perceived_feeling: protagonistFeeling,
  };
}
