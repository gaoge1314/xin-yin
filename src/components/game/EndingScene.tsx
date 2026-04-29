import { useEffect, useState } from 'react';
import type { EndingType } from '../../types/ending';
import { ENDING_LABELS, ENDING_DESCRIPTIONS } from '../../types/ending';
import { evaluateEnding } from '../../systems/ending/endingJudge';
import type { EndingResult } from '../../types/ending';

const ENDING_COLORS: Record<EndingType, { bg: string; text: string; accent: string }> = {
  ANNIHILATION: { bg: 'bg-gray-950', text: 'text-gray-400', accent: 'text-gray-600' },
  DOMESTICATION: { bg: 'bg-amber-950/50', text: 'text-amber-200/70', accent: 'text-amber-400/50' },
  TRANSCENDENCE: { bg: 'bg-sky-950/50', text: 'text-sky-200/80', accent: 'text-sky-400/60' },
  PREMATURE_DEATH: { bg: 'bg-black', text: 'text-white/30', accent: 'text-white/10' },
};

const ENDING_NARRATIVES: Record<EndingType, string[]> = {
  ANNIHILATION: [
    '他成功了。',
    '至少别人是这样说的。',
    '那些曾经属于他的东西——好奇心、温柔、对意义的执着——',
    '被一种更强大的力量碾碎了。',
    '他不再听见心中的声音。',
    '不是因为心印消失了，',
    '而是他选择了不再倾听。',
  ],
  DOMESTICATION: [
    '他没有找到答案，但学会了和问题共处。',
    '群则不再是一座墙，而是一间房子。',
    '有时候，深夜里，他还是会想起那个声音。',
    '那个叫他做自己的声音。',
    '他微笑着，继续明天的日子。',
    '这也许就是最大的勇气——',
    '带着伤痕活着。',
  ],
  TRANSCENDENCE: [
    '尘扫尽了。',
    '他终于看清了那些年来的挣扎——',
    '不是对抗世界，而是对抗自己。',
    '群则还在，世界没变，',
    '但他变了。',
    '心印不再是一束必须守护的光，',
    '它已经成了他本身。',
    '从此以后，他无处可去，却哪里都是家。',
  ],
  PREMATURE_DEATH: [
    '有些伤口，',
    '需要比八年更长的时间。',
  ],
};

export const EndingScene: React.FC = () => {
  const [endingResult, setEndingResult] = useState<EndingResult | null>(null);
  const [visibleLine, setVisibleLine] = useState(0);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const result = evaluateEnding();
    setEndingResult(result);
  }, []);

  useEffect(() => {
    if (!endingResult) return;
    const lines = ENDING_NARRATIVES[endingResult.type];
    if (visibleLine >= lines.length) {
      setTimeout(() => setShowStats(true), 2000);
      return;
    }
    const delay = endingResult.type === 'PREMATURE_DEATH' ? 3000 : 2000;
    const timer = setTimeout(() => setVisibleLine((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLine, endingResult]);

  if (!endingResult) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-white/20 text-sm">八年过去了...</p>
      </div>
    );
  }

  const { type } = endingResult;
  const colors = ENDING_COLORS[type];
  const lines = ENDING_NARRATIVES[type];

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${colors.bg} transition-colors duration-3000`}>
      <div className="max-w-xl w-full px-8 space-y-12">
        <div className="text-center space-y-6">
          <h1 className={`text-2xl font-light tracking-[0.3em] ${colors.accent} animate-[fadeIn_3s_ease-out]`}>
            {ENDING_LABELS[type]}
          </h1>

          <p className={`text-sm ${colors.text} opacity-60`}>
            {ENDING_DESCRIPTIONS[type]}
          </p>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {lines.slice(0, visibleLine).map((line, i) => (
            <p
              key={i}
              className={`${colors.text} text-sm tracking-wider animate-[fadeIn_2s_ease-out]`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {line}
            </p>
          ))}
        </div>

        {showStats && (
          <div className="border-t border-white/5 pt-6 space-y-3 animate-[fadeIn_2s_ease-out]">
            <h3 className="text-white/30 text-xs tracking-widest text-center mb-4">
              八年回顾
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-white/20">心印等级</div>
              <div className="text-white/40">{endingResult.criteria.xinYinLevel}</div>
              <div className="text-white/20">群则数值</div>
              <div className="text-white/40">{endingResult.criteria.socialRuleLevel.toFixed(1)}</div>
              <div className="text-white/20">连接度</div>
              <div className="text-white/40">{endingResult.criteria.connectionLevel}</div>
              <div className="text-white/20">治愈伤痛</div>
              <div className="text-white/40">{endingResult.criteria.healedPainfulCount}处</div>
              <div className="text-white/20">正面习惯</div>
              <div className="text-white/40">{endingResult.criteria.positiveHabitCount}个</div>
              <div className="text-white/20">龙场悟道</div>
              <div className="text-white/40">{endingResult.criteria.hasEnlightenment ? '已完成' : '未完成'}</div>
              <div className="text-white/20">意志力上限</div>
              <div className="text-white/40">{endingResult.criteria.willpowerMax}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
