import { usePlayerStore } from '../../../stores/usePlayerStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';

export const PlayerSection: React.FC = () => {
  const xinYinLevel = usePlayerStore((s) => s.xinYinLevel);
  const trustLevel = usePlayerStore((s) => s.trustLevel);
  const consecutiveUtilitarian = usePlayerStore((s) => s.consecutiveUtilitarian);
  const hasEnlightenment = usePlayerStore((s) => s.hasEnlightenment);

  return (
    <div>
      <SliderControl
        label="心印等级"
        value={xinYinLevel}
        min={0}
        max={100}
        step={1}
        onChange={(value) => usePlayerStore.setState({ xinYinLevel: value })}
      />
      <SliderControl
        label="信任度"
        value={trustLevel}
        min={0}
        max={100}
        step={1}
        onChange={(value) => usePlayerStore.setState({ trustLevel: value })}
      />
      <ToggleControl
        label="冷淡回应"
        checked={usePlayerStore.getState().isColdResponse()}
        onChange={() => {}}
      />
      <SliderControl
        label="连续功利次数"
        value={consecutiveUtilitarian}
        min={0}
        max={10}
        step={1}
        onChange={(value) => usePlayerStore.setState({ consecutiveUtilitarian: value })}
      />
      <ToggleControl
        label="是否已顿悟"
        checked={hasEnlightenment}
        onChange={(value) => usePlayerStore.setState({ hasEnlightenment: value })}
      />
    </div>
  );
};
