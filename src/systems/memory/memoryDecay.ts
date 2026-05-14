import type { MemoryEntry, MemorySnapshot } from '../../types/memory';
import { calculateDetailScore, decayMemoryContent } from '../../types/memory';

export { calculateDetailScore, decayMemoryContent };

export function createMemorySnapshot(
  entry: MemoryEntry,
  totalDays: number,
  currentDay: number
): MemorySnapshot {
  const daysAgo = currentDay - entry.createdAt;
  const detailScore = calculateDetailScore(Math.max(0, daysAgo));
  const remainingDetail = decayMemoryContent(entry.fullContent, detailScore);

  return {
    id: entry.id,
    title: entry.title,
    detailScore,
    remainingDetail,
    feelings: entry.feelings,
    category: entry.category,
    daysAgo: Math.round(Math.max(0, daysAgo)),
    createdAt: entry.createdAt,
  };
}

export function getRecentMemories(
  memories: MemoryEntry[],
  currentDay: number,
  limit: number = 10
): MemorySnapshot[] {
  return memories
    .map((m) => createMemorySnapshot(m, m.createdAt, currentDay))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}