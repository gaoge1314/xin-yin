import { useTimeStore } from '../../../stores/useTimeStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';
import { SelectControl } from '../SelectControl';
import { SEASON_LABELS } from '../../../types/time';
import type { Season } from '../../../types/time';

const SEASON_OPTIONS = Object.entries(SEASON_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const SPEED_OPTIONS = [
  { value: '1', label: '×1' },
  { value: '2', label: '×2' },
  { value: '4', label: '×4' },
];

export const TimeSection: React.FC = () => {
  const store = useTimeStore();

  return (
    <div>
      <SliderControl
        label="年龄"
        value={store.age}
        min={27}
        max={35}
        step={1}
        onChange={(value) => useTimeStore.setState({ age: value })}
      />
      <SelectControl
        label="季节"
        value={store.season}
        options={SEASON_OPTIONS}
        onChange={(value) => useTimeStore.setState({ season: value as Season })}
      />
      <SliderControl
        label="天数"
        value={store.day}
        min={0}
        max={89}
        step={1}
        onChange={(value) => useTimeStore.setState({ day: value })}
      />
      <SliderControl
        label="小时"
        value={store.hour}
        min={0}
        max={23}
        step={1}
        onChange={(value) => useTimeStore.setState({ hour: value })}
      />
      <SelectControl
        label="时间速度"
        value={String(store.speed)}
        options={SPEED_OPTIONS}
        onChange={(value) => useTimeStore.setState({ speed: parseInt(value) as 1 | 2 | 4 })}
      />
      <ToggleControl
        label="暂停"
        checked={store.isPaused}
        onChange={(value) => useTimeStore.setState({ isPaused: value })}
      />
    </div>
  );
};
