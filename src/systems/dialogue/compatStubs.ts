export function calculateDialogueConstraints() {
  return {
    defensePosture: 'neutral' as const,
    willpowerCost: 0,
    speechStyle: 'hesitant' as const,
    triggeredReaction: null as string | null,
    emotionalState: 'neutral',
    trustDelta: 0,
  };
}

export function generateProtagonistResponse() {
  return {
    text: '...',
    innerVoice: null as string | null,
    constraints: {
      defensePosture: 'neutral' as const,
      willpowerCost: 0,
      speechStyle: 'hesitant' as const,
      triggeredReaction: null as string | null,
      emotionalState: 'neutral',
      trustDelta: 0,
    },
  };
}

export function buildDialogueInputForNpc(_npcId: string, _eventId: string, _content: string) {
  return {
    speakerRole: 'npc' as const,
    speakerName: '',
    npcContent: _content,
    eventId: _eventId,
    triggerType: 'npc_social' as const,
    triggeredTag: null as string | null,
  };
}

export function buildDialogueInputForPlayer(_input: string) {
  return {
    speakerRole: 'player' as const,
    speakerName: '',
    npcContent: _input,
    eventId: 'player_input',
    triggerType: 'player_text' as const,
    triggeredTag: null as string | null,
  };
}

export function detectTriggeredTag(_content: string): { tag: string | null; isTriggered: boolean } {
  return { tag: null, isTriggered: false };
}

export function inferEmotionalState() {
  return 'neutral';
}

export function getCurrentEmotionalState() {
  return 'neutral';
}

export const useDialogueMemoryStore = {
  getState: () => ({
    currentEmotionalState: 'neutral',
    addEntry: () => {},
  }),
};