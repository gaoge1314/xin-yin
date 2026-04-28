import { useWillpowerStore } from '../../stores/useWillpowerStore';

export const WillpowerDisplay: React.FC = () => {
  const current = useWillpowerStore((s) => s.current);
  const max = useWillpowerStore((s) => s.max);
  const isDepressed = useWillpowerStore((s) => s.isDepressed);

  const percentage = (current / max) * 100;

  const getBarColor = () => {
    if (percentage > 60) return 'bg-calm/60';
    if (percentage > 30) return 'bg-tense/60';
    return 'bg-danger/60';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs tracking-wider">意志力</span>
        {isDepressed && (
          <span className="text-danger/50 text-xs">低迷</span>
        )}
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right">
        <span className="text-white/30 text-xs">
          {Math.floor(current)}/{max}
        </span>
      </div>
    </div>
  );
};
