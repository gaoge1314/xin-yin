import { useRef, useEffect } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';

const MAX_DISPLAY_ENTRIES = 50;

export const NarrativeDisplay: React.FC = () => {
  const narrativeLog = useSceneStore((s) => s.narrativeLog);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [narrativeLog]);

  const displayLog = narrativeLog.slice(-MAX_DISPLAY_ENTRIES);

  if (narrativeLog.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white/15 text-sm">
          时间在流逝...
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3 overflow-y-auto h-full">
      {displayLog.map((text, i) => (
        <p
          key={narrativeLog.length - displayLog.length + i}
          className="text-white/50 text-sm leading-relaxed animate-[fadeIn_0.5s_ease-out]"
        >
          {text}
        </p>
      ))}
    </div>
  );
};
