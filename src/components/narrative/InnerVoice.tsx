import { useState, useEffect, useRef } from 'react';

interface InnerVoiceProps {
  onAllShown?: () => void;
}

const MOCK_LINES = [
  { text: '又一天结束了。', type: 'mock' as const },
  { text: '什么都没改变。', type: 'mock' as const },
  { text: '也许...', type: 'fragile' as const },
  { text: '也许什么？', type: 'mock' as const },
  { text: '算了吧。', type: 'mock' as const },
  { text: '没有人会在意的。', type: 'mock' as const },
  { text: '我...还在意。', type: 'fragile' as const },
  { text: '在意有什么用？', type: 'mock' as const },
];

export const InnerVoice: React.FC<InnerVoiceProps> = ({ onAllShown }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const onAllShownRef = useRef(onAllShown);
  onAllShownRef.current = onAllShown;
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (visibleLines >= MOCK_LINES.length) {
      if (!hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onAllShownRef.current?.();
      }
      return;
    }

    const delay = MOCK_LINES[visibleLines].type === 'mock' ? 1500 : 2500;
    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
      {MOCK_LINES.slice(0, visibleLines).map((line, index) => (
        <div
          key={index}
          className={`
            text-lg tracking-wider opacity-0
            ${line.type === 'mock'
              ? 'text-voice-mock font-light animate-[float-up_3s_ease-out_forwards]'
              : 'text-voice-fragile font-extralight animate-[float-up_4s_ease-out_forwards]'
            }
          `}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
