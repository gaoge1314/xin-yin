import { useSocialRuleStore } from '../../../stores/useSocialRuleStore';
import { SliderControl } from '../SliderControl';
import { ToggleControl } from '../ToggleControl';

export const SocialRuleSection: React.FC = () => {
  const rules = useSocialRuleStore((s) => s.rules);

  return (
    <div>
      {rules.map((rule, index) => (
        <div key={rule.id}>
          {index > 0 && <div className="border-t border-white/5 my-2" />}
          <div className="text-amber-400/60 text-xs mb-1">{rule.name}</div>
          <SliderControl
            label="强度"
            value={rule.intensity}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) =>
              useSocialRuleStore.setState({
                rules: rules.map((r) =>
                  r.id === rule.id ? { ...r, intensity: value } : r
                ),
              })
            }
          />
          <ToggleControl
            label="激活"
            checked={rule.isActive}
            onChange={(value) =>
              useSocialRuleStore.setState({
                rules: rules.map((r) =>
                  r.id === rule.id ? { ...r, isActive: value } : r
                ),
              })
            }
          />
        </div>
      ))}
    </div>
  );
};
