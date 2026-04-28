import { useState, useEffect } from 'react';

interface GameOverSceneProps {
  onReturnToMenu: () => void;
}

export const GameOverScene: React.FC<GameOverSceneProps> = ({
  onReturnToMenu,
}) => {
  const [phase, setPhase] = useState<'shutdown' | 'black' | 'text'>('shutdown');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('black'), 2000);
    const t2 = setTimeout(() => setPhase('text'), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {phase === 'shutdown' && (
        <div className="w-full h-full animate-[shutdown_2s_ease-in_forwards] bg-[#0a0a1a]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
          </div>
        </div>
      )}

      {phase === 'black' && (
        <div className="w-full h-full bg-black" />
      )}

      {phase === 'text' && (
        <div className="text-center animate-[fadeIn_3s_ease-in_forwards]">
          <p className="text-white/40 text-lg tracking-widest leading-relaxed mb-12">
            他从未为自己做过决定，
            <br />
            这是第一个。
          </p>
          <button
            className="text-white/20 text-sm hover:text-white/40 transition-colors duration-500"
            onClick={onReturnToMenu}
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
};
