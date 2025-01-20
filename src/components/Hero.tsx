import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<StateData>;
      const stateData = customEvent.detail;
      setActiveState(stateData);
    };

    window.addEventListener('stateChanged', handleStateChange);
    return () => {
      window.removeEventListener('stateChanged', handleStateChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 hero-section">
      <div className="text-center max-w-4xl animate-fade-in">
        <p className="text-yellow-400 text-sm md:text-base tracking-wider mb-4">SERIOUS ABOUT BUYING A FIRM?</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">Discover high-potential firms</span>
          <br />
          <span className="text-white">before they hit the market</span>
        </h1>
        <div className="flex justify-center">
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="group flex flex-col items-center text-white/80 hover:text-white transition-colors"
          >
            <span className="text-sm uppercase tracking-wider mb-2">Pay only when you close</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
}