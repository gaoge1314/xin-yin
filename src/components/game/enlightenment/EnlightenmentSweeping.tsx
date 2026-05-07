import React from 'react';
import { useEnlightenmentStore } from '../../../stores/useEnlightenmentStore';
import { useCognitionStore } from '../../../stores/useCognitionStore';
import { useSceneStore } from '../../../stores/useSceneStore';
import type { DustType } from '../../../types/cognition';

const DUST_TYPE_LABELS: Record<DustType, string> = {
  '我执': '我执',
  '名': '名',
  '情': '情',
  '怨': '怨',
  '惧': '惧',
};

export const EnlightenmentSweeping: React.FC = () => {
  const exitSweepDust = useEnlightenmentStore((s) => s.exitSweepDust);
  const selectDustCognition = useEnlightenmentStore((s) => s.selectDustCognition);
  const cognitions = useCognitionStore((s) => s.cognitions);

  const unlockedCognitions = cognitions.filter(c => c.isUnlocked);
  const unrelievedCognitions = unlockedCognitions.filter(c => !c.isRelieved && !c.isTransformed);
  const relievedCognitions = unlockedCognitions.filter(c => c.isRelieved || c.isTransformed);

  const handleClose = () => {
    exitSweepDust();
    useSceneStore.getState().setPhase('core-loop');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-w-md w-full mx-4 bg-gray-900/95 border border-gray-700 rounded-lg p-6">
        <h2 className="text-center text-amber-200 text-lg mb-6">他的心尘</h2>

        <div className="space-y-3 mb-6">
          {unrelievedCognitions.map((cognition) => (
            <button
              key={cognition.id}
              onClick={() => {
                selectDustCognition(cognition.id);
              }}
              className="w-full text-left px-4 py-3 rounded border border-red-900/50 bg-gray-800/80 hover:bg-gray-700/80 hover:border-red-700/70 transition-all"
            >
              <span className="text-red-400 mr-2">◈</span>
              <span className="text-gray-200 text-sm">"{cognition.currentContent}"</span>
              <span className="ml-2 text-xs text-gray-500">[{DUST_TYPE_LABELS[cognition.dustType]}]</span>
            </button>
          ))}

          {relievedCognitions.map((cognition) => (
            <div
              key={cognition.id}
              className="px-4 py-3 rounded border border-gray-700/30 bg-gray-800/40 opacity-50"
            >
              <span className="text-gray-500 mr-2">◇</span>
              <span className="text-gray-500 text-sm line-through">"{cognition.currentContent}"</span>
              <span className="ml-2 text-xs text-gray-600">[已释怀]</span>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-xs mb-4">点击灰尘进入回忆</p>

        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-400 hover:text-gray-200 text-sm border border-gray-700 rounded hover:border-gray-500 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
