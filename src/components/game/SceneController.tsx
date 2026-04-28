import { useCallback } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';
import { useGameStore } from '../../stores/useGameStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useOrganStore } from '../../stores/useOrganStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { RooftopScene } from './RooftopScene';
import { FallingScene } from './FallingScene';
import { UltimateChoice } from './UltimateChoice';
import { GameOverScene } from './GameOverScene';
import { AwakeningScene } from './AwakeningScene';
import { EnlightenmentFalling } from './enlightenment/EnlightenmentFalling';
import { EnlightenmentSweeping } from './enlightenment/EnlightenmentSweeping';
import { EnlightenmentAwakening } from './enlightenment/EnlightenmentAwakening';

function resetAllStores() {
  useTimeStore.getState().reset();
  useWillpowerStore.getState().reset();
  useCognitionStore.getState().reset();
  useOrganStore.getState().reset();
  usePlayerStore.getState().reset();
  useSceneStore.getState().clearNarrativeLog();
}

export const SceneController: React.FC = () => {
  const phase = useSceneStore((s) => s.phase);
  const setPhase = useSceneStore((s) => s.setPhase);
  const memories = useGameStore((s) => s.memories);
  const newGame = useGameStore((s) => s.newGame);

  const handleStepOut = useCallback(() => {
    setPhase('prologue-falling');
  }, [setPhase]);

  const handleFallComplete = useCallback(() => {
    setPhase('prologue-choice');
  }, [setPhase]);

  const handleLetGo = useCallback(() => {
    setPhase('prologue-gameover');
  }, [setPhase]);

  const handleHoldOn = useCallback(() => {
    setPhase('prologue-awakening');
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
        return <RooftopScene onStepOut={handleStepOut} />;
      case 'prologue-falling':
        return (
          <FallingScene
            memories={memories}
            onFallComplete={handleFallComplete}
          />
        );
      case 'prologue-choice':
        return (
          <UltimateChoice
            onLetGo={handleLetGo}
            onHoldOn={handleHoldOn}
          />
        );
      case 'prologue-gameover':
        return <GameOverScene onReturnToMenu={handleReturnToMenu} />;
      case 'prologue-awakening':
        return <AwakeningScene onAwakeningComplete={handleAwakeningComplete} />;
      case 'enlightenment-falling':
        return <EnlightenmentFalling />;
      case 'enlightenment-sweeping':
        return <EnlightenmentSweeping />;
      case 'enlightenment-awakening':
        return <EnlightenmentAwakening />;
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
