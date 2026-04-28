import { useState, useCallback, useRef } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useEnlightenmentStore } from '../../stores/useEnlightenmentStore';
import { TRUST_LOW_THRESHOLD } from '../../types/trust';

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

export const TextInput: React.FC = () => {
  const [text, setText] = useState('');
  const [showIntensity, setShowIntensity] = useState(false);
  const [canResonate, setCanResonate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addInfluence = usePlayerStore((s) => s.addInfluence);
  const checkResonance = usePlayerStore((s) => s.checkResonance);
  const willpowerCurrent = useWillpowerStore((s) => s.current);
  const consumeWillpower = useWillpowerStore((s) => s.consume);
  const interruptRecovery = useWillpowerStore((s) => s.interruptRecovery);
  const setInputFocused = useTimeStore((s) => s.setInputFocused);
  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);
  const setPhase = useSceneStore((s) => s.setPhase);

  const isClosed = usePlayerStore((s) => s.isClosed);
  const trustLevel = usePlayerStore((s) => s.trustLevel);
  const hasEnlightenment = usePlayerStore((s) => s.hasEnlightenment);
  const isLowTrust = trustLevel < TRUST_LOW_THRESHOLD && !isClosed;

  const getWillpowerPercent = useCallback((intensity: Intensity) => {
    return hasEnlightenment
      ? INTENSITY_WILLPOWER_PERCENT_ENLIGHTENED[intensity]
      : INTENSITY_WILLPOWER_PERCENT[intensity];
  }, [hasEnlightenment]);

  const handlePrepareSend = useCallback(() => {
    if (!text.trim()) return;
    if (isClosed) return;

    if (text.trim() === '测试：龙场悟道') {
      useEnlightenmentStore.getState().startEnlightenment();
      setPhase('enlightenment-falling');
      setText('');
      return;
    }

    const resonates = checkResonance(text.trim());
    setCanResonate(resonates);
    setShowIntensity(true);
  }, [text, checkResonance, setPhase, isClosed]);

  const handleSelectIntensity = useCallback((intensity: Intensity) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const costPercent = getWillpowerPercent(intensity);
    const cost = Math.ceil(willpowerCurrent * costPercent);

    if (cost > 0) {
      consumeWillpower(cost);
    }

    if (intensity === 'earnest') {
      interruptRecovery();
    }

    addInfluence(trimmed, intensity);
    addNarrativeLog(INTENSITY_NARRATIVE[intensity]);

    setText('');
    setShowIntensity(false);
    setCanResonate(false);
    setInputFocused(false);
    setIsFocused(false);
  }, [text, willpowerCurrent, consumeWillpower, interruptRecovery, addInfluence, addNarrativeLog, setInputFocused, getWillpowerPercent]);

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

  const textareaBorder = isClosed
    ? 'border-red-900/40'
    : 'border-white/10';
  const textareaFocusBorder = isClosed
    ? 'focus:border-red-800/50'
    : 'focus:border-calm/30';
  const textareaOpacity = isClosed ? 'opacity-40' : '';

  return (
    <div className="relative">
      {isFocused && !isClosed && (
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
            placeholder={isClosed ? '' : '说些什么，成为他心中的声音...'}
            className={`
              w-full bg-white/[0.03] border ${textareaBorder} rounded px-3 py-2
              text-white/70 text-sm placeholder:text-white/20
              focus:outline-none ${textareaFocusBorder}
              resize-none
              transition-all duration-300
              ${textareaOpacity}
            `}
            rows={1}
            disabled={isClosed}
          />
          {isClosed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-red-400/60 text-sm tracking-wider">
                他封闭了自己，你的声音无法传达
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handlePrepareSend}
          disabled={!text.trim() || showIntensity || isClosed}
          className="
            px-4 py-2 border border-white/10 rounded text-white/30 text-sm
            hover:border-calm/30 hover:text-calm/60
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-300
          "
        >
          传达
        </button>
      </div>

      {isLowTrust && (
        <div className="mt-1 text-amber-500/50 text-xs tracking-wide">
          他似乎不太愿意听你说话...
        </div>
      )}

      {showIntensity && !isClosed && (
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
    </div>
  );
};
