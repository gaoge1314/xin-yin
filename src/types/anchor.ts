export type AnchorTriggerType = 'memory' | 'player_guide' | 'dream' | 'enlightenment';

export interface XinYinAnchor {
  id: string;
  name: string;
  content: string;
  triggerType: AnchorTriggerType;
  triggerKeywords: string[];
  relatedCognition?: string;
  effect: {
    willpowerRecovery: number;
    cognitionProgress?: string;
    narrative?: string;
  };
  isActivated: boolean;
  activationCount: number;
}

export interface AnchorState {
  anchors: XinYinAnchor[];
  activatedCount: number;
}
