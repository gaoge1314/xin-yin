export type NpcRole = 'FAMILY' | 'SOCIAL' | 'WORK' | 'INNER_CIRCLE' | 'FUNCTIONAL';

export type FamilyRole = 'father' | 'mother' | 'sister' | 'niece';

export type NpcKey = 'father' | 'mother' | 'sister' | 'niece' | 'colleague_male' | 'colleague_female' | 'old_friend';

export type NpcEventFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'rare' | 'trigger';

export interface NpcEvent {
  id: string;
  triggerDay: number;
  triggerSeason?: string;
  triggerHour?: number;
  triggerDayOfWeek?: number;
  content: string;
  frequency?: NpcEventFrequency;
  minConnectionLevel?: number;
  effect?: {
    trustChange?: number;
    willpowerChange?: number;
    cognitionUnlock?: string;
    organChange?: Partial<Record<string, number>>;
  };
}

export interface Npc {
  id: NpcKey;
  name: string;
  role: NpcRole;
  familyRole?: FamilyRole;
  age?: number;
  description?: string;
  introductionDay: number;
  introductionSeason: string;
  introductionContent: string;
  currentCloseness: number;
  isIntroduced: boolean;
  events: NpcEvent[];
}
