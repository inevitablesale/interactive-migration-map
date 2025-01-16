import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { EmergingTalentMarket } from "./types";
import { useNavigate } from "react-router-dom";

export function TalentInsights() {
  const navigate = useNavigate();

  const { data: emergingTalentData = [] } = useQuery({
    queryKey: ['emergingTalentMarkets'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_emerging_talent_markets');
      if (error) throw error;
      return data.filter((region, index, self) =>
        index === self.findIndex(r => 
          r.county_name === region.county_name && 
          r.state_name === region.state_name
        )
      );
    },
  });

  const handleNavigateToMarket = (county: string, state: string) => {
    navigate(`/market-report/${state}/${county}`);
  };

  const detailsContent = emergingTalentData?.map((region, index) => (
    <div 
      key={index} 
      className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
      onClick={() => handleNavigateToMarket(region.county_name, region.state_name)}
    >
      <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state_name}</h3>
      <p className="text-sm text-gray-300">Education Rate: {region.education_rate_percent.toFixed(1)}%</p>
      <p className="text-sm text-gray-300">Total Educated: {region.total_educated.toLocaleString()}</p>
      <p className="text-sm text-gray-300">Median Age: {Math.round(region.median_age)}</p>
      <div className="flex justify-between items-center mt-2">
        {region.state_rank && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">State Rank:</p>
            <p className="text-2xl text-white/90 font-medium">{region.state_rank.toLocaleString()}</p>
          </div>
        )}
        {region.national_rank && (
          <div className="text-right">
            <p className="text-gray-500 text-xs mb-0.5">National Rank:</p>
            <p className="text-2xl text-blue-400/90 font-medium">{region.national_rank.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <MetricCard
      title="Talent Availability"
      value={emergingTalentData[0] 
        ? `${emergingTalentData[0].county_name}, ${emergingTalentData[0].state_name}`
        : "Loading..."}
      icon={GraduationCap}
      insight={
        emergingTalentData[0] 
          ? `${emergingTalentData[0].education_rate_percent.toFixed(1)}% education rate, ${emergingTalentData[0].total_educated.toLocaleString()} educated professionals`
          : "Analyzing education data..."
      }
      detailsContent={detailsContent}
    />
  );
}