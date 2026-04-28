import { usePersonalityStore } from '../../../stores/usePersonalityStore';
import { PERSONALITY_LABELS } from '../../../types/personality';
import { SliderControl } from '../SliderControl';
import type { Personality } from '../../../types/personality';

const PERSONALITY_KEYS: (keyof Personality)[] = [
  'cognitionActionSensitivity',
  'selfAwareness',
  'retreatInertia',
  'xinYinAwakenDifficulty',
  'meaningObsession',
];

export const PersonalitySection: React.FC = () => {
  const store = usePersonalityStore();

  return (
    <div>
      {PERSONALITY_KEYS.map((key) => (
        <SliderControl
          key={key}
          label={PERSONALITY_LABELS[key]}
          value={store[key]}
          min={0.1}
          max={1}
          step={0.01}
          onChange={(value) => usePersonalityStore.setState({ [key]: value })}
        />
      ))}
    </div>
  );
};
