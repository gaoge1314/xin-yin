import { useNpcStore } from '../../stores/useNpcStore';
import type { InteractionRecord } from '../../stores/useNpcStore';
import { DAY_OF_WEEK_LABELS, getDayOfWeek } from '../../types/time';

const NPC_STYLES: Record<string, string> = {
  father: 'text-gray-400/70',
  mother: 'text-pink-400/70',
  sister: 'text-blue-400/70',
  niece: 'text-green-400/70',
  colleague_male: 'text-amber-400/70',
  colleague_female: 'text-amber-400/70',
  old_friend: 'text-purple-400/70',
};

export const RecentInteractionsPanel: React.FC = () => {
  const interactions = useNpcStore((s) => s.interactionHistory);
  const recentInteractions = interactions.slice(0, 10);

  return (
    <div className="space-y-3">
      <div className="text-white/40 text-xs tracking-wider border-b border-white/[0.06] pb-1">
        最近交往
      </div>

      {recentInteractions.length === 0 ? (
        <div className="text-white/15 text-[10px] text-center py-3">
          暂无交往记录
        </div>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {recentInteractions.map((record: InteractionRecord, idx: number) => {
            const dayOfWeek = getDayOfWeek(record.day);
            return (
              <div
                key={`${record.eventId}-${idx}`}
                className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01]"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[10px] font-medium ${NPC_STYLES[record.npcId] || 'text-white/50'}`}>
                    {record.npcName}
                  </span>
                  <span className="text-white/15 text-[9px]">
                    第{record.day + 1}天 · {DAY_OF_WEEK_LABELS[dayOfWeek]} · {record.hour}时
                  </span>
                </div>
                <p className="text-white/40 text-[10px] leading-tight truncate">
                  {record.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
