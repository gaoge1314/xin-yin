import { useSceneStore } from './stores/useSceneStore';
import { MainMenu } from './components/game/MainMenu';
import { SceneController } from './components/game/SceneController';
import { CoreGameLoop } from './components/game/CoreGameLoop';
import { DebugPanel } from './components/debug/DebugPanel';

function App() {
  const phase = useSceneStore((s) => s.phase);

  const renderContent = () => {
    switch (phase) {
      case 'menu':
        return <MainMenu />;
      case 'prologue-rooftop':
      case 'prologue-falling':
      case 'prologue-choice':
      case 'prologue-gameover':
      case 'prologue-awakening':
        return <SceneController />;
      case 'core-loop':
        return <CoreGameLoop />;
      case 'ending':
        return <div className="w-full h-full flex items-center justify-center text-white/30">结局画面</div>;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderContent()}
      <DebugPanel />
    </div>
  );
}

export default App;
