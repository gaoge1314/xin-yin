export type NpcRole = 'FAMILY' | 'SOCIAL' | 'WORK' | 'INNER_CIRCLE' | 'FUNCTIONAL';

export type NpcKey = 'mother' | 'colleague_male' | 'colleague_female' | 'old_friend';

export interface NpcEvent {
  id: string;
  triggerDay: number;
  triggerSeason?: string;
  content: string;
  effect?: {
    trustChange?: number;
    willpowerChange?: number;
    cognitionUnlock?: string;
  };
}

export interface Npc {
  id: NpcKey;
  name: string;
  role: NpcRole;
  introductionDay: number;
  introductionSeason: string;
  introductionContent: string;
  currentCloseness: number;
  isIntroduced: boolean;
  events: NpcEvent[];
}
