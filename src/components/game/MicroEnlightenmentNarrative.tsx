import React, { useEffect, useState } from 'react';

interface MicroEnlightenmentNarrativeProps {
  narrative: string | null;
  tagLoosened: boolean;
  onDismiss: () => void;
}

export const MicroEnlightenmentNarrative: React.FC<MicroEnlightenmentNarrativeProps> = ({
  narrative,
  tagLoosened,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (narrative) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [narrative, onDismiss]);

  if (!narrative) return null;

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-sm mx-4 text-center">
        {tagLoosened && (
          <div className="mb-3">
            <span className="text-amber-300 text-xs">✦ 认知松动 ✦</span>
          </div>
        )}
        <p className="text-amber-100/90 text-sm leading-relaxed italic">
          {narrative}
        </p>
      </div>
    </div>
  );
};
