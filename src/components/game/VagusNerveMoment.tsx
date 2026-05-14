import React, { useState } from 'react';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const VagusNerveMoment: React.FC = () => {
  const vagusSkill = usePlayerStore((s) => s.vagusNerveSkill);
  const [inputText, setInputText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!vagusSkill || !vagusSkill.available) return null;

  const handleResolve = () => {
    setSubmitted(true);
  };

  const physiologicalReactions = [
    '剧烈颤抖无法继续动作',
    '胃部翻涌，恶心难忍',
    '突然泪流不止',
    '身体僵硬无法移动',
  ];
  const reaction = physiologicalReactions[Math.floor(Math.random() * physiologicalReactions.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(20,0,0,0.95) 100%)',
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: 'inset 0 0 150px rgba(80,0,0,0.6)',
      }} />
      <div className="max-w-md w-full mx-4 text-center">
        {!submitted ? (
          <>
            <p className="text-red-300 text-lg mb-4 animate-pulse">{reaction}</p>
            <p className="text-gray-400 text-sm mb-6">你必须说些什么——</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                className="flex-1 px-4 py-2 bg-gray-900/80 border border-red-900/50 rounded text-gray-200 text-sm focus:outline-none focus:border-red-600"
                placeholder="对他说话……"
                autoFocus
              />
              <button
                onClick={handleResolve}
                className="px-4 py-2 bg-red-900/50 text-red-200 rounded text-sm hover:bg-red-800/50 transition-colors"
              >
                说
              </button>
            </div>
          </>
        ) : (
          <p className="text-amber-200 text-sm">他停下了。他听见了。</p>
        )}
      </div>
    </div>
  );
};