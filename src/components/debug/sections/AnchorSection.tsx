import { useAnchorStore } from '../../../stores/useAnchorStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';

export const AnchorSection: React.FC = () => {
  const anchors = useAnchorStore((s) => s.anchors);

  return (
    <div>
      {anchors.map((anchor, index) => (
        <div key={anchor.id}>
          {index > 0 && <div className="border-t border-white/5 my-2" />}
          <div className="text-amber-400/60 text-xs mb-1">{anchor.name}</div>
          <ToggleControl
            label="已激活"
            checked={anchor.isActivated}
            onChange={(value) =>
              useAnchorStore.setState({
                anchors: anchors.map((a) =>
                  a.id === anchor.id ? { ...a, isActivated: value } : a
                ),
              })
            }
          />
          <SliderControl
            label="激活次数"
            value={anchor.activationCount}
            min={0}
            max={3}
            step={1}
            onChange={(value) =>
              useAnchorStore.setState({
                anchors: anchors.map((a) =>
                  a.id === anchor.id ? { ...a, activationCount: value } : a
                ),
              })
            }
          />
        </div>
      ))}
    </div>
  );
};
