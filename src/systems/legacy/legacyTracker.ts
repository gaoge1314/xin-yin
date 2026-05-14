import type { LegacyEntry, LegacyAssessment } from '../../types/agent';

export function createLegacyEntry(
  assessment: LegacyAssessment,
  desire: string,
  event: string,
  day: number
): LegacyEntry | null {
  if (!assessment || assessment.score <= 0) return null;

  return {
    id: `legacy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    date: `第${day}天`,
    score: assessment.score,
    type: assessment.type,
    summary: assessment.summary,
    relatedDesire: desire,
    relatedEvent: event,
  };
}

export function getLegacyStats(entries: LegacyEntry[]) {
  let spiritualCount = 0;
  let relationalCount = 0;
  let actionalCount = 0;
  let echoCount = 0;

  for (const entry of entries) {
    switch (entry.type) {
      case 'spiritual':
        spiritualCount++;
        break;
      case 'relational':
        relationalCount++;
        break;
      case 'actional':
        actionalCount++;
        break;
      case 'echo':
        echoCount++;
        break;
    }
  }

  return {
    totalScore: entries.reduce((sum, e) => sum + e.score, 0),
    spiritualCount,
    relationalCount,
    actionalCount,
    echoCount,
  };
}

export function getYearEntries(entries: LegacyEntry[], year: number): LegacyEntry[] {
  return entries.filter((e) => {
    const match = e.date.match(/第(\d+)天/);
    if (!match) return false;
    const day = parseInt(match[1]);
    const entryYear = 2025 + Math.floor(day / 365);
    return entryYear === year;
  });
}