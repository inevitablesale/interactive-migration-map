import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import StateReportCard from "./StateReportCard";

interface StateData {
  STATEFP: string;
  EMP: number | null;
  PAYANN: number | null;
  ESTAB: number | null;
  B19013_001E: number | null;
  B23025_004E: number | null;
  B25077_001E: number | null;
}

export function Hero() {
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const [showHeroText, setShowHeroText] = useState(true);

  // Listen for custom event from Map component
  useEffect(() => {
    const handleStateChange = (event: CustomEvent) => {
      const stateData = (event as CustomEvent<StateData>).detail;
      setActiveState(stateData);
      // Only hide hero text on first state load
      if (!activeState) {
        setShowHeroText(false);
      }
    };

    window.addEventListener('stateChanged', handleStateChange as EventListener);
    return () => {
      window.removeEventListener('stateChanged', handleStateChange as EventListener);
    };
  }, [activeState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      {showHeroText ? (
        <div className="text-center max-w-4xl animate-fade-in">
          <p className="text-yellow-400 text-sm md:text-base tracking-wider mb-4">AI-POWERED MARKET INTELLIGENCE</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">Find Tomorrow's</span>
            <br />
            <span className="text-white">Opportunities Today</span>
          </h1>
          <div className="flex justify-center">
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="group flex flex-col items-center text-white/80 hover:text-white transition-colors"
            >
              <span className="text-sm uppercase tracking-wider mb-2">Explore the Map</span>
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <button 
            onClick={() => setShowHeroText(true)}
            className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-sm text-white/80 hover:text-white transition-colors"
          >
            Show Welcome Screen
          </button>
        </div>
      )}
      {activeState && <StateReportCard data={activeState} isVisible={!showHeroText} />}
    </div>
  );
}