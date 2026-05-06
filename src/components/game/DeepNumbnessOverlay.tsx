import React from 'react';
import { useWillpowerStore } from '../../stores/useWillpowerStore';

export const DeepNumbnessOverlay: React.FC = () => {
  const deepNumbness = useWillpowerStore((s) => s.deepNumbness);

  if (!deepNumbness) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.5)',
        filter: 'grayscale(100%)',
      }}
    >
      <div className="text-center pointer-events-auto">
        <p className="text-gray-600 text-lg mb-2">深度麻木</p>
        <p className="text-gray-700 text-xs">他感觉不到任何东西了</p>
      </div>
    </div>
  );
};
