import type { TriggerType } from '../../types/playerTrigger';
import {
  WILLPOWER_CRITICAL_THRESHOLD,
  CONNECTION_T06_THRESHOLD,
  CONNECTION_T06_HIGH_THRESHOLD,
  CONNECTION_T06_VERY_HIGH_THRESHOLD,
  CONNECTION_T07_THRESHOLD,
  TAG_TRIGGER_INTENSITY_THRESHOLD,
} from '../../types/playerTrigger';
import { useWillpowerStore } from '../../stores/useWillpowerStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useTriggerStore } from '../../stores/useTriggerStore';
import { useTimeStore } from '../../stores/useTimeStore';
import { useTaskStore } from '../../stores/useTaskStore';

export interface TriggerCheckResult {
  triggerType: TriggerType;
  shouldTrigger: boolean;
  reason?: string;
}

export function checkT01(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();
  if (triggerStore.isDailyUsed('T01')) {
    return { triggerType: 'T01', shouldTrigger: false };
  }
  return { triggerType: 'T01', shouldTrigger: true, reason: 'morning_wake' };
}

export function checkT02(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();
  const willpowerState = useWillpowerStore.getState();

  if (triggerStore.isOnCooldown('T02')) {
    return { triggerType: 'T02', shouldTrigger: false };
  }

  if (willpowerState.current <= WILLPOWER_CRITICAL_THRESHOLD) {
    return { triggerType: 'T02', shouldTrigger: true, reason: 'willpower_critical' };
  }

  const bigDrop = triggerStore.checkWillpowerDrop(willpowerState.current);
  if (bigDrop) {
    return { triggerType: 'T02', shouldTrigger: true, reason: 'willpower_sudden_drop' };
  }

  triggerStore.updateLastWillpower(willpowerState.current);
  return { triggerType: 'T02', shouldTrigger: false };
}

export function checkT03(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();
  if (triggerStore.isOnCooldown('T03')) {
    return { triggerType: 'T03', shouldTrigger: false };
  }

  const conflicts = useTaskStore.getState().detectConflicts();
  if (conflicts.length > 0) {
    return { triggerType: 'T03', shouldTrigger: true, reason: 'task_conflict' };
  }

  return { triggerType: 'T03', shouldTrigger: false };
}

export function checkT04(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();

  if (triggerStore.isOnCooldown('T04')) {
    return { triggerType: 'T04', shouldTrigger: false };
  }

  if (triggerStore.pendingMemoryEnd) {
    return { triggerType: 'T04', shouldTrigger: true, reason: 'memory_flashback_end' };
  }

  return { triggerType: 'T04', shouldTrigger: false };
}

export function checkT05(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();

  if (triggerStore.isOnCooldown('T05')) {
    return { triggerType: 'T05', shouldTrigger: false };
  }

  if (triggerStore.pendingSocialTrigger) {
    return {
      triggerType: 'T05',
      shouldTrigger: true,
      reason: `social_tag_trigger:${triggerStore.pendingSocialTrigger}`,
    };
  }

  return { triggerType: 'T05', shouldTrigger: false };
}

export function checkT06(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();
  const playerState = usePlayerStore.getState();
  const connectionLevel = playerState.getConnectionLevel();

  if (triggerStore.isOnCooldown('T06')) {
    return { triggerType: 'T06', shouldTrigger: false };
  }

  if (connectionLevel > CONNECTION_T06_VERY_HIGH_THRESHOLD) {
    if (Math.random() < 0.15) {
      return { triggerType: 'T06', shouldTrigger: true, reason: 'proactive_call_very_high' };
    }
  }

  if (connectionLevel > CONNECTION_T06_HIGH_THRESHOLD) {
    if (Math.random() < 0.10) {
      return { triggerType: 'T06', shouldTrigger: true, reason: 'proactive_call_high' };
    }
  }

  if (connectionLevel > CONNECTION_T06_THRESHOLD) {
    if (Math.random() < 0.05) {
      return { triggerType: 'T06', shouldTrigger: true, reason: 'proactive_call' };
    }
  }

  return { triggerType: 'T06', shouldTrigger: false };
}

export function checkT07(): TriggerCheckResult {
  const triggerStore = useTriggerStore.getState();
  const playerState = usePlayerStore.getState();
  const connectionLevel = playerState.getConnectionLevel();
  const timeState = useTimeStore.getState();

  if (triggerStore.isDailyUsed('T07')) {
    return { triggerType: 'T07', shouldTrigger: false };
  }

  if (connectionLevel < CONNECTION_T07_THRESHOLD) {
    return { triggerType: 'T07', shouldTrigger: false };
  }

  const timeOfDay = timeState.getTimeOfDay();
  if (timeOfDay !== 'EVENING' && timeOfDay !== 'SLEEP') {
    return { triggerType: 'T07', shouldTrigger: false };
  }

  return { triggerType: 'T07', shouldTrigger: true, reason: 'night_before_sleep' };
}

export function checkNpcSocialTrigger(tagTriggerIntensity: number, triggeredTag: string | null): boolean {
  if (!triggeredTag) return false;
  return tagTriggerIntensity >= TAG_TRIGGER_INTENSITY_THRESHOLD;
}

export function checkAllTriggers(): TriggerCheckResult[] {
  return [
    checkT01(),
    checkT02(),
    checkT03(),
    checkT04(),
    checkT05(),
    checkT06(),
    checkT07(),
  ];
}

export function getActiveTriggers(): TriggerCheckResult[] {
  return checkAllTriggers().filter((r) => r.shouldTrigger);
}
