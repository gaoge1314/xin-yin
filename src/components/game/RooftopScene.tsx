import { useState, useEffect, useCallback } from 'react';
import { InnerVoice } from '../narrative/InnerVoice';

interface RooftopSceneProps {
  onStepOut: () => void;
}

export const RooftopScene: React.FC<RooftopSceneProps> = ({ onStepOut }) => {
  const [voicesComplete, setVoicesComplete] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [stepping, setStepping] = useState(false);

  useEffect(() => {
    if (voicesComplete) {
      const timer = setTimeout(() => setShowPrompt(true), 500);
      return () => clearTimeout(timer);
    }
  }, [voicesComplete]);

  const handleClick = useCallback(() => {
    if (!voicesComplete || stepping) return;
    setStepping(true);
    setTimeout(onStepOut, 1500);
  }, [voicesComplete, stepping, onStepOut]);

  return (
    <div
      className="w-full h-full relative cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1a1a2a] to-transparent opacity-60" />

      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-yellow-300/30"
            style={{
              marginLeft: `${(i - 2) * 30}px`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-px h-[30%] bg-gradient-to-t from-transparent via-[#333] to-transparent" />

      <InnerVoice onAllShown={() => setVoicesComplete(true)} />

      {showPrompt && !stepping && (
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center animate-pulse">
          <p className="text-white/40 text-sm tracking-widest">
            点击屏幕，推动他踏出那一步
          </p>
        </div>
      )}

      {stepping && (
        <div className="absolute inset-0 bg-black animate-[fadeIn_1.5s_ease-in_forwards]" />
      )}
    </div>
  );
};
