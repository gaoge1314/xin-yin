interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-1">
      <span className="text-white/70 text-xs">{label}</span>
      <span className="text-amber-400 text-xs">{value.toFixed(2)}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-amber-500 bg-white/10"
      />
    </div>
  );
};
