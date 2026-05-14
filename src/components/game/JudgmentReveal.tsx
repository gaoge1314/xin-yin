import { useState } from 'react';
import type { AgentThreeOutput } from '../../types/agent';

interface JudgmentRevealProps {
  agentTwoNarrative: string;
  agentTwoInterpretation: string;
  agentThreeOutput: AgentThreeOutput;
  originalDesire: string;
  activeDustContent: string | null;
  dustCounter: number;
  onEnterSweeping: () => void;
  onContinueForward: () => void;
}

export const JudgmentReveal: React.FC<JudgmentRevealProps> = ({
  agentTwoNarrative,
  agentTwoInterpretation,
  agentThreeOutput,
  originalDesire,
  activeDustContent,
  dustCounter,
  onEnterSweeping,
  onContinueForward,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const matchColor =
    agentThreeOutput.matchScore >= 7
      ? 'text-amber-200'
      : agentThreeOutput.matchScore >= 4
      ? 'text-yellow-300/60'
      : 'text-red-300/60';

  const matchLabel =
    agentThreeOutput.matchScore >= 7
      ? '心印微动'
      : agentThreeOutput.matchScore >= 4
      ? '似曾相识'
      : '这不是你想要的';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-4 rounded-xl border border-white/10 bg-gray-900/95 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <span className={`text-lg font-medium ${matchColor}`}>{matchLabel}</span>
          <div className="mt-1">
            <span className="text-white/20 text-xs">匹配度 </span>
            <span className={`text-xl font-light ${matchColor}`}>
              {agentThreeOutput.matchScore}/10
            </span>
          </div>
        </div>

        <div className="border border-white/[0.06] rounded-lg bg-white/[0.01] p-4 mb-4">
          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {agentThreeOutput.innerMonologue}
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left mb-3"
        >
          <span className="text-white/20 text-[10px] hover:text-white/40 transition-colors">
            {showDetails ? '▾ 隐藏转码过程' : '▸ 查看转码过程'}
          </span>
        </button>

        {showDetails && (
          <div className="mb-4 p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] space-y-2">
            <div>
              <span className="text-white/25 text-[10px]">你的心愿</span>
              <p className="text-white/50 text-xs">{originalDesire}</p>
            </div>
            {activeDustContent && (
              <div>
                <span className="text-orange-400/40 text-[10px]">参与转码的灰尘</span>
                <p className="text-orange-300/50 text-xs">{activeDustContent}</p>
              </div>
            )}
            <div>
              <span className="text-white/25 text-[10px]">他怎么理解的</span>
              <p className="text-white/40 text-xs">{agentTwoInterpretation}</p>
            </div>
          </div>
        )}

        {agentThreeOutput.isDistorted && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/15 bg-red-500/3">
            <p className="text-red-300/50 text-xs mb-2">
              {agentThreeOutput.distortionSummary}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onEnterSweeping}
                className="flex-1 py-2 rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-300/80 text-sm hover:bg-amber-500/20 transition-colors"
              >
                进入扫尘 · 追溯这个念头
              </button>
              <button
                onClick={onContinueForward}
                className="flex-1 py-2 rounded-lg border border-white/[0.06] bg-white/[0.01] text-white/30 text-sm hover:text-white/50 hover:border-white/[0.1] transition-colors"
              >
                继续前行
              </button>
            </div>
            {dustCounter > 0 && (
              <p className="text-white/15 text-[10px] mt-2 text-center">
                反向证据 · {dustCounter}/3 · {dustCounter >= 3 ? '已积累足够，可以转化' : '还需积累更多行动证据'}
              </p>
            )}
          </div>
        )}

        {!agentThreeOutput.isDistorted && (
          <button
            onClick={onContinueForward}
            className="w-full py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/50 text-sm hover:text-white/70 hover:border-white/[0.15] transition-colors"
          >
            继续前行
          </button>
        )}

        {agentThreeOutput.legacy.score > 0 && (
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <span className="text-white/15 text-[10px]">世界回响 · 遗产{agentThreeOutput.legacy.score}/3</span>
            <p className="text-white/25 text-[10px] mt-0.5">{agentThreeOutput.legacy.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};