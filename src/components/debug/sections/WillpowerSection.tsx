import { useWillpowerStore } from '../../../stores/useWillpowerStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';

export const WillpowerSection: React.FC = () => {
  const store = useWillpowerStore();

  return (
    <div>
      <SliderControl
        label="当前意志力"
        value={store.current}
        min={0}
        max={store.max}
        step={1}
        onChange={(value) => useWillpowerStore.setState({ current: value })}
      />
      <SliderControl
        label="最大意志力"
        value={store.max}
        min={20}
        max={100}
        step={1}
        onChange={(value) => useWillpowerStore.setState({ max: value })}
      />
      <SliderControl
        label="恢复速率"
        value={store.recoveryRate}
        min={0}
        max={10}
        step={0.5}
        onChange={(value) => useWillpowerStore.setState({ recoveryRate: value })}
      />
      <ToggleControl
        label="是否低迷"
        checked={store.isDepressed}
        onChange={(value) => useWillpowerStore.setState({ isDepressed: value })}
      />
      <SliderControl
        label="低迷天数"
        value={store.depressedDays}
        min={0}
        max={999}
        step={1}
        onChange={(value) => useWillpowerStore.setState({ depressedDays: value })}
      />
      <SliderControl
        label="连续好觉天数"
        value={store.consecutiveGoodSleep}
        min={0}
        max={999}
        step={1}
        onChange={(value) => useWillpowerStore.setState({ consecutiveGoodSleep: value })}
      />
      <ToggleControl
        label="是否恢复上限中"
        checked={store.isRecoveringMax}
        onChange={(value) => useWillpowerStore.setState({ isRecoveringMax: value })}
      />
    </div>
  );
};
