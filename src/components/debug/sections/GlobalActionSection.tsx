import { useState } from 'react';
import { useSceneStore } from '../../../stores/useSceneStore';
import { useGameStore } from '../../../stores/useGameStore';
import { useTimeStore } from '../../../stores/useTimeStore';
import { useWillpowerStore } from '../../../stores/useWillpowerStore';
import { useOrganStore } from '../../../stores/useOrganStore';
import { useCognitionStore } from '../../../stores/useCognitionStore';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { useEnlightenmentStore } from '../../../stores/useEnlightenmentStore';
import { usePersonalityStore } from '../../../stores/usePersonalityStore';
import { useSocialRuleStore } from '../../../stores/useSocialRuleStore';
import { useAnchorStore } from '../../../stores/useAnchorStore';

export const GlobalActionSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleResetAll = () => {
    useTimeStore.getState().reset();
    useWillpowerStore.getState().reset();
    useOrganStore.getState().reset();
    useCognitionStore.getState().reset();
    usePlayerStore.getState().reset();
    usePersonalityStore.getState().reset();
    useSocialRuleStore.getState().reset();
    useAnchorStore.getState().reset();
    useEnlightenmentStore.getState().reset();
    useGameStore.getState().newGame();
    useSceneStore.getState().clearNarrativeLog();
    useSceneStore.getState().setPhase('menu');
  };

  const handleResetParams = () => {
    usePersonalityStore.getState().reset();
    useWillpowerStore.getState().reset();
    useOrganStore.getState().reset();
    useCognitionStore.getState().reset();
    usePlayerStore.getState().reset();
    useSocialRuleStore.getState().reset();
    useAnchorStore.getState().reset();
  };

  const handleExportState = async () => {
    const data = {
      time: useTimeStore.getState(),
      willpower: useWillpowerStore.getState(),
      organs: useOrganStore.getState(),
      cognitions: useCognitionStore.getState(),
      player: usePlayerStore.getState(),
      personality: usePersonalityStore.getState(),
      socialRules: useSocialRuleStore.getState(),
      anchors: useAnchorStore.getState(),
      scene: useSceneStore.getState(),
      game: useGameStore.getState(),
    };
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button
        onClick={handleResetAll}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        重置所有
      </button>
      <button
        onClick={handleResetParams}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        恢复默认参数
      </button>
      <button
        onClick={handleExportState}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        导出状态
      </button>
      {copied && (
        <span className="text-green-400 text-xs">已复制!</span>
      )}
    </div>
  );
};
