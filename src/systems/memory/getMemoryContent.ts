import type { Memory } from '../../types/skill';

export function getMemoryContent(memory: Memory): { content: string; innerVoice: string } {
  if (memory.resolution_state === 'resolved' && memory.resolved_version) {
    return memory.resolved_version;
  }

  if (memory.unresolved_version) {
    return memory.unresolved_version;
  }

  return { content: memory.content, innerVoice: memory.innerVoice };
}
