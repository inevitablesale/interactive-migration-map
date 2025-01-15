import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketOpportunityMap } from "./MarketOpportunityMap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScenarioModelingProps {
  stateData: any[];
  statesList: any[];
  onUpdateScenario: (scenarioData: any[]) => void;
}

export function ScenarioModeling({ stateData, statesList, onUpdateScenario }: ScenarioModelingProps) {
  const [growthRate, setGrowthRate] = useState(0);
  const [employeeGrowth, setEmployeeGrowth] = useState(0);
  const [payrollIncrease, setPayrollIncrease] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'all' | 'sold' | 'active' | 'census'>('all');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const { data: soldFirms } = useQuery({
    queryKey: ['soldFirmsData', selectedState],
    queryFn: async () => {
      const query = supabase.from('sold_firms_data').select('*');
      if (selectedState) {
        query.eq('State', selectedState);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: activeFirms } = useQuery({
    queryKey: ['canaryFirmsData', selectedState],
    queryFn: async () => {
      const query = supabase.from('canary_firms_data').select('*');
      if (selectedState) {
        query.eq('STATE', selectedState);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: censusData } = useQuery({
    queryKey: ['censusData', selectedState],
    queryFn: async () => {
      const query = supabase.from('county_data').select('*');
      if (selectedState) {
        query.eq('STATEFP', selectedState);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const applyScenario = () => {
    const updatedData = stateData.map(state => ({
      ...state,
      EMP: Math.round(state.EMP * (1 + employeeGrowth / 100)),
      PAYANN: Math.round(state.PAYANN * (1 + payrollIncrease / 100)),
      ESTAB: Math.round(state.ESTAB * (1 + growthRate / 100))
    }));
    onUpdateScenario(updatedData);
  };

  const calculateMarketMetrics = () => {
    if (!soldFirms || !activeFirms || !censusData) return null;

    const avgDealSize = soldFirms.reduce((acc, firm) => acc + (firm.asking_price || 0), 0) / soldFirms.length;
    const avgEmployeeCount = soldFirms.reduce((acc, firm) => acc + (firm.employee_count || 0), 0) / soldFirms.length;
    const marketSaturation = activeFirms.length / censusData.reduce((acc, county) => acc + (county.B01001_001E || 0), 0) * 100000;

    return {
      avgDealSize,
      avgEmployeeCount,
      marketSaturation,
      totalDeals: soldFirms.length,
      activeCompetitors: activeFirms.length,
      marketPotential: censusData.reduce((acc, county) => acc + (county.B23025_004E || 0), 0)
    };
  };

  const metrics = calculateMarketMetrics();

  if (!stateData?.length) return null;

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
      <Tabs defaultValue="map" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Opportunity Map</TabsTrigger>
          <TabsTrigger value="layers">Data Layers</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <div className="h-[500px] rounded-lg overflow-hidden">
            <MarketOpportunityMap 
              soldFirms={soldFirms || []}
              activeFirms={activeFirms || []}
              censusData={censusData || []}
              activeLayer={activeLayer}
            />
          </div>
        </TabsContent>

        <TabsContent value="layers" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card 
              className={`p-4 cursor-pointer transition-colors ${
                activeLayer === 'all' ? 'bg-blue-500/20' : 'bg-black/20'
              }`}
              onClick={() => setActiveLayer('all')}
            >
              <h3 className="font-medium text-white">All Layers</h3>
              <p className="text-sm text-white/60">Combined view</p>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors ${
                activeLayer === 'sold' ? 'bg-blue-500/20' : 'bg-black/20'
              }`}
              onClick={() => setActiveLayer('sold')}
            >
              <h3 className="font-medium text-white">Sold Firms</h3>
              <p className="text-sm text-white/60">{soldFirms?.length || 0} deals</p>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors ${
                activeLayer === 'active' ? 'bg-blue-500/20' : 'bg-black/20'
              }`}
              onClick={() => setActiveLayer('active')}
            >
              <h3 className="font-medium text-white">Active Firms</h3>
              <p className="text-sm text-white/60">{activeFirms?.length || 0} firms</p>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors ${
                activeLayer === 'census' ? 'bg-blue-500/20' : 'bg-black/20'
              }`}
              onClick={() => setActiveLayer('census')}
            >
              <h3 className="font-medium text-white">Census Data</h3>
              <p className="text-sm text-white/60">{censusData?.length || 0} regions</p>
            </Card>
          </div>

          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="p-4 bg-black/20">
                <h4 className="text-sm font-medium text-white/80">Average Deal Size</h4>
                <p className="text-2xl font-bold text-white">${metrics.avgDealSize.toLocaleString()}</p>
              </Card>
              <Card className="p-4 bg-black/20">
                <h4 className="text-sm font-medium text-white/80">Market Saturation</h4>
                <p className="text-2xl font-bold text-white">{metrics.marketSaturation.toFixed(2)}%</p>
              </Card>
              <Card className="p-4 bg-black/20">
                <h4 className="text-sm font-medium text-white/80">Market Potential</h4>
                <p className="text-2xl font-bold text-white">{metrics.marketPotential.toLocaleString()}</p>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-4">Scenario Modeling</h3>
              <p className="text-sm text-white/60 mb-6">
                Adjust parameters to model different market scenarios
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Market Growth Rate (%)</label>
                <Slider
                  value={[growthRate]}
                  onValueChange={(value) => setGrowthRate(value[0])}
                  max={50}
                  step={1}
                />
                <span className="text-sm text-white/60">{growthRate}%</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">Employee Growth (%)</label>
                <Slider
                  value={[employeeGrowth]}
                  onValueChange={(value) => setEmployeeGrowth(value[0])}
                  max={50}
                  step={1}
                />
                <span className="text-sm text-white/60">{employeeGrowth}%</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">Payroll Increase (%)</label>
                <Slider
                  value={[payrollIncrease]}
                  onValueChange={(value) => setPayrollIncrease(value[0])}
                  max={50}
                  step={1}
                />
                <span className="text-sm text-white/60">{payrollIncrease}%</span>
              </div>
            </div>

            <Button 
              onClick={applyScenario}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Apply Scenario
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}