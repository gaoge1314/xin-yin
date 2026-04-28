import { useState, useEffect, useRef } from 'react';
import { useEnlightenmentStore } from '../../../stores/useEnlightenmentStore';
import { useSceneStore } from '../../../stores/useSceneStore';

export const EnlightenmentFalling: React.FC = () => {
  const [showBreathDot, setShowBreathDot] = useState(false);
  const setEnlightenmentPhase = useEnlightenmentStore((s) => s.setPhase);
  const setScenePhase = useSceneStore((s) => s.setPhase);
  const setScenePhaseRef = useRef(setScenePhase);
  const setEnlightenmentPhaseRef = useRef(setEnlightenmentPhase);
  setScenePhaseRef.current = setScenePhase;
  setEnlightenmentPhaseRef.current = setEnlightenmentPhase;

  useEffect(() => {
    const breathTimer = setTimeout(() => {
      setShowBreathDot(true);
    }, 15000);

    const transitionTimer = setTimeout(() => {
      setEnlightenmentPhaseRef.current('sweeping');
      setScenePhaseRef.current('enlightenment-sweeping');
    }, 30000);

    return () => {
      clearTimeout(breathTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {showBreathDot && (
        <div
          className="w-1 h-1 rounded-full bg-white/10"
          style={{
            animation: 'enlightenmentBreath 4s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
};
