import { runAgentOne } from './agentOne';
import { runAgentTwoStream } from './agentTwo';
import { runAgentThreeStream } from './agentThree';
import { runSweepingAgent } from './sweepingAgent';
import type {
  AgentOneInput,
  AgentOneOutput,
  AgentTwoInput,
  AgentTwoOutput,
  AgentThreeInput,
  AgentThreeOutput,
  SweepingAgentInput,
  SweepingAgentOutput,
  DecayedMemorySummary,
  DustSummary,
  LegacyEntry,
  EvidenceRecord,
} from '../../types/agent';

export interface DesireCycleCallbacks {
  onAgentOneComplete: (output: AgentOneOutput) => void;
  onAgentTwoToken: (token: string) => void;
  onAgentTwoNarrativeComplete: (narrative: string) => void;
  onAgentThreeToken: (token: string) => void;
  onAgentThreeComplete: (output: AgentThreeOutput) => void;
  onSweepingReady: (output: SweepingAgentOutput) => void;
  onError: (error: Error) => void;
}

let lastDesireDay = -1;
let silenceTimeout: ReturnType<typeof setTimeout> | null = null;
let negativeStreak = 0;

function validateAgentOneOutput(raw: Partial<AgentOneOutput>): AgentOneOutput {
  return {
    shouldPrompt: raw.shouldPrompt ?? false,
    urgency: raw.urgency ?? 5,
    urgencyReason: raw.urgencyReason ?? '',
    eventDescription: raw.eventDescription ?? '你感受到内心有一丝波动...',
    suggestedDesires: Array.isArray(raw.suggestedDesires)
      ? raw.suggestedDesires.map((d: any) => ({
          text: d.text ?? '未知心愿',
          type: d.type === 'heartSeal' || d.type === 'dustRisk' ? d.type : 'heartSeal',
          description: d.description ?? '',
          relatedDust: d.relatedDust,
        }))
      : [
          { text: '让他允许自己脆弱一次', type: 'heartSeal' as const, description: '放下防备，接纳自己的软弱' },
          { text: '让他去证明自己', type: 'dustRisk' as const, description: '这可能只是灰尘在说话' },
        ],
  };
}

export async function startDesireCycle(callbacks: DesireCycleCallbacks): Promise<void> {
  try {
    const input: AgentOneInput = {
      currentEvent: {
        id: 'daily',
        description: '日常的一天',
        isTsunami: false,
        year: 2025,
        season: '春',
      },
      memories: [],
      protagonistState: {
        willpowerCurrent: 50,
        willpowerMax: 100,
        xinYinLevel: 0,
        connectionLevel: 50,
        organSummary: '',
      },
      dusts: [],
      daysSinceLastDesire: 999,
    };

    let output: AgentOneOutput;
    try {
      const raw = await runAgentOne(input);
      output = validateAgentOneOutput(raw);
    } catch (apiError) {
      output = validateAgentOneOutput({
        shouldPrompt: true,
        urgency: 5,
        urgencyReason: '无法连接心君，使用默认判断',
        eventDescription: '你感受到内心有一丝波动...',
      });
    }
    callbacks.onAgentOneComplete(output);
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function submitDesire(
  playerDesire: string,
  _isSilent: boolean,
  callbacks: DesireCycleCallbacks
): Promise<void> {
  try {
    const input: AgentTwoInput = {
      playerDesire,
      isSilent: _isSilent,
      currentEvent: null,
      protagonistState: {
        willpowerCurrent: 50,
        willpowerMax: 100,
        xinYinLevel: 0,
        herdLevel: 50,
        connectionLevel: 50,
      },
      activeDust: null,
      environment: {
        season: '春',
        year: 2025,
        timeOfDay: 'daytime',
        activeSocialRules: [],
      },
    };

    await runAgentTwoStream(
      input,
      callbacks.onAgentTwoToken,
      async (agentTwoOutput) => {
        callbacks.onAgentTwoNarrativeComplete(agentTwoOutput.narrative);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const input3: AgentThreeInput = {
          originalDesire: playerDesire,
          executionNarrative: agentTwoOutput.narrative,
          interpretationOfDesire: agentTwoOutput.interpretationOfDesire,
          plan: agentTwoOutput.plan,
          dustUsed: agentTwoOutput.dustUsed,
          protagonistState: { willpowerCurrent: 50, willpowerMax: 100, xinYinLevel: 0, connectionLevel: 50 },
          activeDustId: null,
          dustCounter: 0,
        };

        await runAgentThreeStream(
          input3,
          callbacks.onAgentThreeToken,
          (agentThreeOutput) => callbacks.onAgentThreeComplete(agentThreeOutput),
          callbacks.onError
        );
      },
      callbacks.onError
    );
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function triggerSweeping(
  _dustId: string,
  onComplete: (output: SweepingAgentOutput) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const output = await runSweepingAgent({
      dust: { id: 'test', content: '测试灰尘', dustType: '我执' },
      protagonistState: { willpowerCurrent: 50, xinYinLevel: 0 },
      counterEvidence: [],
      memories: [],
    });
    onComplete(output);
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}

export function getNegativeStreak(): number {
  return negativeStreak;
}