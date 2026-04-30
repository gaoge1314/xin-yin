import type { TimeState } from './time';
import type { Cognition } from './cognition';
import type { WillpowerState } from './willpower';
import type { OrganHealth } from './organs';
import type { PlayerInfluence, ActionRecord } from './action';
import type { DreamVision, Memory } from './skill';
import type { EventRecord } from './event';
import type { PlayerTriggerState } from './playerTrigger';

export interface SaveData {
  version: string;
  timestamp: number;
  phase: GamePhase;
  state: {
    time: TimeState;
    willpower: WillpowerState;
    organs: OrganHealth;
    cognitions: Cognition[];
    xinYinLevel: number;
    playerInfluences: PlayerInfluence[];
    believedVisions: DreamVision[];
    rejectedVisions: DreamVision[];
    memories: Memory[];
    recallCooldown: number;
    dreamCooldown: number;
    triggerState: Partial<PlayerTriggerState>;
  };
  history: {
    actions: ActionRecord[];
    events: EventRecord[];
    transformations: TransformationRecord[];
  };
}

export interface TransformationRecord {
  cognitionId: string;
  timestamp: number;
  fromContent: string;
  toContent: string;
}

export type GamePhase =
  | 'menu'
  | 'prologue-rooftop'
  | 'prologue-falling'
  | 'prologue-choice'
  | 'prologue-cause'
  | 'prologue-gameover'
  | 'prologue-awakening'
  | 'core-loop'
  | 'enlightenment-falling'
  | 'enlightenment-sweeping'
  | 'enlightenment-awakening'
  | 'ending';

export const SAVE_VERSION = '1.0.0';
export const SAVE_KEY = 'xin-yin-save';
