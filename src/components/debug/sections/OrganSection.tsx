import { useOrganStore } from '../../../stores/useOrganStore';
import { ORGAN_NAMES } from '../../../types/organs';
import { SliderControl } from '../SliderControl';
import type { OrganHealth } from '../../../types/organs';

const ORGAN_KEYS: (keyof OrganHealth)[] = [
  'heart',
  'liver',
  'spleen',
  'lungs',
  'stomach',
];

export const OrganSection: React.FC = () => {
  const store = useOrganStore();

  return (
    <div>
      {ORGAN_KEYS.map((key) => (
        <SliderControl
          key={key}
          label={ORGAN_NAMES[key]}
          value={store[key]}
          min={0}
          max={100}
          step={1}
          onChange={(value) => useOrganStore.setState({ [key]: value })}
        />
      ))}
    </div>
  );
};
