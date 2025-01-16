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

  // Validate state parameter before querying
  const isValidState = state && !isNaN(Number(state)) && state.length <= 2;

  // Query the materialized view for state rankings
  const { data: stateRankings, isLoading: rankingsLoading } = useQuery({
    queryKey: ['stateRankings', state],
    queryFn: async () => {
      if (!isValidState) {
        throw new Error('Invalid state parameter');
      }

      const { data, error } = await supabase
        .from('state_rankings')
        .select('*')
        .eq('STATEFP', state)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: isValidState
  });

  // Get state data
  const { data: stateData, isLoading: stateLoading } = useQuery({
    queryKey: ['stateData', state],
    queryFn: async () => {
      if (!isValidState) {
        throw new Error('Invalid state parameter');
      }

      const { data, error } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', state)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: isValidState
  });

  // First get state abbreviation
  const { data: stateAbbr } = useQuery({
    queryKey: ['stateAbbr', state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('postal_abbr')
        .eq('STATEFP', state)
        .single();

      if (error) throw error;
      return data?.postal_abbr;
    },
    enabled: !!state
  });

  const { data: countyData } = useQuery({
    queryKey: ['countyData', state],
    queryFn: async () => {
      // Get all counties for the state, sorted by population
      const { data, error } = await supabase
        .from('county_data')
        .select('*')
        .eq('STATEFP', state)
        .order('B01001_001E', { ascending: false });

      if (error) throw error;

      // Create a Map to keep track of unique counties while preserving the sort order
      const uniqueCounties = new Map();
      
      data?.forEach(county => {
        if (!uniqueCounties.has(county.COUNTYNAME)) {
          uniqueCounties.set(county.COUNTYNAME, county);
        }
      });

      // Convert Map values back to array and take top 6
      return Array.from(uniqueCounties.values()).slice(0, 6);
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
      if (isValidState && state) {
        const name = await getStateName(state);
        setStateName(name);
      }
    };
    loadStateName();
  }, [state, isValidState]);

  // Handle invalid state parameter
  if (!isValidState) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid state parameter</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  if (stateLoading || rankingsLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading state market data...</div>
        </div>
      </div>
    );
  }

  if (!stateData || !stateRankings) {
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

  const calculateNationalRank = () => {
    if (!stateRankings) return null;
    return stateRankings.density_rank;
  };

  const calculateEducationPercentages = (stateData: any) => {
    if (!stateData) return {
      bachelors: 0,
      masters: 0,
      doctorate: 0
    };

    const total = stateData.B15003_001E || 1; // Total population 25 years and over
    return {
      bachelors: ((stateData.B15003_022E || 0) / total * 100).toFixed(1),
      masters: ((stateData.B15003_023E || 0) / total * 100).toFixed(1),
      doctorate: ((stateData.B15003_025E || 0) / total * 100).toFixed(1)
    };
  };

  const handleCountyClick = (countyName: string) => {
    if (!stateAbbr) return;
    navigate(`/market-report/${countyName}/${stateAbbr}`);
  };

  const nationalRank = calculateNationalRank();
  const educationPercentages = calculateEducationPercentages(stateData);

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={() => navigate(-1)} variant="ghost" className="text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold text-white">{stateName}</h1>
              {nationalRank && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                  National Rank: #{nationalRank}
                </Badge>
              )}
            </div>
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
              <h2 className="text-lg font-semibold text-white">Total Firms</h2>
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
              <h2 className="text-lg font-semibold text-white">Education Distribution</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Bachelor's</span>
                <span className="text-white">{educationPercentages.bachelors}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Master's</span>
                <span className="text-white">{educationPercentages.masters}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Doctorate</span>
                <span className="text-white">{educationPercentages.doctorate}%</span>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Growth Rate</h2>
            </div>
            <p className="text-2xl font-bold text-white">
              {stateRankings?.growth_rate ? 
                `${stateRankings.growth_rate.toFixed(1)}%` : 
                `${(((stateData.MOVEDIN2022 ?? 0) - (stateData.MOVEDIN2021 ?? 0)) / (stateData.MOVEDIN2021 || 1) * 100).toFixed(1)}%`
              }
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
                  key={`${county.COUNTYFP}-${county.STATEFP}`}
                  className="bg-black/40 backdrop-blur-md border-white/10 p-6 cursor-pointer hover:bg-black/60 transition-colors"
                  onClick={() => handleCountyClick(county.COUNTYNAME)}
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
                      <p className="text-sm text-gray-400">Firms</p>
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
