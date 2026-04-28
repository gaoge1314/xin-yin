import type { Action } from '../../types/action';

export const INITIAL_ACTIONS: Action[] = [
  {
    id: 'browse_phone',
    name: '刷手机',
    category: 'escape',
    cognitionConflict: { self_worth: 2, happiness: 1 },
    baseProbability: 0.3,
    outcomes: [
      {
        id: 'browse_phone_negative',
        type: 'negative',
        probability: 0.7,
        feedback: '又浪费了一个小时，什么也没得到。',
        effects: [
          { target: 'willpower', value: -3 },
          { target: 'organ', key: 'stomach', value: -2 },
        ],
      },
      {
        id: 'browse_phone_neutral',
        type: 'neutral',
        probability: 0.3,
        feedback: '看到了一些有趣的东西，但时间已经过去了。',
        effects: [
          { target: 'willpower', value: -1 },
        ],
      },
    ],
  },
  {
    id: 'play_games',
    name: '打游戏',
    category: 'escape',
    cognitionConflict: { self_worth: 3, meaninglessness: 2 },
    baseProbability: 0.35,
    outcomes: [
      {
        id: 'play_games_escape',
        type: 'neutral',
        probability: 0.6,
        feedback: '在游戏里，至少规则是公平的。暂时忘了那些烦心事。',
        effects: [
          { target: 'willpower', value: 2 },
          { target: 'organ', key: 'heart', value: 1 },
        ],
      },
      {
        id: 'play_games_guilt',
        type: 'negative',
        probability: 0.4,
        feedback: '打了一整天，现实的问题一个都没解决。又是在逃避。',
        effects: [
          { target: 'willpower', value: -5 },
          { target: 'organ', key: 'liver', value: -3 },
        ],
      },
    ],
  },
  {
    id: 'walk_alone',
    name: '一个人走路',
    category: 'self',
    cognitionConflict: { relationship: 1 },
    baseProbability: 0.15,
    outcomes: [
      {
        id: 'walk_thinking',
        type: 'positive',
        probability: 0.4,
        feedback: '走了很远，脑子里的一些东西慢慢清晰了。',
        effects: [
          { target: 'willpower', value: 3 },
          { target: 'organ', key: 'heart', value: 2 },
        ],
      },
      {
        id: 'walk_wandering',
        type: 'neutral',
        probability: 0.6,
        feedback: '漫无目的地走着，不知道要去哪里。',
        effects: [
          { target: 'willpower', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'numb_work',
    name: '麻木工作',
    category: 'work',
    cognitionConflict: { self_worth: 4, meaninglessness: 3 },
    baseProbability: 0.25,
    outcomes: [
      {
        id: 'numb_work_done',
        type: 'neutral',
        probability: 0.5,
        feedback: '工作完成了，但心里什么感觉都没有。像机器一样。',
        effects: [
          { target: 'willpower', value: -2 },
          { target: 'organ', key: 'spleen', value: -2 },
        ],
      },
      {
        id: 'numb_work_accumulate',
        type: 'negative',
        probability: 0.5,
        feedback: '又一天过去了，郁结在胸口堆积。',
        effects: [
          { target: 'willpower', value: -4 },
          { target: 'organ', key: 'liver', value: -3 },
          { target: 'organ', key: 'stomach', value: -2 },
        ],
      },
    ],
  },
  {
    id: 'study_metaphysics',
    name: '研究命理',
    category: 'self',
    cognitionConflict: { meaninglessness: 2, specialness: 1 },
    baseProbability: 0.08,
    outcomes: [
      {
        id: 'study_meta_positive',
        type: 'positive',
        probability: 0.3,
        feedback: '也许宇宙真的有某种规律……这个想法让你感到一丝安慰。',
        effects: [
          { target: 'willpower', value: 5 },
          { target: 'cognition', key: 'meaninglessness', value: 1 },
        ],
      },
      {
        id: 'study_meta_escape',
        type: 'neutral',
        probability: 0.4,
        feedback: '研究这些东西，是在寻找答案，还是另一种逃避？',
        effects: [
          { target: 'willpower', value: 0 },
        ],
      },
      {
        id: 'study_meta_negative',
        type: 'negative',
        probability: 0.3,
        feedback: '命理说的一切，不过是给自己的逃避找借口。',
        effects: [
          { target: 'willpower', value: -3 },
          { target: 'organ', key: 'spleen', value: -1 },
        ],
      },
    ],
  },
  {
    id: 'write_inner_monologue',
    name: '写内心独白',
    category: 'self',
    cognitionConflict: { hypocrisy: 3 },
    baseProbability: 0.05,
    requirements: [
      { type: 'willpower', minValue: 50 },
    ],
    outcomes: [
      {
        id: 'write_monologue_positive',
        type: 'positive',
        probability: 0.5,
        feedback: '写下来之后，好像看清了一些东西。原来我是这样想的。',
        effects: [
          { target: 'willpower', value: 8 },
          { target: 'cognition', key: 'hypocrisy', value: 1 },
          { target: 'organ', key: 'heart', value: 3 },
        ],
      },
      {
        id: 'write_monologue_negative',
        type: 'negative',
        probability: 0.5,
        feedback: '写出来的东西，连自己都不相信。虚伪。',
        effects: [
          { target: 'willpower', value: -6 },
          { target: 'organ', key: 'liver', value: -2 },
        ],
      },
    ],
  },
  {
    id: 'study',
    name: '学习新技能',
    category: 'self',
    cognitionConflict: { learning: 6, self_worth: 3 },
    baseProbability: 0.1,
    outcomes: [
      {
        id: 'study_positive',
        type: 'positive',
        probability: 0.4,
        feedback: '虽然很难，但确实学到了东西。',
        effects: [
          { target: 'willpower', value: -5 },
          { target: 'cognition', key: 'learning', value: 1 },
          { target: 'organ', key: 'heart', value: 2 },
        ],
      },
      {
        id: 'study_negative',
        type: 'negative',
        probability: 0.6,
        feedback: '太难了，果然我不适合学这些。',
        effects: [
          { target: 'willpower', value: -8 },
          { target: 'organ', key: 'liver', value: -2 },
        ],
      },
    ],
  },
  {
    id: 'socialize',
    name: '主动社交',
    category: 'social',
    cognitionConflict: { relationship: 7, happiness: 2 },
    baseProbability: 0.08,
    outcomes: [
      {
        id: 'socialize_positive',
        type: 'positive',
        probability: 0.35,
        feedback: '虽然紧张，但聊得还不错。',
        effects: [
          { target: 'willpower', value: -6 },
          { target: 'cognition', key: 'relationship', value: 1 },
          { target: 'organ', key: 'stomach', value: 3 },
        ],
      },
      {
        id: 'socialize_negative',
        type: 'negative',
        probability: 0.65,
        feedback: '果然不该出来，好尴尬。',
        effects: [
          { target: 'willpower', value: -10 },
          { target: 'organ', key: 'stomach', value: -3 },
          { target: 'organ', key: 'lungs', value: -1 },
        ],
      },
    ],
  },
  {
    id: 'exercise',
    name: '运动',
    category: 'self',
    cognitionConflict: { self_worth: 4, happiness: 3 },
    baseProbability: 0.12,
    outcomes: [
      {
        id: 'exercise_positive',
        type: 'positive',
        probability: 0.5,
        feedback: '出了一身汗，感觉好多了。',
        effects: [
          { target: 'willpower', value: -3 },
          { target: 'cognition', key: 'happiness', value: 1 },
          { target: 'organ', key: 'heart', value: 3 },
          { target: 'organ', key: 'lungs', value: 2 },
        ],
      },
      {
        id: 'exercise_negative',
        type: 'negative',
        probability: 0.5,
        feedback: '太累了，身体根本吃不消。',
        effects: [
          { target: 'willpower', value: -5 },
          { target: 'organ', key: 'spleen', value: -1 },
        ],
      },
    ],
  },
  {
    id: 'work_overtime',
    name: '加班工作',
    category: 'work',
    cognitionConflict: { self_worth: 5, failure: 4, meaninglessness: 3 },
    baseProbability: 0.25,
    outcomes: [
      {
        id: 'overtime_positive',
        type: 'positive',
        probability: 0.3,
        feedback: '完成了任务，但代价是什么？',
        effects: [
          { target: 'willpower', value: -7 },
          { target: 'cognition', key: 'self_worth', value: 1 },
          { target: 'organ', key: 'liver', value: -2 },
          { target: 'organ', key: 'heart', value: -1 },
        ],
      },
      {
        id: 'overtime_negative',
        type: 'negative',
        probability: 0.7,
        feedback: '加班到深夜，身心俱疲。',
        effects: [
          { target: 'willpower', value: -10 },
          { target: 'organ', key: 'liver', value: -3 },
          { target: 'organ', key: 'heart', value: -2 },
          { target: 'organ', key: 'spleen', value: -2 },
        ],
      },
    ],
  },
  {
    id: 'sleep_early',
    name: '早睡',
    category: 'daily',
    cognitionConflict: {},
    baseProbability: 0.15,
    outcomes: [
      {
        id: 'sleep_positive',
        type: 'positive',
        probability: 0.8,
        feedback: '难得的好觉。',
        effects: [
          { target: 'willpower', value: 5 },
          { target: 'organ', key: 'heart', value: 2 },
          { target: 'organ', key: 'liver', value: 2 },
        ],
      },
      {
        id: 'sleep_insomnia',
        type: 'negative',
        probability: 0.2,
        feedback: '躺在床上，脑子停不下来。',
        effects: [
          { target: 'willpower', value: -2 },
          { target: 'organ', key: 'stomach', value: -1 },
        ],
      },
    ],
  },
  {
    id: 'eat_properly',
    name: '好好吃饭',
    category: 'daily',
    cognitionConflict: { self_worth: 2 },
    baseProbability: 0.2,
    outcomes: [
      {
        id: 'eat_positive',
        type: 'positive',
        probability: 0.6,
        feedback: '好好吃了一顿，胃暖暖的。',
        effects: [
          { target: 'willpower', value: 2 },
          { target: 'organ', key: 'stomach', value: 3 },
          { target: 'organ', key: 'spleen', value: 1 },
        ],
      },
      {
        id: 'eat_skip',
        type: 'negative',
        probability: 0.4,
        feedback: '算了，不吃了。',
        effects: [
          { target: 'willpower', value: -1 },
          { target: 'organ', key: 'stomach', value: -2 },
        ],
      },
    ],
  },
  {
    id: 'reflect',
    name: '自我反思',
    category: 'self',
    cognitionConflict: { failure: 5, self_worth: 4 },
    baseProbability: 0.1,
    outcomes: [
      {
        id: 'reflect_positive',
        type: 'positive',
        probability: 0.3,
        feedback: '也许换个角度看，事情没那么糟。',
        effects: [
          { target: 'willpower', value: -4 },
          { target: 'cognition', key: 'failure', value: 1 },
          { target: 'organ', key: 'spleen', value: 1 },
        ],
      },
      {
        id: 'reflect_negative',
        type: 'negative',
        probability: 0.7,
        feedback: '越想越觉得自己一无是处。',
        effects: [
          { target: 'willpower', value: -8 },
          { target: 'organ', key: 'spleen', value: -2 },
          { target: 'organ', key: 'lungs', value: -1 },
        ],
      },
    ],
  },
];
