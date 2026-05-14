import { useState, useEffect } from 'react';
import type { SweepingAgentOutput, EvidenceRecord } from '../../types/agent';
import type { Cognition } from '../../types/cognition';

interface SweepingFlowProps {
  dust: Cognition;
  dustMeta: { counter: number; evidenceRecords: EvidenceRecord[]; sweepAttempts: number };
  onSweep: () => Promise<SweepingAgentOutput>;
  onExit: () => void;
}

export const SweepingFlow: React.FC<SweepingFlowProps> = ({
  dust,
  dustMeta,
  onSweep,
  onExit,
}) => {
  const [step, setStep] = useState<'traces' | 'sweeping' | 'result'>('traces');
  const [sweepingResult, setSweepingResult] = useState<SweepingAgentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSweep = async () => {
    setIsLoading(true);
    setError(null);
    setStep('sweeping');

    try {
      const result = await onSweep();
      setSweepingResult(result);
      setStep('result');
    } catch (e) {
      setError(e instanceof Error ? e.message : '扫尘失败');
    } finally {
      setIsLoading(false);
    }
  };

  const canTransform = dustMeta.counter >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-4 rounded-xl border border-white/10 bg-gray-900/95 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <span className="text-amber-200/80 text-lg">追溯：{dust.name}</span>
          <p className="text-white/40 text-xs mt-1">{dust.currentContent}</p>
        </div>

        {step === 'traces' && (
          <>
            <div className="mb-4">
              <span className="text-white/30 text-xs tracking-wider">行迹 — 他曾做到过的事</span>
              <div className="mt-2 space-y-2">
                {dustMeta.evidenceRecords.length === 0 ? (
                  <p className="text-white/15 text-xs text-center py-4">
                    还没有行动证据。他需要先做出不一样的事。
                  </p>
                ) : (
                  dustMeta.evidenceRecords.map((record, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded border border-white/[0.06] bg-white/[0.01]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">{record.date}</span>
                        <span className="text-amber-300/60 text-[10px]">匹配度 {record.matchScore}/10</span>
                      </div>
                      <p className="text-white/25 text-[10px] mt-0.5">{record.description}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-white/20 text-[10px]">反向证据</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        i < dustMeta.counter ? 'bg-amber-400/60' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/15 text-[10px]">{dustMeta.counter}/3</span>
              </div>
            </div>

            {!canTransform && (
              <div className="mb-4 p-3 rounded-lg border border-amber-500/15 bg-amber-500/3">
                <p className="text-amber-300/50 text-xs text-center">
                  证据不足。光靠想是不够的，他需要先做出不一样的事，看到结果，心里才会真正松动。
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSweep}
                className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                  canTransform
                    ? 'border border-amber-400/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                    : 'border border-white/[0.06] bg-white/[0.01] text-white/30 hover:text-white/50'
                }`}
              >
                {canTransform ? '以行破知 · 转化灰尘' : '追溯这段念头'}
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2 rounded-lg border border-white/[0.06] bg-white/[0.01] text-white/30 text-sm hover:text-white/50 transition-colors"
              >
                返回
              </button>
            </div>
          </>
        )}

        {step === 'sweeping' && isLoading && (
          <div className="py-8 text-center">
            <div className="animate-pulse text-amber-300/40 text-sm">
              {canTransform ? '正在连接他的过去与现在...' : '正在帮他看清这个念头...'}
            </div>
          </div>
        )}

        {step === 'result' && sweepingResult && (
          <>
            <div className="mb-4 p-4 rounded-lg border border-white/[0.06] bg-white/[0.01]">
              <span className="text-white/25 text-[10px] tracking-wider">灰尘的来历</span>
              <p className="text-white/60 text-sm leading-relaxed mt-1 whitespace-pre-wrap">
                {sweepingResult.originStory}
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg border border-amber-400/15 bg-amber-500/3">
              <span className="text-amber-300/50 text-[10px] tracking-wider">对立证据</span>
              <p className="text-white/60 text-sm leading-relaxed mt-1 whitespace-pre-wrap">
                {sweepingResult.counterEvidence}
              </p>
            </div>

            {canTransform && (
              <div className="mb-4 p-3 rounded-lg border border-amber-400/30 bg-amber-500/10 text-center">
                <p className="text-amber-200/80 text-sm">
                  ◇ 灰尘已转化
                </p>
                <p className="text-white/30 text-[10px] mt-1">
                  这个信念不再扭曲他的认知。它不是消失了，而是被看见了。被看见的东西，不再能暗中操控。
                </p>
              </div>
            )}

            <button
              onClick={onExit}
              className="w-full py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/50 text-sm hover:text-white/70 transition-colors"
            >
              {canTransform ? '心印 +10 · 连接度 +15 · 继续' : '继续'}
            </button>
          </>
        )}

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 mb-4">
            <p className="text-red-300/50 text-xs text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};