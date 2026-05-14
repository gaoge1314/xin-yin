import { useState, useCallback, useRef } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useEnlightenmentStore } from '../../stores/useEnlightenmentStore';
import { useTriggerStore } from '../../stores/useTriggerStore';
import { useAlignmentStore } from '../../stores/useAlignmentStore';
import { buildAlignmentInput } from '../../systems/alignment/buildAlignmentInput';
import { TRUST_LOW_THRESHOLD, getConnectionTier } from '../../types/trust';
import type { ConnectionTier } from '../../types/trust';
import { calculateDialogueConstraints, generateProtagonistResponse, inferEmotionalState, buildDialogueInputForPlayer, useDialogueMemoryStore } from '../../systems/dialogue/compatStubs';

type Intensity = 'whisper' | 'normal' | 'earnest' | 'resonance';

const INTENSITY_LABELS: Record<Intensity, string> = {
  whisper: '低声',
  normal: '正常',
  earnest: '恳切',
  resonance: '心印相合',
};

const INTENSITY_WILLPOWER_PERCENT: Record<Intensity, number> = {
  whisper: 0.2,
  normal: 0.4,
  earnest: 0.6,
  resonance: 0,
};

const INTENSITY_WILLPOWER_PERCENT_ENLIGHTENED: Record<Intensity, number> = {
  whisper: 0.1,
  normal: 0.2,
  earnest: 0.3,
  resonance: 0,
};

const INTENSITY_NARRATIVE: Record<Intensity, string> = {
  whisper: '一个微弱的声音在他心中响起...',
  normal: '你的声音在他心中回荡...',
  earnest: '你恳切地呼唤他...',
  resonance: '你的话与他心底的声音合而为一...',
};

const INTENSITY_STYLES: Record<Intensity, string> = {
  whisper: 'border-white/20 text-white/40 hover:border-white/30 hover:text-white/50',
  normal: 'border-white/30 text-white/60 hover:border-calm/30 hover:text-calm/60',
  earnest: 'border-white/40 text-white/80 hover:border-calm/50 hover:text-calm/80',
  resonance: 'border-calm/50 text-calm hover:border-calm/70 hover:text-calm shadow-[0_0_12px_rgba(135,206,235,0.3)]',
};

const DORMANT_STATUS_MAP: Record<string, string> = {
  T01: '等待清晨...',
  T02: '他还在撑着',
  T03: '他在犹豫',
  T04: '回忆的余波',
  T05: '内心被触动',
  T06: '他在找你',
  T07: '夜晚将至',
};

const TIER_BORDER_HEX: Record<ConnectionTier, string> = {
  '陌路': 'rgba(156, 163, 175, 0.3)',
  '疏远': 'rgba(147, 197, 253, 0.3)',
  '倾听': 'rgba(250, 204, 21, 0.3)',
  '信任': 'rgba(251, 146, 60, 0.3)',
  '共生': 'rgba(253, 230, 138, 0.3)',
};

export const TextInput: React.FC = () => {
  const [text, setText] = useState('');
  const [showIntensity, setShowIntensity] = useState(false);
  const [canResonate, setCanResonate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hoverDormant, setHoverDormant] = useState(false);
  const [isJudging, setIsJudging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addInfluence = usePlayerStore((s) => s.addInfluence);
  const checkResonance = usePlayerStore((s) => s.checkResonance);
  const willpowerCurrent = useWillpowerStore((s) => s.current);
  const consumeWillpower = useWillpowerStore((s) => s.consume);
  const interruptRecovery = useWillpowerStore((s) => s.interruptRecovery);
  const setInputFocused = useTimeStore((s) => s.setInputFocused);
  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);
  const setPhase = useSceneStore((s) => s.setPhase);

  const trustLevel = usePlayerStore((s) => s.trustLevel);
  const hasEnlightenment = usePlayerStore((s) => s.hasEnlightenment);
  const isLowTrust = trustLevel < TRUST_LOW_THRESHOLD;
  const currentTier = getConnectionTier(trustLevel);

  const inputBoxState = useTriggerStore((s) => s.inputBoxState);
  const activeTrigger = useTriggerStore((s) => s.activeTrigger);
  const activePerception = useTriggerStore((s) => s.activePerception);
  const dismissToDormant = useTriggerStore((s) => s.dismissToDormant);
  const respondAndClose = useTriggerStore((s) => s.respondAndClose);

  const getWillpowerPercent = useCallback((intensity: Intensity) => {
    return hasEnlightenment
      ? INTENSITY_WILLPOWER_PERCENT_ENLIGHTENED[intensity]
      : INTENSITY_WILLPOWER_PERCENT[intensity];
  }, [hasEnlightenment]);

  const handlePrepareSend = useCallback(() => {
    if (!text.trim()) return;

    if (text.trim() === '测试：扫尘') {
      useEnlightenmentStore.getState().enterSweepDust();
      setPhase('enlightenment-sweeping');
      setText('');
      return;
    }

    const resonates = checkResonance(text.trim());
    setCanResonate(resonates);
    setShowIntensity(true);
  }, [text, checkResonance, setPhase]);

  const handleSelectIntensity = useCallback(async (intensity: Intensity) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setShowIntensity(false);
    setIsJudging(true);

    const alignmentInput = buildAlignmentInput(trimmed);
    const alignmentResult = await useAlignmentStore.getState().judgeAlignment(alignmentInput);
    const costMultiplier = useAlignmentStore.getState().getCostMultiplier();

    let finalIntensity = intensity;
    let adjustedCostMultiplier = costMultiplier;

    if (alignmentResult.alignment_judgment === 'high') {
      finalIntensity = 'resonance';
      adjustedCostMultiplier = 0;
    }

    const costPercent = getWillpowerPercent(finalIntensity);
    let cost = Math.ceil(willpowerCurrent * costPercent);

    if (adjustedCostMultiplier === 0) {
      cost = 0;
    } else if (adjustedCostMultiplier > 1) {
      cost = Math.ceil(cost * adjustedCostMultiplier);
    }

    if (cost > 0) {
      consumeWillpower(cost);
    }

    if (finalIntensity === 'earnest') {
      interruptRecovery();
    }

    addInfluence(trimmed, finalIntensity);
    addNarrativeLog(INTENSITY_NARRATIVE[finalIntensity]);

    if (alignmentResult.protagonist_perceived_feeling) {
      addNarrativeLog(alignmentResult.protagonist_perceived_feeling);
    }

    const dialogueInput = buildDialogueInputForPlayer(trimmed);
    const constraints = calculateDialogueConstraints(dialogueInput, dialogueInput.triggerType);
    const responseContext = {
      speakerRole: 'player' as const,
      speakerName: '心印',
      npcContent: trimmed,
      eventId: `player_input_${Date.now()}`,
      constraints,
    };
    const protagonistResult = generateProtagonistResponse(responseContext, dialogueInput.triggeredTag);

    addNarrativeLog(`他：${protagonistResult.text}`);

    if (protagonistResult.innerVoice) {
      addNarrativeLog(protagonistResult.innerVoice);
    }

    if (protagonistResult.willpowerCost > 0) {
      addNarrativeLog(`（回应消耗了${protagonistResult.willpowerCost}点意志力）`);
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

    setText('');
    setIsJudging(false);
    setCanResonate(false);
    setInputFocused(false);
    setIsFocused(false);

    respondAndClose(false);
  }, [text, willpowerCurrent, consumeWillpower, interruptRecovery, addInfluence, addNarrativeLog, setInputFocused, getWillpowerPercent, respondAndClose]);

  const handleSilentCompanion = useCallback(() => {
    addNarrativeLog('你没有说话。但你在这里。他感觉到了。');
    respondAndClose(true);
  }, [addNarrativeLog, respondAndClose]);

  const handleDismiss = useCallback(() => {
    dismissToDormant();
  }, [dismissToDormant]);

  const handleCancel = useCallback(() => {
    setShowIntensity(false);
    setCanResonate(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showIntensity) return;
      handlePrepareSend();
    }
    if (e.key === 'Escape' && showIntensity) {
      handleCancel();
    }
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setInputFocused(true);
  }, [setInputFocused]);

  const handleBlur = useCallback(() => {
    if (!showIntensity) {
      setIsFocused(false);
      setInputFocused(false);
    }
  }, [showIntensity, setInputFocused]);

  const intensityOptions: Intensity[] = canResonate
    ? ['whisper', 'normal', 'earnest', 'resonance']
    : ['whisper', 'normal', 'earnest'];

  if (inputBoxState === 'dormant') {
    return (
      <div className="flex items-center justify-center py-3">
        <div
          className="relative group cursor-default"
          onMouseEnter={() => setHoverDormant(true)}
          onMouseLeave={() => setHoverDormant(false)}
        >
          <div className="w-2 h-2 rounded-full bg-calm/30 animate-pulse" />
          <div className="absolute w-4 h-4 -inset-1 rounded-full bg-calm/10 animate-[ping_3s_ease-out_infinite]" />

          {hoverDormant && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/80 border border-white/10 rounded text-white/40 text-xs">
              {activeTrigger ? DORMANT_STATUS_MAP[activeTrigger] || '心印在等待' : '心印在沉默中'}
            </div>
          )}
        </div>
      </div>
    );
  }

  const isUrgent = inputBoxState === 'urgent';

  return (
    <div className={`relative ${isUrgent ? 'animate-[fadeIn_0.3s_ease-out]' : ''}`}>
      {activePerception && (
        <div className={`mb-3 p-3 rounded border ${isUrgent ? 'border-amber-500/30 bg-amber-500/5' : 'border-calm/20 bg-calm/5'}`}>
          <div className={`text-xs tracking-widest mb-2 ${isUrgent ? 'text-amber-400/60' : 'text-calm/50'}`}>
            {activePerception.header}
          </div>
          {activePerception.body.map((line, i) => (
            <p key={i} className={`text-sm ${isUrgent ? 'text-white/60' : 'text-white/40'} leading-relaxed`}>
              {line}
            </p>
          ))}
          <div className={`mt-2 text-xs ${isUrgent ? 'text-amber-400/40' : 'text-calm/30'}`}>
            {activePerception.hint}
          </div>
        </div>
      )}

      {isFocused && !showIntensity && (
        <div className="absolute -top-6 left-0 text-calm/40 text-xs tracking-widest animate-pulse">
          心印之声
        </div>
      )}

      {hasEnlightenment && (
        <div className="absolute -top-6 right-0 text-amber-400/50 text-xs tracking-wider">
          知行合一
        </div>
      )}

      <div className={`flex gap-2 items-end transition-all duration-500 ${isFocused ? 'opacity-100' : 'opacity-90'}`}>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isLowTrust ? '说些什么...但他可能不会在意。' : '说些什么，成为他心中的声音...'}
            className={`
              w-full bg-white/[0.03] border rounded px-3 py-2
              text-white/70 text-sm placeholder:text-white/20
              focus:outline-none
              resize-none
              transition-all duration-300
              ${isUrgent ? 'focus:border-amber-500/50' : 'focus:border-calm/30'}
            `}
            style={{
              borderColor: isUrgent ? undefined : TIER_BORDER_HEX[currentTier],
            }}
            rows={1}
          />
        </div>
        <button
          onClick={handlePrepareSend}
          disabled={!text.trim() || showIntensity}
          className={`
            px-4 py-2 border rounded text-sm
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-300
            ${isUrgent
              ? 'border-amber-500/30 text-amber-400/60 hover:border-amber-500/50 hover:text-amber-400/80'
              : 'border-white/10 text-white/30 hover:border-calm/30 hover:text-calm/60'}
          `}
        >
          传达
        </button>
      </div>

      {isLowTrust && (
        <div className="mt-1 text-amber-500/50 text-xs tracking-wide">
          他似乎不太愿意听你说话...
        </div>
      )}

      {isJudging && (
        <div className="mt-2 flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-calm/60 animate-[bounce_1s_ease-in-out_infinite]" />
            <div className="w-1.5 h-1.5 rounded-full bg-calm/60 animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
            <div className="w-1.5 h-1.5 rounded-full bg-calm/60 animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
          </div>
          <span className="text-calm/50 text-sm tracking-widest">倾听中…</span>
        </div>
      )}

      {showIntensity && !isJudging && (
        <div className="mt-2 flex flex-wrap gap-2 items-center animate-[fadeIn_0.3s_ease-out]">
          {intensityOptions.map((intensity) => {
            const cost = Math.ceil(willpowerCurrent * getWillpowerPercent(intensity));
            const label = INTENSITY_LABELS[intensity];
            const isResonance = intensity === 'resonance';

            return (
              <button
                key={intensity}
                onClick={() => handleSelectIntensity(intensity)}
                className={`
                  px-3 py-1.5 border rounded text-sm
                  transition-all duration-300
                  ${INTENSITY_STYLES[intensity]}
                  ${isResonance ? 'animate-pulse' : ''}
                `}
              >
                <span>{label}</span>
                <span className="ml-1 text-xs opacity-60">
                  {isResonance ? '不消耗' : `-${cost}意志`}
                </span>
              </button>
            );
          })}
          <button
            onClick={handleCancel}
            className="
              px-3 py-1.5 border border-white/10 rounded text-white/20 text-sm
              hover:border-white/20 hover:text-white/30
              transition-all duration-300
            "
          >
            取消
          </button>
        </div>
      )}

      {!showIntensity && !isJudging && (
        <div className="mt-2 flex gap-3 items-center">
          {isUrgent && (
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
          )}

          {!isUrgent && (
            <button
              onClick={handleDismiss}
              className="
                text-white/20 text-xs hover:text-white/30
                transition-colors duration-300
              "
            >
              关闭
            </button>
          )}
        </div>
      )}
    </div>
  );
};
