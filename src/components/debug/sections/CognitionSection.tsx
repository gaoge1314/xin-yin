import { useCognitionStore } from '../../../stores/useCognitionStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';

export const CognitionSection: React.FC = () => {
  const { cognitions } = useCognitionStore();

  return (
    <div>
      {cognitions.map((cognition, index) => (
        <div key={cognition.id}>
          {index > 0 && <div className="border-t border-white/5 my-2" />}
          <div className="text-amber-400/60 text-xs mb-1">{cognition.name}</div>
          <ToggleControl
            label="已解锁"
            checked={cognition.isUnlocked}
            onChange={(value) =>
              useCognitionStore.setState({
                cognitions: cognitions.map((c) =>
                  c.id === cognition.id ? { ...c, isUnlocked: value } : c
                ),
              })
            }
          />
          <ToggleControl
            label="已转变"
            checked={cognition.isTransformed}
            onChange={(value) =>
              useCognitionStore.setState({
                cognitions: cognitions.map((c) =>
                  c.id === cognition.id ? { ...c, isTransformed: value } : c
                ),
              })
            }
          />
          <SliderControl
            label="进度"
            value={cognition.progressCount}
            min={0}
            max={3}
            step={1}
            onChange={(value) =>
              useCognitionStore.setState({
                cognitions: cognitions.map((c) =>
                  c.id === cognition.id ? { ...c, progressCount: value } : c
                ),
              })
            }
          />
          <ToggleControl
            label="有顿悟"
            checked={cognition.hasEnlightenment}
            onChange={(value) =>
              useCognitionStore.setState({
                cognitions: cognitions.map((c) =>
                  c.id === cognition.id ? { ...c, hasEnlightenment: value } : c
                ),
              })
            }
          />
        </div>
      ))}
    </div>
  );
};
