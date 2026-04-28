import { useState, useCallback } from 'react';

interface CollapsiblePanelProps {
  title: string;
  side: 'left' | 'right';
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  side,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`
        flex transition-all duration-300 ease-in-out
        ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}
      `}
    >
      <button
        onClick={toggle}
        className={`
          flex-shrink-0 w-6 flex items-center justify-center
          border-white/5 hover:bg-white/[0.02] transition-all duration-300
          ${side === 'left' ? 'border-r' : 'border-l'}
          ${side === 'left' ? 'hover:border-r-calm/20' : 'hover:border-l-calm/20'}
        `}
        title={isOpen ? `收起${title}` : `展开${title}`}
      >
        <span className="text-white/20 text-[10px] writing-vertical select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          {isOpen ? (side === 'left' ? '◀' : '▶') : title}
        </span>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <div className="w-72 p-4 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
