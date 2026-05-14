import { useState, useEffect, useRef } from 'react';
import type { SuggestedDesire, AgentOneOutput } from '../../types/agent';

interface DesireInputProps {
  agentOneOutput: AgentOneOutput;
  onDesireSubmit: (desire: string) => void;
  onSilenceTimeout: () => void;
  silenceSeconds: number;
}

export const DesireInput: React.FC<DesireInputProps> = ({
  agentOneOutput,
  onDesireSubmit,
  onSilenceTimeout,
  silenceSeconds,
}) => {
  const [selectedDesire, setSelectedDesire] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [countdown, setCountdown] = useState(silenceSeconds);
  const countdownRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          onSilenceTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleSelect = (desire: SuggestedDesire) => {
    if (showCustomInput) return;
    if (selectedDesire === desire.text) {
      onDesireSubmit(desire.text);
      return;
    }
    setSelectedDesire(desire.text);
  };

  const handleConfirm = () => {
    const finalDesire = showCustomInput ? customInput.trim() : selectedDesire;
    if (!finalDesire) return;
    onDesireSubmit(finalDesire);
  };

  const handleCustomSubmit = () => {
    if (!customInput.trim()) return;
    onDesireSubmit(customInput.trim());
  };

  const urgencyColor =
    agentOneOutput.urgency >= 8
      ? 'border-red-500/50 bg-red-500/5'
      : agentOneOutput.urgency >= 5
      ? 'border-amber-500/30 bg-amber-500/3'
      : 'border-white/10 bg-white/[0.02]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`max-w-lg w-full mx-4 rounded-xl border ${urgencyColor} bg-gray-900/95 p-6 shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/20 text-xs tracking-wider">
            {agentOneOutput.urgency >= 8 ? '· 此刻 ·' : '· 发心时刻 ·'}
          </span>
          <span className="text-white/20 text-xs">
            {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="mb-5">
          <p className="text-white/70 text-sm leading-relaxed">
            {agentOneOutput.eventDescription}
          </p>
        </div>

        <div className="mb-2">
          <span className="text-white/30 text-xs tracking-wider">你希望他...</span>
        </div>

        <div className="space-y-2 mb-5 max-h-64 overflow-y-auto">
          {(agentOneOutput.suggestedDesires || []).map((desire, idx) => {
            const isSelected = selectedDesire === desire.text;
            const isHeartSeal = desire.type === 'heartSeal';
            const isDustRisk = desire.type === 'dustRisk';

            return (
              <button
                key={idx}
                onClick={() => handleSelect(desire)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-400/50 bg-blue-500/10'
                    : isDustRisk
                    ? 'border-amber-500/15 bg-amber-500/3 hover:border-amber-500/30'
                    : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{desire.text}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isHeartSeal
                        ? 'text-amber-200/60 bg-amber-500/10'
                        : 'text-orange-400/60 bg-orange-500/10'
                    }`}
                  >
                    {isHeartSeal ? '心印方向' : '注意：有风险'}
                  </span>
                </div>
                {desire.description && (
                  <p className="text-white/30 text-[11px] mt-1">{desire.description}</p>
                )}
                {isSelected && (
                  <p className="text-blue-300/60 text-[10px] mt-1">再次点击确认选择</p>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              setShowCustomInput(!showCustomInput);
              setSelectedDesire(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              showCustomInput
                ? 'border-purple-400/40 bg-purple-500/10'
                : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]'
            }`}
          >
            <span className="text-white/50 text-sm">
              {showCustomInput ? '▾ 其他...' : '▸ 其他...'}
            </span>
            <span className="text-white/20 text-[10px] ml-2">自由输入你的心愿</span>
          </button>

          {showCustomInput && (
            <div className="mt-2 space-y-2">
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="输入你的心愿，比如：让他允许自己脆弱一次..."
                className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/70 text-sm placeholder-white/15 resize-none h-20 focus:outline-none focus:border-purple-400/40"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCustomSubmit();
                  }
                }}
              />
              <button
                onClick={handleCustomSubmit}
                disabled={!customInput.trim()}
                className={`w-full py-2 rounded-lg text-sm transition-colors ${
                  customInput.trim()
                    ? 'border border-purple-400/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                    : 'border border-white/[0.04] text-white/15 cursor-not-allowed'
                }`}
              >
                确认心愿
              </button>
            </div>
          )}
        </div>

        {selectedDesire && !showCustomInput && (
          <button
            onClick={handleConfirm}
            className="w-full py-2 rounded-lg border border-blue-400/30 bg-blue-500/10 text-blue-300 text-sm hover:bg-blue-500/20 transition-colors"
          >
            确认：{selectedDesire}
          </button>
        )}

        {!selectedDesire && !showCustomInput && (
          <p className="text-center text-white/15 text-[10px]">
            选择上方心愿或点击「其他」自由输入 · {Math.floor(countdown / 60)}分钟后将自动跳过
          </p>
        )}

        {agentOneOutput.urgency >= 8 && (
          <div className="mt-4 pt-3 border-t border-red-500/10">
            <p className="text-red-300/40 text-[10px] text-center">
              这是重要的时刻。沉默也是一种选择。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};