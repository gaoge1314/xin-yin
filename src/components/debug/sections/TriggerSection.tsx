import { useTriggerStore, type TriggerStoreState } from '../../../stores/useTriggerStore';
import { TRIGGER_INFO, type TriggerType } from '../../../types/playerTrigger';
import { generatePerception } from '../../../systems/trigger/generatePerception';

const TRIGGER_TYPES: TriggerType[] = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07'];

export const TriggerSection: React.FC = () => {
  const inputBoxState = useTriggerStore((s: TriggerStoreState) => s.inputBoxState);
  const activeTrigger = useTriggerStore((s: TriggerStoreState) => s.activeTrigger);
  const silentConsecutiveDays = useTriggerStore((s: TriggerStoreState) => s.silentConsecutiveDays);
  const cooldowns = useTriggerStore((s: TriggerStoreState) => s.cooldowns);
  const dailyTriggersUsed = useTriggerStore((s: TriggerStoreState) => s.dailyTriggersUsed);
  const ignoredToday = useTriggerStore((s: TriggerStoreState) => s.ignoredToday);
  const triggerQueue = useTriggerStore((s: TriggerStoreState) => s.triggerQueue);

  const handleForceState = (state: 'dormant' | 'emerging' | 'urgent') => {
    useTriggerStore.setState({ inputBoxState: state });
  };

  const handleForceTrigger = (type: TriggerType) => {
    const info = TRIGGER_INFO[type];
    const perception = generatePerception(type, { tagName: 'self_worth' });
    if (info.inputState === 'urgent') {
      useTriggerStore.getState().triggerUrgent(type, perception);
    } else {
      useTriggerStore.getState().triggerEmerging(type, perception);
    }
  };

  const handleReset = () => {
    useTriggerStore.getState().reset();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-white/60 text-xs font-bold tracking-wider">触发系统</h3>

      <div className="space-y-1">
        <div className="text-white/40 text-xs">输入框状态: <span className="text-calm/60">{inputBoxState}</span></div>
        <div className="text-white/40 text-xs">活跃触发: <span className="text-calm/60">{activeTrigger ?? '无'}</span></div>
        <div className="text-white/40 text-xs">连续沉默天数: <span className="text-amber-400/60">{silentConsecutiveDays}</span></div>
        <div className="text-white/40 text-xs">今日已触发: <span className="text-calm/60">{dailyTriggersUsed.join(', ') || '无'}</span></div>
        <div className="text-white/40 text-xs">今日已忽略: <span className="text-amber-400/60">{ignoredToday.join(', ') || '无'}</span></div>
        <div className="text-white/40 text-xs">冷却中: <span className="text-white/30">{cooldowns.map((c: {triggerType: string}) => c.triggerType).join(', ') || '无'}</span></div>
        <div className="text-white/40 text-xs">队列: <span className="text-white/30">{triggerQueue.join(', ') || '空'}</span></div>
      </div>

      <div className="space-y-1">
        <div className="text-white/40 text-xs">强制状态:</div>
        <div className="flex gap-1">
          {(['dormant', 'emerging', 'urgent'] as const).map((state) => (
            <button
              key={state}
              onClick={() => handleForceState(state)}
              className="px-2 py-0.5 border border-white/10 rounded text-white/40 text-xs hover:border-calm/30 hover:text-calm/60"
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-white/40 text-xs">手动触发:</div>
        <div className="flex flex-wrap gap-1">
          {TRIGGER_TYPES.map((type) => {
            const info = TRIGGER_INFO[type];
            return (
              <button
                key={type}
                onClick={() => handleForceTrigger(type)}
                className="px-2 py-0.5 border border-white/10 rounded text-white/40 text-xs hover:border-calm/30 hover:text-calm/60"
              >
                {type} {info.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="px-2 py-0.5 border border-amber-500/20 rounded text-amber-400/40 text-xs hover:border-amber-500/30 hover:text-amber-400/60"
      >
        重置触发系统
      </button>
    </div>
  );
};
