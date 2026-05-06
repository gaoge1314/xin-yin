import type { AlignmentInput } from './alignmentTypes';
import { useTriggerStore } from '../../stores/useTriggerStore';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useCognitionStore } from '../../stores/useCognitionStore';
import { useNpcStore } from '../../stores/useNpcStore';
import { TRIGGER_INFO } from '../../types/playerTrigger';
import { useDialogueMemoryStore } from '../dialogue/dialogueMemoryCache';

export function buildAlignmentInput(playerInput: string): AlignmentInput {
  const triggerStore = useTriggerStore.getState();
  const willpowerStore = useWillpowerStore.getState();
  const playerStore = usePlayerStore.getState();
  const cognitionStore = useCognitionStore.getState();
  const npcStore = useNpcStore.getState();

  const activeTrigger = triggerStore.activeTrigger;
  const triggerInfo = activeTrigger ? TRIGGER_INFO[activeTrigger] : null;

  const relevantCognitionLabels = cognitionStore.cognitions
    .filter((c) => c.isUnlocked && !c.isTransformed)
    .map((c) => ({
      object: c.name,
      current_knowing: c.currentContent,
      target_knowing: c.targetContent,
    }));

  const recentEntries = useDialogueMemoryStore.getState().getRecentSummaries(3);
  const recentBehaviorPattern = recentEntries.length > 0
    ? recentEntries.map((e) => `${e.speakerName}：${e.npcContent}`).join('；')
    : '无近期行为';

  const activeNpc = npcStore.activeNpcDialog;
  const sceneNpc = activeNpc ? activeNpc.npcName : '无';

  return {
    player_input: playerInput,
    trigger_context: {
      trigger_id: activeTrigger ?? 'none',
      trigger_type: triggerInfo?.label ?? '无触发',
      scene_description: triggerInfo?.description ?? '当前无特定场景',
    },
    protagonist_current_state: {
      意志力: willpowerStore.current,
      心印: playerStore.xinYinLevel,
      群则: playerStore.herdLevel,
      连接度: playerStore.trustLevel,
      自我保护模式: willpowerStore.current <= 15,
      反扑期: willpowerStore.isDepressed,
    },
    relevant_cognition_labels: relevantCognitionLabels,
    recent_behavior_pattern: recentBehaviorPattern,
    scene_npc: sceneNpc,
  };
}
