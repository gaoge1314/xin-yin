export type EmotionType = 'anger' | 'guilt' | 'shame' | 'numbness' | 'self_doubt';

export interface EmotionTrigger {
  id: string;
  triggerKeywords: string[];
  emotionType: EmotionType;
  emotionReaction: string;
  relatedMemory: string;
  willpowerEffect: number;
  organEffect?: {
    organ: 'heart' | 'liver' | 'spleen' | 'lungs' | 'stomach';
    change: number;
  };
}

export interface TriggeredEmotion {
  triggerId: string;
  timestamp: number;
  intensity: number;
}
