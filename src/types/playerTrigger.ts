export type TriggerType = 'T01' | 'T02' | 'T03' | 'T04' | 'T05' | 'T06' | 'T07';

export type InputBoxState = 'dormant' | 'emerging' | 'urgent';

export type TriggerPriority = 'highest' | 'high' | 'medium' | 'low';

export interface TriggerCooldown {
  triggerType: TriggerType;
  endTime: number;
}

export interface TriggerInfo {
  type: TriggerType;
  priority: TriggerPriority;
  inputState: InputBoxState;
  cooldownHours: number;
  label: string;
  description: string;
}

export interface PerceptionContent {
  triggerType: TriggerType;
  header: string;
  body: string[];
  hint: string;
}

export interface PlayerTriggerState {
  inputBoxState: InputBoxState;
  activeTrigger: TriggerType | null;
  activePerception: PerceptionContent | null;
  triggerQueue: TriggerType[];
  cooldowns: TriggerCooldown[];
  dailyTriggersUsed: TriggerType[];
  ignoredToday: TriggerType[];
  silentConsecutiveDays: number;
  lastWillpowerValue: number;
  pendingMemoryEnd: boolean;
  pendingSocialTrigger: string | null;
}

export const TRIGGER_INFO: Record<TriggerType, TriggerInfo> = {
  T01: {
    type: 'T01',
    priority: 'high',
    inputState: 'emerging',
    cooldownHours: 0,
    label: '早晨醒来',
    description: '每日必触发。睡眠结算完成后，主角尚未进入当日惯性',
  },
  T02: {
    type: 'T02',
    priority: 'highest',
    inputState: 'urgent',
    cooldownHours: 30,
    label: '意志力临界',
    description: '意志力≤15或单次下降>40，惯性即将断裂',
  },
  T03: {
    type: 'T03',
    priority: 'high',
    inputState: 'emerging',
    cooldownHours: 30,
    label: '面临选择节点',
    description: '外部任务与个人计划冲突，或两个选项都痛苦',
  },
  T04: {
    type: 'T04',
    priority: 'highest',
    inputState: 'urgent',
    cooldownHours: 2,
    label: '回忆突现结束',
    description: '被动回忆退去后，主角还在情绪余波中',
  },
  T05: {
    type: 'T05',
    priority: 'medium',
    inputState: 'emerging',
    cooldownHours: 30,
    label: '社交触发认知标签',
    description: '家人言行触发了主角的某个认知标签',
  },
  T06: {
    type: 'T06',
    priority: 'medium',
    inputState: 'emerging',
    cooldownHours: 1,
    label: '主角主动呼唤',
    description: '连接度>40时，主角偶尔主动寻找心印',
  },
  T07: {
    type: 'T07',
    priority: 'low',
    inputState: 'emerging',
    cooldownHours: 0,
    label: '夜晚睡前',
    description: '连接度≥25时，一天中最后一道缝隙',
  },
};

export const TRIGGER_PRIORITY_ORDER: Record<TriggerPriority, number> = {
  highest: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const WILLPOWER_CRITICAL_THRESHOLD = 15;
export const WILLPOWER_DROP_THRESHOLD = 40;
export const CONNECTION_T06_THRESHOLD = 40;
export const CONNECTION_T06_HIGH_THRESHOLD = 60;
export const CONNECTION_T06_VERY_HIGH_THRESHOLD = 80;
export const CONNECTION_T07_THRESHOLD = 25;
export const TAG_TRIGGER_INTENSITY_THRESHOLD = 4;
export const SILENT_CONSECUTIVE_PENALTY_DAYS = 7;
export const SILENT_CONSECUTIVE_PENALTY = 5;
export const MIN_TRUST_FROM_SILENCE = 5;
