export interface TrustState {
  trustLevel: number;
  trustChangeReason?: string;
  consecutiveUtilitarian: number;
}

export const INITIAL_TRUST_LEVEL = 15;
export const CONNECTION_COLD_THRESHOLD = 20;
export const CONNECTION_HIGH_THRESHOLD = 80;
export const TRUST_LOW_THRESHOLD = 35;
export const TRUST_UTILITARIAN_PENALTY = 8;
export const TRUST_EMPATHY_BONUS = 5;
export const TRUST_RECOVERY_RATE = 1;

export type ConnectionTier = '陌路' | '疏远' | '倾听' | '信任' | '共生';

export const CONNECTION_TIER_THRESHOLDS = [
  { min: 0, max: 19, tier: '陌路' as ConnectionTier },
  { min: 20, max: 39, tier: '疏远' as ConnectionTier },
  { min: 40, max: 59, tier: '倾听' as ConnectionTier },
  { min: 60, max: 79, tier: '信任' as ConnectionTier },
  { min: 80, max: 100, tier: '共生' as ConnectionTier },
];

export const CONNECTION_TIER_COLORS: Record<ConnectionTier, string> = {
  '陌路': 'gray-400',
  '疏远': 'blue-300',
  '倾听': 'yellow-400',
  '信任': 'orange-400',
  '共生': 'amber-200',
};

export const CONNECTION_TIER_DESCRIPTIONS: Record<ConnectionTier, string> = {
  '陌路': '他还感觉不到你的存在',
  '疏远': '他隐约能听到，但不确定',
  '倾听': '他开始认真听你说话',
  '信任': '他视你为内心真实的一部分',
  '共生': '你们已难分彼此',
};

export function getConnectionTier(level: number): ConnectionTier {
  const threshold = CONNECTION_TIER_THRESHOLDS.find(
    (t) => level >= t.min && level <= t.max
  );
  return threshold ? threshold.tier : '陌路';
}
