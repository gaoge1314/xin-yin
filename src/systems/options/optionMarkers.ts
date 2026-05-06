import type { GameOption } from '../../types/option';
import { OPTION_SOURCE_STYLES, OPTION_SOURCE_STYLES_HIGHLIGHTED, OPTION_SOURCE_LABELS } from '../../types/option';

export interface OptionStyle {
  borderColor: string;
  glow?: string;
  shake?: boolean;
  label: string;
}

export function getOptionStyle(option: GameOption, sweepDustUsed: boolean): OptionStyle {
  const styles = sweepDustUsed ? OPTION_SOURCE_STYLES_HIGHLIGHTED : OPTION_SOURCE_STYLES;
  const sourceStyle = styles[option.source];

  return {
    borderColor: sourceStyle.borderColor,
    glow: sourceStyle.glow,
    shake: sourceStyle.shake ?? false,
    label: OPTION_SOURCE_LABELS[option.source],
  };
}

export function isDustOption(option: GameOption): boolean {
  return option.source === '灰尘';
}

export function isDangerousOption(option: GameOption): boolean {
  return option.isDangerous;
}
