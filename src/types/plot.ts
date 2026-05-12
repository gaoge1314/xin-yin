export interface PlotChapter {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  keyEvents: PlotEvent[];
  themeTags: string[];
  xueGuanConcept: string;
  playerGrowth: string;
}

export interface PlotEvent {
  id: string;
  name: string;
  triggerPhase: number;
  description: string;
  innerMeaning: string;
  choices: PlotChoice[];
}

export interface PlotChoice {
  text: string;
  xinYinEffect: number;
  herdEffect: number;
  willpowerCost: number;
  unlocksCognition?: string;
  narrative: string;
}

export interface PlotArc {
  id: string;
  title: string;
  subtitle: string;
  chapters: PlotChapter[];
  endings: PlotEnding[];
}

export interface PlotEnding {
  id: string;
  name: string;
  condition: string;
  description: string;
  xinYinRequired: number;
  herdRequired: number;
}