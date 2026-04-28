import { useState, useEffect, useRef } from 'react';

interface AwakeningSceneProps {
  onAwakeningComplete: () => void;
}

export const AwakeningScene: React.FC<AwakeningSceneProps> = ({
  onAwakeningComplete,
}) => {
  const [phase, setPhase] = useState<
    'reverse' | 'heartbeat' | 'awake' | 'title'
  >('reverse');
  const onCompleteRef = useRef(onAwakeningComplete);
  onCompleteRef.current = onAwakeningComplete;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('heartbeat'), 3000);
    const t2 = setTimeout(() => setPhase('awake'), 5500);
    const t3 = setTimeout(() => setPhase('title'), 8000);
    const t4 = setTimeout(() => onCompleteRef.current(), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#050510] overflow-hidden">
      {phase === 'reverse' && (
        <div className="relative w-full h-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 border border-calm/30 rounded-sm"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 15}%`,
                animation: `reverseFlow 2s ease-out forwards`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {phase === 'heartbeat' && (
        <div className="flex flex-col items-center">
          <div
            className="w-6 h-6 rounded-full bg-calm/60"
            style={{
              animation: 'heartbeat 0.8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-12 h-12 rounded-full bg-calm/20 blur-md"
            style={{
              animation: 'heartbeat 0.8s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {phase === 'awake' && (
        <div className="text-center animate-[fadeIn_2s_ease-out_forwards]">
          <div className="mb-8">
            <div
              className="w-3 h-3 rounded-full bg-calm/40 mx-auto"
              style={{
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>
          <p className="text-white/30 text-sm tracking-widest">
            窗外，微光渐起
          </p>
        </div>
      )}

      {phase === 'title' && (
        <div className="text-center animate-[fadeIn_3s_ease-in_forwards]">
          <h1 className="text-5xl text-calm/80 font-extralight tracking-[0.5em] mb-4">
            心印回响
          </h1>
          <div
            className="w-2 h-2 rounded-full bg-calm/30 mx-auto"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      )}
    </div>
  );
};
