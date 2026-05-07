import { useState } from 'react';
import { useNpcStore } from '../../stores/useNpcStore';
import type { ContactType } from '../../types/npc';

const CONTACT_TYPE_OPTIONS: { type: ContactType; label: string; desc: string }[] = [
  { type: '电话', label: '📞 电话', desc: '即时，可能不方便' },
  { type: '发消息', label: '💬 发消息', desc: '延时，压力小' },
  { type: '上门', label: '🚶 上门', desc: '面对面，情感浓度高' },
  { type: '写信', label: '✉️ 写信', desc: '表达平时说不出的话' },
];

export const ContactFlowOverlay: React.FC = () => {
  const contactRequest = useNpcStore((s) => s.contactRequest);
  const negotiateContactType = useNpcStore((s) => s.negotiateContactType);
  const confirmContactType = useNpcStore((s) => s.confirmContactType);
  const completeContact = useNpcStore((s) => s.completeContact);
  const dismissContactRequest = useNpcStore((s) => s.dismissContactRequest);

  const [playerInput, setPlayerInput] = useState('');
  const [contactSummary, setContactSummary] = useState('');

  if (!contactRequest) return null;

  const handleNegotiateSubmit = () => {
    if (!playerInput.trim()) return;
    negotiateContactType(contactRequest.npcId, playerInput.trim());
    setPlayerInput('');
  };

  const handleConfirmType = (type: ContactType) => {
    confirmContactType(type);
  };

  const handleCompleteContact = () => {
    const summary = contactSummary.trim() || '聊了几句。';
    completeContact(summary);
    setContactSummary('');
    setPlayerInput('');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-lg border border-white/10 bg-[#0d0d14]/95 p-6 space-y-4">
        <div className="text-center">
          <div className="text-white/60 text-sm mb-1">
            联系{contactRequest.npcName}
          </div>
        </div>

        {contactRequest.phase === 'refused' && (
          <div className="space-y-4">
            <div className="px-4 py-3 rounded border border-white/[0.06] bg-white/[0.02]">
              <p className="text-white/40 text-xs mb-2">他拒绝了：</p>
              <p className="text-white/60 text-sm leading-relaxed">
                "{contactRequest.refusalReason}"
              </p>
            </div>
            <button
              onClick={() => {
                dismissContactRequest();
              }}
              className="w-full px-4 py-2 rounded border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 text-xs transition-colors"
            >
              好吧
            </button>
          </div>
        )}

        {contactRequest.phase === 'accepted' && (
          <div className="space-y-4">
            {contactRequest.protagonistPreference && (
              <div className="px-4 py-3 rounded border border-white/[0.06] bg-white/[0.02]">
                <p className="text-white/40 text-xs mb-1">他想着：</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  {contactRequest.protagonistPreference}
                </p>
              </div>
            )}

            <div className="text-white/30 text-xs text-center">
              你想怎么联系？
            </div>

            <div className="space-y-1">
              <input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNegotiateSubmit()}
                placeholder="比如：打个电话吧"
                className="w-full px-3 py-2 rounded border border-white/[0.08] bg-white/[0.02] text-white/70 text-xs placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
              <button
                onClick={handleNegotiateSubmit}
                disabled={!playerInput.trim()}
                className="w-full px-4 py-2 rounded border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 text-xs transition-colors disabled:opacity-30"
              >
                告诉他
              </button>
            </div>

            <div className="border-t border-white/[0.04] pt-3">
              <div className="text-white/20 text-[10px] mb-2">或者直接选择：</div>
              <div className="grid grid-cols-2 gap-1">
                {CONTACT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleConfirmType(opt.type)}
                    className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] text-left transition-colors"
                  >
                    <div className="text-white/40 text-[10px]">{opt.label}</div>
                    <div className="text-white/15 text-[9px]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={dismissContactRequest}
              className="w-full text-white/15 text-[10px] hover:text-white/30 transition-colors"
            >
              算了，不联系了
            </button>
          </div>
        )}

        {contactRequest.phase === 'negotiating' && (
          <div className="space-y-4">
            {contactRequest.protagonistPreference && (
              <div className="px-4 py-3 rounded border border-white/[0.06] bg-white/[0.02]">
                <p className="text-white/50 text-xs leading-relaxed">
                  {contactRequest.protagonistPreference}
                </p>
              </div>
            )}

            {contactRequest.contactType ? (
              <div className="text-center">
                <div className="text-white/30 text-xs mb-3">
                  方式确定：{contactRequest.contactType}
                </div>
                <button
                  onClick={() => confirmContactType(contactRequest.contactType!)}
                  className="px-6 py-2 rounded border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 text-xs transition-colors"
                >
                  开始联系
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="text"
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNegotiateSubmit()}
                  placeholder="再试试别的说法..."
                  className="w-full px-3 py-2 rounded border border-white/[0.08] bg-white/[0.02] text-white/70 text-xs placeholder:text-white/15 focus:outline-none focus:border-white/20"
                />
                <button
                  onClick={handleNegotiateSubmit}
                  disabled={!playerInput.trim()}
                  className="w-full px-4 py-2 rounded border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 text-xs transition-colors disabled:opacity-30"
                >
                  告诉他
                </button>
              </div>
            )}

            <div className="border-t border-white/[0.04] pt-3">
              <div className="text-white/20 text-[10px] mb-2">或者直接选择：</div>
              <div className="grid grid-cols-2 gap-1">
                {CONTACT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleConfirmType(opt.type)}
                    className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] text-left transition-colors"
                  >
                    <div className="text-white/40 text-[10px]">{opt.label}</div>
                    <div className="text-white/15 text-[9px]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={dismissContactRequest}
              className="w-full text-white/15 text-[10px] hover:text-white/30 transition-colors"
            >
              算了，不联系了
            </button>
          </div>
        )}

        {contactRequest.phase === 'in_progress' && (
          <div className="space-y-4">
            <div className="px-4 py-3 rounded border border-white/[0.06] bg-white/[0.02]">
              <p className="text-white/30 text-xs mb-2">
                你正在通过{contactRequest.contactType}联系{contactRequest.npcName}……
              </p>
              <p className="text-white/20 text-[10px]">
                聊了些什么？
              </p>
            </div>

            <textarea
              value={contactSummary}
              onChange={(e) => setContactSummary(e.target.value)}
              placeholder="描述这次联系的内容（也可以直接结束）"
              rows={3}
              className="w-full px-3 py-2 rounded border border-white/[0.08] bg-white/[0.02] text-white/70 text-xs placeholder:text-white/15 focus:outline-none focus:border-white/20 resize-none"
            />

            <button
              onClick={handleCompleteContact}
              className="w-full px-4 py-2 rounded border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-white/50 text-xs transition-colors"
            >
              结束联系
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
