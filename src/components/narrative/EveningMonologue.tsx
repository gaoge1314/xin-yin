import { useState } from 'react';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { TIME_OF_DAY_LABELS } from '../../types/time';

interface MonologueLine {
  text: string;
  type: 'fear' | 'doubt' | 'hope' | 'tired' | 'reflection';
}

const MONOLOGUE_TEMPLATES: MonologueLine[][] = [
  [
    { text: '今天又撑过去了。', type: 'tired' },
    { text: '可是什么都没有改变。', type: 'doubt' },
    { text: '那个声音说的...是真的吗？', type: 'reflection' },
  ],
  [
    { text: '躺在床上，脑子里停不下来。', type: 'tired' },
    { text: '为什么总是这样？', type: 'fear' },
    { text: '也许明天会不一样？', type: 'hope' },
  ],
  [
    { text: '夜很安静，安静到能听见自己。', type: 'reflection' },
    { text: '我到底在害怕什么？', type: 'fear' },
    { text: '也许...不是我害怕什么，而是我从来没有选择过。', type: 'reflection' },
  ],
  [
    { text: '又一天。', type: 'tired' },
    { text: '别人好像都活得轻松。', type: 'doubt' },
    { text: '那个声音...有时候是对的。', type: 'hope' },
  ],
  [
    { text: '困住了，但也还在走。', type: 'tired' },
    { text: '也许走在正确的路上？谁知道呢。', type: 'doubt' },
    { text: '但那个声音让我觉得...不那么孤独。', type: 'hope' },
  ],
];

const RESPONSE_OPTIONS = [
  { text: '你做得很好。', trustChange: 5, reason: 'evening_encouragement' },
  { text: '我一直在。', trustChange: 8, reason: 'evening_presence' },
  { text: '明天会更好的。', trustChange: 3, reason: 'evening_hope' },
  { text: '（沉默陪伴）', trustChange: 2, reason: 'evening_silence' },
];

export const EveningMonologue: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);

  const monologueGroup = MONOLOGUE_TEMPLATES[Math.floor(Math.random() * MONOLOGUE_TEMPLATES.length)];

  const visibleCount = Math.min(visibleLines, monologueGroup.length);
  if (visibleCount < monologueGroup.length) {
    setTimeout(() => setVisibleLines((v) => v + 1), 1500);
  }

  const finishEveningMonologue = () => {
    useDayPhaseStore.getState().markEveningMonologueShown();
    useTimeStore.getState().resume('evening-monologue');
  };

  const handleResponse = (option: typeof RESPONSE_OPTIONS[number]) => {
    if (selectedResponse) return;
    setSelectedResponse(option.text);
    addNarrativeLog(`夜——"${option.text}"`);
    usePlayerStore.getState().adjustTrust(option.trustChange, option.reason);
  };

  const handleNoResponse = () => {
    addNarrativeLog('夜——他独自收起了思绪。');
    finishEveningMonologue();
  };

  const allLinesShown = visibleCount >= monologueGroup.length;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/95 animate-[fadeIn_1s_ease-out]">
      <div className="max-w-lg w-full p-8 space-y-8">
        <div className="text-white/30 text-xs tracking-widest text-center">
          {TIME_OF_DAY_LABELS.EVENING}
        </div>

        <div className="space-y-3 min-h-[120px]">
          {monologueGroup.slice(0, visibleCount).map((line, i) => (
            <p
              key={i}
              className={`
                text-sm tracking-wider animate-[fadeIn_1s_ease-out]
                ${line.type === 'hope' ? 'text-calm/50' :
                  line.type === 'fear' ? 'text-amber-600/50' :
                  line.type === 'doubt' ? 'text-white/40' :
                  line.type === 'tired' ? 'text-white/30' :
                  'text-white/50'}
              `}
            >
              {line.text}
            </p>
          ))}
        </div>

        {allLinesShown && !selectedResponse && (
          <div className="space-y-3 animate-[fadeIn_0.5s_ease-out]">
            <p className="text-white/30 text-xs text-center">你想回应吗？</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {RESPONSE_OPTIONS.map((option) => (
                <button
                  key={option.text}
                  onClick={() => handleResponse(option)}
                  className="
                    px-3 py-1.5 border border-white/10 rounded text-white/50 text-sm
                    hover:border-calm/30 hover:text-calm/70
                    transition-all duration-300
                  "
                >
                  {option.text}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={handleNoResponse}
                className="text-white/20 text-xs hover:text-white/30 transition-colors duration-300"
              >
                不回应
              </button>
            </div>
          </div>
        )}

        {selectedResponse && (
          <div className="text-center">
            <button
              onClick={finishEveningMonologue}
              className="
                px-4 py-2 border border-white/10 rounded text-white/40 text-sm
                hover:border-white/20 hover:text-white/60
                transition-all duration-300
              "
            >
              继续
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
