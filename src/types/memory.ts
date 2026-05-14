export interface MemoryEntry {
  id: string;
  title: string;
  fullContent: string;
  feelings: string;
  category: 'painful' | 'joyful' | 'neutral' | 'core';
  season: string;
  year: number;
  createdAt: number;
  isHealed?: boolean;
  isCore?: boolean;
}

export interface MemorySnapshot {
  id: string;
  title: string;
  detailScore: number;
  remainingDetail: string;
  feelings: string;
  category: string;
  daysAgo: number;
  createdAt: number;
}

export function calculateDetailScore(daysAgo: number): number {
  if (daysAgo <= 0) return 100;
  if (daysAgo <= 0.014) return 58;
  if (daysAgo <= 0.042) return 44;
  if (daysAgo <= 0.375) return 36;
  if (daysAgo <= 1) return 33;
  if (daysAgo <= 2) return 28;
  if (daysAgo <= 6) return 25;
  if (daysAgo <= 7) return 23;
  if (daysAgo <= 14) return 21;
  if (daysAgo <= 30) return 18;
  if (daysAgo <= 60) return 15;
  if (daysAgo <= 90) return 13;
  if (daysAgo <= 180) return 10;
  if (daysAgo <= 365) return 8;
  return 5;
}

export function decayMemoryContent(fullContent: string, detailScore: number): string {
  if (detailScore >= 80) return fullContent;
  if (detailScore >= 50) return fullContent.slice(0, Math.floor(fullContent.length * 0.7)) + '...';
  if (detailScore >= 30) return fullContent.slice(0, Math.floor(fullContent.length * 0.4)) + '...';
  if (detailScore >= 15) return fullContent.slice(0, Math.floor(fullContent.length * 0.2)) + '...';
  return '只记得大概...';
}