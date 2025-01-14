import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, Users, Target, InfoIcon, ArrowUpRight, Building2, 
  Users2, Home, GraduationCap, AlertTriangle, BookOpen, DollarSign 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

const formatPopulation = (value: number) => {
  if (value < 1000) {
    return value.toString();
  }
  if (value < 1000000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${(value / 1000000).toFixed(1)}M`;
};

// Format density with proper decimal places
const formatDensity = (value: number) => {
  return value.toFixed(1);
};

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
  county_name: string;
  state_fp: string;
  county_fp: string;
  total_population: number;
  total_establishments: number;
  establishments_per_1000_population: number;
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

interface FutureSaturationMetric {
  county_name: string;
  current_firm_density: number;
  projected_firm_density: number;
  firm_growth_rate: number;
  population_growth_rate: number;
}

interface EmergingTalentMetric {
  county_name: string;
  education_rate_percent: number;
  total_educated: number;
  education_growth_rate: number;
  median_age: number;
}

interface AffordableTalentMetric {
  county_name: string;
  median_rent: number;
  accountant_density: number;
  vacancy_rate: number;
  affordability_score: number;
}

async function fetchMarketGrowthMetrics() {
  const { data, error } = await supabase.rpc('get_market_growth_metrics');
  if (error) throw error;
  return data as MarketGrowthMetric[];
}

async function fetchCompetitiveMarketMetrics() {
  const { data, error } = await supabase.rpc('get_competitive_market_metrics');
  if (error) throw error;
  return data as CompetitiveMarketMetric[];
}

async function fetchUnderservedRegions() {
  const { data, error } = await supabase.rpc('get_underserved_regions');
  if (error) throw error;
  return data as UnderservedRegionMetric[];
}

async function fetchFutureSaturationMetrics() {
  const { data, error } = await supabase.rpc('get_future_saturation_risk');
  if (error) throw error;
  return data as FutureSaturationMetric[];
}

async function fetchEmergingTalentMetrics() {
  const { data, error } = await supabase.rpc('get_emerging_talent_markets');
  if (error) throw error;
  return data as EmergingTalentMetric[];
}

async function fetchAffordableTalentMetrics() {
  const { data, error } = await supabase.rpc('get_affordable_talent_hubs');
  if (error) throw error;
  return data as AffordableTalentMetric[];
}

export function KeyInsightsPanel() {
  const { data: growthMetrics } = useQuery({
    queryKey: ['marketGrowthMetrics'],
    queryFn: fetchMarketGrowthMetrics,
  });

  const { data: competitiveMetrics } = useQuery({
    queryKey: ['competitiveMarketMetrics'],
    queryFn: fetchCompetitiveMarketMetrics,
  });

  const { data: underservedMetrics } = useQuery({
    queryKey: ['underservedRegions'],
    queryFn: fetchUnderservedRegions,
  });

  const { data: saturationData } = useQuery({
    queryKey: ['futureSaturationRisk'],
    queryFn: fetchFutureSaturationMetrics,
  });

  const { data: emergingTalentData } = useQuery({
    queryKey: ['emergingTalentMarkets'],
    queryFn: fetchEmergingTalentMetrics,
  });

  const { data: affordableTalentData } = useQuery({
    queryKey: ['affordableTalentHubs'],
    queryFn: fetchAffordableTalentMetrics,
  });

  const topGrowthRegion = growthMetrics?.[0];
  const topCompetitiveMarket = competitiveMetrics?.[0];
  const topUnderservedRegion = underservedMetrics?.[0];
  const topSaturationRisk = saturationData?.[0];
  const topEmergingMarket = emergingTalentData?.[0];
  const topAffordableHub = affordableTalentData?.[0];

  const insights = [
    {
      title: "Top Growth Region",
      value: topGrowthRegion 
        ? `${topGrowthRegion.county_name}, ${topGrowthRegion.state}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topGrowthRegion ? (
            <>
              {`${topGrowthRegion.growth_rate_percentage.toFixed(1)}% of national moves, ${topGrowthRegion.total_moves.toLocaleString()} total moves`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Move-in Distribution:</p>
                      <div className="text-sm text-gray-300">
                        <p>2022: {topGrowthRegion.total_movedin_2022.toLocaleString()}</p>
                        <p>2021: {topGrowthRegion.total_movedin_2021.toLocaleString()}</p>
                        <p>2020: {topGrowthRegion.total_movedin_2020.toLocaleString()}</p>
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p>Total Moves: {topGrowthRegion.total_moves.toLocaleString()}</p>
                          <p className="mt-1">
                            Represents {topGrowthRegion.growth_rate_percentage.toFixed(1)}% of all national moves
                          </p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Regions</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-4">Top Growth Regions</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
                        <div>Rank</div>
                        <div>Region</div>
                        <div>Growth Rate</div>
                        <div>Total Moves</div>
                      </div>
                      {growthMetrics?.map((region, index) => (
                        <div 
                          key={`${region.county_name}-${region.state}-${index}`}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-accent">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{region.county_name}</p>
                            <p className="text-sm text-white/60">{region.state}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400">+{region.growth_rate_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center">
                            {region.total_moves.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
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
        ? `${topCompetitiveMarket.county_name}, ${formatDensity(topCompetitiveMarket.establishments_per_1000_population)} firms/1k pop`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topCompetitiveMarket ? (
            <>
              {`${topCompetitiveMarket.total_establishments.toLocaleString()} establishments, ${formatPopulation(topCompetitiveMarket.total_population)} population`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Market Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Total Establishments: {topCompetitiveMarket.total_establishments.toLocaleString()}</p>
                        <p>Population: {topCompetitiveMarket.total_population.toLocaleString()}</p>
                        <p>Density: {formatDensity(topCompetitiveMarket.establishments_per_1000_population)} firms per 1,000 residents</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Markets</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-4">Top Competitive Markets</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
                        <div>Rank</div>
                        <div>Region</div>
                        <div>Establishments</div>
                        <div>Density</div>
                      </div>
                      {competitiveMetrics?.slice(0, 10).map((market, index) => (
                        <div 
                          key={`${market.county_name}-${market.state_fp}-${index}`}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-accent">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{market.county_name}</p>
                            <p className="text-sm text-white/60">State {market.state_fp}</p>
                          </div>
                          <div className="flex items-center">
                            {market.total_establishments.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            {formatDensity(market.establishments_per_1000_population)} per 1k
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing market data"
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Region Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>County: {topUnderservedRegion.county_name}</p>
                        <p>Population: {topUnderservedRegion.population.toLocaleString()}</p>
                        <p>Total Establishments: {topUnderservedRegion.total_establishments}</p>
                        <p>Recent Movers: {topUnderservedRegion.recent_movers.toLocaleString()}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Underserved Regions</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-4">Underserved Regions</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">
                        <div>Region</div>
                        <div>Firms per 10k</div>
                        <div>Market Status</div>
                        <div>Opportunity</div>
                      </div>
                      {underservedMetrics?.map((region, index) => (
                        <div 
                          key={`${region.county_name}-${region.state_name}-${index}`}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{region.county_name}</p>
                            <p className="text-sm text-white/60">{region.state_name}</p>
                          </div>
                          <div className="flex items-center">
                            {region.firms_per_10k_population.toFixed(1)}
                          </div>
                          <div className="flex items-center">
                            <span className={region.market_status === 'Underserved' ? 'text-yellow-400' : 'text-green-400'}>
                              {region.market_status}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={region.opportunity_status === 'High Opportunity' ? 'text-green-400' : 'text-yellow-400'}>
                              {region.opportunity_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
      title: "Future Saturation Risk",
      value: topSaturationRisk 
        ? `${topSaturationRisk.projected_firm_density.toFixed(1)} firms/10k pop`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topSaturationRisk ? (
            <>
              {`Current: ${topSaturationRisk.current_firm_density.toFixed(1)}, Growth: ${topSaturationRisk.firm_growth_rate.toFixed(1)}%`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Market Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Population Growth: {topSaturationRisk.population_growth_rate.toFixed(1)}%</p>
                        <p>Current Density: {topSaturationRisk.current_firm_density.toFixed(1)} firms/10k</p>
                        <p>Projected Density: {topSaturationRisk.projected_firm_density.toFixed(1)} firms/10k</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View All Risks</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Future Market Saturation Risks</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {saturationData?.map((region, index) => (
                        <div 
                          key={index}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{region.county_name}</p>
                          </div>
                          <div className="text-right">
                            <p>Current: {region.current_firm_density.toFixed(1)}</p>
                          </div>
                          <div className="text-right">
                            <p>Projected: {region.projected_firm_density.toFixed(1)}</p>
                          </div>
                          <div className="text-right">
                            <p>Growth: {region.firm_growth_rate.toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing market data..."
          )}
        </div>
      ),
      icon: AlertTriangle,
    },
    {
      title: "Emerging Talent Market",
      value: topEmergingMarket 
        ? `${topEmergingMarket.education_rate_percent.toFixed(1)}% educated`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topEmergingMarket ? (
            <>
              {`${topEmergingMarket.total_educated.toLocaleString()} educated professionals`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Market Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Education Rate: {topEmergingMarket.education_rate_percent.toFixed(1)}%</p>
                        <p>Growth Rate: {topEmergingMarket.education_growth_rate.toFixed(1)}%</p>
                        <p>Median Age: {topEmergingMarket.median_age}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Markets</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Emerging Talent Markets</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {emergingTalentData?.map((market, index) => (
                        <div 
                          key={index}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{market.county_name}</p>
                          </div>
                          <div className="text-right">
                            <p>{market.education_rate_percent.toFixed(1)}% educated</p>
                          </div>
                          <div className="text-right">
                            <p>{market.total_educated.toLocaleString()} total</p>
                          </div>
                          <div className="text-right">
                            <p>Age: {market.median_age}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
      title: "Affordable Talent Hub",
      value: topAffordableHub 
        ? `$${topAffordableHub.median_rent.toLocaleString()}/mo`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topAffordableHub ? (
            <>
              {`${topAffordableHub.accountant_density.toFixed(1)} accountants per 10k residents`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Hub Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Median Rent: ${topAffordableHub.median_rent.toLocaleString()}</p>
                        <p>Vacancy Rate: {topAffordableHub.vacancy_rate.toFixed(1)}%</p>
                        <p>Affordability Score: {topAffordableHub.affordability_score.toFixed(1)}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Hubs</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Affordable Talent Hubs</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {affordableTalentData?.map((hub, index) => (
                        <div 
                          key={index}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{hub.county_name}</p>
                          </div>
                          <div className="text-right">
                            <p>${hub.median_rent.toLocaleString()}/mo</p>
                          </div>
                          <div className="text-right">
                            <p>{hub.accountant_density.toFixed(1)} per 10k</p>
                          </div>
                          <div className="text-right">
                            <p>{hub.vacancy_rate.toFixed(1)}% vacant</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing housing data..."
          )}
        </div>
      ),
      icon: DollarSign,
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
