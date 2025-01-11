import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BottomPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#222222] text-white transition-all duration-300 ${isExpanded ? 'h-80' : 'h-12'}`}>
      <Button
        variant="ghost"
        className="absolute top-0 left-1/2 -translate-x-1/2 text-white hover:bg-white/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronUp className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </Button>
      
      {isExpanded && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Scenario Simulation</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Price Increase (%)</label>
              <Input 
                type="number" 
                placeholder="0"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Migration Inflow</label>
              <Input 
                type="number" 
                placeholder="0"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Time Period (months)</label>
              <Input 
                type="number" 
                placeholder="12"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Button className="mt-4 bg-cyan-500 hover:bg-cyan-600">
            Generate Insights
          </Button>
        </div>
      )}
    </div>
  );
}