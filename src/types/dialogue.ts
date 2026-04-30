export type EnergyLevel = "depleted" | "low" | "moderate" | "sufficient";

export type DefensePosture = "open" | "normal" | "guarded" | "closed";

export type ResponseLength = "minimal" | "short" | "normal" | "extended";

export type ComplianceWillingness = "resistant" | "reluctant" | "neutral" | "willing";

export type SpeakerRole = "player" | "mother" | "father" | "sister" | "npc";

export type DialogueType = "greeting" | "question" | "suggestion" | "command" | "criticism" | "sharing";

export interface DialogueInput {
  currentWillpower: number;
  currentImprint: number;
  currentHerd: number;
  connectionLevel: number;
  isSelfProtection: boolean;
  isRepetitivePhase: boolean;
  triggeredTag: string | null;
  tagTriggerIntensity: number;
  speakerRole: SpeakerRole;
  dialogueType: DialogueType;
  recentBehaviorPattern: string;
  consecutiveGoodSleep: number;
  triggerType?: import('./playerTrigger').TriggerType;
}

export interface DialogueConstraints {
  energyLevel: EnergyLevel;
  defensePosture: DefensePosture;
  responseLength: ResponseLength;
  complianceWillingness: ComplianceWillingness;
  triggeredReaction: string | null;
  willpowerCostMultiplier: number;
}

export interface ProtagonistResponseContext {
  speakerRole: SpeakerRole;
  speakerName: string;
  npcContent: string;
  eventId: string;
  constraints: DialogueConstraints;
}
