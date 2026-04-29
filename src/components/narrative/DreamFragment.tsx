import { useDayPhaseStore } from '../../stores/useDayPhaseStore';
import { useGameStore } from '../../stores/useGameStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useTimeStore } from '../../stores/useTimeStore';

const DREAM_FRAGMENTS = [
  '模糊的面孔在水中扭曲...',
  '一片空旷的走廊，尽头有微光...',
  '回声，却听不清说了什么...',
  '手心里有一缕温暖，醒来时已经不在了...',
  '下坠，下坠，然后停住——像被什么托住了。',
  '有人在说话，声音很熟悉但想不起是谁...',
  '光从缝隙中透进来，只是一瞬间...',
];

export const DreamFragment: React.FC = () => {
  const believedVisions = useGameStore((s) => s.believedVisions);
  const rejectedVisions = useGameStore((s) => s.rejectedVisions);
  const addNarrativeLog = useSceneStore((s) => s.addNarrativeLog);

  const hasVisions = believedVisions.length > 0 || rejectedVisions.length > 0;

  const fragment = hasVisions
    ? believedVisions.length > 0
      ? believedVisions[believedVisions.length - 1].content
      : rejectedVisions[rejectedVisions.length - 1].content
    : DREAM_FRAGMENTS[Math.floor(Math.random() * DREAM_FRAGMENTS.length)];

  const handleDismiss = () => {
    addNarrativeLog('梦终究散去了...');
    useDayPhaseStore.getState().markDreamFragmentShown();
    useTimeStore.getState().resume('dream-fragment');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/95 animate-[fadeIn_2s_ease-out]">
      <div className="max-w-md w-full p-8 text-center space-y-8">
        <div className="text-white/15 text-xs tracking-[0.3em]">
          梦
        </div>

        <div className="space-y-4">
          <p className="text-white/30 text-sm italic tracking-wider animate-[float-up_3s_ease-out_forwards]">
            {fragment}
          </p>

          {hasVisions && believedVisions.length > 0 && (
            <p className="text-calm/30 text-xs tracking-wider">
              —他相信了这个梦—
            </p>
          )}
          {hasVisions && rejectedVisions.length > 0 && believedVisions.length === 0 && (
            <p className="text-white/20 text-xs tracking-wider">
              —他不信这个梦—
            </p>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="
            px-4 py-2 border border-white/5 rounded text-white/20 text-sm
            hover:border-white/10 hover:text-white/30
            transition-all duration-300
            animate-pulse
          "
        >
          醒来
        </button>
      </div>
    </div>
  );
};
