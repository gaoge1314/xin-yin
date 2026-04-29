import { useState, useEffect, useCallback } from 'react';
import { MEMORY_SCRIPTS } from '../../data/memories/memoryScripts';

interface CauseModeSceneProps {
  onRetry: () => void;
  onGiveUp: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  name: '名',
  emotion: '情',
  resentment: '怨',
  fear: '惧',
  obsession: '我执',
  beauty: '光',
  special: '悟',
};

const CATEGORY_COLORS: Record<string, string> = {
  name: 'text-amber-400/60',
  emotion: 'text-rose-400/60',
  resentment: 'text-red-400/60',
  fear: 'text-purple-400/60',
  obsession: 'text-cyan-400/60',
  beauty: 'text-emerald-400/60',
  special: 'text-yellow-400/60',
};

const SPECIFIC_IDS = new Set([
  'memory_paper_game',
  'memory_father_back',
  'memory_self_deception',
  'memory_inspection_punishment',
  'memory_high_school_lost',
  'memory_why_alive',
  'memory_sister_choice',
  'memory_father_stroke',
  'memory_keke_born',
]);

const SELECTED_MEMORIES = MEMORY_SCRIPTS.filter(
  (m) => m.isCore || SPECIFIC_IDS.has(m.id)
);

export const CauseModeScene: React.FC<CauseModeSceneProps> = ({
  onRetry,
  onGiveUp,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [visible, setVisible] = useState(false);

  const advance = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      if (currentIndex >= SELECTED_MEMORIES.length - 1) {
        setIsComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 600);
  }, [currentIndex]);

  useEffect(() => {
    if (isComplete) return;
    const showTimer = setTimeout(() => setVisible(true), 100);
    const autoTimer = setInterval(() => {
      advance();
    }, 4000);
    return () => {
      clearTimeout(showTimer);
      clearInterval(autoTimer);
    };
  }, [currentIndex, isComplete, advance]);

  useEffect(() => {
    if (isComplete) {
      setVisible(true);
    }
  }, [isComplete]);

  const handleClick = useCallback(() => {
    if (!isComplete && visible) {
      advance();
    }
  }, [isComplete, visible, advance]);

  if (isComplete) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-[#050510] transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="text-white/70 text-lg tracking-widest leading-relaxed mb-16 text-center animate-[fadeIn_2s_ease-in_forwards]">
          心印从未消失。
          <br />
          你愿意再试一次吗？
        </p>
        <div className="flex gap-8">
          <button
            className="text-white/40 text-sm tracking-wider hover:text-white/80 transition-colors duration-500 border border-white/10 px-6 py-2 rounded hover:border-white/30"
            onClick={onRetry}
          >
            再试一次
          </button>
          <button
            className="text-white/20 text-sm tracking-wider hover:text-white/50 transition-colors duration-500 border border-white/5 px-6 py-2 rounded hover:border-white/15"
            onClick={onGiveUp}
          >
            就这样吧
          </button>
        </div>
      </div>
    );
  }

  const memory = SELECTED_MEMORIES[currentIndex];

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-[#050510] cursor-pointer select-none"
      onClick={handleClick}
    >
      <div
        className={`max-w-lg px-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs tracking-wider ${CATEGORY_COLORS[memory.category]}`}>
            {CATEGORY_LABELS[memory.category]}
          </span>
          <span className="text-white/10 text-xs">·</span>
          <span className="text-white/50 text-sm tracking-wide">
            {memory.title}
          </span>
        </div>

        <p className="text-white/30 text-sm leading-relaxed mb-6">
          {memory.content.length > 80
            ? memory.content.slice(0, 80) + '…'
            : memory.content}
        </p>

        <p className="text-white/15 text-xs italic leading-relaxed">
          「{memory.innerVoice}」
        </p>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-white/10 text-[10px]">
            {currentIndex + 1} / {SELECTED_MEMORIES.length}
          </span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
      </div>
    </div>
  );
};
