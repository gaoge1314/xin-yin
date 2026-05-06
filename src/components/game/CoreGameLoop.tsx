import { useEffect, useState } from 'react';
import { ClockDisplay } from './ClockDisplay';
import { WillpowerDisplay } from './WillpowerDisplay';
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
import { NpcDialogModal } from './NpcDialogModal';
import { TaskPanel } from './TaskPanel';
import { WorldInfoPanel } from './WorldInfoPanel';
import { RecentInteractionsPanel } from './RecentInteractionsPanel';
import { CollapsiblePanel } from '../ui/CollapsiblePanel';
import { gameLoop } from '../../systems/gameLoop';
import { useTimeStore } from '../../stores/useTimeStore';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { useWorldEventStore } from '../../stores/useWorldEventStore';
import { useNpcStore } from '../../stores/useNpcStore';
import { useTriggerStore } from '../../stores/useTriggerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { getConnectionTier, CONNECTION_TIER_COLORS, CONNECTION_TIER_DESCRIPTIONS } from '../../types/trust';
import type { ConnectionTier } from '../../types/trust';
import { TIME_OF_DAY_LABELS } from '../../types/time';

type PhaseUI = 'morning-ritual' | 'daytime' | 'evening-monologue' | 'dream-fragment' | 'default';

const TIER_TEXT_CLASS: Record<ConnectionTier, string> = {
  '陌路': 'text-gray-400',
  '疏远': 'text-blue-300',
  '倾听': 'text-yellow-400',
  '信任': 'text-orange-400',
  '共生': 'text-amber-200',
};

const TIER_BAR_HEX: Record<ConnectionTier, string> = {
  '陌路': '#9CA3AF',
  '疏远': '#93C5FD',
  '倾听': '#FACC15',
  '信任': '#FB923C',
  '共生': '#FDE68A',
};

export const CoreGameLoop: React.FC = () => {
  const [currentPhaseUI, setCurrentPhaseUI] = useState<PhaseUI>('default');

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
        useTimeStore.getState().pause('morning-ritual');
      } else if (phaseTransition === 'EVENING') {
        setCurrentPhaseUI('evening-monologue');
        useTimeStore.getState().pause('evening-monologue');
      } else if (phaseTransition === 'SLEEP') {
        setCurrentPhaseUI('dream-fragment');
        useTimeStore.getState().pause('dream-fragment');
      } else {
        const timeOfDay = useTimeStore.getState().getTimeOfDay();
        if (timeOfDay === 'DAYTIME') {
          setCurrentPhaseUI('daytime');
          useTimeStore.getState().resume('morning-ritual');
          useTimeStore.getState().resume('evening-monologue');
          useTimeStore.getState().resume('dream-fragment');
        } else if (currentPhaseUI !== 'default') {
          setCurrentPhaseUI('default');
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [currentPhaseUI]);

  const timeOfDay = useTimeStore((s) => s.getTimeOfDay());
  const activeEvent = useWorldEventStore((s) => s.activeEventId)
    ? useWorldEventStore.getState().getActiveEvent()
    : null;
  const activeNpcDialog = useNpcStore((s) => s.activeNpcDialog);
  const inputBoxState = useTriggerStore((s) => s.inputBoxState);

  const tierInfo = usePlayerStore((s) => {
    const level = s.trustLevel;
    const tier = getConnectionTier(level);
    return {
      tier,
      color: CONNECTION_TIER_COLORS[tier],
      description: CONNECTION_TIER_DESCRIPTIONS[tier],
      level,
    };
  });

  const xinYinLevel = usePlayerStore((s) => s.xinYinLevel);
  const herdLevel = usePlayerStore((s) => s.herdLevel);

  useEffect(() => {
    if (activeEvent && activeEvent.choices && activeEvent.choices.length > 0) {
      useTimeStore.getState().pause('world-event');
    } else {
      useTimeStore.getState().resume('world-event');
    }
  }, [activeEvent?.id]);

  useEffect(() => {
    if (activeNpcDialog) {
      useTimeStore.getState().pause('npc-dialog');
    } else {
      useTimeStore.getState().resume('npc-dialog');
    }
  }, [activeNpcDialog?.eventId]);

  const renderPhaseOverlay = () => {
    if (activeNpcDialog) {
      return (
        <NpcDialogModal
          dialog={activeNpcDialog}
          onDismiss={() => {
            useNpcStore.getState().dismissActiveDialog();
            useNpcStore.getState().processNextDialog();
          }}
        />
      );
    }

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
      {inputBoxState === 'urgent' && (
        <div className="absolute inset-0 pointer-events-none z-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      )}

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
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs tracking-wider">心印</span>
                <span className="text-white/50 text-sm">{Math.floor(xinYinLevel)}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${xinYinLevel}%`, backgroundColor: 'rgba(147,197,253,0.4)' }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs tracking-wider">群则</span>
                <span className="text-white/50 text-sm">{Math.floor(herdLevel)}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${herdLevel}%`, backgroundColor: 'rgba(168,162,158,0.4)' }}
                />
              </div>
            </div>
            <WillpowerDisplay />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs tracking-wider">连接度</span>
                <span
                  key={tierInfo.tier}
                  className={`text-xs ${TIER_TEXT_CLASS[tierInfo.tier]} animate-[fadeIn_0.3s_ease-out]`}
                  title={tierInfo.description}
                >
                  {tierInfo.tier}
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${tierInfo.level}%`, backgroundColor: TIER_BAR_HEX[tierInfo.tier], opacity: 0.6 }}
                />
              </div>
              <div className="text-right">
                <span className="text-white/50 text-sm">{tierInfo.level}</span>
              </div>
            </div>
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
            <TextInput />
          </div>
        </div>

        <CollapsiblePanel title="世界" side="right" defaultOpen={true}>
          <div className="flex flex-col gap-4">
            <WorldInfoPanel />
            <div className="border-t border-white/5 pt-3">
              <RecentInteractionsPanel />
            </div>
            <div className="border-t border-white/5 pt-3">
              <SkillButtons />
            </div>
            <div className="border-t border-white/5 pt-3">
              <TaskPanel />
            </div>
          </div>
        </CollapsiblePanel>
      </div>

      {renderPhaseOverlay()}
    </div>
  );
};
