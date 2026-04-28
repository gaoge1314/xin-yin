import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useOrganStore } from '../../stores/useOrganStore';

export const HeartRateIndicator: React.FC = () => {
  const willpowerCurrent = useWillpowerStore((s) => s.current);
  const willpowerMax = useWillpowerStore((s) => s.max);
  const isDepressed = useWillpowerStore((s) => s.isDepressed);
  const heartHealth = useOrganStore((s) => s.heart);

  const percentage = (willpowerCurrent / willpowerMax) * 100;

  const getColor = () => {
    if (isDepressed) return '#FF4444';
    if (percentage > 60) return '#87CEEB';
    if (percentage > 30) return '#FFD700';
    return '#FF4444';
  };

  const getAnimationDuration = () => {
    if (isDepressed) return '2s';
    if (percentage > 60) return '1.2s';
    if (percentage > 30) return '0.8s';
    return '0.5s';
  };

  const color = getColor();
  const duration = getAnimationDuration();

  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative">
        <div
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.6,
            animation: `heartbeat ${duration} ease-in-out infinite`,
            boxShadow: `0 0 10px ${color}40, 0 0 20px ${color}20`,
          }}
        />
        <div
          className="absolute inset-0 w-5 h-5 rounded-full blur-md"
          style={{
            backgroundColor: color,
            opacity: 0.3,
            animation: `heartbeat ${duration} ease-in-out infinite`,
          }}
        />
      </div>
      <span className="text-white/20 text-xs mt-1">
        心率
      </span>
      {heartHealth < 30 && (
        <span className="text-danger/40 text-xs mt-0.5">
          心悸
        </span>
      )}
    </div>
  );
};
