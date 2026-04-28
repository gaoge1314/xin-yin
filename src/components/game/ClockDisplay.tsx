import { useTimeStore } from '../../stores/useTimeStore';
import { SEASON_LABELS } from '../../types/time';

function getTimeOfDayLabel(hour: number): string {
  if (hour >= 0 && hour <= 5) return '凌晨';
  if (hour >= 6 && hour <= 11) return '上午';
  if (hour >= 12 && hour <= 17) return '下午';
  return '夜晚';
}

export const ClockDisplay: React.FC = () => {
  const age = useTimeStore((s) => s.age);
  const season = useTimeStore((s) => s.season);
  const day = useTimeStore((s) => s.day);
  const hour = useTimeStore((s) => s.hour);
  const isInputFocused = useTimeStore((s) => s.isInputFocused);
  const speed = useTimeStore((s) => s.speed);
  const isPaused = useTimeStore((s) => s.isPaused);

  const textOpacity = isInputFocused ? 'text-white/20' : 'text-white/60';
  const timeOfDay = getTimeOfDayLabel(hour);

  return (
    <div className="flex items-center gap-3">
      <span className={`${textOpacity} text-sm`}>
        {age}岁 · {SEASON_LABELS[season]} · 第{day}天 · {hour}时
      </span>
      <span className={`${isInputFocused ? 'text-white/10' : 'text-white/30'} text-xs`}>
        {timeOfDay}
      </span>
      {isPaused && !isInputFocused && (
        <span className="text-tense/60 text-xs">⏸ 暂停</span>
      )}
      {!isPaused && speed > 1 && (
        <span className="text-calm/60 text-xs">×{speed}</span>
      )}
    </div>
  );
};
