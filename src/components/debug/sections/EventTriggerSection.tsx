import { useState } from 'react';
import { useEnlightenmentStore } from '../../../stores/useEnlightenmentStore';
import { useSceneStore } from '../../../stores/useSceneStore';
import { useTimeStore } from '../../../stores/useTimeStore';
import { useWillpowerStore } from '../../../stores/useWillpowerStore';
import { useOrganStore } from '../../../stores/useOrganStore';
import { useCognitionStore } from '../../../stores/useCognitionStore';
import { useAnchorStore } from '../../../stores/useAnchorStore';
import { INITIAL_EMOTION_TRIGGERS } from '../../../data/triggers/initialTriggers';
import { SelectControl } from '../SelectControl';

export const EventTriggerSection: React.FC = () => {
  const [selectedTrigger, setSelectedTrigger] = useState(
    INITIAL_EMOTION_TRIGGERS[0]?.id ?? ''
  );
  const [selectedAnchor, setSelectedAnchor] = useState('');
  const anchors = useAnchorStore((s) => s.anchors);

  const handleTriggerEnlightenment = () => {
    useEnlightenmentStore.getState().startEnlightenment();
    useSceneStore.getState().setPhase('enlightenment-falling');
  };

  const handleAdvanceSeason = () => {
    useTimeStore.getState().advanceSeason();
  };

  const handleAdvanceHour = () => {
    useTimeStore.getState().advanceTime();
  };

  const handleAdvanceDay = () => {
    for (let i = 0; i < 24; i++) {
      useTimeStore.getState().advanceTime();
    }
  };

  const handleGoodSleep = () => {
    useWillpowerStore.getState().recordGoodSleep();
    useSceneStore.getState().addNarrativeLog('调试：触发好觉');
  };

  const handleBadSleep = () => {
    useWillpowerStore.getState().recordBadSleep();
    useSceneStore.getState().addNarrativeLog('调试：触发坏觉');
  };

  const handleEmotionTrigger = () => {
    const trigger = INITIAL_EMOTION_TRIGGERS.find((t) => t.id === selectedTrigger);
    if (!trigger) return;
    useWillpowerStore.getState().consume(Math.abs(trigger.willpowerEffect));
    if (trigger.organEffect) {
      useOrganStore.getState().updateOrgan({
        organ: trigger.organEffect.organ,
        change: trigger.organEffect.change,
        reason: '调试触发',
      });
    }
    useSceneStore.getState().addNarrativeLog(trigger.emotionReaction);
  };

  const handleActivateAnchor = () => {
    if (!selectedAnchor) return;
    useAnchorStore.getState().activateAnchor(selectedAnchor);
    const anchor = useAnchorStore.getState().anchors.find((a) => a.id === selectedAnchor);
    if (anchor) {
      useWillpowerStore.getState().recover(anchor.effect.willpowerRecovery);
      if (anchor.effect.cognitionProgress) {
        useCognitionStore.getState().recordPositiveFeedback(
          anchor.effect.cognitionProgress as any,
          'debug'
        );
      }
      if (anchor.effect.narrative) {
        useSceneStore.getState().addNarrativeLog(anchor.effect.narrative);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleTriggerEnlightenment}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        触发龙场悟道
      </button>
      <button
        onClick={handleAdvanceSeason}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        推进一季
      </button>
      <button
        onClick={handleAdvanceHour}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        推进1小时
      </button>
      <button
        onClick={handleAdvanceDay}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        推进1天
      </button>
      <button
        onClick={handleGoodSleep}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        触发好觉
      </button>
      <button
        onClick={handleBadSleep}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        触发坏觉
      </button>

      <div className="border-t border-white/5 my-2" />

      <div className="text-white/50 text-xs mb-1">情绪触发器</div>
      <SelectControl
        label="选择触发器"
        value={selectedTrigger}
        options={INITIAL_EMOTION_TRIGGERS.map((t) => ({
          value: t.id,
          label: t.emotionReaction,
        }))}
        onChange={setSelectedTrigger}
      />
      <button
        onClick={handleEmotionTrigger}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        触发情绪
      </button>

      <div className="border-t border-white/5 my-2" />

      <div className="text-white/50 text-xs mb-1">心印锚点激活</div>
      <SelectControl
        label="选择锚点"
        value={selectedAnchor}
        options={anchors.map((a) => ({ value: a.id, label: a.name }))}
        onChange={setSelectedAnchor}
      />
      <button
        onClick={handleActivateAnchor}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        激活锚点
      </button>
    </div>
  );
};
