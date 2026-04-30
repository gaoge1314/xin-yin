import type { DialogueConstraints, ProtagonistResponseContext, EnergyLevel, DefensePosture, SpeakerRole, ResponseLength } from '../../types/dialogue';
import { getResponseTemplates, type ResponseTemplate } from '../../data/dialogue/protagonistResponses';
import { useDialogueMemoryStore, type EmotionalState, type AttitudeToward } from './dialogueMemoryCache';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';

export interface ProtagonistResponse {
  text: string;
  innerVoice: string | null;
  constraints: DialogueConstraints;
  willpowerCost: number;
}

const RESPONSE_LENGTH_ORDER: Record<ResponseLength, number> = {
  minimal: 0,
  short: 1,
  normal: 2,
  extended: 3,
};

export function matchTemplate(template: ResponseTemplate, constraints: DialogueConstraints, speakerRole: SpeakerRole, triggeredTag: string | null): number {
  let score = 0;

  if (template.triggeredTag) {
    if (triggeredTag && template.triggeredTag === triggeredTag) {
      score += 100;
    }
  }

  if (template.speakerRole) {
    if (template.speakerRole === speakerRole) {
      score += 50;
    }
  }

  if (template.energyLevel) {
    if (template.energyLevel === constraints.energyLevel) {
      score += 30;
    } else {
      score -= 20;
    }
  }

  if (template.defensePosture) {
    if (template.defensePosture === constraints.defensePosture) {
      score += 30;
    } else {
      score -= 20;
    }
  }

  if (template.minLength) {
    if (RESPONSE_LENGTH_ORDER[constraints.responseLength] >= RESPONSE_LENGTH_ORDER[template.minLength]) {
      score += 10;
    } else {
      score -= 30;
    }
  }

  return score;
}

export function selectTemplate(constraints: DialogueConstraints, speakerRole: SpeakerRole, triggeredTag: string | null): ResponseTemplate {
  const templates = getResponseTemplates();
  const scored = templates.map((t) => ({ template: t, score: matchTemplate(t, constraints, speakerRole, triggeredTag) }));
  const matching = scored.filter((s) => s.score > 0);

  if (matching.length === 0) {
    return { text: "……", innerVoice: "（不知道该说什么。）" };
  }

  const maxScore = Math.max(...matching.map((s) => s.score));
  const topGroup = matching.filter((s) => s.score === maxScore);
  const chosen = topGroup[Math.floor(Math.random() * topGroup.length)];
  return chosen.template;
}

export function calculateWillpowerCost(constraints: DialogueConstraints): number {
  if (constraints.willpowerCostMultiplier === 0) return 0;
  const base = 3;
  return Math.max(0, Math.ceil(base * constraints.willpowerCostMultiplier));
}

export function inferEmotionalState(constraints: DialogueConstraints): EmotionalState {
  const { energyLevel, defensePosture } = constraints;

  if (energyLevel === 'depleted') {
    if (defensePosture === 'closed') return '麻木';
    if (defensePosture === 'guarded') return '防御';
    return '脆弱';
  }

  if (energyLevel === 'low') {
    if (defensePosture === 'closed') return '防御';
    if (defensePosture === 'guarded') return '烦躁';
    if (defensePosture === 'normal') return '低落';
    return '焦虑';
  }

  if (energyLevel === 'moderate') {
    if (defensePosture === 'closed') return '防御';
    if (defensePosture === 'guarded') return '烦躁';
    if (defensePosture === 'normal') return '平静';
    return '略微放松';
  }

  if (defensePosture === 'closed') return '防御';
  if (defensePosture === 'guarded') return '平静';
  if (defensePosture === 'normal') return '平静';
  return '略微放松';
}

const COMPLIANCE_ORDER: Record<string, number> = {
  resistant: 0,
  reluctant: 1,
  neutral: 2,
  willing: 3,
};

export function inferAttitudeToward(constraints: DialogueConstraints, speakerRole: SpeakerRole): AttitudeToward {
  const { defensePosture, complianceWillingness } = constraints;

  if (defensePosture === 'closed') return '回避';
  if (defensePosture === 'guarded') return '抗拒';

  if (defensePosture === 'normal') {
    if (COMPLIANCE_ORDER[complianceWillingness] >= COMPLIANCE_ORDER['neutral']) return '中立';
    return '抗拒';
  }

  if (complianceWillingness === 'willing') return '信任';
  return '中立';
}

export function generateProtagonistResponse(context: ProtagonistResponseContext, triggeredTag: string | null): ProtagonistResponse {
  const template = selectTemplate(context.constraints, context.speakerRole, triggeredTag);
  const cost = calculateWillpowerCost(context.constraints);

  if (cost > 0) {
    useWillpowerStore.getState().consume(cost);
  }

  useDialogueMemoryStore.getState().updateEmotionalState(inferEmotionalState(context.constraints));
  useDialogueMemoryStore.getState().updateAttitudeToward(context.speakerRole, inferAttitudeToward(context.constraints, context.speakerRole));

  return {
    text: template.text,
    innerVoice: template.innerVoice ?? null,
    constraints: context.constraints,
    willpowerCost: cost,
  };
}
