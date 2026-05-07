import { useWorldEventStore } from '../../stores/useWorldEventStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { WORLD_EVENTS } from '../../data/events/worldEvents';
import { SEASON_LABELS, DAY_OF_WEEK_LABELS, getDayOfWeek } from '../../types/time';
import type { EventRecord } from '../../types/event';

const CATEGORY_LABELS: Record<string, string> = {
  economic: '经济',
  social: '社会',
  personal: '个人',
  family: '家庭',
};

const CATEGORY_STYLES: Record<string, string> = {
  economic: 'text-amber-400/60',
  social: 'text-blue-400/60',
  personal: 'text-green-400/60',
  family: 'text-pink-400/60',
};

export const WorldInfoPanel: React.FC = () => {
  const totalDays = useTimeStore((s) => s.totalDays);
  const currentYear = useTimeStore((s) => s.currentYear);
  const season = useTimeStore((s) => s.season);
  const history = useWorldEventStore((s) => s.history);
  const isConditionMet = useWorldEventStore((s) => s.isConditionMet);
  const dayOfWeek = getDayOfWeek(totalDays);

  const seasonLabel = SEASON_LABELS[season];

  const pendingEvents = WORLD_EVENTS.filter((event) => {
    if (history.some((r) => r.eventId === event.id)) return false;
    return isConditionMet(event);
  });

  const historyWithContent: (EventRecord & { content?: string; category?: string })[] = history
    .map((record) => {
      const event = WORLD_EVENTS.find((e) => e.id === record.eventId);
      return {
        ...record,
        content: event?.content,
        category: event?.category,
      };
    })
    .reverse();

  return (
    <div className="space-y-3">
      <div className="text-white/40 text-xs tracking-wider border-b border-white/[0.06] pb-1">
        世界信息
      </div>

      <div className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/30 text-[10px]">当前</span>
        </div>
        <div className="text-white/50 text-[11px] leading-tight space-y-0.5">
          <div>{currentYear}年 · {seasonLabel} · 第{totalDays + 1}天 · {DAY_OF_WEEK_LABELS[dayOfWeek]}</div>
        </div>
        {pendingEvents.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {pendingEvents.map((event) => (
              <div key={event.id} className="text-white/40 text-[10px] leading-tight">
                <span className={`text-[9px] px-1 py-0.5 rounded bg-white/[0.03] ${CATEGORY_STYLES[event.category] || 'text-white/40'}`}>
                  {CATEGORY_LABELS[event.category] || event.category}
                </span>
                <span className="ml-1">{event.content.substring(0, 30)}…</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {historyWithContent.length > 0 && (
        <div className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/30 text-[10px]">历史</span>
            <span className="text-white/15 text-[9px]">{historyWithContent.length}</span>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {historyWithContent.map((record, idx) => (
              <div key={`${record.eventId}-${idx}`} className="text-white/35 text-[10px] leading-tight">
                <span className={`text-[9px] px-1 py-0.5 rounded bg-white/[0.03] ${record.category ? (CATEGORY_STYLES[record.category] || 'text-white/40') : 'text-white/40'}`}>
                  {record.category ? (CATEGORY_LABELS[record.category] || record.category) : ''}
                </span>
                <span className="ml-1">{record.content?.substring(0, 25)}…</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
