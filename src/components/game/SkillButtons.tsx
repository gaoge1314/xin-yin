import { useState } from 'react';
import { useRecallSkill, useDreamSkill, executeSweepDust, executeVagusNerve } from '../../systems/skills/skillManager';
import { SkillSelectionModal } from './SkillSelectionModal';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useTimeStore } from '../../stores/useTimeStore';

export const SkillButtons: React.FC = () => {
  const [showRecallModal, setShowRecallModal] = useState(false);
  const recall = useRecallSkill();
  const dream = useDreamSkill();

  const sweepDustSkill = usePlayerStore((s) => s.sweepDustSkill);
  const vagusNerveSkill = usePlayerStore((s) => s.vagusNerveSkill);
  const currentDay = useTimeStore((s) => s.day);

  const sweepDustUsedToday = sweepDustSkill?.lastUsedDay === currentDay;
  const canUseSweepDust = !!sweepDustSkill && !sweepDustUsedToday;
  const isVagusNerveAvailable = vagusNerveSkill?.available ?? false;

  const handleSelectMemory = (type: 'good' | 'painful', memoryId: string) => {
    recall.useRecall(type, memoryId);
  };

  const handleDream = () => {
    dream.useDream();
  };

  const handleSweepDust = () => {
    const result = executeSweepDust();
    if (!result.success && result.reason) {
      console.log(result.reason);
    }
  };

  const handleVagusNerve = () => {
    const result = executeVagusNerve();
    if (!result.success && result.reason) {
      console.log(result.reason);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <span className="text-white/40 text-xs tracking-wider">技能</span>

        <button
          onClick={() => setShowRecallModal(true)}
          disabled={!recall.canUse}
          className="
            w-full px-3 py-2 border border-white/10 rounded text-left
            hover:border-calm/30 transition-all duration-300
            group disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <div className="text-white/40 text-xs group-hover:text-calm/60 transition-colors">
            回忆召唤
          </div>
          <div className="text-white/15 text-[10px] mt-0.5">
            {recall.canUse ? '点击选择回忆' : `冷却中 (${recall.recallCooldown})`}
          </div>
        </button>

        <button
          onClick={handleDream}
          disabled={!dream.canUse}
          className="
            w-full px-3 py-2 border border-white/10 rounded text-left
            hover:border-voice-fragile/30 transition-all duration-300
            group disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <div className="text-white/40 text-xs group-hover:text-voice-fragile/60 transition-colors">
            入梦
          </div>
          <div className="text-white/15 text-[10px] mt-0.5">
            {dream.canUse ? '可用' : `冷却中 (${dream.dreamCooldown})`}
          </div>
        </button>

        <button
          onClick={handleSweepDust}
          disabled={!canUseSweepDust}
          className="
            w-full px-3 py-2 border border-white/10 rounded text-left
            hover:border-warm/30 transition-all duration-300
            group disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <div className="text-white/40 text-xs group-hover:text-warm/60 transition-colors">
            扫尘
          </div>
          <div className="text-white/15 text-[10px] mt-0.5">
            {sweepDustUsedToday ? '今日已使用' : sweepDustSkill ? '可用' : '未解锁'}
          </div>
        </button>

        {isVagusNerveAvailable && (
          <button
            onClick={handleVagusNerve}
            className="
              w-full px-3 py-2 border border-white/10 rounded text-left
              hover:border-danger/30 transition-all duration-300
              group
            "
          >
            <div className="text-white/40 text-xs group-hover:text-danger/60 transition-colors">
              迷走神经
            </div>
            <div className="text-white/15 text-[10px] mt-0.5">
              意志临界时可用
            </div>
          </button>
        )}
      </div>

      <SkillSelectionModal
        isOpen={showRecallModal}
        onClose={() => setShowRecallModal(false)}
        memories={recall.memories}
        onSelectMemory={handleSelectMemory}
      />
    </>
  );
};
