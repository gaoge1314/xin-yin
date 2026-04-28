interface SelectControlProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const SelectControl: React.FC<SelectControlProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70 text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 text-amber-400 text-xs border border-white/10 rounded px-1 py-0.5"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
