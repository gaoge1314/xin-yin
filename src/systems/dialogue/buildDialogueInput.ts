import type { DialogueInput, SpeakerRole, DialogueType } from '../../types/dialogue';
import type { NpcKey } from '../../types/npc';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useDialogueMemoryStore } from './dialogueMemoryCache';
import { useTriggerStore } from '../../stores/useTriggerStore';

export function npcIdToSpeakerRole(npcId: NpcKey): SpeakerRole {
  switch (npcId) {
    case 'mother':
      return 'mother';
    case 'father':
      return 'father';
    case 'sister':
      return 'sister';
    case 'xinyue':
      return 'npc';
    default:
      return 'npc';
  }
}

export function detectDialogueType(content: string): DialogueType {
  if (content.includes('？') || content.includes('吗') || content.includes('什么') || content.includes('怎么') || content.includes('为什么')) {
    return 'question';
  }
  if (content.includes('必须') || content.includes('应该') || content.includes('赶紧') || content.includes('快点') || content.endsWith('去')) {
    return 'command';
  }
  if (content.includes('可以试试') || content.includes('看看') || content.includes('建议') || content.includes('不如')) {
    return 'suggestion';
  }
  if (content.includes('都怪') || content.includes('总是') || content.includes('你就不能')) {
    return 'criticism';
  }
  if (content.includes('我也') || content.includes('其实我') || content.includes('心里') || content.includes('害怕') || content.includes('担心')) {
    return 'sharing';
  }
  return 'greeting';
}

const COGNITION_KEYWORDS: Record<string, string[]> = {
  self_worth: ['成功', '价值', '出息', '前途', '成就', '配', '优秀'],
  specialness: ['特殊', '不一样', '凭什么', '例外', '别人'],
  meaninglessness: ['意义', '有什么用', '无所谓', '都一样', '算了'],
  learning: ['学习', '读书', '考试', '知识', '考研', '研究'],
  relationship: ['朋友', '社交', '人际', '真心', '利用', '功利'],
  failure: ['失败', '没用', '废物', '不行', '做不到'],
  happiness: ['快乐', '开心', '享受', '放松', '休息'],
  hypocrisy: ['骗', '假装', '虚伪', '面具', '演'],
};

export function detectTriggeredTag(content: string): { tag: string | null; intensity: number } {
  const cognitions = useCognitionStore.getState().cognitions;
  const unlockedUntransformed = cognitions.filter(
    (c) => c.isUnlocked && !c.isTransformed
  );

  let bestTag: string | null = null;
  let bestCount = 0;

  for (const cognition of unlockedUntransformed) {
    const keywords = COGNITION_KEYWORDS[cognition.id];
    if (!keywords) continue;

    let matchCount = 0;
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        matchCount++;
      }
    }

    if (matchCount > bestCount) {
      bestCount = matchCount;
      bestTag = cognition.id;
    }
  }

  if (bestTag === null) {
    return { tag: null, intensity: 0 };
  }

  return { tag: bestTag, intensity: Math.min(bestCount * 2, 10) };
}

export function buildDialogueInputForNpc(npcId: NpcKey, _eventId: string, npcContent: string): DialogueInput {
  const willpowerStore = useWillpowerStore.getState();
  const playerStore = usePlayerStore.getState();
  const dialogueMemoryStore = useDialogueMemoryStore.getState();
  const triggeredTag = detectTriggeredTag(npcContent);
  const recentEntries = dialogueMemoryStore.getRecentSummaries(3);
  const recentBehaviorPattern = recentEntries.length > 0
    ? recentEntries.map((e) => `${e.speakerName}：${e.npcContent}`).join('；')
    : '无';

  return {
    currentWillpower: willpowerStore.current,
    currentImprint: playerStore.xinYinLevel,
    currentHerd: playerStore.herdLevel,
    connectionLevel: playerStore.getConnectionLevel(),
    isSelfProtection: willpowerStore.current <= 15,
    isRepetitivePhase: willpowerStore.isDepressed,
    triggeredTag: triggeredTag.tag,
    tagTriggerIntensity: triggeredTag.intensity,
    speakerRole: npcIdToSpeakerRole(npcId),
    dialogueType: detectDialogueType(npcContent),
    recentBehaviorPattern,
    consecutiveGoodSleep: willpowerStore.consecutiveGoodSleep,
  };
}

export function buildDialogueInputForPlayer(playerText: string): DialogueInput {
  const willpowerStore = useWillpowerStore.getState();
  const playerStore = usePlayerStore.getState();
  const dialogueMemoryStore = useDialogueMemoryStore.getState();
  const triggerStore = useTriggerStore.getState();
  const triggeredTag = detectTriggeredTag(playerText);
  const recentEntries = dialogueMemoryStore.getRecentSummaries(3);
  const recentBehaviorPattern = recentEntries.length > 0
    ? recentEntries.map((e) => `${e.speakerName}：${e.npcContent}`).join('；')
    : '无';

  return {
    currentWillpower: willpowerStore.current,
    currentImprint: playerStore.xinYinLevel,
    currentHerd: playerStore.herdLevel,
    connectionLevel: playerStore.getConnectionLevel(),
    isSelfProtection: willpowerStore.current <= 15,
    isRepetitivePhase: willpowerStore.isDepressed,
    triggeredTag: triggeredTag.tag,
    tagTriggerIntensity: triggeredTag.intensity,
    speakerRole: 'player',
    dialogueType: detectDialogueType(playerText),
    recentBehaviorPattern,
    consecutiveGoodSleep: willpowerStore.consecutiveGoodSleep,
    triggerType: triggerStore.activeTrigger ?? undefined,
  };
}
