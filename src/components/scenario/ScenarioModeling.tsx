import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { MarketOpportunityMap } from './MarketOpportunityMap';
import { ValuationEstimator } from './ValuationEstimator';
import { BuyerStrategyOptimizer } from './BuyerStrategyOptimizer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export function ScenarioModeling() {
  const [activeLayer, setActiveLayer] = useState<'all' | 'sold' | 'active' | 'census'>('all');

  const { data: soldFirms, isLoading: loadingSold } = useQuery({
    queryKey: ['soldFirmsData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sold_firms_data')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: activeFirms, isLoading: loadingActive } = useQuery({
    queryKey: ['canaryFirmsData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: censusData, isLoading: loadingCensus } = useQuery({
    queryKey: ['censusData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_data')
        .select(`
          COUNTYNAME,
          STATEFP,
          B01001_001E,
          B19013_001E,
          B23025_004E,
          ESTAB,
          EMP,
          PAYANN
        `);
      if (error) throw error;
      return data;
    }
  });

  const isLoading = loadingSold || loadingActive || loadingCensus;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-6">Market Opportunity Analysis</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <Tabs defaultValue="map" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-black/20">
                <TabsTrigger value="map">Opportunity Map</TabsTrigger>
                <TabsTrigger value="layers">Data Layers</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="map">
                <MarketOpportunityMap 
                  soldFirms={soldFirms || []}
                  activeFirms={activeFirms || []}
                  censusData={censusData || []}
                  activeLayer={activeLayer}
                />
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
                    <p className="text-sm text-white/60">{soldFirms?.length || 0} firms</p>
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
              </TabsContent>

              <TabsContent value="analysis">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ValuationEstimator soldFirms={soldFirms || []} />
                  <BuyerStrategyOptimizer 
                    soldFirms={soldFirms || []} 
                    activeFirms={activeFirms || []}
                    censusData={censusData || []}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  );
}