import { useSceneStore } from '../../stores/useSceneStore';
import { useGameStore } from '../../stores/useGameStore';

export const MainMenu: React.FC = () => {
  const setPhase = useSceneStore((s) => s.setPhase);
  const hasSave = useGameStore((s) => s.hasSave);
  const loadGame = useGameStore((s) => s.loadGame);

  const handleNewGame = () => {
    setPhase('prologue-rooftop');
  };

  const handleContinue = () => {
    if (loadGame()) {
      setPhase('core-loop');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0f]">
      <div className="mb-16 text-center">
        <h1 className="text-5xl text-calm/60 font-extralight tracking-[0.5em] mb-4">
          心印回响
        </h1>
        <div
          className="w-2 h-2 rounded-full bg-calm/20 mx-auto"
          style={{
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <button
          className="
            px-8 py-3 border border-white/15 text-white/50 text-sm tracking-widest
            hover:border-calm/40 hover:text-calm/80
            transition-all duration-500 rounded-sm
            bg-transparent
          "
          onClick={handleNewGame}
        >
          新的开始
        </button>

        {hasSave() && (
          <button
            className="
              px-8 py-3 border border-white/10 text-white/30 text-sm tracking-widest
              hover:border-white/30 hover:text-white/50
              transition-all duration-500 rounded-sm
              bg-transparent
            "
            onClick={handleContinue}
          >
            继续
          </button>
        )}
      </div>

      <p className="absolute bottom-8 text-white/15 text-xs tracking-wider">
        知行合一
      </p>
    </div>
  );
};
