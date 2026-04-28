import { useOrganStore } from '../../stores/useOrganStore';
import { ORGAN_NAMES, ORGAN_EMOTIONS, ORGAN_CRITICAL_THRESHOLD, ORGAN_EVENT_THRESHOLD } from '../../types/organs';
import type { OrganHealth } from '../../types/organs';

const ORGAN_ICONS: Record<keyof OrganHealth, string> = {
  heart: '♥',
  liver: '◆',
  spleen: '●',
  lungs: '◇',
  stomach: '▼',
};

const ORGAN_COLORS: Record<keyof OrganHealth, { healthy: string; warning: string; critical: string }> = {
  heart: { healthy: '#87CEEB', warning: '#FFD700', critical: '#FF4444' },
  liver: { healthy: '#90EE90', warning: '#FFD700', critical: '#FF4444' },
  spleen: { healthy: '#DEB887', warning: '#FFD700', critical: '#FF4444' },
  lungs: { healthy: '#B0C4DE', warning: '#FFD700', critical: '#FF4444' },
  stomach: { healthy: '#DDA0DD', warning: '#FFD700', critical: '#FF4444' },
};

export const OrganStatusPanel: React.FC = () => {
  const organs = useOrganStore();

  const getOrganColor = (organ: keyof OrganHealth, value: number) => {
    const colors = ORGAN_COLORS[organ];
    if (value < ORGAN_EVENT_THRESHOLD) return colors.critical;
    if (value < ORGAN_CRITICAL_THRESHOLD) return colors.warning;
    return colors.healthy;
  };

  const getStatusLabel = (value: number) => {
    if (value < ORGAN_EVENT_THRESHOLD) return '危';
    if (value < ORGAN_CRITICAL_THRESHOLD) return '衰';
    if (value < 50) return '弱';
    return '安';
  };

  return (
    <div className="space-y-2">
      <span className="text-white/40 text-xs tracking-wider">身体状态</span>
      <div className="space-y-1.5">
        {(Object.keys(ORGAN_NAMES) as (keyof OrganHealth)[]).map((organ) => {
          const value = organs[organ];
          const color = getOrganColor(organ, value);
          const statusLabel = getStatusLabel(value);
          const isCritical = value < ORGAN_CRITICAL_THRESHOLD;

          return (
            <div
              key={organ}
              className={`
                px-2.5 py-2 rounded border transition-all duration-300
                ${isCritical
                  ? 'border-danger/20 bg-danger/[0.03]'
                  : 'border-white/[0.06] bg-white/[0.01]'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ color }}
                    className="text-sm"
                  >
                    {ORGAN_ICONS[organ]}
                  </span>
                  <span className="text-white/50 text-xs">{ORGAN_NAMES[organ]}</span>
                  <span className="text-white/20 text-[10px]">{ORGAN_EMOTIONS[organ]}</span>
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color }}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${value}%`,
                    backgroundColor: color,
                    opacity: 0.6,
                  }}
                />
              </div>
              <div className="text-right mt-0.5">
                <span className="text-white/20 text-[10px]">{Math.floor(value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
