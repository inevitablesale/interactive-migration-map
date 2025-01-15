import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketOpportunityMap } from "../scenario/MarketOpportunityMap";
import { MarketSimilarityAnalysis } from "./MarketSimilarityAnalysis";
import { ScenarioModeling } from "../scenario/ScenarioModeling";
import { StrategyBuilder } from "./StrategyBuilder";
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
  const [filters, setFilters] = useState<AnalysisFilters>({
    employeeCountMin: '',
    employeeCountMax: '',
    revenueMin: '',
    revenueMax: '',
    region: 'all'
  });

  const [activeLayer, setActiveLayer] = useState<'all' | 'sold' | 'active' | 'census'>('all');
  const [scenarioData, setScenarioData] = useState<any[]>([]);

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    // Validate filters
    const numericFields = {
      employeeCountMin: 'Minimum Employee Count',
      employeeCountMax: 'Maximum Employee Count',
      revenueMin: 'Minimum Revenue',
      revenueMax: 'Maximum Revenue'
    };

    for (const [key, label] of Object.entries(numericFields)) {
      const value = filters[key as keyof typeof numericFields];
      if (value && isNaN(Number(value))) {
        toast.error(`${label} must be a valid number`);
        return;
      }
    }

    toast.success("Filters applied successfully");
  };

  const handleUpdateScenario = (updatedData: any[]) => {
    setScenarioData(updatedData);
  };

  return (
    <div className="space-y-8">
      {/* Analysis Filters */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Analysis Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="employeeCountMin" className="text-white">Min Employees</Label>
            <Input
              id="employeeCountMin"
              placeholder="0"
              value={filters.employeeCountMin}
              onChange={(e) => handleFilterChange('employeeCountMin', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="employeeCountMax" className="text-white">Max Employees</Label>
            <Input
              id="employeeCountMax"
              placeholder="1000+"
              value={filters.employeeCountMax}
              onChange={(e) => handleFilterChange('employeeCountMax', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="revenueMin" className="text-white">Min Revenue</Label>
            <Input
              id="revenueMin"
              placeholder="$0"
              value={filters.revenueMin}
              onChange={(e) => handleFilterChange('revenueMin', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="revenueMax" className="text-white">Max Revenue</Label>
            <Input
              id="revenueMax"
              placeholder="$10M+"
              value={filters.revenueMax}
              onChange={(e) => handleFilterChange('revenueMax', e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="region" className="text-white">Region</Label>
            <Select 
              value={filters.region} 
              onValueChange={(value) => handleFilterChange('region', value)}
            >
              <SelectTrigger className="bg-black/40 border-white/10 text-white">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="northeast">Northeast</SelectItem>
                <SelectItem value="southeast">Southeast</SelectItem>
                <SelectItem value="midwest">Midwest</SelectItem>
                <SelectItem value="southwest">Southwest</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full">
            <Button 
              onClick={handleApplyFilters}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Market Opportunity Map with Layer Controls */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Market Opportunity Map</h2>
          <div className="flex gap-2">
            <Button
              variant={activeLayer === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('all')}
              className="text-sm"
            >
              All Layers
            </Button>
            <Button
              variant={activeLayer === 'sold' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('sold')}
              className="text-sm"
            >
              Sold Firms
            </Button>
            <Button
              variant={activeLayer === 'active' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('active')}
              className="text-sm"
            >
              Active Firms
            </Button>
            <Button
              variant={activeLayer === 'census' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('census')}
              className="text-sm"
            >
              Census Data
            </Button>
          </div>
        </div>
        <div className="h-[500px] rounded-lg overflow-hidden">
          <MarketOpportunityMap
            soldFirms={[]}
            activeFirms={[]}
            censusData={[]}
            activeLayer={activeLayer}
          />
        </div>
      </Card>

      {/* Market Similarity Analysis */}
      <MarketSimilarityAnalysis filters={filters} />

      {/* Scenario Modeling */}
      {stateData && statesList && (
        <ScenarioModeling 
          stateData={stateData}
          statesList={statesList}
          onUpdateScenario={handleUpdateScenario}
        />
      )}

      {/* Strategy Builder */}
      <StrategyBuilder />
    </div>
  );
}