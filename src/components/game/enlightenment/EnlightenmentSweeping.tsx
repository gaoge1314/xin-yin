import { useEffect, useRef, useCallback } from 'react';
import { useEnlightenmentStore } from '../../../stores/useEnlightenmentStore';
import { useSceneStore } from '../../../stores/useSceneStore';

export const EnlightenmentSweeping: React.FC = () => {
  const currentPhase = useEnlightenmentStore((s) => s.currentPhase);
  const clickCount = useEnlightenmentStore((s) => s.clickCount);
  const dustParticles = useEnlightenmentStore((s) => s.dustParticles);
  const currentMonologue = useEnlightenmentStore((s) => s.currentMonologue);
  const startEnlightenment = useEnlightenmentStore((s) => s.startEnlightenment);
  const setEnlightenmentPhase = useEnlightenmentStore((s) => s.setPhase);
  const clickDust = useEnlightenmentStore((s) => s.clickDust);
  const spawnDust = useEnlightenmentStore((s) => s.spawnDust);
  const setCurrentMonologue = useEnlightenmentStore((s) => s.setCurrentMonologue);
  const setScenePhase = useSceneStore((s) => s.setPhase);

  const monologueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (currentPhase === 'idle' || currentPhase === 'falling') {
      startEnlightenment();
    }
    setEnlightenmentPhase('sweeping');
  }, [currentPhase, startEnlightenment, setEnlightenmentPhase]);

  useEffect(() => {
    if (clickCount > 0 && clickCount < 30) {
      const maxSpawn = Math.max(1, 3 - Math.floor(clickCount / 10));
      const spawnCount = Math.floor(Math.random() * maxSpawn) + 1;
      for (let i = 0; i < spawnCount; i++) {
        setTimeout(() => spawnDust(), i * 200);
      }
    }
  }, [clickCount, spawnDust]);

  useEffect(() => {
    if (clickCount >= 30) {
      setEnlightenmentPhase('awakening');
      setScenePhase('enlightenment-awakening');
    }
  }, [clickCount, setEnlightenmentPhase, setScenePhase]);

  useEffect(() => {
    if (currentMonologue) {
      if (monologueTimerRef.current) {
        clearTimeout(monologueTimerRef.current);
      }
      monologueTimerRef.current = setTimeout(() => {
        setCurrentMonologue(null);
      }, 3000);
    }
    return () => {
      if (monologueTimerRef.current) {
        clearTimeout(monologueTimerRef.current);
      }
    };
  }, [currentMonologue, setCurrentMonologue]);

  const handleDustClick = useCallback(
    (id: number) => {
      clickDust(id);
    },
    [clickDust]
  );

  return (
    <div className="w-full h-full relative overflow-hidden select-none" style={{ background: 'linear-gradient(180deg, #0d0b08 0%, #080604 40%, #050403 100%)' }}>
      <div
        className="absolute top-[8%] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,80,0.08) 0%, rgba(255,150,50,0.03) 40%, transparent 70%)',
          animation: 'lampFlicker 3s ease-in-out infinite',
        }}
      />

      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-2 h-3 rounded-sm bg-amber-900/20" />
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-1 h-4 bg-amber-600/10" style={{ animation: 'lampFlicker 2s ease-in-out infinite' }} />

      <div className="absolute top-[60%] left-[15%] right-[15%] h-px bg-stone-800/20" />
      <div className="absolute top-[58%] left-[20%] w-[60%] h-[2%] border-x border-t border-stone-800/10" />

      <div className="absolute top-0 left-0 w-px h-full bg-stone-900/10" style={{ left: '8%' }} />
      <div className="absolute top-0 w-px h-full bg-stone-900/10" style={{ left: '92%' }} />

      {dustParticles.map((dust) => (
        <div
          key={dust.id}
          className="absolute cursor-pointer transition-opacity duration-500"
          style={{
            left: `${dust.x}%`,
            top: `${dust.y}%`,
            opacity: dust.isFading ? 0 : dust.opacity * 0.6,
            animation: dust.isFading ? undefined : `dustFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
          onClick={() => handleDustClick(dust.id)}
        >
          <span className={`text-xs whitespace-nowrap hover:text-stone-300/80 transition-colors duration-200 ${dust.isFallback ? 'text-stone-500/40' : 'text-stone-400/60'}`}>
            {dust.text}
          </span>
        </div>
      ))}

      {currentMonologue && (
        <div
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-center px-8"
          style={{
            animation: 'fadeIn 1s ease-out forwards',
          }}
        >
          <p className="text-stone-300/70 text-sm leading-relaxed tracking-wider">
            {currentMonologue}
          </p>
        </div>
      )}

      <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2">
        <div className="w-24 h-px bg-stone-700/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-700/30 transition-all duration-300"
            style={{ width: `${Math.min((clickCount / 30) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
