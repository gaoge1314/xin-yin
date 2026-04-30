import { useState } from 'react';
import { useTimeStore } from '../../stores/useTimeStore';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useGameStore } from '../../stores/useGameStore';
import { useTriggerStore } from '../../stores/useTriggerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { generateT01Perception } from '../../systems/trigger/generatePerception';
import { TIME_OF_DAY_LABELS } from '../../types/time';
import { calculateDialogueConstraints } from '../../systems/dialogue/calculateConstraints';
import { generateProtagonistResponse, inferEmotionalState } from '../../systems/dialogue/generateResponse';
import { buildDialogueInputForPlayer } from '../../systems/dialogue/buildDialogueInput';
import { useDialogueMemoryStore } from '../../systems/dialogue/dialogueMemoryCache';

const WANGYANGMING_HINTS = [
  '知是行之始，行是知之成。不必等想清楚了再走。',
  '心即理也。你心里知道答案，只是不敢听。',
  '破山中贼易，破心中贼难。但难不代表不可能。',
  '此心光明，亦复何言。他不需要完美，只需要真实。',
  '无善无恶心之体。不要评判他的感受，只需要看见。',
];

export const MorningRitual: React.FC = () => {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'perception' | 'respond'>('perception');
  const [showHint, setShowHint] = useState(false);
  const [wangyangmingHint, setWangyangmingHint] = useState('');

  const season = useTimeStore((s) => s.season);
  const age = useTimeStore((s) => s.age);
  const memories = useGameStore((s) => s.memories);
  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);

  const perception = generateT01Perception();

  const recentPainful = memories.filter((m) => m.type === 'painful' && !m.isHealed).length;
  const recentHealed = memories.filter((m) => m.isHealed).length;

  const finishMorningRitual = () => {
    useDayPhaseStore.getState().markMorningRitualDone();
    useTimeStore.getState().resume('morning-ritual');
    useTriggerStore.getState().resetDaily();
  };

  const handleProceedToRespond = () => {
    setStep('respond');
  };

  const handleSubmit = () => {
    const trimmed = input.trim();

    if (trimmed) {
      addNarrativeLog(`清晨——${trimmed}`);

      const dialogueInput = buildDialogueInputForPlayer(trimmed);
      const constraints = calculateDialogueConstraints(dialogueInput);
      const responseContext = {
        speakerRole: 'player' as const,
        speakerName: '心印',
        npcContent: trimmed,
        eventId: `morning_T01_${Date.now()}`,
        constraints,
      };
      const protagonistResult = generateProtagonistResponse(responseContext, dialogueInput.triggeredTag);

      addNarrativeLog(`他：${protagonistResult.text}`);
      if (protagonistResult.innerVoice) {
        addNarrativeLog(protagonistResult.innerVoice);
      }

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

      usePlayerStore.getState().adjustTrust(1, 'morning_response');
      usePlayerStore.getState().addInfluence(trimmed, 'normal');
    }

    useTriggerStore.getState().respondAndClose(false);
    finishMorningRitual();
  };

  const handleSilentDismiss = () => {
    addNarrativeLog('清晨——他默默地开始了新的一天。');
    useTriggerStore.getState().dismissToDormant();
    finishMorningRitual();
  };

  const handleShowHint = () => {
    const hint = WANGYANGMING_HINTS[Math.floor(Math.random() * WANGYANGMING_HINTS.length)];
    setWangyangmingHint(hint);
    setShowHint(true);
  };

  if (step === 'perception') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/95 animate-[fadeIn_1s_ease-out]">
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <div className="text-calm/60 text-xs tracking-widest">
            {TIME_OF_DAY_LABELS.MORNING}
          </div>

          <h2 className="text-white/70 text-lg font-light tracking-wider">
            {perception.header}
          </h2>

          <div className="space-y-2 text-white/40 text-sm text-left">
            {perception.body.map((line, i) => (
              <p key={i} className="leading-relaxed">{line}</p>
            ))}
          </div>

          <div className="text-calm/30 text-xs">
            {perception.hint}
          </div>

          <div className="space-y-2 text-white/40 text-sm">
            <p>{age}岁 · {season === 'spring' ? '春' : season === 'summer' ? '夏' : season === 'autumn' ? '秋' : '冬'}</p>
            <p>未愈的伤痕：{recentPainful}处 · 已释怀的：{recentHealed}处</p>
          </div>

          <button
            onClick={handleProceedToRespond}
            className="
              mt-6 px-6 py-2 border border-calm/30 rounded text-calm/60 text-sm
              hover:border-calm/50 hover:text-calm/80
              transition-all duration-500
              animate-pulse
            "
          >
            回应他
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/95 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-md w-full p-8 text-center space-y-6">
        <div className="text-calm/60 text-xs tracking-widest">
          {TIME_OF_DAY_LABELS.MORNING}
        </div>

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

        {showHint && wangyangmingHint && (
          <div className="p-3 border border-amber-500/20 rounded bg-amber-500/5 text-amber-400/50 text-sm">
            「{wangyangmingHint}」
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleShowHint}
            className="
              text-white/20 text-xs hover:text-white/40
              transition-colors duration-300
            "
          >
            系统提示
          </button>
          <button
            onClick={handleSilentDismiss}
            className="text-white/20 text-xs hover:text-white/30 transition-colors duration-300"
          >
            沉默
          </button>
        </div>
      </div>
    </div>
  );
};
