import type { TriggerType, PerceptionContent } from '../../types/playerTrigger';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useGameStore } from '../../stores/useGameStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useTaskStore } from '../../stores/useTaskStore';

const SLEEP_QUALITY_LABELS: Record<string, string> = {
  good: '还算安稳',
  bad: '很不安稳',
  depressed: '沉重而疲惫',
};

const ENERGY_LABELS: Record<string, string> = {
  high: '精神还行',
  moderate: '有些疲惫',
  low: '很累',
  depleted: '几乎耗尽',
};

function getEnergyLevel(): string {
  const willpower = useWillpowerStore.getState();
  const ratio = willpower.current / willpower.max;
  if (ratio > 0.7) return 'high';
  if (ratio > 0.4) return 'moderate';
  if (ratio > 0.15) return 'low';
  return 'depleted';
}

function getSleepQuality(): string {
  const willpower = useWillpowerStore.getState();
  if (willpower.isDepressed) return 'depressed';
  if (willpower.consecutiveGoodSleep >= 3) return 'good';
  if (willpower.consecutiveGoodSleep > 0) return 'good';
  return 'bad';
}

function getDailyPressureSources(): string[] {
  const sources: string[] = [];
  const willpower = useWillpowerStore.getState();
  const cognitions = useCognitionStore.getState().cognitions;

  if (willpower.current < 30) sources.push('意志力持续低迷');
  if (willpower.isDepressed) sources.push('抑郁状态的阴影');

  const activeUntransformed = cognitions.filter(
    (c) => c.isUnlocked && !c.isTransformed
  );
  if (activeUntransformed.length > 3) sources.push('多个内心冲突未解');

  const memories = useGameStore.getState().memories;
  const painfulUnhealed = memories.filter(
    (m) => m.type === 'painful' && !m.isHealed
  );
  if (painfulUnhealed.length > 2) sources.push('旧伤未愈');

  return sources.length > 0 ? sources : ['日常的平淡'];
}

const MORNING_INNER_VOICES = [
  '又是新的一天...能撑过去吗？',
  '今天不想起来。但不起又能怎样？',
  '还活着。那就继续吧。',
  '也许今天会不一样？...大概不会。',
  '那个声音还在吗？有时候我分不清。',
  '窗外好像有光。但跟我有什么关系。',
];

export function generateT01Perception(): PerceptionContent {
  const sleepQuality = getSleepQuality();
  const energyLevel = getEnergyLevel();
  const pressureSources = getDailyPressureSources();
  const innerVoice = MORNING_INNER_VOICES[Math.floor(Math.random() * MORNING_INNER_VOICES.length)];

  const body: string[] = [];
  body.push(`他醒了。昨晚睡得${SLEEP_QUALITY_LABELS[sleepQuality]}。`);
  body.push(`今天他感觉${ENERGY_LABELS[energyLevel]}。`);

  if (pressureSources.length > 0) {
    body.push(`今天可能面对：${pressureSources.join('，')}。`);
  }

  body.push(`他的心声："${innerVoice}"`);

  return {
    triggerType: 'T01',
    header: '他醒了',
    body,
    hint: '回应他的内心状态，帮助定调这一天的方向',
  };
}

export function generateT02Perception(reason?: string): PerceptionContent {
  const willpower = useWillpowerStore.getState();
  const body: string[] = [];

  body.push('他的意志力正在见底。不是在身体上——是心里的那根弦快断了。');

  if (reason === 'willpower_sudden_drop') {
    body.push('刚才发生了什么，让他一下子被掏空了。');
  } else {
    body.push('他已经撑了很久了，每一秒都在消耗。');
  }

  if (willpower.isDepressed) {
    body.push('他甚至不知道自己还在不在撑。');
  }

  body.push('他现在最需要的不是建议。是被看见。');

  return {
    triggerType: 'T02',
    header: '他快撑不住了',
    body,
    hint: '说一些话。不一定解决问题，但让他知道有人在',
  };
}

export function generateT03Perception(): PerceptionContent {
  const taskStore = useTaskStore.getState();
  const conflicts = taskStore.detectConflicts ? taskStore.detectConflicts() : [];

  const body: string[] = [];
  body.push('他在犹豫。');

  if (conflicts.length > 0) {
    const conflict = conflicts[0];
    body.push(`一边是${conflict.worldTaskId || '外部的期待'}，一边是${conflict.personalPlanContent || '他自己的打算'}。`);
    body.push('两个方向在拉扯他。不是利弊的问题——是他在怕什么。');
  } else {
    body.push('面前有两条路，他不知道该走哪条。');
    body.push('不是选不了，是选哪个都会痛。');
  }

  return {
    triggerType: 'T03',
    header: '他在犹豫',
    body,
    hint: '提供一个方向，注意不要直接命令',
  };
}

export function generateT04Perception(): PerceptionContent {
  const body: string[] = [];

  body.push('那段回忆刚刚退去。');
  body.push('他还没完全回来。蜷缩在现实的角落里，像被撕开了一道口子。');

  const residualEmotions = ['羞耻', '愤怒', '悲伤', '麻木', '释然'];
  const emotion = residualEmotions[Math.floor(Math.random() * residualEmotions.length)];
  body.push(`回忆退去后，他感到${emotion}。`);

  body.push('那道裂缝还没合上。');

  return {
    triggerType: 'T04',
    header: '回忆刚刚退去',
    body,
    hint: '回应刚被撕开的伤口。这是治愈的关键时刻',
  };
}

export function generateT05Perception(tagName: string): PerceptionContent {
  const body: string[] = [];

  const tagLabels: Record<string, string> = {
    self_worth: '自我价值',
    specialness: '特殊性',
    meaninglessness: '无意义',
    learning: '学习',
    relationship: '人际关系',
    failure: '失败',
    happiness: '快乐',
    hypocrisy: '虚伪',
    effort: '努力',
    learning_meaning: '学习意义',
  };

  const label = tagLabels[tagName] || tagName;

  body.push(`刚才那句话碰到了他心里的"${label}"。`);
  body.push('他在防御。也许是沉默，也许是转移话题，也许是一声轻叹。');
  body.push('他可能在想一些自己都不敢承认的东西。');

  return {
    triggerType: 'T05',
    header: '他的内心被触动了',
    body,
    hint: '帮他说出来。或者只是陪着他感受',
  };
}

export function generateT06Perception(reason?: string): PerceptionContent {
  const body: string[] = [];

  if (reason === 'proactive_call_very_high') {
    body.push('他在找你。不是因为有事。是因为他想起你在这里。');
  } else if (reason === 'proactive_call_high') {
    body.push('他有一个感受，但他不知道怎么开口。你能感觉到他在等。');
  } else {
    body.push('他好像想说什么，又咽回去了。');
    body.push('也许他在等一个声音。');
  }

  return {
    triggerType: 'T06',
    header: '他在找你',
    body,
    hint: '你感受到什么就说什么',
  };
}

export function generateT07Perception(): PerceptionContent {
  const body: string[] = [];

  body.push('一天结束了。');
  body.push('他现在躺下了，但还没睡着。');
  body.push('这是他一天中最安静的时刻。');

  const willpower = useWillpowerStore.getState();
  if (willpower.current < 30) {
    body.push('今天很累。不是身体的累。');
  } else {
    body.push('今天，他还在。这就够了。');
  }

  return {
    triggerType: 'T07',
    header: '一天结束了',
    body,
    hint: '轻声的回应。可以是总结，也可以只是道一声晚安',
  };
}

export function generatePerception(triggerType: TriggerType, context?: { reason?: string; tagName?: string }): PerceptionContent {
  switch (triggerType) {
    case 'T01':
      return generateT01Perception();
    case 'T02':
      return generateT02Perception(context?.reason);
    case 'T03':
      return generateT03Perception();
    case 'T04':
      return generateT04Perception();
    case 'T05':
      return generateT05Perception(context?.tagName || '');
    case 'T06':
      return generateT06Perception(context?.reason);
    case 'T07':
      return generateT07Perception();
  }
}
