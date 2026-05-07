import { useState, useMemo } from 'react';
import { useNpcStore, NPC_CATEGORY_ORDER } from '../../stores/useNpcStore';
import type { Npc, NpcCategory, NpcKey } from '../../types/npc';

type ViewLevel = 'categories' | 'npc-list' | 'npc-detail';

const NPC_STYLES: Record<string, string> = {
  father: 'text-gray-400/70',
  mother: 'text-pink-400/70',
  sister: 'text-blue-400/70',
  niece: 'text-green-400/70',
  xinyue: 'text-purple-400/70',
  colleague_male: 'text-amber-400/70',
  colleague_female: 'text-amber-400/70',
  old_friend: 'text-cyan-400/70',
};

const CATEGORY_ICONS: Record<NpcCategory, string> = {
  '家人': '🏠',
  '旧识': '📖',
  '故交': '🎓',
  '新识': '🌱',
};

function getTimeColorClass(daysSince: number): string {
  if (daysSince <= 7) return 'text-white/50';
  if (daysSince <= 14) return 'text-yellow-300/60';
  if (daysSince <= 21) return 'text-orange-400/70';
  return 'text-red-400/80';
}

function formatDaysAgo(days: number): string {
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return '很久以前';
}

export const ContactPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewLevel, setViewLevel] = useState<ViewLevel>('categories');
  const [selectedCategory, setSelectedCategory] = useState<NpcCategory | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<NpcKey | null>(null);

  const npcs = useNpcStore((s) => s.npcs);
  const getDaysSinceLastContact = useNpcStore((s) => s.getDaysSinceLastContact);
  const suggestContact = useNpcStore((s) => s.suggestContact);

  const categoryCounts = useMemo(() => {
    const counts: Record<NpcCategory, number> = { '家人': 0, '旧识': 0, '故交': 0, '新识': 0 };
    npcs.forEach((npc) => {
      if (npc.isIntroduced && counts[npc.category] !== undefined) {
        counts[npc.category]++;
      }
    });
    return counts;
  }, [npcs]);

  const categoryNpcs = useMemo(() => {
    if (!selectedCategory) return [];
    return npcs.filter((npc) => npc.category === selectedCategory && npc.isIntroduced);
  }, [npcs, selectedCategory]);

  const selectedNpc = useMemo(() => {
    if (!selectedNpcId) return null;
    return npcs.find((npc) => npc.id === selectedNpcId) || null;
  }, [npcs, selectedNpcId]);

  const handleCategoryClick = (category: NpcCategory) => {
    setSelectedCategory(category);
    setViewLevel('npc-list');
  };

  const handleNpcClick = (npcId: NpcKey) => {
    setSelectedNpcId(npcId);
    setViewLevel('npc-detail');
  };

  const handleBack = () => {
    if (viewLevel === 'npc-detail') {
      setViewLevel('npc-list');
      setSelectedNpcId(null);
    } else if (viewLevel === 'npc-list') {
      setViewLevel('categories');
      setSelectedCategory(null);
    }
  };

  const handleSuggestContact = (npcId: NpcKey) => {
    suggestContact(npcId);
    setIsOpen(false);
    setViewLevel('categories');
    setSelectedCategory(null);
    setSelectedNpcId(null);
  };

  if (!isOpen) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-3 py-2 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-colors text-left"
        >
          <span className="text-white/40 text-xs tracking-wider">♡ 牵挂</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
        <span className="text-white/40 text-xs tracking-wider">牵挂的人</span>
        <button
          onClick={() => {
            setIsOpen(false);
            setViewLevel('categories');
            setSelectedCategory(null);
            setSelectedNpcId(null);
          }}
          className="text-white/20 text-[10px] hover:text-white/40 transition-colors"
        >
          关闭
        </button>
      </div>

      {viewLevel === 'categories' && (
        <div className="space-y-1">
          {NPC_CATEGORY_ORDER.map((category) => {
            const count = categoryCounts[category];
            const isLocked = category === '新识' && count === 0;
            return (
              <button
                key={category}
                onClick={() => !isLocked && handleCategoryClick(category)}
                disabled={isLocked}
                className={`w-full px-3 py-2 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-colors text-left flex items-center justify-between ${
                  isLocked ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-white/50 text-xs flex items-center gap-2">
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span>{category}</span>
                </span>
                <span className="text-white/20 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {viewLevel === 'npc-list' && selectedCategory && (
        <div className="space-y-1">
          <button
            onClick={handleBack}
            className="text-white/20 text-[10px] hover:text-white/40 transition-colors mb-2"
          >
            ▸ {selectedCategory} · 返回
          </button>

          {categoryNpcs.length === 0 ? (
            <div className="text-white/15 text-[10px] text-center py-3">
              暂无联系人
            </div>
          ) : (
            categoryNpcs.map((npc) => {
              const daysSince = getDaysSinceLastContact(npc.id);
              const timeColor = getTimeColorClass(daysSince);
              const lastSummary = npc.lastContact?.summary || '尚未联系';

              return (
                <button
                  key={npc.id}
                  onClick={() => handleNpcClick(npc.id)}
                  className="w-full px-3 py-2 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-medium ${NPC_STYLES[npc.id] || 'text-white/50'}`}>
                      {npc.name}
                      {!npc.isContactable && (
                        <span className="text-white/15 ml-1">🔒</span>
                      )}
                    </span>
                    <span className={`${timeColor} text-[10px]`}>
                      {npc.lastContact ? formatDaysAgo(daysSince) : '—'}
                    </span>
                  </div>
                  <p className="text-white/25 text-[10px] truncate">
                    {lastSummary}
                  </p>
                </button>
              );
            })
          )}
        </div>
      )}

      {viewLevel === 'npc-detail' && selectedNpc && (
        <div className="space-y-3">
          <button
            onClick={handleBack}
            className="text-white/20 text-[10px] hover:text-white/40 transition-colors"
          >
            ▸ 返回
          </button>

          <div className="px-3 py-2 rounded border border-white/[0.06] bg-white/[0.01] space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${NPC_STYLES[selectedNpc.id] || 'text-white/50'}`}>
                {selectedNpc.name}
              </span>
              <span className="text-white/20 text-[10px]">
                好感 {selectedNpc.affection}
              </span>
            </div>

            {selectedNpc.lastContact ? (
              <>
                <div className="space-y-0.5">
                  <div className="text-white/30 text-[10px]">
                    上次联系：{selectedNpc.lastContact.gameDate}
                  </div>
                  <div className="text-white/30 text-[10px]">
                    距今：{formatDaysAgo(getDaysSinceLastContact(selectedNpc.id))}
                  </div>
                  <div className="text-white/30 text-[10px]">
                    方式：{selectedNpc.lastContact.initiator === '主角' ? '你主动' : '对方主动'}·{selectedNpc.lastContact.type}
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-2">
                  <p className="text-white/35 text-[10px] leading-relaxed">
                    {selectedNpc.lastContact.summary}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-white/15 text-[10px]">
                尚未联系过
              </div>
            )}

            {selectedNpc.contactHistory.length > 0 && (
              <div className="border-t border-white/[0.04] pt-2">
                <div className="text-white/25 text-[10px] mb-1">联系记录</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedNpc.contactHistory.slice(0, 10).map((record, idx) => (
                    <div key={idx} className="text-white/20 text-[9px] leading-tight">
                      · {record.gameDate} - {record.type} - {record.summary}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleSuggestContact(selectedNpc.id)}
            disabled={!selectedNpc.isContactable}
            className={`w-full px-3 py-2 rounded border text-xs transition-colors ${
              selectedNpc.isContactable
                ? 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 hover:text-white/70'
                : 'border-white/[0.04] bg-transparent text-white/15 cursor-not-allowed'
            }`}
          >
            {selectedNpc.isContactable
              ? `建议主角联系${selectedNpc.name}`
              : selectedNpc.contactUnlockCondition || '暂时无法联系'}
          </button>
        </div>
      )}
    </div>
  );
};
