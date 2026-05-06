import { useState, useEffect, useCallback, useRef } from 'react';

interface RooftopSceneProps {
  onHoldOn: () => void;
  onLetGo: () => void;
}

const MONOLOGUE = [
  { text: '2025年3月。', delay: 1800, fragile: false },
  { text: '考研出分了。', delay: 1800, fragile: false },
  { text: '没有奇迹。', delay: 2200, fragile: false },
  { text: '出租屋的窗户开着……', delay: 2200, fragile: false },
  { text: '风很冷。', delay: 2600, fragile: true },
  { text: '也许……', delay: 2600, fragile: true },
  { text: '也许什么？', delay: 1800, fragile: false },
  { text: '算了吧。', delay: 2200, fragile: false },
];

const HOLD_ON_KEYWORDS = [
  '别跳', '等等', '不要', '回来', '停', '等一下', '不要跳', '别走',
  '住手', '活下去', '活着', '别放弃', '坚持', '不要放弃', '回来吧',
  '别做傻事', '别这样', '我想你', '需要你', '在乎你', '爱你',
  '留下来', '别离开', '求你', '不可以', '别去',
];

const NEGATIVE_KEYWORDS = [
  '跳吧', '去吧', '走吧', '结束吧', '无所谓', '随便',
  '放手', '放弃吧', '解脱', '去死', '不如死',
];

const TOTAL_SECONDS = 30;

function createHeartbeat() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const beat = (time: number, freq: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
    };
    beat(now, 80, 0.1);
    beat(now + 0.15, 55, 0.06);
    setTimeout(() => ctx.close(), 800);
  } catch {}
}

export const RooftopScene: React.FC<RooftopSceneProps> = ({ onHoldOn, onLetGo }) => {
  const [phase, setPhase] = useState<'monologue' | 'prompt' | 'countdown'>('monologue');
  const [lineIdx, setLineIdx] = useState(0);
  const [shown, setShown] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [text, setText] = useState('');
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<'holdon' | 'letgo' | null>(null);
  const doneRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== 'monologue') return;
    if (lineIdx >= MONOLOGUE.length) {
      const t = setTimeout(() => setPhase('prompt'), 600);
      return () => clearTimeout(t);
    }
    const delay = lineIdx === 0 ? 800 : MONOLOGUE[lineIdx - 1].delay;
    const t = setTimeout(() => {
      setShown(prev => [...prev, lineIdx]);
      setLineIdx(prev => prev + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, lineIdx]);

  useEffect(() => {
    if (phase !== 'prompt') return;
    const t = setTimeout(() => setPhase('countdown'), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'countdown' || locked) return;
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, locked]);

  useEffect(() => {
    if (seconds === 0 && phase === 'countdown' && !doneRef.current) {
      doneRef.current = true;
      setLocked(true);
      setResult('letgo');
      setTimeout(onLetGo, 1500);
    }
  }, [seconds, phase, onLetGo]);

  useEffect(() => {
    if (phase !== 'countdown' || locked || seconds > 3 || seconds <= 0) return;
    createHeartbeat();
  }, [seconds, phase, locked]);

  const judge = useCallback((input: string): 'holdon' | 'letgo' => {
    const s = input.trim();
    if (!s) return 'letgo';
    for (const kw of HOLD_ON_KEYWORDS) {
      if (s.includes(kw)) return 'holdon';
    }
    for (const kw of NEGATIVE_KEYWORDS) {
      if (s.includes(kw)) return 'letgo';
    }
    return 'holdon';
  }, []);

  const handleSubmit = useCallback(() => {
    if (locked || doneRef.current || !text.trim()) return;
    doneRef.current = true;
    setLocked(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const r = judge(text);
    setResult(r);
    setTimeout(() => {
      if (r === 'holdon') onHoldOn();
      else onLetGo();
    }, 1500);
  }, [text, locked, judge, onHoldOn, onLetGo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const timerColor = () => {
    if (seconds > 10) return 'rgba(255,255,255,0.35)';
    if (seconds > 3) {
      const t = (10 - seconds) / 7;
      const g = Math.round(255 * (1 - t * 0.55));
      return `rgba(255,${g},${g},0.45)`;
    }
    return 'rgba(255,120,120,0.55)';
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#1a1a3a]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1a1a2a] to-transparent opacity-60" />

      <div className="absolute top-[10%] right-[15%] w-[30%] h-[40%] border border-white/[0.06] rounded-sm bg-gradient-to-b from-[#0d0d25] to-[#151530]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
      </div>

      <div className="absolute top-[15%] left-[20%] flex flex-col items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-yellow-300/20"
            style={{ marginLeft: `${(i - 2) * 30}px` }}
          />
        ))}
      </div>

      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-px h-[30%] bg-gradient-to-t from-transparent via-[#333] to-transparent" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }}
      />

      {phase === 'monologue' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          {shown.map(i => (
            <div
              key={i}
              className={`text-lg tracking-wider opacity-0 animate-[float-up_3s_ease-out_forwards] ${
                MONOLOGUE[i].fragile
                  ? 'text-voice-fragile font-extralight'
                  : 'text-voice-mock font-light'
              }`}
            >
              {MONOLOGUE[i].text}
            </div>
          ))}
        </div>
      )}

      {phase === 'prompt' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-[fadeIn_1s_ease-out]">
          <p className="text-white/30 text-sm tracking-[0.3em] animate-pulse">
            你还有时间说些什么
          </p>
        </div>
      )}

      {phase === 'countdown' && (
        <>
          <div className="absolute bottom-6 left-6 pointer-events-none">
            <span
              className="font-serif text-5xl font-light tabular-nums transition-colors duration-1000"
              style={{ color: timerColor() }}
            >
              {seconds}
            </span>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-md animate-[fadeIn_0.5s_ease-out]">
            <div className="flex gap-2 items-end">
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={locked}
                placeholder="说些什么……"
                className="flex-1 bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white/70 text-sm placeholder:text-white/20 focus:outline-none focus:border-calm/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              />
              <button
                onClick={handleSubmit}
                disabled={locked || !text.trim()}
                className="px-4 py-2 border border-white/10 rounded text-sm text-white/30 hover:border-calm/30 hover:text-calm/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                传达
              </button>
            </div>
          </div>
        </>
      )}

      {result && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center animate-[fadeIn_1.5s_ease-out_forwards]">
          <p className={`text-lg tracking-widest ${result === 'holdon' ? 'text-calm/60' : 'text-white/30'}`}>
            {result === 'holdon' ? '他停下了' : '风继续吹'}
          </p>
        </div>
      )}
    </div>
  );
};
