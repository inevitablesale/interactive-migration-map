import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StateStats {
  state: string;
  stat: string;
  value: number;
  color: string;
}

export function Hero() {
  const [currentState, setCurrentState] = useState<StateStats | null>(null);

  useEffect(() => {
    const fetchAndCycleStates = async () => {
      const { data: stateData, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB')
        .not('EMP', 'is', null);

      if (error) {
        console.error('Error fetching state data:', error);
        return;
      }

      const stats = stateData.map((state) => [
        {
          state: state.STATEFP,
          stat: 'Employment',
          value: state.EMP || 0,
          color: '#9b87f5'
        },
        {
          state: state.STATEFP,
          stat: 'Annual Payroll',
          value: state.PAYANN || 0,
          color: '#0EA5E9'
        },
        {
          state: state.STATEFP,
          stat: 'Establishments',
          value: state.ESTAB || 0,
          color: '#D946EF'
        }
      ]).flat();

      let index = 0;
      const interval = setInterval(() => {
        setCurrentState(stats[index]);
        index = (index + 1) % stats.length;
      }, 3000);

      return () => clearInterval(interval);
    };

    fetchAndCycleStates();
  }, []);

  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <div className="text-center max-w-4xl">
        <p className="text-cyan-400 text-sm md:text-base tracking-wider mb-4">AI-POWERED MARKET INTELLIGENCE</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">Find Tomorrow's</span>
          <br />
          <span className="text-white">Opportunities Today</span>
        </h1>
        {currentState && (
          <div className="animate-fade-in mb-8">
            <p className="text-lg md:text-xl text-gray-200">
              In <span style={{ color: currentState.color }}>{currentState.state}</span>,
              <br />
              {currentState.stat}: <span style={{ color: currentState.color }}>{formatValue(currentState.value)}</span>
            </p>
          </div>
        )}
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Detect acquisition signals in accounting practices before they list. Our AI analyzes millions of data points to identify growth patterns.
        </p>
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