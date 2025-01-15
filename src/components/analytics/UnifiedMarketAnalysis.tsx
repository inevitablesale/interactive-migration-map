import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MarketSimilarityAnalysis } from "./MarketSimilarityAnalysis";
import { ScenarioModeling } from "../scenario/ScenarioModeling";
import { MarketOpportunityMap } from "../scenario/MarketOpportunityMap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisFilters {
  employeeCountMin: string;
  employeeCountMax: string;
  revenueMin: string;
  revenueMax: string;
  region: string;
}

export function UnifiedMarketAnalysis() {
  const [activeLayer, setActiveLayer] = useState<'all' | 'sold' | 'active' | 'census'>('all');
  const [selectedFirms, setSelectedFirms] = useState<any[]>([]);
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  const [analysisFilters, setAnalysisFilters] = useState<AnalysisFilters>({
    employeeCountMin: '',
    employeeCountMax: '',
    revenueMin: '',
    revenueMax: '',
    region: 'all'
  });

  // Fetch base data
  const { data: stateData } = useQuery({
    queryKey: ['stateData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: statesList } = useQuery({
    queryKey: ['statesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Handle filter changes
  const handleFilterChange = (key: keyof AnalysisFilters, value: string) => {
    setAnalysisFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters and update analysis
  const handleApplyFilters = () => {
    // Validate numeric fields
    const numericFields = {
      employeeCountMin: 'Minimum Employee Count',
      employeeCountMax: 'Maximum Employee Count',
      revenueMin: 'Minimum Revenue',
      revenueMax: 'Maximum Revenue'
    };

    for (const [key, label] of Object.entries(numericFields)) {
      const value = analysisFilters[key as keyof typeof numericFields];
      if (value && isNaN(Number(value))) {
        toast.error(`${label} must be a valid number`);
        return;
      }
    }

    // Update scenario data based on filters
    if (stateData) {
      const filteredData = stateData.map(state => ({
        ...state,
        EMP: Math.round(state.EMP * (1 + (Number(analysisFilters.employeeCountMax) - Number(analysisFilters.employeeCountMin)) / 100)),
        PAYANN: Math.round(state.PAYANN * (1 + (Number(analysisFilters.revenueMax) - Number(analysisFilters.revenueMin)) / 100))
      }));
      setScenarioData(filteredData);
    }

    toast.success("Analysis updated with new filters");
  };

  // Handle scenario updates
  const handleUpdateScenario = (updatedData: any[]) => {
    setScenarioData(updatedData);
    // This will trigger updates in child components
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Market Analysis Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-white">Min Employees</label>
            <input
              type="text"
              placeholder="0"
              value={analysisFilters.employeeCountMin}
              onChange={(e) => handleFilterChange('employeeCountMin', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white">Max Employees</label>
            <input
              type="text"
              placeholder="1000+"
              value={analysisFilters.employeeCountMax}
              onChange={(e) => handleFilterChange('employeeCountMax', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white">Min Revenue</label>
            <input
              type="text"
              placeholder="$0"
              value={analysisFilters.revenueMin}
              onChange={(e) => handleFilterChange('revenueMin', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white">Max Revenue</label>
            <input
              type="text"
              placeholder="$10M+"
              value={analysisFilters.revenueMax}
              onChange={(e) => handleFilterChange('revenueMax', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white">Region</label>
            <select 
              value={analysisFilters.region} 
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            >
              <option value="all">All Regions</option>
              <option value="northeast">Northeast</option>
              <option value="southeast">Southeast</option>
              <option value="midwest">Midwest</option>
              <option value="southwest">Southwest</option>
              <option value="west">West</option>
            </select>
          </div>
          <div className="col-span-full">
            <button 
              onClick={handleApplyFilters}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Map and Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketOpportunityMap
          soldFirms={selectedFirms}
          activeFirms={[]}
          censusData={[]}
          activeLayer={activeLayer}
        />
        
        <MarketSimilarityAnalysis filters={analysisFilters} />
      </div>

      {/* Scenario Modeling */}
      {stateData && statesList && (
        <ScenarioModeling
          stateData={scenarioData.length ? scenarioData : stateData}
          statesList={statesList}
          onUpdateScenario={handleUpdateScenario}
        />
      )}
    </div>
  );
}
