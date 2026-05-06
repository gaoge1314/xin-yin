export type AlignmentJudgment = 'high' | 'partial' | 'low' | 'conflict';

export interface AlignmentInput {
  player_input: string;
  trigger_context: {
    trigger_id: string;
    trigger_type: string;
    scene_description: string;
  };
  protagonist_current_state: {
    意志力: number;
    心印: number;
    群则: number;
    连接度: number;
    自我保护模式: boolean;
    反扑期: boolean;
  };
  relevant_cognition_labels: Array<{
    object: string;
    current_knowing: string;
    target_knowing: string;
  }>;
  recent_behavior_pattern: string;
  scene_npc: string;
}

export interface AlignmentOutput {
  alignment_score: number;
  alignment_judgment: AlignmentJudgment;
  alignment_target: string;
  reasoning_brief: string;
  recommended_tier: string;
  protagonist_perceived_feeling: string;
}
