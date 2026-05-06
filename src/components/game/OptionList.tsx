import React from 'react';
import type { GameOption } from '../../types/option';
import { OPTION_SOURCE_LABELS } from '../../types/option';
import { getOptionStyle } from '../../systems/options/optionMarkers';
import { useOptionStore } from '../../stores/useOptionStore';

interface OptionListProps {
  options: GameOption[];
  onSelect: (option: GameOption) => void;
}

export const OptionList: React.FC<OptionListProps> = ({ options, onSelect }) => {
  const sweepDustUsed = useOptionStore((s) => s.sweepDustUsed);

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const style = getOptionStyle(option, sweepDustUsed);
        const label = OPTION_SOURCE_LABELS[option.source];

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className="w-full text-left px-4 py-3 rounded transition-all hover:brightness-110"
            style={{
              border: `1px solid ${style.borderColor}`,
              boxShadow: style.glow,
              animation: style.shake ? 'dust-shake 0.3s infinite' : undefined,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-200 text-sm">○ {option.text}</span>
              <span className={`text-xs ml-2 ${option.source === '灰尘' ? 'text-red-400' : option.source === '心印' ? 'text-amber-300' : option.source === '群则' ? 'text-gray-400' : 'text-gray-500'}`}>
                [{label}]
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
