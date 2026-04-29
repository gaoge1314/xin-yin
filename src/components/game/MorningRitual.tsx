import { useState } from 'react';
import { useTimeStore } from '../../stores/useTimeStore';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useGameStore } from '../../stores/useGameStore';
import { TIME_OF_DAY_LABELS } from '../../types/time';

const MORNING_PROMPTS = [
  '新的一天，你想对他说什么？',
  '清晨的微光中，他缓缓醒来...',
  '新一天的旅程开始了，给他一句鼓励吧。',
  '他从梦中醒来，世界还在沉睡。',
];

export const MorningRitual: React.FC = () => {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'review' | 'guide'>('review');

  const season = useTimeStore((s) => s.season);
  const age = useTimeStore((s) => s.age);
  const memories = useGameStore((s) => s.memories);
  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);

  const recentPainful = memories.filter((m) => m.type === 'painful' && !m.isHealed).length;
  const recentHealed = memories.filter((m) => m.isHealed).length;

  const finishMorningRitual = () => {
    useDayPhaseStore.getState().markMorningRitualDone();
    useTimeStore.getState().resume('morning-ritual');
  };

  const handleNext = () => {
    setStep('guide');
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      setInput('...');
    }
    addNarrativeLog(`清晨——${input.trim() || '...'}`);
    finishMorningRitual();
  };

  if (step === 'review') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/95 animate-[fadeIn_1s_ease-out]">
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <div className="text-calm/60 text-xs tracking-widest">
            {TIME_OF_DAY_LABELS.MORNING}
          </div>

          <h2 className="text-white/70 text-lg font-light tracking-wider">
            新的一天
          </h2>

          <div className="space-y-2 text-white/40 text-sm">
            <p>{age}岁 · {season === 'spring' ? '春' : season === 'summer' ? '夏' : season === 'autumn' ? '秋' : '冬'}</p>
            <p>未愈的伤痕：{recentPainful}处</p>
            <p>已释怀的：{recentHealed}处</p>
          </div>

          <button
            onClick={handleNext}
            className="
              mt-6 px-6 py-2 border border-calm/30 rounded text-calm/60 text-sm
              hover:border-calm/50 hover:text-calm/80
              transition-all duration-500
              animate-pulse
            "
          >
            继续新的一天
          </button>
        </div>
      </div>
    );
  }

  const prompt = MORNING_PROMPTS[Math.floor(Math.random() * MORNING_PROMPTS.length)];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/95 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-md w-full p-8 text-center space-y-6">
        <div className="text-calm/60 text-xs tracking-widest">
          {TIME_OF_DAY_LABELS.MORNING}
        </div>

        <p className="text-white/50 text-sm">{prompt}</p>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="对他说些什么..."
            className="
              flex-1 bg-white/[0.03] border border-white/10 rounded px-3 py-2
              text-white/70 text-sm placeholder:text-white/20
              focus:outline-none focus:border-calm/30
              transition-all duration-300
            "
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="
              px-4 py-2 border border-calm/30 rounded text-calm/60 text-sm
              hover:border-calm/50 hover:text-calm/80
              transition-all duration-300
            "
          >
            开启
          </button>
        </div>

        <button
          onClick={() => {
            addNarrativeLog('清晨——他默默地开始了新的一天。');
            finishMorningRitual();
          }}
          className="text-white/20 text-xs hover:text-white/30 transition-colors duration-300"
        >
          沉默
        </button>
      </div>
    </div>
  );
};
