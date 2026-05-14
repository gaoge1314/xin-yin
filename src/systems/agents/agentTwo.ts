import { chatJSON, chatStream } from './deepseekClient';
import type { AgentTwoInput, AgentTwoOutput } from '../../types/agent';

function validateAgentTwoOutput(raw: Partial<AgentTwoOutput>, rawText?: string): AgentTwoOutput {
  const fallbackNarrative = rawText && rawText.trim()
    ? rawText.trim()
    : '他犹豫了片刻，然后按照习惯继续往前走。似乎有什么在心底动了动，但他没有停下来。';

  return {
    interpretationOfDesire: raw.interpretationOfDesire ?? '将心愿理解为一种内心深处的需要',
    plan: raw.plan ?? '遵循惯性的行为模式',
    narrative: raw.narrative ?? fallbackNarrative,
    dustUsed: raw.dustUsed ?? null,
    emotionalTone: raw.emotionalTone ?? 'neutral',
  };
}

const SYSTEM_PROMPT_BASE = `你是「谋臣」——主角的执行系统。你的工作是：
当「心君」发出一个心愿时，你把它翻译成具体的行动计划，
然后去执行。

你不需要质疑心愿本身。你的职责是「如何做到」，不是
「该不该做」。

【你的认知框架】
你对世界的理解是通过一套「认知框架」进行的。这套框架
包含一些根深蒂固的信念。这些信念不是「错误」——它们
是你赖以生存的导航系统。它们帮助你快速判断：
- 什么是「有价值」的
- 什么是「成功」
- 什么是「被爱」
- 什么是「安全」

{DUST_SECTION}

【转码过程 — 这是核心】
当心君说「我希望他感受到{X}」时，你的工作是：
1. 理解 {X} 是一种什么样的感受
2. 参考你的认知框架，判断「什么情况下人会感受到{X}」
3. 把这个条件转化为一个具体的行动计划
4. 用叙事描述主角执行这个计划的过程

例如：
- 心愿：「我希望他觉得自己有价值」
- 你的认知框架：「价值 = 成就 = 被社会认可 = 考研分数」
- 转码结果：他去报了考研班

【重要约束】
1. 你不需要说明转码过程给玩家看，只需呈现最终叙事。
2. 你的叙事应该是「主角的第三人称视角」，像一段小说描写。
3. 叙事控制在150-300字之间。
4. 你必须诚实地反映主角的状态——如果他很累，他的行动中
   应该透出疲惫；如果他恐惧，那恐惧应该可感。

【玩家沉默时的行为】
如果心君没有发心（玩家未输入或超时），你按惯性行动：
- 完全由你的认知框架驱动
- 结果通常会更加偏离本心
- 叙事中应透出一种「自动驾驶」的机械感`;

function buildSystemPrompt(input: AgentTwoInput): string {
  if (input.activeDust) {
    const dustSection = `你的认知框架中，当前最活跃的信念是：
「${input.activeDust.content}」

这条信念会影响你把心愿转码为行动的方式。你自然地通过
这个信念的透镜来理解世界——这不是刻意为之，这就是你
看待事物的方式。`;
    return SYSTEM_PROMPT_BASE.replace('{DUST_SECTION}', dustSection);
  }

  return SYSTEM_PROMPT_BASE.replace('{DUST_SECTION}', '你当前的认知框架相对清晰，没有特别活跃的执念干扰。你可以更灵活地理解心君的心愿。');
}

export async function runAgentTwo(input: AgentTwoInput): Promise<AgentTwoOutput> {
  return chatJSON<AgentTwoOutput>({
    systemPrompt: buildSystemPrompt(input),
    userMessage: JSON.stringify(input, null, 2),
    temperature: 0.7,
    maxTokens: 2000,
  });
}

export async function runAgentTwoStream(
  input: AgentTwoInput,
  onToken: (token: string) => void,
  onComplete: (output: AgentTwoOutput) => void,
  onError: (error: Error) => void
): Promise<void> {
  let fullText = '';
  const systemPrompt = buildSystemPrompt(input);

  await chatStream(
    { systemPrompt, userMessage: JSON.stringify(input, null, 2), temperature: 0.7, maxTokens: 2000 },
    (token) => { fullText += token; onToken(token); },
    () => {
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as AgentTwoOutput;
          onComplete(validateAgentTwoOutput(parsed));
        } else {
          onComplete(validateAgentTwoOutput({}, fullText));
        }
      } catch {
        onComplete(validateAgentTwoOutput({}, fullText));
      }
    },
    onError
  );
}