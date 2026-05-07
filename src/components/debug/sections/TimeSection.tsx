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
  const age = useTimeStore((s) => s.age);
  const season = useTimeStore((s) => s.season);
  const day = useTimeStore((s) => s.day);
  const hour = useTimeStore((s) => s.hour);
  const speed = useTimeStore((s) => s.speed);
  const isPaused = useTimeStore((s) => s.isPaused);

  return (
    <div>
      <SliderControl
        label="年龄"
        value={age}
        min={27}
        max={35}
        step={1}
        onChange={(value) => useTimeStore.setState({ age: value })}
      />
      <SelectControl
        label="季节"
        value={season}
        options={SEASON_OPTIONS}
        onChange={(value) => useTimeStore.setState({ season: value as Season })}
      />
      <SliderControl
        label="天数"
        value={day}
        min={0}
        max={89}
        step={1}
        onChange={(value) => useTimeStore.setState({ day: value })}
      />
      <SliderControl
        label="小时"
        value={hour}
        min={0}
        max={23}
        step={1}
        onChange={(value) => useTimeStore.setState({ hour: value })}
      />
      <SelectControl
        label="时间速度"
        value={String(speed)}
        options={SPEED_OPTIONS}
        onChange={(value) => useTimeStore.setState({ speed: parseInt(value) as 1 | 2 | 4 })}
      />
      <ToggleControl
        label="暂停"
        checked={isPaused}
        onChange={(value) => useTimeStore.setState({ isPaused: value })}
      />
    </div>
  );
};
