export type NpcRole = 'FAMILY' | 'SOCIAL' | 'WORK' | 'INNER_CIRCLE' | 'FUNCTIONAL';

export type FamilyRole = 'father' | 'mother' | 'sister' | 'niece';

export type NpcKey = 'father' | 'mother' | 'sister' | 'niece' | 'xinyue' | 'colleague_male' | 'colleague_female' | 'old_friend';

export type NpcCategory = '家人' | '旧识' | '故交' | '新识';

export type ContactType = '电话' | '发消息' | '上门' | '写信';

export type ContactInitiator = '主角' | 'NPC' | '系统';

export type NpcEventFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'rare' | 'trigger';

export interface ContactRecord {
  gameDay: number;
  gameDate: string;
  type: ContactType;
  initiator: ContactInitiator;
  summary: string;
  keywords?: string[];
}

export interface NormalFrequency {
  type: string;
  intervalDays: string;
  description: string;
}

export interface AffectionThresholds {
  打开心扉?: number;
  求助?: number;
  [key: string]: number | undefined;
}

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
  category: NpcCategory;
  familyRole?: FamilyRole;
  age?: number;
  description?: string;
  introductionDay: number;
  introductionSeason: string;
  introductionContent: string;
  currentCloseness: number;
  affection: number;
  isIntroduced: boolean;
  isContactable: boolean;
  contactUnlockCondition?: string;
  lastContact: ContactRecord | null;
  contactHistory: ContactRecord[];
  normalFrequency: NormalFrequency;
  currentStatus: string;
  hiddenEvents: string[];
  affectionThresholds: AffectionThresholds;
  events: NpcEvent[];
}
