import { useRecallSkill, useDreamSkill } from '../../systems/skills/skillManager';

export const SkillButtons: React.FC = () => {
  const recall = useRecallSkill();
  const dream = useDreamSkill();

  const handleRecall = () => {
    const painfulMemories = recall.memories.filter((m) => m.type === 'painful' && !m.isHealed);
    const goodMemories = recall.memories.filter((m) => m.type === 'good');

    if (painfulMemories.length > 0 && Math.random() > 0.5) {
      recall.useRecall('painful', painfulMemories[0].id);
    } else if (goodMemories.length > 0) {
      recall.useRecall('good', goodMemories[0].id);
    }
  };

  const handleDream = () => {
    dream.useDream();
  };

  return (
    <div className="space-y-3">
      <span className="text-white/40 text-xs tracking-wider">技能</span>

      <button
        onClick={handleRecall}
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
          {recall.canUse ? '可用' : `冷却中 (${recall.recallCooldown})`}
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
  );
};
