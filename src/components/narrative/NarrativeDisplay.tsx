import { useRef, useEffect } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';

const MAX_DISPLAY_ENTRIES = 50;

const MEMORY_TITLE_RE = /^【(名|情|怨|惧|我执|光|悟)】(.+)$/;
const INNER_VOICE_RE = /^——"(.+)"$/;

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

  const renderEntry = (text: string, index: number) => {
    const titleMatch = text.match(MEMORY_TITLE_RE);
    if (titleMatch) {
      const [, label, title] = titleMatch;
      const isLight = label === '光' || label === '悟';
      return (
        <div key={index} className="mt-2 mb-1">
          <span className={`text-xs px-1.5 py-0.5 rounded mr-2 ${isLight ? 'bg-calm/20 text-calm/70' : 'bg-danger/20 text-danger/70'}`}>
            {label}
          </span>
          <span className={`text-sm font-medium ${isLight ? 'text-calm/80' : 'text-danger/70'}`}>
            {title}
          </span>
        </div>
      );
    }

    const voiceMatch = text.match(INNER_VOICE_RE);
    if (voiceMatch) {
      return (
        <p key={index} className="text-white/40 text-sm italic pl-2 border-l border-white/10">
          {text}
        </p>
      );
    }

    return (
      <p
        key={index}
        className="text-white/50 text-sm leading-relaxed animate-[fadeIn_0.5s_ease-out]"
      >
        {text}
      </p>
    );
  };

  return (
    <div ref={containerRef} className="space-y-1 overflow-y-auto h-full">
      {displayLog.map((text, i) =>
        renderEntry(text, narrativeLog.length - displayLog.length + i)
      )}
    </div>
  );
};
