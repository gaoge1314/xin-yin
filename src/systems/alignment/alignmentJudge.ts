import type { AlignmentInput, AlignmentOutput, AlignmentJudgment } from './alignmentTypes';

const TARGET_KEYWORDS: Record<string, string[]> = {
  self_worth: ['值得', '价值', '出息', '配得上', '优秀'],
  specialness: ['独特', '不一样', '特别', '真实'],
  meaninglessness: ['有意义', '值得做', '目标', '方向'],
  learning: ['学习', '成长', '进步', '知识', '探索'],
  relationship: ['真心', '信任', '连接', '关心', '温暖'],
  failure: ['再试', '不怕', '失败是', '经历', '勇气'],
  happiness: ['快乐', '开心', '享受', '幸福', '值得快乐'],
  hypocrisy: ['真实', '坦诚', '做自己', '接纳'],
  effort: ['努力', '坚持', '不放弃', '尝试'],
  learning_meaning: ['意义', '热爱', '内心', '追求'],
};

const CURRENT_KEYWORDS: Record<string, string[]> = {
  self_worth: ['废物', '没用', '不配', '失败'],
  specialness: ['随便', '都行', '无所谓', '一样'],
  meaninglessness: ['算了', '没意义', '有什么用', '无所谓'],
  learning: ['不想学', '讨厌', '抗拒', '没用'],
  relationship: ['不相信', '利用', '虚伪', '假'],
  failure: ['做不到', '不行', '放弃', '算了'],
  happiness: ['不配快乐', '没资格', '不需要', '快乐有什么用'],
  hypocrisy: ['骗', '假装', '面具', '演'],
  effort: ['没用', '白费', '不值得', '何必'],
  learning_meaning: ['没意义', '为了什么', '装', '应付'],
};

function simulateAlignment(input: AlignmentInput): AlignmentOutput {
  const playerInput = input.player_input;
  const cognitions = input.relevant_cognition_labels;

  let targetMatches = 0;
  let currentMatches = 0;
  let matchedTarget = '';

  for (const cognition of cognitions) {
    const cognitionId = cognition.object;
    const targetKeywords = TARGET_KEYWORDS[cognitionId] ?? [];
    const currentKeywords = CURRENT_KEYWORDS[cognitionId] ?? [];

    for (const keyword of targetKeywords) {
      if (playerInput.includes(keyword)) {
        targetMatches++;
        matchedTarget = cognition.target_knowing;
      }
    }

    for (const keyword of currentKeywords) {
      if (playerInput.includes(keyword)) {
        currentMatches++;
      }
    }
  }

  let alignmentScore: number;
  let judgment: AlignmentJudgment;
  let reasoningBrief: string;
  let protagonistFeeling: string;

  if (targetMatches > 0 && currentMatches === 0) {
    alignmentScore = 0.7 + Math.min(targetMatches * 0.05, 0.25);
    judgment = 'high';
    reasoningBrief = '玩家输入与认知转化方向高度一致';
    protagonistFeeling = '他感到内心有什么被触动了，一种温暖而坚定的力量';
  } else if (targetMatches > 0 && currentMatches > 0) {
    alignmentScore = 0.4 + targetMatches * 0.05;
    judgment = 'partial';
    reasoningBrief = '玩家输入部分与认知转化方向一致，但仍有矛盾';
    protagonistFeeling = '他感到矛盾，内心似乎有什么在挣扎';
  } else if (currentMatches > 0 && targetMatches === 0) {
    alignmentScore = 0.1 + Math.random() * 0.2;
    judgment = 'conflict';
    reasoningBrief = '玩家输入与当前认知方向一致，但与转化目标冲突';
    protagonistFeeling = '他感到更加困惑，那些旧的声音又响起来了';
  } else {
    alignmentScore = 0.4 + Math.random() * 0.1;
    judgment = 'partial';
    reasoningBrief = '玩家输入未直接触及认知标签';
    protagonistFeeling = '他安静地听着，似乎在思考什么';
  }

  if (input.protagonist_current_state.自我保护模式) {
    alignmentScore = Math.max(alignmentScore - 0.15, 0);
  }
  if (input.protagonist_current_state.反扑期) {
    alignmentScore = Math.max(alignmentScore - 0.1, 0);
  }

  const recommendedTier = judgment === 'high' ? 'resonance'
    : judgment === 'partial' ? 'normal'
    : 'whisper';

  return {
    alignment_score: Math.round(alignmentScore * 100) / 100,
    alignment_judgment: judgment,
    alignment_target: matchedTarget || '无特定目标',
    reasoning_brief: reasoningBrief,
    recommended_tier: recommendedTier,
    protagonist_perceived_feeling: protagonistFeeling,
  };
}

export async function alignmentJudge(input: AlignmentInput): Promise<AlignmentOutput> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Alignment judge timeout')), 3000);
  });

  const judgePromise = new Promise<AlignmentOutput>((resolve) => {
    setTimeout(() => {
      resolve(simulateAlignment(input));
    }, 100);
  });

  try {
    return await Promise.race([judgePromise, timeoutPromise]);
  } catch {
    throw new Error('Alignment judge timeout');
  }
}
