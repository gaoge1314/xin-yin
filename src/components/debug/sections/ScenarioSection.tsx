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

export const ScenarioSection: React.FC = () => {
  const handleJumpToCoreLoop = () => {
    useGameStore.getState().newGame();
    useTimeStore.getState().reset();
    useWillpowerStore.getState().reset();
    useOrganStore.getState().reset();
    useCognitionStore.getState().reset();
    usePlayerStore.getState().reset();
    usePersonalityStore.getState().reset();
    useSocialRuleStore.getState().reset();
    useAnchorStore.getState().reset();
    useEnlightenmentStore.getState().reset();
    useSceneStore.getState().clearNarrativeLog();
    useSceneStore.getState().setPhase('core-loop');
  };

  const handleJumpToSweepDust = () => {
    useWillpowerStore.getState().reset();
    useWillpowerStore.setState({ max: 60, current: 60 });
    useTimeStore.getState().reset();
    useTimeStore.getState().advanceSeason();
    usePlayerStore.getState().reset();
    useGameStore.getState().newGame();
    useGameStore.setState({ dreamCooldown: 1 });
    useEnlightenmentStore.getState().enterSweepDust();
    useSceneStore.getState().setPhase('enlightenment-sweeping');
  };

  const handleJumpToEnding = () => {
    useSceneStore.getState().setPhase('ending');
  };

  return (
    <div>
      <button
        onClick={handleJumpToCoreLoop}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        跳转到核心循环
      </button>
      <button
        onClick={handleJumpToSweepDust}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        跳转到扫尘
      </button>
      <button
        onClick={handleJumpToEnding}
        className="w-full text-left px-2 py-1 text-xs text-white/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
      >
        跳转到结局
      </button>
    </div>
  );
};
