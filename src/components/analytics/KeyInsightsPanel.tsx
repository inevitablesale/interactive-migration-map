import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { 
  TrendingUp, Users, Target, InfoIcon, ArrowUpRight, Building2, 
  Users2, Home, GraduationCap, ChartBarIcon, BookOpen, Coins,
  DollarSign, Briefcase, LineChart, Building
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface MarketGrowthMetric {
  county_name: string;
  state: string;
  population_growth: number;
  growth_rate_percentage: number;
  total_movedin_2022: number;
  total_movedin_2021: number;
  total_movedin_2020: number;
  total_moves: number;
}

interface ValueMetric {
  county_name: string;
  median_income: number;
  median_home_value: number;
  total_firms: number;
  avg_revenue: number;
  growth_potential: number;
}

interface CompetitiveMarketMetric {
  "Company Name": string;
  "State Name": string;
  employeeCount: number;
  followerCount: number;
  COUNTYNAME: string;
  STATEFP: number;
  revenue_per_employee?: number;
  market_saturation?: number;
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
  median_income?: number;
}

interface EmergingTalentMarket {
  county_name: string;
  education_rate_percent: number;
  total_educated: number;
  education_growth_rate: number;
  median_age: number;
  private_to_public_ratio?: number;
}

interface FutureSaturationRisk {
  county_name: string;
  current_firm_density: number;
  projected_firm_density: number;
  firm_growth_rate: number;
  population_growth_rate: number;
  median_income?: number;
}

export function KeyInsightsPanel() {
  const navigate = useNavigate();

  const { data: marketGrowthMetrics } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_market_growth_metrics');
      if (error) throw error;
      return data as MarketGrowthMetric[];
    },
  });

  const { data: competitiveMarkets } = useQuery({
    queryKey: ['competitiveMarkets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .order('employeeCount', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as CompetitiveMarketMetric[];
    },
  });

  const { data: underservedRegions } = useQuery({
    queryKey: ['underservedRegions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_underserved_regions');
      if (error) throw error;
      return data as UnderservedRegionMetric[];
    },
  });

  const { data: emergingTalentData } = useQuery({
    queryKey: ['emergingTalentMarkets'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_emerging_talent_markets');
      if (error) throw error;
      return data as EmergingTalentMarket[];
    },
  });

  const { data: futureSaturationData } = useQuery({
    queryKey: ['futureSaturationRisk'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_future_saturation_risk');
      if (error) throw error;
      return data as FutureSaturationRisk[];
    },
  });

  const { data: countyRankings } = useQuery({
    queryKey: ['countyRankings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_county_rankings');
      if (error) throw error;
      return data;
    },
  });

  const transformedValueMetrics: ValueMetric[] = useMemo(() => {
    if (!countyRankings) return [];
    
    return countyRankings
      .filter(county => county.total_firms > 0)
      .map(county => ({
        county_name: county.countyname,
        median_income: county.state_density_avg * 50000, // Estimated based on density
        median_home_value: county.state_growth_avg * 100000, // Estimated based on growth
        total_firms: county.total_firms,
        avg_revenue: county.firm_density * 10000, // Estimated based on density
        growth_potential: county.growth_rate
      }))
      .sort((a, b) => b.avg_revenue - a.avg_revenue)
      .slice(0, 5);
  }, [countyRankings]);

  // Add state comparison data
  const { data: stateComparison } = useQuery({
    queryKey: ['stateComparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E')
        .order('ESTAB', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const topValueMetric = transformedValueMetrics?.[0];

  const insights = [
    {
      title: "High-Value Markets",
      value: topValueMetric 
        ? `${topValueMetric.county_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topValueMetric ? (
            <>
              {`$${(topValueMetric.avg_revenue / 1000).toFixed(1)}K avg revenue, ${topValueMetric.growth_potential.toFixed(1)}% growth potential`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">High-Value Markets</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {transformedValueMetrics?.slice(0, 5).map((market, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => navigate(`/market-report/${market.county_name}`)}
                      >
                        <h3 className="text-lg font-semibold text-white">{market.county_name}</h3>
                        <p className="text-sm text-gray-300">Median Income: ${market.median_income.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Average Revenue: ${(market.avg_revenue / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-300">Growth Potential: {market.growth_potential.toFixed(1)}%</p>
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
      value: topGrowthMetric 
        ? `${topGrowthMetric.county_name}, ${topGrowthMetric.state}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topGrowthMetric ? (
            <>
              {`${topGrowthMetric.growth_rate_percentage.toFixed(1)}% growth rate, ${(topGrowthMetric.total_moves || 0).toLocaleString()} total moves`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Market Growth Leaders</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {marketGrowthMetrics?.slice(0, 5).map((region, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => navigate(`/market-report/${region.county_name}/${region.state}`)}
                      >
                        <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state}</h3>
                        <p className="text-sm text-gray-300">Growth Rate: {region.growth_rate_percentage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-300">Total Moves: {region.total_moves.toLocaleString()}</p>
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
      value: topEmergingTalentMarket 
        ? `${topEmergingTalentMarket.county_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topEmergingTalentMarket ? (
            <>
              {`${topEmergingTalentMarket.education_rate_percent.toFixed(1)}% education rate, ${topEmergingTalentMarket.total_educated.toLocaleString()} educated professionals`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Talent Markets</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {emergingTalentData?.slice(0, 5).map((market, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white">{market.county_name}</h3>
                        <p className="text-sm text-gray-300">Education Rate: {market.education_rate_percent.toFixed(1)}%</p>
                        <p className="text-sm text-gray-300">Total Educated: {market.total_educated.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Median Age: {market.median_age}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing talent data..."
          )}
        </div>
      ),
      icon: GraduationCap,
    },
    {
      title: "Market Competition",
      value: topCompetitiveMarket 
        ? `${topCompetitiveMarket.COUNTYNAME}, ${topCompetitiveMarket["State Name"]}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topCompetitiveMarket ? (
            <>
              {`${topCompetitiveMarket.employeeCount.toLocaleString()} employees, ${topCompetitiveMarket.followerCount.toLocaleString()} followers`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Market Competition</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {competitiveMarkets?.slice(0, 5).map((market, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => navigate(`/market-report/${market.COUNTYNAME}/${market["State Name"]}`)}
                      >
                        <h3 className="text-lg font-semibold text-white">{market.COUNTYNAME}, {market["State Name"]}</h3>
                        <p className="text-sm text-gray-300">Employees: {market.employeeCount.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Followers: {market.followerCount.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Market Saturation: {(market.market_saturation || 0).toFixed(1)}%</p>
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
      value: topUnderservedRegion 
        ? `${topUnderservedRegion.county_name}, ${topUnderservedRegion.state_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topUnderservedRegion ? (
            <>
              {`${topUnderservedRegion.market_status}, ${topUnderservedRegion.opportunity_status}`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Growth Opportunities</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {underservedRegions?.slice(0, 5).map((region, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                        onClick={() => navigate(`/market-report/${region.county_name}/${region.state_name}`)}
                      >
                        <h3 className="text-lg font-semibold text-white">{region.county_name}, {region.state_name}</h3>
                        <p className="text-sm text-gray-300">Market Status: {region.market_status}</p>
                        <p className="text-sm text-gray-300">Opportunity: {region.opportunity_status}</p>
                        <p className="text-sm text-gray-300">Firms per 10k: {region.firms_per_10k_population}</p>
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
      value: topFutureSaturationRisk 
        ? `${topFutureSaturationRisk.county_name}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topFutureSaturationRisk ? (
            <>
              {`Current: ${topFutureSaturationRisk.current_firm_density.toFixed(1)} firms/10k, Projected: ${topFutureSaturationRisk.projected_firm_density.toFixed(1)} firms/10k`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Market Saturation Risk Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {futureSaturationData?.slice(0, 5).map((region, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white">{region.county_name}</h3>
                        <p className="text-sm text-gray-300">Current Density: {region.current_firm_density.toFixed(1)} per 10k</p>
                        <p className="text-sm text-gray-300">Projected Density: {region.projected_firm_density.toFixed(1)} per 10k</p>
                        <p className="text-sm text-gray-300">Growth Rate: {region.firm_growth_rate.toFixed(1)}%</p>
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
      <h2 className="text-3xl font-bold">Market Insights at a Glance</h2>
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
            <p className="text-2xl font-bold text-white mb-2">{insight.value}</p>
            <div className="text-sm text-white/80">{insight.insight}</div>
          </Card>
        ))}
      </div>

      {/* State Comparison Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">State Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stateComparison?.slice(0, 2).map((state, index) => (
            <Card key={index} className="p-6 bg-black/40 backdrop-blur-md border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">State {state.STATEFP}</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Establishments</span>
                  <span className="text-white font-medium">{state.ESTAB?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Employment</span>
                  <span className="text-white font-medium">{state.EMP?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Annual Payroll</span>
                  <span className="text-white font-medium">${(state.PAYANN / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Median Income</span>
                  <span className="text-white font-medium">${state.B19013_001E?.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
