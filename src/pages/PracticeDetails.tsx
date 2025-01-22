import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PracticeHeader } from "@/components/practice-details/PracticeHeader";
import { PracticeInfo } from "@/components/practice-details/PracticeInfo";
import { KeyMetricsBar } from "@/components/practice-details/KeyMetricsBar";
import { MarketMetricsGrid } from "@/components/practice-details/MarketMetricsGrid";
import { BusinessOverview } from "@/components/practice-details/BusinessOverview";
import { TopFirm, ComprehensiveMarketData } from "@/types/rankings";

export default function PracticeDetails() {
  const { id } = useParams();

  const { data: practice } = useQuery({
    queryKey: ['practice', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('Company ID', parseInt(id || '0'))
        .single();

      if (error) throw error;
      return data as TopFirm;
    }
  });

  const { data: marketData } = useQuery({
    queryKey: ['market-data', practice?.COUNTYFP, practice?.STATEFP],
    queryFn: async () => {
      if (!practice?.COUNTYFP || !practice?.STATEFP) return null;

      const { data, error } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYFP', practice.COUNTYFP.toString())
        .eq('STATEFP', practice.STATEFP.toString())
        .single();

      if (error) throw error;
      return data as ComprehensiveMarketData;
    },
    enabled: !!practice?.COUNTYFP && !!practice?.STATEFP
  });

  if (!practice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PracticeHeader practice={practice} />
        
        <div className="grid gap-8">
          <KeyMetricsBar 
            practice={practice} 
            countyData={marketData || {
              payann: parseInt(marketData?.payann?.toString() || '0'),
              emp: parseInt(marketData?.emp?.toString() || '0'),
              population_growth_rate: parseInt(marketData?.population_growth_rate?.toString() || '0')
            }} 
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <BusinessOverview practice={practice} />
              <MarketMetricsGrid marketData={marketData || {}} />
            </div>
            <div>
              <PracticeInfo practice={practice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}