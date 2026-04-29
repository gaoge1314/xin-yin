import { useTimeStore } from '../../stores/useTimeStore';

export const PauseButton: React.FC = () => {
  const isPaused = useTimeStore((s) => s.isPaused);
  const speed = useTimeStore((s) => s.speed);
  const setSpeed = useTimeStore((s) => s.setSpeed);
  const togglePause = useTimeStore((s) => s.togglePause);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={togglePause}
        className={`
          px-2 py-0.5 text-xs rounded border transition-all duration-300
          ${isPaused
            ? 'border-amber-500/40 text-amber-400/70 bg-amber-500/10'
            : 'border-white/10 text-white/20 hover:border-white/20'
          }
        `}
        title={isPaused ? '继续' : '暂停'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
      {([1, 2, 4] as const).map((s) => (
        <button
          key={s}
          onClick={() => setSpeed(s)}
          className={`
            px-1.5 py-0.5 text-xs rounded border transition-all duration-300
            ${
              speed === s
                ? 'border-calm/30 text-calm/60'
                : 'border-white/10 text-white/20 hover:border-white/20'
            }
          `}
        >
          ×{s}
        </button>
      ))}
    </div>
  );
};
