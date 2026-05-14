import { useEffect, useState, useMemo, useCallback } from 'react';
import { ClockDisplay } from './ClockDisplay';
import { WillpowerDisplay } from './WillpowerDisplay';
import { CognitionPanel } from './CognitionPanel';
import { OrganStatusPanel } from './OrganStatusPanel';
import { PauseButton } from './PauseButton';
import { MorningRitual } from './MorningRitual';
import { NarrativeDisplay } from '../narrative/NarrativeDisplay';
import { NpcDialogModal } from './NpcDialogModal';
import { TaskPanel } from './TaskPanel';
import { WorldInfoPanel } from './WorldInfoPanel';
import { RecentInteractionsPanel } from './RecentInteractionsPanel';
import { CollapsiblePanel } from '../ui/CollapsiblePanel';
import { DustListPanel } from './DustListPanel';
import { ContactPanel } from './ContactPanel';
import { ContactFlowOverlay } from './ContactFlowOverlay';
import { VagusNerveMoment } from './VagusNerveMoment';
import { DeepNumbnessOverlay } from './DeepNumbnessOverlay';
import { DesireInput } from './DesireInput';
import { JudgmentReveal } from './JudgmentReveal';
import { SweepingFlow } from './SweepingFlow';
import { gameLoop } from '../../systems/gameLoop';
import {
  startDesireCycle,
  submitDesire,
  triggerSweeping,
  type DesireCycleCallbacks,
} from '../../systems/agents/agentManager';
import { useTimeStore } from '../../stores/useTimeStore';
import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { useNpcStore } from '../../stores/useNpcStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { getConnectionTier, CONNECTION_TIER_COLORS, CONNECTION_TIER_DESCRIPTIONS } from '../../types/trust';
import type { ConnectionTier } from '../../types/trust';
import type { Cognition } from '../../types/cognition';
import { TIME_OF_DAY_LABELS, getTimeOfDay as deriveTimeOfDay } from '../../types/time';
import type { AgentOneOutput, AgentTwoOutput, AgentThreeOutput, SweepingAgentOutput } from '../../types/agent';

type PhaseUI = 'morning-ritual' | 'daytime' | 'default';

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

type DesirePhase =
  | 'idle'
  | 'checking'
  | 'prompting'
  | 'executing'
  | 'judging'
  | 'revealing'
  | 'sweeping';

export const CoreGameLoop: React.FC = () => {
  const [currentPhaseUI, setCurrentPhaseUI] = useState<PhaseUI>('default');
  const [desirePhase, setDesirePhase] = useState<DesirePhase>('idle');
  const [agentOneOutput, setAgentOneOutput] = useState<AgentOneOutput | null>(null);
  const [agentTwoNarrative, setAgentTwoNarrative] = useState('');
  const [agentTwoInterpretation, setAgentTwoInterpretation] = useState('');
  const [agentTwoPlan, setAgentTwoPlan] = useState('');
  const [agentTwoDustUsed, setAgentTwoDustUsed] = useState<string | null>(null);
  const [agentThreeOutput, setAgentThreeOutput] = useState<AgentThreeOutput | null>(null);
  const [originalDesire, setOriginalDesire] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [streamingPhase, setStreamingPhase] = useState<'narrative' | 'judgment' | null>(null);
  const [sweepingDust, setSweepingDust] = useState<Cognition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckDay, setLastCheckDay] = useState(-1);
  const [desirePromptRequested, setDesirePromptRequested] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    gameLoop.start();
    const timer = setTimeout(() => setHasInitialized(true), 3000);
    return () => {
      gameLoop.stop();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const dayPhaseState = useDayPhaseStore.getState();
      const phaseTransition = dayPhaseState.checkDayPhaseTransition();

      if (phaseTransition === 'MORNING') {
        setCurrentPhaseUI('morning-ritual');
        useTimeStore.getState().pause('morning-ritual');
      } else {
        const timeOfDay = useTimeStore.getState().getTimeOfDay();
        if (timeOfDay === 'DAYTIME') {
          setCurrentPhaseUI('daytime');
          useTimeStore.getState().resume('morning-ritual');
        } else if (currentPhaseUI !== 'default') {
          setCurrentPhaseUI('default');
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [currentPhaseUI]);

  useEffect(() => {
    if (desirePhase !== 'idle') return;
    if (!hasInitialized) return;

    const totalDays = useTimeStore.getState().totalDays;
    if (totalDays === lastCheckDay) return;

    setLastCheckDay(totalDays);
    checkDesireMoment();
  }, [lastCheckDay, desirePhase, hasInitialized]);

  const checkDesireMoment = useCallback(async () => {
    setDesirePhase('checking');
    setError(null);

    const callbacks: DesireCycleCallbacks = {
      onAgentOneComplete: (output) => {
        setAgentOneOutput(output);
        if (output.shouldPrompt) {
          setDesirePhase('prompting');
        } else {
          setDesirePhase('idle');
        }
      },
      onAgentTwoToken: () => {},
      onAgentTwoNarrativeComplete: () => {},
      onAgentThreeToken: () => {},
      onAgentThreeComplete: () => {},
      onSweepingReady: () => {},
      onError: (err) => {
        setError(err.message);
        setDesirePhase('idle');
      },
    };

    try {
      await startDesireCycle(callbacks);
      if (desirePhase === 'checking') {
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '检查发心失败');
      setDesirePhase('idle');
    }
  }, [desirePhase]);

  const handleDesireSubmit = useCallback(async (desire: string) => {
    setOriginalDesire(desire);
    setDesirePhase('executing');
    setStreamingText('');
    setStreamingPhase('narrative');
    setError(null);

    const callbacks: DesireCycleCallbacks = {
      onAgentOneComplete: () => {},
      onAgentTwoToken: (token) => {
        setStreamingText((prev) => prev + token);
      },
      onAgentTwoNarrativeComplete: (narrative) => {
        setAgentTwoNarrative(narrative);
        setStreamingText('');
        setDesirePhase('judging');
        setStreamingPhase('judgment');
      },
      onAgentThreeToken: (token) => {
        setStreamingText((prev) => prev + token);
      },
      onAgentThreeComplete: (output) => {
        setAgentThreeOutput(output);
        setStreamingText('');
        setStreamingPhase(null);
        setDesirePhase('revealing');
      },
      onSweepingReady: () => {},
      onError: (err) => {
        setError(err.message);
        setDesirePhase('idle');
        setStreamingPhase(null);
      },
    };

    try {
      await submitDesire(desire, false, callbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '执行失败');
      setDesirePhase('idle');
      setStreamingPhase(null);
    }
  }, []);

  const handleSilenceTimeout = useCallback(async () => {
    setOriginalDesire('');
    setDesirePhase('executing');
    setStreamingText('');
    setStreamingPhase('narrative');
    setError(null);

    const callbacks: DesireCycleCallbacks = {
      onAgentOneComplete: () => {},
      onAgentTwoToken: (token) => {
        setStreamingText((prev) => prev + token);
      },
      onAgentTwoNarrativeComplete: (narrative) => {
        setAgentTwoNarrative(narrative);
        setStreamingText('');
        setDesirePhase('judging');
        setStreamingPhase('judgment');
      },
      onAgentThreeToken: (token) => {
        setStreamingText((prev) => prev + token);
      },
      onAgentThreeComplete: (output) => {
        setAgentThreeOutput(output);
        setStreamingText('');
        setStreamingPhase(null);
        setDesirePhase('revealing');
      },
      onSweepingReady: () => {},
      onError: (err) => {
        setError(err.message);
        setDesirePhase('idle');
        setStreamingPhase(null);
      },
    };

    try {
      await submitDesire('', true, callbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '执行失败');
      setDesirePhase('idle');
      setStreamingPhase(null);
    }
  }, []);

  const handleEnterSweeping = useCallback(() => {
    if (!agentThreeOutput || !agentTwoDustUsed) return;

    const cognitions = useCognitionStore.getState().cognitions;
    const activeDust = cognitions.find(
      (c) => c.currentContent === agentTwoDustUsed && !c.isTransformed
    );

    if (activeDust) {
      setSweepingDust(activeDust);
      setDesirePhase('sweeping');
    }
  }, [agentThreeOutput, agentTwoDustUsed]);

  const handleSweepingComplete = useCallback(async (): Promise<SweepingAgentOutput> => {
    if (!sweepingDust) throw new Error('无灰尘可扫');

    return new Promise((resolve, reject) => {
      triggerSweeping(
        sweepingDust.id,
        (output) => resolve(output),
        (err) => reject(err)
      );
    });
  }, [sweepingDust]);

  const handleContinueForward = useCallback(() => {
    setDesirePhase('idle');
    setAgentOneOutput(null);
    setAgentTwoNarrative('');
    setAgentTwoInterpretation('');
    setAgentThreeOutput(null);
    setOriginalDesire('');
  }, []);

  const handleExitSweeping = useCallback(() => {
    setDesirePhase('idle');
    setSweepingDust(null);
    setAgentThreeOutput(null);
    setOriginalDesire('');
  }, []);

  const handleRequestDesirePrompt = useCallback(() => {
    setDesirePromptRequested(true);
    checkDesireMoment();
  }, [checkDesireMoment]);

  useEffect(() => {
    if (desirePromptRequested && desirePhase === 'idle') {
      setDesirePromptRequested(false);
    }
  }, [desirePromptRequested, desirePhase]);

  const hour = useTimeStore((s) => s.hour);
  const timeOfDay = deriveTimeOfDay(hour);
  const activeNpcDialog = useNpcStore((s) => s.activeNpcDialog);
  const contactRequest = useNpcStore((s) => s.contactRequest);

  const trustLevel = usePlayerStore((s) => s.trustLevel);
  const tierInfo = useMemo(() => {
    const tier = getConnectionTier(trustLevel);
    return {
      tier,
      color: CONNECTION_TIER_COLORS[tier],
      description: CONNECTION_TIER_DESCRIPTIONS[tier],
      level: trustLevel,
    };
  }, [trustLevel]);

  const xinYinLevel = usePlayerStore((s) => s.xinYinLevel);
  const herdLevel = usePlayerStore((s) => s.herdLevel);
  const vagusSkill = usePlayerStore((s) => s.vagusNerveSkill);

  useEffect(() => {
    if (activeNpcDialog) {
      useTimeStore.getState().pause('npc-dialog');
    } else {
      useTimeStore.getState().resume('npc-dialog');
    }
  }, [activeNpcDialog?.eventId]);

  useEffect(() => {
    if (contactRequest) {
      useTimeStore.getState().pause('contact-flow');
    } else {
      useTimeStore.getState().resume('contact-flow');
    }
  }, [contactRequest?.phase]);

  useEffect(() => {
    if (
      desirePhase === 'prompting' ||
      desirePhase === 'executing' ||
      desirePhase === 'judging' ||
      desirePhase === 'revealing' ||
      desirePhase === 'sweeping'
    ) {
      useTimeStore.getState().pause('desire-cycle');
    } else {
      useTimeStore.getState().resume('desire-cycle');
    }
  }, [desirePhase]);

  useEffect(() => {
    if (vagusSkill?.available) {
      useTimeStore.getState().pause('vagus-nerve');
    } else {
      useTimeStore.getState().resume('vagus-nerve');
    }
  }, [vagusSkill?.available]);

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

    if (desirePhase === 'prompting' && agentOneOutput) {
      return (
        <DesireInput
          agentOneOutput={agentOneOutput}
          onDesireSubmit={handleDesireSubmit}
          onSilenceTimeout={handleSilenceTimeout}
          silenceSeconds={60}
        />
      );
    }

    if ((desirePhase === 'executing' || desirePhase === 'judging') && streamingPhase) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-w-lg w-full mx-4 rounded-xl border border-white/10 bg-gray-900/95 p-6 shadow-2xl">
            <div className="text-center mb-3">
              <span className="text-white/30 text-xs tracking-wider">
                {streamingPhase === 'narrative' ? '他在行动...' : '他在感受...'}
              </span>
            </div>
            <div className="border border-white/[0.06] rounded-lg bg-white/[0.01] p-4 min-h-[120px]">
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="animate-pulse text-white/30">|</span>
              </p>
            </div>
            {originalDesire && (
              <p className="text-white/20 text-[10px] mt-2 text-center">
                你希望他：{originalDesire}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (desirePhase === 'revealing' && agentThreeOutput && agentTwoNarrative) {
      const cognitions = useCognitionStore.getState();
      const activeDustId = agentTwoDustUsed
        ? cognitions.cognitions.find((c) => c.currentContent === agentTwoDustUsed)
        : null;
      const dustMeta = activeDustId
        ? cognitions.getDustMeta(activeDustId.id)
        : { counter: 0, evidenceRecords: [], sweepAttempts: 0 };

      return (
        <JudgmentReveal
          agentTwoNarrative={agentTwoNarrative}
          agentTwoInterpretation={agentTwoInterpretation}
          agentThreeOutput={agentThreeOutput}
          originalDesire={originalDesire}
          activeDustContent={agentTwoDustUsed}
          dustCounter={dustMeta.counter}
          onEnterSweeping={handleEnterSweeping}
          onContinueForward={handleContinueForward}
        />
      );
    }

    if (desirePhase === 'sweeping' && sweepingDust) {
      const cognitionStore = useCognitionStore.getState();
      const dustMeta = cognitionStore.getDustMeta(sweepingDust.id);

      return (
        <SweepingFlow
          dust={sweepingDust}
          dustMeta={dustMeta}
          onSweep={handleSweepingComplete}
          onExit={handleExitSweeping}
        />
      );
    }

    switch (currentPhaseUI) {
      case 'morning-ritual':
        return <MorningRitual />;
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
        <div className="flex items-center gap-3">
          {desirePhase === 'idle' && (
            <button
              onClick={handleRequestDesirePrompt}
              className="text-white/25 text-xs hover:text-white/50 transition-colors border border-white/[0.06] rounded px-2 py-1"
            >
              发心
            </button>
          )}
          <PauseButton />
        </div>
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
                <span className="text-white/30 text-xs tracking-wider">君臣信任</span>
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

          {error && (
            <div className="px-4 py-2 bg-red-500/5 border-t border-red-500/10">
              <p className="text-red-300/50 text-xs text-center">{error}</p>
            </div>
          )}

          <div className="border-t border-white/5 p-4">
            <div className="text-center">
              <span className="text-white/15 text-xs">
                {desirePhase === 'idle'
                  ? '等待发心时刻... 或点击上方「发心」主动触发'
                  : desirePhase === 'checking'
                  ? '正在感知当下...'
                  : ''}
              </span>
            </div>
          </div>
        </div>

        <CollapsiblePanel title="世界" side="right" defaultOpen={true}>
          <div className="flex flex-col gap-4">
            <ContactPanel />
            <WorldInfoPanel />
            <div className="border-t border-white/5 pt-3">
              <RecentInteractionsPanel />
            </div>
            <div className="border-t border-white/5 pt-3">
              <TaskPanel />
            </div>
          </div>
        </CollapsiblePanel>
      </div>

      <DustListPanel />
      <ContactFlowOverlay />
      <VagusNerveMoment />
      <DeepNumbnessOverlay />

      {renderPhaseOverlay()}
    </div>
  );
};