interface ToggleControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleControl: React.FC<ToggleControlProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70 text-xs">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`
          rounded-full w-8 h-4 flex items-center transition-colors duration-200
          ${checked ? 'bg-amber-500' : 'bg-white/20'}
        `}
      >
        <div
          className={`
            w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-4' : 'translate-x-0.5'}
          `}
        />
      </button>
    </div>
  );
};
