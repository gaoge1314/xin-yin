import { useCallback } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { useGameStore } from '../../stores/useGameStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useOrganStore } from '../../stores/useOrganStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useNpcStore } from '../../stores/useNpcStore';
import { useWorldEventStore } from '../../stores/useWorldEventStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useHabitStore } from '../../stores/useHabitStore';
import { useEnlightenmentStore } from '../../stores/useEnlightenmentStore';
import { usePersonalityStore } from '../../stores/usePersonalityStore';
import { useSocialRuleStore } from '../../stores/useSocialRuleStore';
import { useAnchorStore } from '../../stores/useAnchorStore';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { RooftopScene } from './RooftopScene';
import { CauseModeScene } from './CauseModeScene';
import { GameOverScene } from './GameOverScene';
import { AwakeningScene } from './AwakeningScene';
import { EnlightenmentSweeping } from './enlightenment/EnlightenmentSweeping';

function resetAllStores() {
  useTimeStore.getState().reset();
  useWillpowerStore.getState().reset();
  useCognitionStore.getState().reset();
  useOrganStore.getState().reset();
  usePlayerStore.getState().reset();
  useNpcStore.getState().reset();
  useWorldEventStore.getState().reset();
  useTaskStore.getState().reset();
  useHabitStore.getState().reset();
  useEnlightenmentStore.getState().reset();
  usePersonalityStore.getState().reset();
  useSocialRuleStore.getState().reset();
  useAnchorStore.getState().reset();
  useDayPhaseStore.getState().reset();
  useSceneStore.getState().clearNarrativeLog();
}

export const SceneController: React.FC = () => {
  const phase = useSceneStore((s) => s.phase);
  const setPhase = useSceneStore((s) => s.setPhase);
  const newGame = useGameStore((s) => s.newGame);

  const handleLetGo = useCallback(() => {
    setPhase('prologue-cause');
  }, [setPhase]);

  const handleHoldOn = useCallback(() => {
    setPhase('prologue-awakening');
  }, [setPhase]);

  const handleCauseRetry = useCallback(() => {
    setPhase('prologue-rooftop');
  }, [setPhase]);

  const handleCauseGiveUp = useCallback(() => {
    setPhase('prologue-gameover');
  }, [setPhase]);

  const handleReturnToMenu = useCallback(() => {
    setPhase('menu');
  }, [setPhase]);

  const handleAwakeningComplete = useCallback(() => {
    newGame();
    resetAllStores();
    setPhase('core-loop');
  }, [newGame, setPhase]);

  const renderScene = () => {
    switch (phase) {
      case 'prologue-rooftop':
        return <RooftopScene onHoldOn={handleHoldOn} onLetGo={handleLetGo} />;
      case 'prologue-cause':
        return (
          <CauseModeScene
            onRetry={handleCauseRetry}
            onGiveUp={handleCauseGiveUp}
          />
        );
      case 'prologue-gameover':
        return <GameOverScene onReturnToMenu={handleReturnToMenu} />;
      case 'prologue-awakening':
        return <AwakeningScene onAwakeningComplete={handleAwakeningComplete} />;
      case 'enlightenment-sweeping':
        return <EnlightenmentSweeping />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      {renderScene()}
    </div>
  );
};
