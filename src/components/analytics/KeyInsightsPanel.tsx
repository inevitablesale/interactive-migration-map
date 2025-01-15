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

interface CountyRanking {
  statefp: string;
  countyfp: string;
  COUNTYNAME: string;
  total_firms: number;
  population: number;
  firm_density: number;
  growth_rate: number;
  density_rank: number;
  growth_rank: number;
  state_density_avg: number;
  state_growth_avg: number;
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

async function fetchCountyRankings() {
  const { data, error } = await supabase
    .from('county_rankings')
    .select('*')
    .order('growth_rank', { ascending: true })
    .limit(1);
  if (error) throw error;
  return data || [];
}

export function KeyInsightsPanel() {
  const navigate = useNavigate();
  const { data: countyRankings } = useQuery({
    queryKey: ['countyRankings'],
    queryFn: fetchCountyRankings,
  });

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

  const topGrowthCounty = countyRankings?.[0];
  const topCompetitiveMarket = competitiveMetrics?.[0];
  const topUnderservedRegion = underservedMetrics?.[0];

  const insights = [
    {
      title: "Top Growth Region",
      value: topGrowthCounty 
        ? `${topGrowthCounty.COUNTYNAME || 'N/A'}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topGrowthCounty ? (
            <>
              {`${((topGrowthCounty.growth_rate || 0) * 100).toFixed(1)}% growth rate, ${(topGrowthCounty.total_firms || 0).toLocaleString()} firms`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Region Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Population: {(topGrowthCounty.B01001_001E || 0).toLocaleString()}</p>
                        <p>Firm Density: {(topGrowthCounty.firm_density || 0).toFixed(2)} per capita</p>
                        <p>Growth Rank: #{topGrowthCounty.growth_rank || 'N/A'}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
