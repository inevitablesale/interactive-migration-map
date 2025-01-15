import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, Users, Target, InfoIcon, ArrowUpRight, Building2, 
  Users2, Home, GraduationCap, ChartBarIcon, BookOpen, Coins
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

interface CompetitiveMarketMetric {
  "Company Name": string;
  "State Name": string;
  employeeCount: number;
  followerCount: number;
  COUNTYNAME: string;
  STATEFP: number;
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
}

interface EmergingTalentMarket {
  county_name: string;
  education_rate_percent: number;
  total_educated: number;
  education_growth_rate: number;
  median_age: number;
}

interface FutureSaturationRisk {
  county_name: string;
  current_firm_density: number;
  projected_firm_density: number;
  firm_growth_rate: number;
  population_growth_rate: number;
}

async function fetchMarketGrowthMetrics() {
  const { data, error } = await supabase.rpc('get_market_growth_metrics');
  if (error) throw error;
  return data as MarketGrowthMetric[];
}

async function fetchCompetitiveMarketMetrics() {
  const { data, error } = await supabase
    .from('canary_firms_data')
    .select('*')
    .order('employeeCount', { ascending: false })
    .limit(5);
  
  if (error) throw error;
  return data as CompetitiveMarketMetric[];
}

async function fetchUnderservedRegions() {
  const { data, error } = await supabase.rpc('get_underserved_regions');
  if (error) throw error;
  return data as UnderservedRegionMetric[];
}

async function fetchEmergingTalentMarkets() {
  const { data, error } = await supabase.rpc('get_emerging_talent_markets');
  if (error) throw error;
  return data as EmergingTalentMarket[];
}

async function fetchFutureSaturationRisk() {
  const { data, error } = await supabase.rpc('get_future_saturation_risk');
  if (error) throw error;
  return data as FutureSaturationRisk[];
}

export function KeyInsightsPanel() {
  const navigate = useNavigate();
  const { data: marketGrowthMetrics } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: fetchMarketGrowthMetrics,
  });

  const { data: competitiveMarkets } = useQuery({
    queryKey: ['competitiveMarkets'],
    queryFn: fetchCompetitiveMarketMetrics,
  });

  const { data: underservedRegions } = useQuery({
    queryKey: ['underservedRegions'],
    queryFn: fetchUnderservedRegions,
  });

  const { data: emergingTalentData } = useQuery({
    queryKey: ['emergingTalentMarkets'],
    queryFn: fetchEmergingTalentMarkets,
  });

  const { data: futureSaturationData } = useQuery({
    queryKey: ['futureSaturationRisk'],
    queryFn: fetchFutureSaturationRisk,
  });

  const topGrowthMetric = marketGrowthMetrics?.[0];
  const topCompetitiveMarket = competitiveMarkets?.[0];
  const topUnderservedRegion = underservedRegions?.[0];
  const topEmergingTalentMarket = emergingTalentData?.[0];
  const topFutureSaturationRisk = futureSaturationData?.[0];

  const insights = [
    {
      title: "Top Growth Region",
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
                    <DialogTitle className="text-xl font-bold text-white">Top Growth Regions</DialogTitle>
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
      title: "Competitive Market",
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
                    <DialogTitle className="text-xl font-bold text-white">Top Competitive Markets</DialogTitle>
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
      title: "Underserved Region",
      value: topUnderservedRegion 
        ? `${topUnderservedRegion.state_name}, ${topUnderservedRegion.firms_per_10k_population} firms/10k`
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
                    <DialogTitle className="text-xl font-bold text-white">Underserved Regions</DialogTitle>
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
      title: "Emerging Talent Markets",
      value: topEmergingTalentMarket 
        ? `${topEmergingTalentMarket.county_name}, ${topEmergingTalentMarket.total_educated.toLocaleString()} educated professionals`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topEmergingTalentMarket ? (
            <>
              {`${topEmergingTalentMarket.education_rate_percent.toFixed(1)}% education rate`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Emerging Talent Markets</DialogTitle>
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
      icon: BookOpen,
    },
    {
      title: "Future Saturation Risk",
      value: topFutureSaturationRisk 
        ? `${topFutureSaturationRisk.projected_firm_density?.toFixed(1) || '0'} per 10k`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topFutureSaturationRisk ? (
            <>
              {`${topFutureSaturationRisk.county_name}, ${(topFutureSaturationRisk.firm_growth_rate || 0).toFixed(1)}% growth`}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Future Saturation Risk Analysis</DialogTitle>
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
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </section>
  );
}