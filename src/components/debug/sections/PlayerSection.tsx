import { usePlayerStore } from '../../../stores/usePlayerStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';

export const PlayerSection: React.FC = () => {
  const store = usePlayerStore();

  return (
    <div>
      <SliderControl
        label="心印等级"
        value={store.xinYinLevel}
        min={0}
        max={100}
        step={1}
        onChange={(value) => usePlayerStore.setState({ xinYinLevel: value })}
      />
      <SliderControl
        label="信任度"
        value={store.trustLevel}
        min={0}
        max={100}
        step={1}
        onChange={(value) => usePlayerStore.setState({ trustLevel: value })}
      />
      <ToggleControl
        label="冷淡回应"
        checked={store.isColdResponse()}
        onChange={() => {}}
      />
      <SliderControl
        label="连续功利次数"
        value={store.consecutiveUtilitarian}
        min={0}
        max={10}
        step={1}
        onChange={(value) => usePlayerStore.setState({ consecutiveUtilitarian: value })}
      />
      <ToggleControl
        label="是否已顿悟"
        checked={store.hasEnlightenment}
        onChange={(value) => usePlayerStore.setState({ hasEnlightenment: value })}
      />
    </div>
  );
};
