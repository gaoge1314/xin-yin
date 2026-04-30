import type { NpcDialogEntry } from '../../stores/useNpcStore';

interface NpcDialogModalProps {
  dialog: NpcDialogEntry;
  onDismiss: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  father: '父亲',
  mother: '母亲',
  sister: '姐姐',
  niece: '可可',
  colleague_male: '同事',
  colleague_female: '同事',
  old_friend: '老友',
};

export const NpcDialogModal: React.FC<NpcDialogModalProps> = ({
  dialog,
  onDismiss,
}) => {
  const roleLabel = ROLE_LABELS[dialog.npcId] || dialog.npcName;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/90 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-lg w-full p-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 border border-white/20 rounded text-white/50">
            {roleLabel}
          </span>
          {dialog.npcDescription && (
            <span className="text-white/20 text-xs truncate">
              {dialog.npcDescription}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-white/80 text-base font-light tracking-wider leading-relaxed">
            {dialog.content}
          </h2>
        </div>

        {dialog.protagonistResponse && (
          <div className="space-y-2 border-t border-white/5 pt-4">
            <span className="text-xs text-white/30 tracking-wider">明泽</span>
            <p className="text-white/50 text-sm italic tracking-wider leading-relaxed">
              {dialog.protagonistResponse}
            </p>
            {dialog.protagonistInnerVoice && (
              <p className="text-white/25 text-xs tracking-wider leading-relaxed">
                {dialog.protagonistInnerVoice}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onDismiss}
            className="
              px-6 py-2 border border-white/10 rounded text-white/40 text-sm
              hover:border-white/20 hover:text-white/60
              transition-all duration-300
            "
          >
            继续
          </button>
        </div>
      </div>
    </div>
  );
};
