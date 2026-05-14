import { useState } from 'react';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useTriggerStore } from '../../stores/useTriggerStore';
import { generateT07Perception } from '../../systems/trigger/generatePerception';
import { calculateDialogueConstraints, generateProtagonistResponse, inferEmotionalState, buildDialogueInputForPlayer, useDialogueMemoryStore } from '../../systems/dialogue/compatStubs';
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

export const EveningMonologue: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [monologueIndex] = useState(() => Math.floor(Math.random() * MONOLOGUE_TEMPLATES.length));

  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);

  const monologueGroup = MONOLOGUE_TEMPLATES[monologueIndex];
  const perception = generateT07Perception();

  const visibleCount = Math.min(visibleLines, monologueGroup.length);
  if (visibleCount < monologueGroup.length) {
    setTimeout(() => setVisibleLines((v) => v + 1), 1500);
  }

  const finishEveningMonologue = () => {
    useDayPhaseStore.getState().markEveningMonologueShown();
    useTimeStore.getState().resume('evening-monologue');
    useTriggerStore.getState().respondAndClose(false);
  };

  const handleCustomSubmit = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    if (selectedResponse) return;
    setSelectedResponse(trimmed);
    addNarrativeLog(`夜——"${trimmed}"`);

    const dialogueInput = buildDialogueInputForPlayer(trimmed);
    const constraints = calculateDialogueConstraints(dialogueInput);
    const responseContext = {
      speakerRole: 'player' as const,
      speakerName: '心印',
      npcContent: trimmed,
      eventId: `evening_T07_${Date.now()}`,
      constraints,
    };
    const protagonistResult = generateProtagonistResponse(responseContext, dialogueInput.triggeredTag);

    addNarrativeLog(`他：${protagonistResult.text}`);

    useDialogueMemoryStore.getState().addEntry({
      speakerRole: 'player',
      speakerName: '心印',
      npcContent: trimmed,
      protagonistResponse: protagonistResult.text,
      triggeredTag: dialogueInput.triggeredTag,
      emotionalState: inferEmotionalState(constraints),
      day: useTimeStore.getState().totalDays,
      hour: useTimeStore.getState().hour,
    });

    usePlayerStore.getState().adjustTrust(2, 'evening_warm_response');
    usePlayerStore.getState().addInfluence(trimmed, 'whisper');
  };

  const handleSilentCompanion = () => {
    if (selectedResponse) return;
    setSelectedResponse('（沉默陪伴）');
    addNarrativeLog('夜——你没有说话。但你在这里。');
    useTriggerStore.getState().respondAndClose(true);
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

        {perception && (
          <div className="p-3 rounded border border-calm/20 bg-calm/5">
            <div className="text-calm/50 text-xs tracking-widest mb-2">
              {perception.header}
            </div>
            {perception.body.map((line, i) => (
              <p key={i} className="text-white/40 text-sm leading-relaxed">{line}</p>
            ))}
          </div>
        )}

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

            {showCustomInput ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCustomSubmit();
                  }}
                  placeholder="轻声说些什么..."
                  className="
                    flex-1 bg-white/[0.03] border border-white/10 rounded px-3 py-2
                    text-white/70 text-sm placeholder:text-white/20
                    focus:outline-none focus:border-calm/30
                    transition-all duration-300
                  "
                  autoFocus
                />
                <button
                  onClick={handleCustomSubmit}
                  className="
                    px-4 py-2 border border-calm/30 rounded text-calm/60 text-sm
                    hover:border-calm/50 hover:text-calm/80
                    transition-all duration-300
                  "
                >
                  说
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="
                    px-3 py-1.5 border border-white/10 rounded text-white/50 text-sm
                    hover:border-calm/30 hover:text-calm/70
                    transition-all duration-300
                  "
                >
                  说些什么
                </button>
                <button
                  onClick={handleSilentCompanion}
                  className="
                    px-3 py-1.5 border border-calm/20 rounded text-calm/40 text-sm
                    hover:border-calm/30 hover:text-calm/60
                    transition-all duration-300
                  "
                >
                  沉默陪伴
                </button>
              </div>
            )}

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
