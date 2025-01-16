import { ChartBar, Users, Target, InfoIcon, ArrowUpRight, Building2, Users2, Home, GraduationCap, ChartBarIcon, Coins,
  DollarSign, Briefcase, LineChart, Building, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ValueMetric {
  county_name: string;
  state_name: string;
  median_income: number;
  median_home_value: number;
  total_firms: number;
  avg_revenue: number;
  growth_potential: number;
  state_rank: number;
  national_rank: number;
}

interface MarketGrowthMetric {
  county_name: string;
  state: string;
  population_growth: number;
  growth_rate_percentage: number;
  total_movedin_2022: number;
  total_movedin_2021: number;
  total_movedin_2020: number;
  total_moves: number;
  state_rank?: number;
  national_rank?: number;
}

interface CompetitiveMarketMetric {
  COUNTYNAME: string;
  "State Name": string;
  employeeCount: number;
  followerCount: number;
  market_saturation?: number;
  state_rank?: number;
  national_rank?: number;
}

interface UnderservedRegionMetric {
  county_name: string;
  state_name: string;
  total_establishments: number;
  population: number;
  firms_per_10k_population: number;
  recent_movers: number;
  market_status: string;
  opportunity_status: string;
  state_rank?: number;
  national_rank?: number;
  median_income?: number;
}

interface EmergingTalentMarket {
  county_name: string;
  state_name: string;
  education_rate_percent: number;
  total_educated: number;
  education_growth_rate: number;
  median_age: number;
  state_rank?: number;
  national_rank?: number;
}

interface FutureSaturationRisk {
  county_name: string;
  state_name: string;
  current_firm_density: number;
  projected_firm_density: number;
  firm_growth_rate: number;
  population_growth_rate: number;
  state_rank?: number;
  national_rank?: number;
}

export function KeyInsightsPanel() {
  const navigate = useNavigate();

  const handleNavigateToMarket = (county: string, state: string) => {
    navigate(`/market-report/${state}/${county}`);
  };

  const { data: valueMetrics = [] } = useQuery({
    queryKey: ['valueMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_value_metrics');
      if (error) throw error;
      return data;
    },
  });

  const { data: marketGrowthMetrics = [] } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_growth_metrics');
      if (error) throw error;
      return data;
    },
  });

  const { data: competitiveMarkets = [] } = useQuery({
    queryKey: ['competitiveMarkets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('COUNTYNAME, "State Name", employeeCount, followerCount')
        .order('employeeCount', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      return data.map(market => ({
        ...market,
        market_saturation: (market.employeeCount / 1000) * 100
      }));
    },
  });

  const { data: underservedRegions = [] } = useQuery({
    queryKey: ['underservedRegions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_underserved_regions');
      if (error) throw error;
      return data;
    },
  });

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

  const { data: futureSaturationData = [] } = useQuery({
    queryKey: ['futureSaturationRisk'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_future_saturation_risk');
      if (error) throw error;
      return data.filter((region, index, self) =>
        index === self.findIndex(r => r.county_name === region.county_name)
      );
    },
  });

  const transformedValueMetrics = valueMetrics?.map(metric => ({
    ...metric,
    state_rank: metric.state_rank || undefined,
    national_rank: metric.national_rank || undefined
  }));

  const insights = [
    {
      title: "High-Value Markets",
      value: transformedValueMetrics?.[0] 
        ? `${transformedValueMetrics[0].county_name}, ${transformedValueMetrics[0].state_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {transformedValueMetrics?.[0] ? (
            <>
              {`$${(transformedValueMetrics[0].avg_revenue / 1000).toFixed(1)}K avg revenue, ${transformedValueMetrics[0].growth_potential.toFixed(1)}% growth potential`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">High-Value Markets</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {transformedValueMetrics?.slice(0, 5).map((market, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => handleNavigateToMarket(market.county_name, market.state_name)}
                      >
                        <h3 className="text-lg font-semibold text-white">{market.county_name}, {market.state_name}</h3>
                        <p className="text-sm text-gray-300">Median Income: ${market.median_income.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Average Revenue: ${(market.avg_revenue / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-300">Growth Potential: {market.growth_potential.toFixed(1)}%</p>
                        <div className="flex justify-between items-center mt-2">
                          {market.state_rank && (
                            <div className="text-right">
                              <p className="text-gray-500 text-xs mb-0.5">State Rank:</p>
                              <p className="text-2xl text-white/90 font-medium">{market.state_rank.toLocaleString()}</p>
                            </div>
                          )}
                          {market.national_rank && (
                            <div className="text-right">
                              <p className="text-gray-500 text-xs mb-0.5">National Rank:</p>
                              <p className="text-2xl text-blue-400/90 font-medium">{market.national_rank.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing market data"
          )}
        </div>
      ),
      icon: DollarSign,
    },
    {
      title: "Market Growth Leaders",
      value: marketGrowthMetrics?.[0] 
        ? `${marketGrowthMetrics[0].county_name}, ${marketGrowthMetrics[0].state}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {marketGrowthMetrics?.[0] ? (
            <>
              {`${marketGrowthMetrics[0].growth_rate_percentage.toFixed(1)}% growth rate, ${(marketGrowthMetrics[0].total_moves || 0).toLocaleString()} total moves`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Market Growth Leaders</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {marketGrowthMetrics?.slice(0, 5).map((region, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => handleNavigateToMarket(region.county_name, region.state)}
                      >
                        <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state}</h3>
                        <p className="text-sm text-gray-300">Growth Rate: {region.growth_rate_percentage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-300">Total Moves: {region.total_moves.toLocaleString()}</p>
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
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing regional data"
          )}
        </div>
      ),
      icon: TrendingUp,
    },
    {
      title: "Talent Availability",
      value: emergingTalentData[0] 
        ? `${emergingTalentData[0].county_name}, ${emergingTalentData[0].state_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {emergingTalentData[0] ? (
            <>
              {`${emergingTalentData[0].education_rate_percent.toFixed(1)}% education rate, ${emergingTalentData[0].total_educated.toLocaleString()} educated professionals`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Education Demographics</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {emergingTalentData?.map((region, index) => (
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
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing education data..."
          )}
        </div>
      ),
      icon: GraduationCap,
    },
    {
      title: "Market Competition",
      value: competitiveMarkets[0] 
        ? `${competitiveMarkets[0].COUNTYNAME}, ${competitiveMarkets[0]["State Name"]}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {competitiveMarkets[0] ? (
            <>
              {`${competitiveMarkets[0].employeeCount.toLocaleString()} employees, ${competitiveMarkets[0].followerCount.toLocaleString()} followers`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Market Competition</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {competitiveMarkets?.slice(0, 5).map((market, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => handleNavigateToMarket(market.COUNTYNAME, market["State Name"])}
                      >
                        <h3 className="text-lg font-semibold text-white">{market.COUNTYNAME}, {market["State Name"]}</h3>
                        <p className="text-sm text-gray-300">Employees: {market.employeeCount.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Followers: {market.followerCount.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Market Saturation: {(market.market_saturation || 0).toFixed(1)}%</p>
                        <div className="flex justify-between items-center mt-2">
                          {market.state_rank && (
                            <div className="text-right">
                              <p className="text-gray-500 text-xs mb-0.5">State Rank:</p>
                              <p className="text-2xl text-white/90 font-medium">{market.state_rank.toLocaleString()}</p>
                            </div>
                          )}
                          {market.national_rank && (
                            <div className="text-right">
                              <p className="text-gray-500 text-xs mb-0.5">National Rank:</p>
                              <p className="text-2xl text-blue-400/90 font-medium">{market.national_rank.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing market data..."
          )}
        </div>
      ),
      icon: Users,
    },
    {
      title: "Growth Opportunities",
      value: underservedRegions[0] 
        ? `${underservedRegions[0].county_name}, ${underservedRegions[0].state_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {underservedRegions[0] ? (
            <>
              {`${underservedRegions[0].market_status}, ${underservedRegions[0].opportunity_status}`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Growth Opportunities</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {underservedRegions?.slice(0, 5).map((region, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => handleNavigateToMarket(region.county_name, region.state_name)}
                      >
                        <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state_name}</h3>
                        <p className="text-sm text-gray-300">Market Status: {region.market_status}</p>
                        <p className="text-sm text-gray-300">Opportunity: {region.opportunity_status}</p>
                        <p className="text-sm text-gray-300">Firms per 10k: {region.firms_per_10k_population}</p>
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
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing market data"
          )}
        </div>
      ),
      icon: Target,
    },
    {
      title: "Market Saturation Risk",
      value: futureSaturationData[0] 
        ? `${futureSaturationData[0].county_name}, ${futureSaturationData[0].state_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {futureSaturationData[0] ? (
            <>
              {`Current: ${futureSaturationData[0].current_firm_density.toFixed(1)} firms/10k, Projected: ${futureSaturationData[0].projected_firm_density.toFixed(1)} firms/10k`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Market Saturation Risk Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {futureSaturationData?.map((region, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => handleNavigateToMarket(region.county_name, region.state_name)}
                      >
                        <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state_name}</h3>
                        <p className="text-sm text-gray-300">Current Density: {region.current_firm_density.toFixed(1)} firms/10k</p>
                        <p className="text-sm text-gray-300">Projected Density: {region.projected_firm_density.toFixed(1)} firms/10k</p>
                        <p className="text-sm text-gray-300">Growth Rate: {region.firm_growth_rate.toFixed(1)}%</p>
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
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing market data..."
          )}
        </div>
      ),
      icon: ChartBarIcon,
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Trending Insights</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <Card
            key={insight.title}
            className="p-6 bg-black/40 backdrop-blur-md border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <insight.icon className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-lg text-white">{insight.title}</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-2 min-h-[4rem] flex items-center">{insight.value}</p>
            <div className="text-sm text-white/80">{insight.insight}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
