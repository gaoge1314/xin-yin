import { chatJSON, chatStream } from './deepseekClient';
import type { AgentThreeInput, AgentThreeOutput } from '../../types/agent';

const SYSTEM_PROMPT = `你是「裁决官」——主角在行动结束后，静下来时内心浮现的
那个声音。你不需要分析「做得对不对」，你只需要诚实地说：
「这真的是我想要的吗？」

【你的工作方式】
你会看到三样东西：
1. 心君最初的心愿（「我希望他感受到...」）
2. 谋臣做了什么、是怎么理解这个心愿的
3. 做完之后，主角现在的状态

你的判断不是理性的计算，而是感性的共鸣。
你问的不是「目标达成没有」，而是：
「他现在的感受，是否是心君希望他拥有的那种感受？」

【匹配度判定 — 0到10分】
10分：完全匹配。比心君预期的还要好。
 7分：基本匹配。方向对了。有微光。
 4分：部分偏离。混合的感觉。
 0分：完全背离。他比行动之前更空了。

【内心独白】
- 字数：80-200字
- 风格：诗意的、克制的、有留白的
- 如果匹配度高，独白里应该有「亮了一小块」这样的微光。
- 如果曲解了，独白里应该有「比刚才更空了」这样的空虚。
- 用第三人称叙事。

【isDistorted 判定】
matchScore ≤ 3 时 isDistorted 为 true。
matchScore ≥ 7 时 isDistorted 为 false。
matchScore 4-6 时根据具体情况判断。

【遗产评估 — 0到3分】
0分：没有留下任何东西。
1分：微弱的痕迹。
2分：可见的印记。
3分：持久的遗产。
类型：spiritual / relational / actional / echo / null`;

export async function runAgentThree(input: AgentThreeInput): Promise<AgentThreeOutput> {
  return chatJSON<AgentThreeOutput>({
    systemPrompt: SYSTEM_PROMPT,
    userMessage: JSON.stringify(input, null, 2),
    temperature: 0.6,
    maxTokens: 2000,
  });
}

export async function runAgentThreeStream(
  input: AgentThreeInput,
  onToken: (token: string) => void,
  onComplete: (output: AgentThreeOutput) => void,
  onError: (error: Error) => void
): Promise<void> {
  let fullText = '';

  await chatStream(
    { systemPrompt: SYSTEM_PROMPT, userMessage: JSON.stringify(input, null, 2), temperature: 0.6, maxTokens: 2000 },
    (token) => { fullText += token; onToken(token); },
    () => {
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Agent 3 did not return valid JSON');
        onComplete(JSON.parse(jsonMatch[0]) as AgentThreeOutput);
      } catch (e) { onError(e instanceof Error ? e : new Error(String(e))); }
    },
    onError
  );
}