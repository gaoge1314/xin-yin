import { useState, useEffect, useRef } from 'react';
import { useEnlightenmentStore } from '../../../stores/useEnlightenmentStore';
import { useSceneStore } from '../../../stores/useSceneStore';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { useWillpowerStore } from '../../../stores/useWillpowerStore';
import { useCognitionStore } from '../../../stores/useCognitionStore';
import { ENLIGHTENMENT_MONOLOGUE } from '../../../data/enlightenment/innerMonologues';

type AwakeningStep = 'monologue' | 'input' | 'nod' | 'effects' | 'done';

export const EnlightenmentAwakening: React.FC = () => {
  const [step, setStep] = useState<AwakeningStep>('monologue');
  const [revealedLines, setRevealedLines] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [brightness, setBrightness] = useState(0);

  const completeEnlightenment = useEnlightenmentStore((s) => s.completeEnlightenment);
  const setScenePhase = useSceneStore((s) => s.setPhase);

  const completeRef = useRef(completeEnlightenment);
  const setScenePhaseRef = useRef(setScenePhase);
  completeRef.current = completeEnlightenment;
  setScenePhaseRef.current = setScenePhase;

  useEffect(() => {
    const brightnessInterval = setInterval(() => {
      setBrightness((prev) => {
        if (prev >= 1) return 1;
        return prev + 0.01;
      });
    }, 100);

    return () => clearInterval(brightnessInterval);
  }, []);

  useEffect(() => {
    if (step !== 'monologue') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < ENLIGHTENMENT_MONOLOGUE.length; i++) {
      timers.push(
        setTimeout(() => {
          setRevealedLines(i + 1);
        }, (i + 1) * 2000)
      );
    }

    timers.push(
      setTimeout(() => {
        setStep('input');
      }, (ENLIGHTENMENT_MONOLOGUE.length + 1) * 2000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [step]);

  const handleSubmitInput = () => {
    setStep('nod');
    setTimeout(() => {
      setStep('effects');
    }, 3000);
  };

  useEffect(() => {
    if (step !== 'effects') return;

    const timer = setTimeout(() => {
      usePlayerStore.getState().triggerEnlightenment();
      useWillpowerStore.getState().restoreMaxAfterEnlightenment();
      useCognitionStore.getState().setAllDeepEnlightenment();

      completeRef.current();
      setScenePhaseRef.current('core-loop');
      setStep('done');
    }, 3000);

    return () => clearTimeout(timer);
  }, [step]);

  const bgStyle = {
    background: `linear-gradient(180deg, rgba(30,22,12,${0.2 + brightness * 0.6}) 0%, rgba(15,10,5,${0.3 + brightness * 0.4}) 50%, rgba(8,5,2,${0.5 + brightness * 0.3}) 100%)`,
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" style={bgStyle}>
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-64 h-64 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,200,100,${0.05 + brightness * 0.15}) 0%, rgba(255,160,60,${0.02 + brightness * 0.08}) 40%, transparent 70%)`,
        }}
      />

      {step === 'monologue' && (
        <div className="flex flex-col items-center gap-4 max-w-lg px-8">
          {ENLIGHTENMENT_MONOLOGUE.slice(0, revealedLines).map((line, i) => (
            <p
              key={i}
              className="text-stone-300/80 text-base leading-relaxed tracking-wider text-center"
              style={{
                animation: 'enlightenmentLineReveal 1.5s ease-out forwards',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {step === 'input' && (
        <div className="flex flex-col items-center gap-6 animate-[fadeIn_1s_ease-out_forwards]">
          <p className="text-stone-400/50 text-sm tracking-wider">你想说什么？</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitInput();
              }}
              className="bg-transparent border-b border-stone-600/30 text-stone-300/70 text-sm px-2 py-1 w-48 outline-none focus:border-amber-700/40 transition-colors placeholder-stone-600/30"
              placeholder="..."
              autoFocus
            />
            <button
              onClick={handleSubmitInput}
              className="text-stone-500/50 text-sm hover:text-stone-300/70 transition-colors"
            >
              说
            </button>
          </div>
        </div>
      )}

      {step === 'nod' && (
        <div className="flex flex-col items-center gap-4 animate-[fadeIn_1s_ease-out_forwards]">
          <p className="text-stone-300/70 text-base leading-relaxed tracking-wider text-center max-w-md">
            他点了点头。不是因为你说了什么，而是因为你一直在这里。
          </p>
        </div>
      )}

      {step === 'effects' && (
        <div className="flex flex-col items-center gap-4 animate-[fadeIn_1s_ease-out_forwards]">
          <div className="text-amber-400/60 text-sm tracking-wider">心印永久+30</div>
          <div className="text-calm/50 text-sm tracking-wider">意志力上限恢复至100</div>
          <div className="text-stone-300/50 text-sm tracking-wider">解锁被动：知行合一</div>
        </div>
      )}

      {step === 'done' && null}
    </div>
  );
};
