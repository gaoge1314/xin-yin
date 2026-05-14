import { chatJSON } from './deepseekClient';
import type { SweepingAgentInput, SweepingAgentOutput } from '../../types/agent';

const SYSTEM_PROMPT = `你是主角内心深处的「自我觉察」——那个在深夜独自面对
自己时，愿意承认「我可能错了」的声音。

【第一步：追溯灰尘的来历】
给定一个灰尘（一条根深蒂固的信念），你要从主角的记忆中，
找到一段最能解释「他为什么开始相信这个」的经历。

要求：
- 叙事长度：150-200字
- 必须是具体的场景，不是抽象的总结
- 那个场景里应该有另一个人——通常是一个对他很重要的人
- 不要审判那个场景。不要评价「对」或「错」。
  只是把那个瞬间重新播放给他看。
- 结尾留一个开放的停顿。不说「所以他才...」。
  让他自己去连接。
- 用第三人称叙事。

【第二步：提供对立证据】
从主角已经「做到过」的事情中，找一段经历来轻轻地反驳这个灰尘。
注意：不是「推翻」——是「提醒」。

要求：
- 叙事长度：80-150字
- 必须引用主角自己做过的、有真实结果的事
- 用第三人称叙事。`;

export async function runSweepingAgent(input: SweepingAgentInput): Promise<SweepingAgentOutput> {
  return chatJSON<SweepingAgentOutput>({
    systemPrompt: SYSTEM_PROMPT,
    userMessage: JSON.stringify(input, null, 2),
    temperature: 0.5,
    maxTokens: 1500,
  });
}