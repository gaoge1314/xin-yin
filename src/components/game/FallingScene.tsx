import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Memory } from '../../types/skill';

interface FallingSceneProps {
  memories: Memory[];
  onFallComplete: () => void;
}

interface FragmentState {
  memory: Memory;
  side: 'left' | 'right';
  y: number;
  visible: boolean;
  reading: boolean;
}

export const FallingScene: React.FC<FallingSceneProps> = ({
  memories,
  onFallComplete,
}) => {
  const [fragments, setFragments] = useState<FragmentState[]>([]);
  const [fallProgress, setFallProgress] = useState(0);
  const [activeFragment, setActiveFragment] = useState<Memory | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const onFallCompleteRef = useRef(onFallComplete);
  onFallCompleteRef.current = onFallComplete;

  const rainElements = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      left: Math.random() * 100,
      height: Math.random() * 100 + 50,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
      index: i,
    }));
  }, []);

  useEffect(() => {
    const initialFragments: FragmentState[] = memories.map((m, i) => ({
      memory: m,
      side: i % 2 === 0 ? 'left' : 'right',
      y: Math.random() * 60 + 20,
      visible: false,
      reading: false,
    }));
    setFragments(initialFragments);

    const timers: ReturnType<typeof setTimeout>[] = [];
    initialFragments.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setFragments((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, visible: true } : f))
          );
        }, 2000 + i * 3000)
      );
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [memories]);

  useEffect(() => {
    if (isPaused) return;

    let completed = false;
    const interval = setInterval(() => {
      setFallProgress((prev) => {
        if (completed) return prev;
        const next = prev + 0.5;
        if (next >= 100) {
          completed = true;
          clearInterval(interval);
          setTimeout(() => onFallCompleteRef.current(), 0);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleFragmentClick = useCallback((fragment: FragmentState) => {
    setIsPaused(true);
    setActiveFragment(fragment.memory);
  }, []);

  const handleCloseFragment = useCallback(() => {
    setActiveFragment(null);
    setIsPaused(false);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#050520] to-[#000010]"
        style={{
          transform: `translateY(${fallProgress * 0.5}px)`,
        }}
      />

      {rainElements.map((rain) => (
        <div
          key={rain.index}
          className="absolute w-px bg-white/10"
          style={{
            left: `${rain.left}%`,
            height: `${rain.height}px`,
            top: `${((fallProgress * 3 + rain.index * 50) % 120) - 20}%`,
            animation: `fall ${rain.duration}s linear infinite`,
            animationDelay: `${rain.delay}s`,
          }}
        />
      ))}

      {fragments.map(
        (fragment, i) =>
          fragment.visible && (
            <div
              key={i}
              className={`
                absolute cursor-pointer transition-all duration-300
                ${fragment.side === 'left' ? 'left-[8%]' : 'right-[8%]'}
              `}
              style={{
                top: `${fragment.y}%`,
              }}
              onClick={() => handleFragmentClick(fragment)}
            >
              <div
                className={`
                  w-12 h-12 border border-white/20 rounded-sm
                  bg-fragment hover:bg-fragment-hover
                  flex items-center justify-center
                  transition-all duration-300
                  ${fragment.memory.type === 'good'
                    ? 'hover:border-calm/50'
                    : 'hover:border-danger/50'
                  }
                `}
              >
                <span className="text-white/30 text-xs">
                  {fragment.memory.type === 'good' ? '✦' : '✧'}
                </span>
              </div>
            </div>
          )
      )}

      {activeFragment && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/70 z-10"
          onClick={handleCloseFragment}
        >
          <div
            className="max-w-md p-6 bg-[#0a0a1a]/90 border border-white/10 rounded-lg animate-[slideUp_0.5s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`
                text-xs px-2 py-0.5 rounded
                ${activeFragment.type === 'good' ? 'bg-calm/20 text-calm/70' : 'bg-danger/20 text-danger/70'}
              `}>
                {{name:'名',emotion:'情',resentment:'怨',fear:'惧',obsession:'我执',beauty:'光',special:'悟'}[activeFragment.category]}
              </span>
              <span className={`
                text-sm font-medium
                ${activeFragment.type === 'good' ? 'text-calm/80' : 'text-danger/70'}
              `}>
                {activeFragment.title}
              </span>
            </div>
            <p
              className={`
                text-base leading-relaxed mb-3
                ${activeFragment.type === 'good' ? 'text-calm/80' : 'text-danger/70'}
              `}
            >
              {activeFragment.content}
            </p>
            <p className="text-white/40 text-sm italic mb-4">
              "{activeFragment.innerVoice}"
            </p>
            <p className="text-white/30 text-xs text-right">
              {activeFragment.age}岁 · {activeFragment.season === 'spring' ? '春' : activeFragment.season === 'summer' ? '夏' : activeFragment.season === 'autumn' ? '秋' : '冬'}
            </p>
            <button
              className="mt-4 text-white/40 text-sm hover:text-white/70 transition-colors"
              onClick={handleCloseFragment}
            >
              继续...
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-calm/50 transition-all duration-150"
            style={{ width: `${fallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
