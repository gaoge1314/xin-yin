import { useState } from 'react';
import type { WorldEvent } from '../../types/event';

interface WorldEventModalProps {
  event: WorldEvent;
  onChoiceSelected: (choiceId: string) => void;
  onObserve: () => void;
}

export const WorldEventModal: React.FC<WorldEventModalProps> = ({
  event,
  onChoiceSelected,
  onObserve,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    onChoiceSelected(choiceId);
  };

  const typeLabel = event.type === 'macro' ? '世界变动' : '个人遭遇';
  const typeStyle = event.type === 'macro'
    ? 'border-amber-500/30 text-amber-400/70'
    : 'border-white/20 text-white/50';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/90 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-lg w-full p-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-0.5 border rounded ${typeStyle}`}>
            {typeLabel}
          </span>
          {event.category && (
            <span className="text-white/20 text-xs">
              {event.category === 'economic' ? '经济' :
               event.category === 'social' ? '社会' :
               event.category === 'personal' ? '个人' : '家庭'}
            </span>
          )}
        </div>

        <h2 className="text-white/80 text-lg font-light tracking-wider">
          {event.content}
        </h2>

        {event.choices && event.choices.length > 0 && (
          <div className="space-y-3">
            {event.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                disabled={selectedChoice !== null}
                className={`
                  w-full text-left px-4 py-3 border rounded
                  transition-all duration-300
                  ${selectedChoice === choice.id
                    ? 'border-calm/50 bg-calm/10 text-calm/80'
                    : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className="text-sm">{choice.text}</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onObserve}
          disabled={selectedChoice !== null}
          className="
            w-full text-center text-white/30 text-sm
            hover:text-white/50
            transition-colors duration-300
            disabled:opacity-30
          "
        >
          旁观 — 让他自己决定
        </button>
      </div>
    </div>
  );
};
