import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Building2, TrendingUp, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStateName } from "@/utils/stateUtils";
import { useEffect, useState } from "react";

export default function StateMarketReport() {
  const { state } = useParams();
  const navigate = useNavigate();
  const [stateName, setStateName] = useState<string>("");

  const { data: stateData, isLoading } = useQuery({
    queryKey: ['stateMarketReport', state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', state)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: countyData } = useQuery({
    queryKey: ['countyData', state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_data')
        .select('*, state_fips_codes!inner(postal_abbr)')
        .eq('STATEFP', state)
        .order('B01001_001E', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
    enabled: !!state
  });

  const { data: marketOpportunities } = useQuery({
    queryKey: ['stateOpportunities', state],
    queryFn: async () => {
      const { data: opportunities } = await supabase.rpc('get_market_opportunities');
      return opportunities?.filter(opp => opp.statefp === state);
    },
    enabled: !!state
  });

  const { data: competitiveAnalysis } = useQuery({
    queryKey: ['stateCompetitiveAnalysis', state],
    queryFn: async () => {
      const { data: analysis } = await supabase.rpc('get_competitive_analysis');
      return analysis?.find(a => a.statefp === state);
    },
    enabled: !!state
  });

  useEffect(() => {
    const loadStateName = async () => {
      if (state) {
        const name = await getStateName(state);
        setStateName(name);
      }
    };
    loadStateName();
  }, [state]);

  const handleCountyClick = (countyName: string, stateAbbr: string) => {
    // Remove " County" suffix if present for the URL
    const formattedCounty = countyName.replace(/ County$/, '');
    navigate(`/market-report/${stateAbbr}/${formattedCounty}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading state market data...</div>
        </div>
      </div>
    );
  }

  if (!stateData) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">State not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={() => navigate(-1)} variant="ghost" className="text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">{stateName}</h1>
            <p className="text-gray-400 mt-2">State Market Analysis</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
              {competitiveAnalysis?.competition_level || 'Analyzing'} Competition
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
              {marketOpportunities?.length ? 'Growth Opportunities' : 'Stable Market'}
            </Badge>
          </div>
        </div>

        {/* State Level Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Total Establishments</h2>
            </div>
            <p className="text-2xl font-bold text-white">{stateData.ESTAB?.toLocaleString()}</p>
          </Card>
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Annual Payroll</h2>
            </div>
            <p className="text-2xl font-bold text-white">${(stateData.PAYANN / 1000000).toFixed(1)}M</p>
          </Card>
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Total Population</h2>
            </div>
            <p className="text-2xl font-bold text-white">{stateData.B01001_001E?.toLocaleString()}</p>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Growth Rate</h2>
            </div>
            <p className="text-2xl font-bold text-white">
              {((stateData.MOVEDIN2022 ?? 0) - (stateData.MOVEDIN2021 ?? 0)) / (stateData.MOVEDIN2021 || 1) * 100}%
            </p>
          </Card>
        </div>

        {/* County Level Metrics */}
        {countyData && countyData.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Top Counties</h2>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                View All Counties <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countyData.map((county) => (
                <Card 
                  key={county.COUNTYFP}
                  className="bg-black/40 backdrop-blur-md border-white/10 p-6 cursor-pointer hover:bg-black/60 transition-colors"
                  onClick={() => handleCountyClick(county.COUNTYNAME, county.state_fips_codes.postal_abbr)}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">{county.COUNTYNAME}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Population</p>
                      <p className="text-xl font-bold text-white">
                        {county.B01001_001E?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Establishments</p>
                      <p className="text-xl font-bold text-white">
                        {county.ESTAB?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Recent Moves</p>
                      <p className="text-xl font-bold text-white">
                        {county.MOVEDIN2022?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Market Opportunities */}
        {marketOpportunities && marketOpportunities.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Growth Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketOpportunities.map((opportunity, index) => (
                <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10 p-4">
                  <h3 className="text-lg font-medium text-white mb-2">{opportunity.countyname}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Migration Score</span>
                      <span className="text-white">{opportunity.migration_score.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Business Density</span>
                      <span className="text-white">{opportunity.business_density_score.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Coverage</span>
                      <span className="text-white">{opportunity.service_coverage_score.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
