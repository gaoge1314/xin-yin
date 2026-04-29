import { useState } from 'react';
import { useRecallSkill, useDreamSkill } from '../../systems/skills/skillManager';
import { SkillSelectionModal } from './SkillSelectionModal';

export const SkillButtons: React.FC = () => {
  const [showRecallModal, setShowRecallModal] = useState(false);
  const recall = useRecallSkill();
  const dream = useDreamSkill();

  const handleSelectMemory = (type: 'good' | 'painful', memoryId: string) => {
    recall.useRecall(type, memoryId);
  };

  const handleDream = () => {
    dream.useDream();
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
