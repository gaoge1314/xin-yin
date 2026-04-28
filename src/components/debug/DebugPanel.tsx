import { useEffect } from 'react';
import { useDebugStore } from '../../stores/useDebugStore';
import { DEBUG_SECTION_LABELS } from '../../types/debug';
import type { DebugSectionId } from '../../types/debug';
import { PersonalitySection } from './sections/PersonalitySection';
import { WillpowerSection } from './sections/WillpowerSection';
import { TimeSection } from './sections/TimeSection';
import { OrganSection } from './sections/OrganSection';
import { CognitionSection } from './sections/CognitionSection';
import { PlayerSection } from './sections/PlayerSection';
import { SocialRuleSection } from './sections/SocialRuleSection';
import { AnchorSection } from './sections/AnchorSection';
import { EventTriggerSection } from './sections/EventTriggerSection';
import { ScenarioSection } from './sections/ScenarioSection';
import { GlobalActionSection } from './sections/GlobalActionSection';

const SECTION_COMPONENTS: Record<DebugSectionId, React.FC> = {
  personality: PersonalitySection,
  willpower: WillpowerSection,
  time: TimeSection,
  organ: OrganSection,
  cognition: CognitionSection,
  player: PlayerSection,
  socialRule: SocialRuleSection,
  anchor: AnchorSection,
  eventTrigger: EventTriggerSection,
  scenario: ScenarioSection,
  globalAction: GlobalActionSection,
};

export const DebugPanel: React.FC = () => {
  const isVisible = useDebugStore((s) => s.isVisible);
  const sections = useDebugStore((s) => s.sections);
  const toggleVisibility = useDebugStore((s) => s.toggleVisibility);
  const toggleSection = useDebugStore((s) => s.toggleSection);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleVisibility();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleVisibility]);

  return (
    <>
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 px-2 py-1 rounded bg-amber-500/80 text-black text-xs font-bold hover:bg-amber-400 transition-colors"
      >
        {isVisible ? '×' : '调试'}
      </button>

      {isVisible && (
        <div className="fixed right-0 top-0 h-full w-80 bg-black/80 backdrop-blur-sm border-l border-amber-500/20 z-40 flex flex-col">
          <div className="border-b border-amber-500/20 px-3 py-2 flex items-center justify-between">
            <span className="text-amber-400 text-sm font-bold">调试模式</span>
            <button
              onClick={toggleVisibility}
              className="text-white/50 hover:text-white text-sm"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            {sections.map((section) => {
              const SectionComponent = SECTION_COMPONENTS[section.id as DebugSectionId];
              return (
                <div key={section.id} className="mb-1">
                  <div
                    onClick={() => toggleSection(section.id as DebugSectionId)}
                    className="text-amber-400/80 text-xs font-bold py-1.5 cursor-pointer flex items-center gap-1"
                  >
                    <span>{section.isCollapsed ? '▶' : '▼'}</span>
                    <span>{DEBUG_SECTION_LABELS[section.id as DebugSectionId]}</span>
                  </div>
                  {!section.isCollapsed && (
                    <div data-section-id={section.id} className="pl-3 py-1">
                      {SectionComponent && <SectionComponent />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
