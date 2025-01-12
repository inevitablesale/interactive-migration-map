import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const handleStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<StateData>;
      const stateData = customEvent.detail;
      setActiveState(stateData);

      // Calculate insights for toast notification
      const employmentRate = stateData.EMP && stateData.B23025_004E ? 
        (stateData.EMP / stateData.B23025_004E * 100).toFixed(1) : null;
      
      const businessDensity = stateData.ESTAB && stateData.B23025_004E ? 
        (stateData.ESTAB / (stateData.B23025_004E / 1000)).toFixed(1) : null;

      // Show toast with key metrics
      toast({
        title: "State Market Update",
        description: (
          <div className="space-y-2">
            <p>• {stateData.ESTAB?.toLocaleString()} active businesses</p>
            <p>• {employmentRate}% employment rate</p>
            <p>• ${(stateData.B25077_001E || 0).toLocaleString()} median home value</p>
          </div>
        ),
        duration: 3000,
      });
    };

    window.addEventListener('stateChanged', handleStateChange);
    return () => {
      window.removeEventListener('stateChanged', handleStateChange);
    };
  }, [toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 hero-section">
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
    </div>
  );
}