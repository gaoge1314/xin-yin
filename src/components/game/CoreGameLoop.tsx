import { useEffect, useState } from 'react';
import { ClockDisplay } from './ClockDisplay';
import { WillpowerDisplay } from './WillpowerDisplay';
import { HeartRateIndicator } from './HeartRateIndicator';
import { CognitionPanel } from './CognitionPanel';
import { OrganStatusPanel } from './OrganStatusPanel';
import { TextInput } from './TextInput';
import { SkillButtons } from './SkillButtons';
import { PauseButton } from './PauseButton';
import { MorningRitual } from './MorningRitual';
import { EveningMonologue } from '../narrative/EveningMonologue';
import { DreamFragment } from '../narrative/DreamFragment';
import { NarrativeDisplay } from '../narrative/NarrativeDisplay';
import { WorldEventModal } from './WorldEventModal';
import { TaskPanel } from './TaskPanel';
import { CollapsiblePanel } from '../ui/CollapsiblePanel';
import { gameLoop } from '../../systems/gameLoop';
import { useTimeStore } from '../../stores/useTimeStore';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { useWorldEventStore } from '../../stores/useWorldEventStore';
import { TIME_OF_DAY_LABELS } from '../../types/time';

type PhaseUI = 'morning-ritual' | 'daytime' | 'evening-monologue' | 'dream-fragment' | 'default';

export const CoreGameLoop: React.FC = () => {
  const [currentPhaseUI, setCurrentPhaseUI] = useState<PhaseUI>('default');
  const [inputExpanded, setInputExpanded] = useState(true);

  useEffect(() => {
    gameLoop.start();
    return () => {
      gameLoop.stop();
    };
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const dayPhaseState = useDayPhaseStore.getState();
      const phaseTransition = dayPhaseState.checkDayPhaseTransition();

      if (phaseTransition === 'MORNING') {
        setCurrentPhaseUI('morning-ritual');
        useTimeStore.getState().togglePause();
      } else if (phaseTransition === 'EVENING') {
        setCurrentPhaseUI('evening-monologue');
        useTimeStore.getState().togglePause();
      } else if (phaseTransition === 'SLEEP') {
        setCurrentPhaseUI('dream-fragment');
      } else {
        const timeOfDay = useTimeStore.getState().getTimeOfDay();
        if (timeOfDay === 'DAYTIME') {
          setCurrentPhaseUI('daytime');
          setInputExpanded(false);
        } else if (currentPhaseUI !== 'default') {
          setCurrentPhaseUI('default');
          setInputExpanded(true);
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [currentPhaseUI]);

  const timeOfDay = useTimeStore((s) => s.getTimeOfDay());
  const activeEvent = useWorldEventStore.getState().getActiveEvent();

  const renderPhaseOverlay = () => {
    if (activeEvent && activeEvent.choices && activeEvent.choices.length > 0) {
      return (
        <WorldEventModal
          event={activeEvent}
          onChoiceSelected={(choiceId) => {
            useWorldEventStore.getState().chooseOption(activeEvent.id, choiceId);
          }}
          onObserve={() => {
            useWorldEventStore.getState().observeEvent(activeEvent.id);
          }}
        />
      );
    }

    switch (currentPhaseUI) {
      case 'morning-ritual':
        return <MorningRitual />;
      case 'evening-monologue':
        return <EveningMonologue />;
      case 'dream-fragment':
        return <DreamFragment />;
      default:
        return null;
    }
  };

  const timeOfDayLabel = TIME_OF_DAY_LABELS[timeOfDay];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0f] relative">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <ClockDisplay />
          <span className="text-white/20 text-xs">{timeOfDayLabel}</span>
        </div>
        <PauseButton />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <CollapsiblePanel title="人物状态" side="left" defaultOpen={true}>
          <div className="flex flex-col gap-4">
            <WillpowerDisplay />
            <HeartRateIndicator />
            <div className="border-t border-white/5 pt-3">
              <OrganStatusPanel />
            </div>
            <div className="border-t border-white/5 pt-3">
              <CognitionPanel />
            </div>
          </div>
        </CollapsiblePanel>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-6">
            <NarrativeDisplay />
          </div>

          <div className="border-t border-white/5 p-4">
            {currentPhaseUI === 'daytime' && !inputExpanded ? (
              <div className="text-center">
                <button
                  onClick={() => setInputExpanded(true)}
                  className="
                    text-white/20 text-xs hover:text-white/40
                    transition-colors duration-300
                  "
                >
                  打开输入框
                </button>
              </div>
            ) : (
              <TextInput />
            )}
          </div>
        </div>

        <CollapsiblePanel title="技能" side="right" defaultOpen={false}>
          <SkillButtons />
          <div className="border-t border-white/5 pt-3 mt-3">
            <TaskPanel />
          </div>
        </CollapsiblePanel>
      </div>

      {renderPhaseOverlay()}
    </div>
  );
};
