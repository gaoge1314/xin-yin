import type { DialogueInput, DialogueConstraints, EnergyLevel, DefensePosture, ResponseLength, ComplianceWillingness } from '../../types/dialogue';
import type { TriggerType } from '../../types/playerTrigger';

export function calculateDialogueConstraints(input: DialogueInput, triggerType?: TriggerType): DialogueConstraints {
  const {
    currentWillpower: willpower,
    currentImprint: imprintLevel,
    currentHerd: herdLevel,
    connectionLevel,
    isSelfProtection,
    isRepetitivePhase,
    triggeredTag,
    tagTriggerIntensity,
    speakerRole,
    dialogueType,
    recentBehaviorPattern,
    consecutiveGoodSleep,
  } = input;

  let energyLevel: EnergyLevel;
  if (willpower <= 10) {
    energyLevel = "depleted";
  } else if (willpower <= 35) {
    energyLevel = "low";
  } else if (willpower <= 65) {
    energyLevel = "moderate";
  } else {
    energyLevel = "sufficient";
  }

  let defenseModifier = 0;
  if (isSelfProtection) defenseModifier += 2;
  if (isRepetitivePhase) defenseModifier += 1;
  if (speakerRole === "player" && connectionLevel < 15) defenseModifier += 1;
  if (speakerRole === "player" && connectionLevel > 65) defenseModifier -= 1;
  if (triggeredTag !== null) defenseModifier += 1;
  if (speakerRole === "mother" && (recentBehaviorPattern.includes("催") || recentBehaviorPattern.includes("频繁"))) defenseModifier += 1;
  if (speakerRole === "sister" && connectionLevel > 40) defenseModifier -= 1;
  if (speakerRole === "player" && connectionLevel > 60) defenseModifier -= 1;
  if (consecutiveGoodSleep >= 3) defenseModifier -= 1;
  if (dialogueType === "command") defenseModifier += 1;
  if (dialogueType === "sharing") defenseModifier -= 1;

  if (triggerType === 'T02') {
    if (connectionLevel > 50) {
      defenseModifier -= 2;
    } else {
      defenseModifier += 1;
    }
  }
  if (triggerType === 'T04') {
    defenseModifier -= 2;
  }
  if (triggerType === 'T05' && triggeredTag !== null) {
    defenseModifier += 1;
  }

  let defensePosture: DefensePosture;
  if (defenseModifier <= -2) {
    defensePosture = "open";
  } else if (defenseModifier <= 0) {
    defensePosture = "normal";
  } else if (defenseModifier === 1) {
    defensePosture = "guarded";
  } else {
    defensePosture = "closed";
  }

  const lengthMatrix: Record<EnergyLevel, Record<DefensePosture, ResponseLength>> = {
    depleted: { closed: "minimal", guarded: "minimal", normal: "minimal", open: "short" },
    low: { closed: "minimal", guarded: "short", normal: "short", open: "short" },
    moderate: { closed: "short", guarded: "short", normal: "normal", open: "extended" },
    sufficient: { closed: "short", guarded: "normal", normal: "extended", open: "extended" },
  };
  const responseLength = lengthMatrix[energyLevel][defensePosture];

  let complianceScore = 50;
  complianceScore += herdLevel / 2;
  complianceScore += imprintLevel / -2;
  if (triggeredTag !== null && tagTriggerIntensity > 5) complianceScore -= 15;
  if (speakerRole === "mother" && dialogueType === "command") complianceScore -= 10;
  if (speakerRole === "sister" && dialogueType === "suggestion") complianceScore += 10;
  if (speakerRole === "player" && connectionLevel > 50) complianceScore += 10;

  let complianceWillingness: ComplianceWillingness;
  if (complianceScore < 25) {
    complianceWillingness = "resistant";
  } else if (complianceScore < 40) {
    complianceWillingness = "reluctant";
  } else if (complianceScore < 60) {
    complianceWillingness = "neutral";
  } else {
    complianceWillingness = "willing";
  }

  let triggeredReaction: string | null = null;
  if (triggeredTag !== null) {
    const reactionMap: Record<string, string> = {
      self_worth: "会不自觉回避与成就相关的话题，可能突然沉默或转移话题",
      specialness: "会习惯性地说'我没事''随便''都行'，但心里并非真的这样想",
      meaninglessness: "对任何建议都缺乏反应，可能表现出麻木和无感",
      learning: "对学习相关话题产生本能抗拒，可能突然变得烦躁",
      relationship: "对善意产生怀疑，可能反问'你为什么对我好'",
      failure: "对评价极度敏感，可能过度反应或完全回避",
      happiness: "对快乐感到不安，可能下意识否定快乐的必要性",
      hypocrisy: "可能突然沉默，感觉自己在欺骗所有人",
    };
    triggeredReaction = reactionMap[triggeredTag] ?? "对话时会有轻微的防御性反应";
    if (tagTriggerIntensity >= 8) {
      triggeredReaction += "，反应强烈";
    }
  }

  let willpowerCostMultiplier = 0;
  if (dialogueType === "command" || dialogueType === "suggestion") {
    let deviation = Math.abs(herdLevel - imprintLevel) / 100 * 3;
    if (triggeredTag !== null && tagTriggerIntensity > 5) deviation += 3;
    willpowerCostMultiplier = 0.5 + (deviation / 10);
    willpowerCostMultiplier = Math.max(0.5, Math.min(2.0, willpowerCostMultiplier));
  }

  return {
    energyLevel,
    defensePosture,
    responseLength,
    complianceWillingness,
    triggeredReaction,
    willpowerCostMultiplier,
  };
}

export function getEnergyDescription(level: EnergyLevel): string {
  const descriptions: Record<EnergyLevel, string> = {
    depleted: "几乎无能量",
    low: "低能量",
    moderate: "中等能量",
    sufficient: "充足能量",
  };
  return descriptions[level];
}
