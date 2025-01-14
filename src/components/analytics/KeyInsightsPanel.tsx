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

const formatPopulation = (value: number) => {
  if (value < 1000) {
    return value.toString();
  }
  if (value < 1000000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${(value / 1000000).toFixed(1)}M`;
};

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
  const { data, error } = await supabase.rpc('get_competitive_market_metrics');
  if (error) throw error;
  return data as CompetitiveMarketMetric[];
}

async function fetchUnderservedRegions() {
  const { data, error } = await supabase.rpc('get_underserved_regions');
  if (error) throw error;
  return data as UnderservedRegionMetric[];
}

export function KeyInsightsPanel() {
  const navigate = useNavigate();
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

  const { data: employeeRentData } = useQuery({
    queryKey: ['employeeRentAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_employee_rent_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: followerData } = useQuery({
    queryKey: ['followerAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_follower_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: vacancyData } = useQuery({
    queryKey: ['vacancyAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vacancy_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: educationData } = useQuery({
    queryKey: ['educationAgeAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_education_age_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: futureSaturationData } = useQuery({
    queryKey: ['futureSaturationRisk'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_future_saturation_risk');
      if (error) throw error;
      return data as FutureSaturationRisk[];
    }
  });

  const { data: emergingTalentData } = useQuery({
    queryKey: ['emergingTalentMarkets'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_emerging_talent_markets');
      if (error) throw error;
      return data as EmergingTalentMarket[];
    }
  });

  const { data: affordableTalentData } = useQuery({
    queryKey: ['affordableTalentHubs'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_affordable_talent_hubs');
      if (error) throw error;
      return data;
    }
  });

  const topGrowthRegion = growthMetrics?.[0];
  const topCompetitiveMarket = competitiveMetrics?.[0];
  const topUnderservedRegion = underservedMetrics?.[0];

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
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            navigate(`/market-report/${encodeURIComponent(region.county_name)}/${encodeURIComponent(region.state)}`);
                          }}
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
      title: "Employee Density",
      value: employeeRentData?.[0] ? 
        `${Math.round(employeeRentData[0].employees_per_1k_population)} per 1k` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {employeeRentData?.[0] ? (
            <>
              {`${employeeRentData[0].total_employees.toLocaleString()} employees in ${employeeRentData[0].county_name}`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Region Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Population: {employeeRentData[0].total_population.toLocaleString()}</p>
                        <p>Median Rent: ${employeeRentData[0].median_gross_rent.toLocaleString()}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Details</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Employee Density Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {employeeRentData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">State {region.state_fp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{Math.round(region.employees_per_1k_population)} per 1k</p>
                            <p className="text-sm text-gray-400">{region.total_employees.toLocaleString()} employees</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing employee data..."
          )}
        </div>
      ),
      icon: Building2,
    },
    {
      title: "Social Engagement",
      value: followerData?.[0] ? 
        `${Math.round(followerData[0].followers_per_employee)}x` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {followerData?.[0] ? (
            <>
              {`${followerData[0].follower_count.toLocaleString()} followers, ${followerData[0].employee_count} employees`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <p className="text-sm text-gray-300">Followers per employee ratio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Companies</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Social Media Engagement Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {followerData?.map((company, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{company.company_name}</h4>
                            <p className="text-sm text-gray-400">{company.employee_count} employees</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{Math.round(company.followers_per_employee)}x</p>
                            <p className="text-sm text-gray-400">{company.follower_count.toLocaleString()} followers</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing social data..."
          )}
        </div>
      ),
      icon: Users2,
    },
    {
      title: "Housing Availability",
      value: vacancyData?.[0] ? 
        `${(vacancyData[0].vacant_to_occupied_ratio * 100).toFixed(1)}%` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {vacancyData?.[0] ? (
            <>
              {`${vacancyData[0].county_name}, ${Math.round(vacancyData[0].firms_per_10k_population)} firms per 10k residents`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Vacancy Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Total Firms: {vacancyData[0].firm_count}</p>
                        <p>Vacancy Ratio: {(vacancyData[0].vacant_to_occupied_ratio * 100).toFixed(1)}%</p>
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
                    <DialogTitle>Housing Market Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {vacancyData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">State {region.state_fp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {(region.vacant_to_occupied_ratio * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-400">
                              {Math.round(region.firms_per_10k_population)} firms/10k pop
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing housing data..."
          )}
        </div>
      ),
      icon: Home,
    },
    {
      title: "Education Level",
      value: educationData?.[0] ? 
        `${educationData[0].masters_degree_percent.toFixed(1)}%` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {educationData?.[0] ? (
            <>
              {`${educationData[0].county_name}, median age ${Math.round(educationData[0].median_age)}`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Education Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Masters Degree: {educationData[0].masters_degree_percent.toFixed(1)}%</p>
                        <p>Total Firms: {educationData[0].firm_count}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Demographics</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Education Demographics</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {educationData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">State {region.state_fp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {region.masters_degree_percent.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-400">
                              Median Age: {Math.round(region.median_age)}
                            </p>
                          </div>
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
  ];

  const newInsights = [
    {
      title: "Future Saturation Risk",
      value: futureSaturationData?.[0] ? 
        `${futureSaturationData[0].projected_firm_density?.toFixed(1) || '0'} per 10k` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {futureSaturationData?.[0] ? (
            <>
              {`${futureSaturationData[0].county_name}, ${(futureSaturationData[0].firm_growth_rate || 0).toFixed(1)}% growth`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Saturation Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Current Density: {futureSaturationData[0].current_firm_density?.toFixed(1) || '0'} per 10k</p>
                        <p>Population Growth: {(futureSaturationData[0].population_growth_rate || 0).toFixed(1)}%</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Projections</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Future Market Saturation Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {futureSaturationData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">
                              Current Density: {region.current_firm_density?.toFixed(1) || '0'} per 10k
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {region.projected_firm_density?.toFixed(1) || '0'} per 10k
                            </p>
                            <p className="text-sm text-gray-400">
                              Growth: {(region.firm_growth_rate || 0).toFixed(1)}%
                            </p>
                          </div>
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
    {
      title: "Emerging Talent Markets",
      value: emergingTalentData?.[0] ? 
        `${emergingTalentData[0].education_rate_percent?.toFixed(1)}%` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {emergingTalentData?.[0] ? (
            <>
              {`${emergingTalentData[0].county_name}, ${emergingTalentData[0].total_educated?.toLocaleString()} educated professionals`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Education Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Education Rate: {emergingTalentData[0].education_rate_percent?.toFixed(1)}%</p>
                        <p>Growth Rate: {emergingTalentData[0].education_growth_rate?.toFixed(1)}%</p>
                        <p>Median Age: {emergingTalentData[0].median_age}</p>
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
                  <div className="mt-4 space-y-4">
                    {emergingTalentData?.map((market, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{market.county_name}</h4>
                            <p className="text-sm text-gray-400">
                              {market.total_educated?.toLocaleString()} educated professionals
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {market.education_rate_percent?.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-400">
                              Growth: {market.education_growth_rate?.toFixed(1)}%
                            </p>
                          </div>
                        </div>
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
      title: "Affordable Talent Hubs",
      value: affordableTalentData?.[0] ? 
        `$${affordableTalentData[0].median_rent.toLocaleString()}` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {affordableTalentData?.[0] ? (
            <>
              {`${affordableTalentData[0].county_name}, ${affordableTalentData[0].accountant_density.toFixed(1)} accountants per 10k`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Hub Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Median Rent: ${affordableTalentData[0].median_rent.toLocaleString()}</p>
                        <p>Vacancy Rate: {affordableTalentData[0].vacancy_rate.toFixed(1)}%</p>
                        <p>Affordability Score: {affordableTalentData[0].affordability_score.toFixed(1)}</p>
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
                  <div className="mt-4 space-y-4">
                    {affordableTalentData?.map((hub, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{hub.county_name}</h4>
                            <p className="text-sm text-gray-400">
                              {hub.accountant_density.toFixed(1)} accountants per 10k
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              ${hub.median_rent.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              Score: {hub.affordability_score.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing hub data..."
          )}
        </div>
      ),
      icon: Coins,
    },
  ];

  const allInsights = [...insights, ...newInsights];

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Market Insights at a Glance</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allInsights.map((insight) => (
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
