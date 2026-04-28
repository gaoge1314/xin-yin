import { useTimeStore } from '../../stores/useTimeStore';

export const PauseButton: React.FC = () => {
  const speed = useTimeStore((s) => s.speed);
  const setSpeed = useTimeStore((s) => s.setSpeed);

  return (
    <div className="flex items-center gap-1">
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
