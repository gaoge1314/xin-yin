interface UltimateChoiceProps {
  onLetGo: () => void;
  onHoldOn: () => void;
}

export const UltimateChoice: React.FC<UltimateChoiceProps> = ({
  onLetGo,
  onHoldOn,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050510] animate-[fadeIn_2s_ease-in]">
      <div className="mb-16 text-center">
        <p className="text-white/30 text-sm tracking-widest mb-2">
          风声渐弱
        </p>
        <p className="text-white/20 text-xs">
          在最后的瞬间，你听见——
        </p>
      </div>

      <div className="flex flex-col gap-8 items-center">
        <button
          className="
            group relative px-8 py-4 border border-choice-letgo/30
            text-choice-letgo/70 text-base tracking-wider
            hover:border-choice-letgo/60 hover:text-choice-letgo
            transition-all duration-700 rounded-sm
            bg-transparent
          "
          onClick={onLetGo}
        >
          <span className="relative z-10">就这样吧，这很公平。</span>
          <div className="absolute inset-0 bg-choice-letgo/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm" />
        </button>

        <div className="w-px h-4 bg-white/10" />

        <button
          className="
            group relative px-8 py-4 border border-choice-holdon/30
            text-choice-holdon/70 text-base tracking-wider
            hover:border-choice-holdon/60 hover:text-choice-holdon
            transition-all duration-700 rounded-sm
            bg-transparent
          "
          onClick={onHoldOn}
        >
          <span className="relative z-10">可是，我还想再试一次。</span>
          <div className="absolute inset-0 bg-choice-holdon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm" />
          <div className="absolute -inset-1 bg-calm/5 rounded-sm opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700" />
        </button>
      </div>
    </div>
  );
};
