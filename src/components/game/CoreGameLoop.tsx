import { useEffect } from 'react';
import { ClockDisplay } from './ClockDisplay';
import { WillpowerDisplay } from './WillpowerDisplay';
import { HeartRateIndicator } from './HeartRateIndicator';
import { CognitionPanel } from './CognitionPanel';
import { OrganStatusPanel } from './OrganStatusPanel';
import { TextInput } from './TextInput';
import { SkillButtons } from './SkillButtons';
import { PauseButton } from './PauseButton';
import { NarrativeDisplay } from '../narrative/NarrativeDisplay';
import { CollapsiblePanel } from '../ui/CollapsiblePanel';
import { gameLoop } from '../../systems/gameLoop';

export const CoreGameLoop: React.FC = () => {
  useEffect(() => {
    gameLoop.start();
    return () => {
      gameLoop.stop();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0f] relative">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <ClockDisplay />
        <PauseButton />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <CollapsiblePanel title="人物状态" side="left" defaultOpen={true}>
          <div className="flex flex-col gap-4">
            <WillpowerDisplay />
            <HeartRateIndicator />
            <div className="border-t border-white/5 pt-3">
              <OrganStatusPanel />
            </div>
            <div className="border-t border-white/5 pt-3">
              <CognitionPanel />
            </div>
          </div>
        </CollapsiblePanel>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-6">
            <NarrativeDisplay />
          </div>

          <div className="border-t border-white/5 p-4">
            <TextInput />
          </div>
        </div>

        <CollapsiblePanel title="技能" side="right" defaultOpen={false}>
          <SkillButtons />
        </CollapsiblePanel>
      </div>
    </div>
  );
};
