import type { Season } from '../../types/time';
import type { Memory } from '../../types/skill';

export function selectMemoryForSeason(season: Season, memories: Memory[]): Memory | null {
  if (memories.length === 0) return null;

  const seasonMatched = memories.filter((m) => m.season === season);
  const seasonUntriggered = seasonMatched.filter((m) => m.version_triggered_count === 0);
  if (seasonUntriggered.length > 0) {
    return seasonUntriggered[Math.floor(Math.random() * seasonUntriggered.length)];
  }

  const allUntriggered = memories.filter((m) => m.version_triggered_count === 0);
  if (allUntriggered.length > 0) {
    return allUntriggered[Math.floor(Math.random() * allUntriggered.length)];
  }

  const seasonUnresolved = seasonMatched.filter(
    (m) => m.resolution_state === 'unresolved' && m.version_triggered_count > 0,
  );
  if (seasonUnresolved.length > 0) {
    return seasonUnresolved[Math.floor(Math.random() * seasonUnresolved.length)];
  }

  const allUnresolved = memories.filter(
    (m) => m.resolution_state === 'unresolved' && m.version_triggered_count > 0,
  );
  if (allUnresolved.length > 0) {
    return allUnresolved[Math.floor(Math.random() * allUnresolved.length)];
  }

  const allResolved = memories.filter((m) => m.resolution_state === 'resolved');
  if (allResolved.length > 0) {
    const seasonResolved = allResolved.filter((m) => m.season === season);
    const pool = seasonResolved.length > 0 ? seasonResolved : allResolved;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return null;
}
