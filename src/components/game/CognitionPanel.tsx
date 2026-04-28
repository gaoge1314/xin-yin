import { useCognitionStore } from '../../stores/useCognitionStore';
import type { DustType } from '../../types/cognition';

const DUST_TYPE_COLORS: Record<DustType, string> = {
  '我执': 'text-purple-400/60',
  '名': 'text-blue-400/60',
  '情': 'text-pink-400/60',
};

export const CognitionPanel: React.FC = () => {
  const cognitions = useCognitionStore((s) => s.cognitions);

  return (
    <div className="space-y-2">
      <span className="text-white/40 text-xs tracking-wider">认知档案</span>
      <div className="space-y-1.5">
        {cognitions
          .filter((c) => c.isUnlocked)
          .map((cognition) => (
            <div
              key={cognition.id}
              className={`
                px-2 py-1.5 rounded text-xs border
                transition-all duration-300
                ${
                  cognition.isTransformed
                    ? 'border-calm/30 bg-calm/5 text-calm/70'
                    : 'border-white/10 bg-white/[0.02] text-white/40'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  {cognition.name}
                  <span className={`text-[9px] ${DUST_TYPE_COLORS[cognition.dustType]}`}>
                    [{cognition.dustType}]
                  </span>
                  {cognition.depth === 'deep' && !cognition.isTransformed && (
                    <span className="text-[9px] text-amber-400/50">深</span>
                  )}
                </span>
                {!cognition.isTransformed && (
                  <div className="flex items-center gap-1.5">
                    {cognition.depth === 'deep' && cognition.progressCount >= 3 && !cognition.hasEnlightenment && (
                      <span className="text-[9px] text-amber-300/40">待悟</span>
                    )}
                    {cognition.depth === 'deep' && cognition.hasEnlightenment && (
                      <span className="text-[9px] text-calm/60">可化</span>
                    )}
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            i < cognition.progressCount
                              ? 'bg-calm/60'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] mt-0.5 opacity-60 truncate">
                {cognition.currentContent}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
