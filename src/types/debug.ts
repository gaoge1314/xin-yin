export type DebugSectionId =
  | 'personality'
  | 'willpower'
  | 'time'
  | 'organ'
  | 'cognition'
  | 'player'
  | 'socialRule'
  | 'anchor'
  | 'eventTrigger'
  | 'scenario'
  | 'globalAction';

export interface DebugSectionState {
  id: DebugSectionId;
  label: string;
  isCollapsed: boolean;
}

export const DEBUG_SECTION_LABELS: Record<DebugSectionId, string> = {
  personality: '人格参数',
  willpower: '意志力',
  time: '时间',
  organ: '五脏',
  cognition: '认知',
  player: '玩家状态',
  socialRule: '群则',
  anchor: '心印锚点',
  eventTrigger: '事件触发',
  scenario: '剧本快进',
  globalAction: '全局操作',
};
