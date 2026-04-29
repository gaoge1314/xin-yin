import { useState } from 'react';
import type { Memory } from '../../types/skill';

interface SkillSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onSelectMemory: (type: 'good' | 'painful', memoryId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  name: '名',
  emotion: '情',
  resentment: '怨',
  fear: '惧',
  obsession: '我执',
  beauty: '光',
  special: '悟',
};

const CATEGORY_COLORS: Record<string, string> = {
  name: 'bg-amber-500/20 text-amber-300',
  emotion: 'bg-rose-500/20 text-rose-300',
  resentment: 'bg-red-500/20 text-red-300',
  fear: 'bg-purple-500/20 text-purple-300',
  obsession: 'bg-indigo-500/20 text-indigo-300',
  beauty: 'bg-emerald-500/20 text-emerald-300',
  special: 'bg-cyan-500/20 text-cyan-300',
};

export const SkillSelectionModal: React.FC<SkillSelectionModalProps> = ({
  isOpen,
  onClose,
  memories,
  onSelectMemory,
}) => {
  const [activeTab, setActiveTab] = useState<'painful' | 'good'>('painful');

  if (!isOpen) return null;

  const painfulMemories = memories.filter((m) => m.type === 'painful' && !m.isHealed);
  const goodMemories = memories.filter((m) => m.type === 'good');
  const currentMemories = activeTab === 'painful' ? painfulMemories : goodMemories;

  const handleSelect = (memory: Memory) => {
    onSelectMemory(memory.type, memory.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#0f0f15] border border-white/10 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg text-white/80 font-light tracking-wider">回忆召唤</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('painful')}
            className={`
              flex-1 py-3 text-sm tracking-wider transition-all
              ${activeTab === 'painful'
                ? 'text-red-400 border-b-2 border-red-400/50 bg-red-500/5'
                : 'text-white/40 hover:text-white/60'}
            `}
          >
            痛苦回忆 ({painfulMemories.length})
          </button>
          <button
            onClick={() => setActiveTab('good')}
            className={`
              flex-1 py-3 text-sm tracking-wider transition-all
              ${activeTab === 'good'
                ? 'text-emerald-400 border-b-2 border-emerald-400/50 bg-emerald-500/5'
                : 'text-white/40 hover:text-white/60'}
            `}
          >
            美好回忆 ({goodMemories.length})
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {currentMemories.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              {activeTab === 'painful' ? '没有可面对的痛苦回忆' : '没有美好的回忆'}
            </div>
          ) : (
            <div className="space-y-2">
              {currentMemories.map((memory) => (
                <button
                  key={memory.id}
                  onClick={() => handleSelect(memory)}
                  className="
                    w-full p-4 text-left border border-white/5 rounded
                    hover:border-white/20 hover:bg-white/5
                    transition-all duration-200 group
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          px-2 py-0.5 text-[10px] rounded
                          ${CATEGORY_COLORS[memory.category] || 'bg-white/10 text-white/50'}
                        `}>
                          {CATEGORY_LABELS[memory.category] || memory.category}
                        </span>
                        <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                          {memory.title}
                        </span>
                        {memory.isCore && (
                          <span className="text-amber-400 text-xs">⭐</span>
                        )}
                        {memory.type === 'painful' && memory.isHealed && (
                          <span className="text-emerald-400 text-xs">✓ 已治愈</span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs line-clamp-2">
                        {memory.content.slice(0, 80)}...
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-white/25 text-[10px]">
                        <span>{memory.age}岁</span>
                        <span>·</span>
                        <span>
                          {memory.season === 'spring' ? '春' :
                           memory.season === 'summer' ? '夏' :
                           memory.season === 'autumn' ? '秋' : '冬'}
                        </span>
                        {memory.dustName && (
                          <>
                            <span>·</span>
                            <span className="text-red-300/50">{memory.dustName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-white/10 text-white/30 text-xs">
          {activeTab === 'painful'
            ? '选择一个痛苦回忆尝试治愈，需要匹配当前心境关键词'
            : '选择一个美好回忆获得意志力恢复'}
        </div>
      </div>
    </div>
  );
};
