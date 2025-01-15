import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, Users, Target, InfoIcon, ArrowUpRight, Building2, 
  Users2, Home, GraduationCap, ChartBarIcon, BookOpen, Coins,
  DollarSign, Briefcase, LineChart, Building
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

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
  state: string;
  state_name: string;
  median_income: number;
  median_home_value: number;
  total_firms: number;
  avg_revenue: number;
  growth_potential: number;
  rank?: number;
  national_rank?: number;
}

interface CompetitiveMarketMetric {
  COUNTYNAME: string;
  "State Name": string;
  employeeCount: number;
  followerCount: number;
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
  state_name: string;
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
  state_name?: string;
}

export function KeyInsightsPanel() {
  const navigate = useNavigate();

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
      return data;
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

  const { data: stateData = [] } = useQuery({
    queryKey: ['stateComparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, ESTAB, EMP, PAYANN, B19013_001E')
        .limit(2);
      if (error) throw error;
      return data;
    },
  });

  const { data: countyRankings } = useQuery({
    queryKey: ['countyRankings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_rankings')
        .select('*')
        .order('firms_per_10k', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const transformedValueMetrics: ValueMetric[] = useMemo(() => {
    if (!countyRankings) return [];
    
    return countyRankings
      .filter((county, index, self) => 
        index === self.findIndex(c => c.COUNTYNAME === county.COUNTYNAME)
      )
      .filter(county => county.total_establishments > 0)
      .map(county => ({
        county_name: county.COUNTYNAME.endsWith(" County") ? county.COUNTYNAME : `${county.COUNTYNAME} County`,
        state: county.STATEFP,
        state_name: county.state_name || getStateNameFromFIPS(county.STATEFP),
        median_income: county.median_household_income || 0,
        median_home_value: county.median_home_value || 0,
        total_firms: county.total_establishments || 0,
        avg_revenue: (county.total_payroll || 0) / (county.total_establishments || 1),
        growth_potential: county.population_growth_rate || 0,
        rank: county.firm_density_rank,
        national_rank: county.national_firm_density_rank
      }))
      .sort((a, b) => b.avg_revenue - a.avg_revenue)
      .slice(0, 5);
  }, [countyRankings]);

  const handleNavigateToMarket = (county: string, state: string) => {
    let finalState = state;
    let finalCounty = county;
    
    if (!finalState && county.includes(',')) {
      const [countyPart, statePart] = county.split(',').map(s => s.trim());
      finalCounty = countyPart;
      finalState = statePart;
    }

    if (!finalState) {
      console.error('State is undefined for county:', county);
      return;
    }

    const formattedCounty = finalCounty.endsWith(" County") ? finalCounty : `${finalCounty} County`;
    navigate(`/market-report/${formattedCounty}/${finalState}`);
  };

  const insights = [
    {
      title: "High-Value Markets",
      value: transformedValueMetrics?.[0] 
        ? `${transformedValueMetrics[0].county_name}`
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
                        <h3 className="text-lg font-semibold text-white min-h-[3rem] flex items-center">{market.county_name}</h3>
                        <p className="text-sm text-gray-300">Median Income: ${market.median_income.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Average Revenue: ${(market.avg_revenue / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-300">Growth Potential: {market.growth_potential.toFixed(1)}%</p>
                        {(market.rank || market.national_rank) && (
                          <div className="flex justify-between items-center mt-2">
                            {market.rank && (
                              <div className="text-right">
                                <p className="text-gray-500 text-xs mb-0.5">State Rank:</p>
                                <p className="text-2xl text-white/90 font-medium">{market.rank.toLocaleString()}</p>
                              </div>
                            )}
                            {market.national_rank && (
                              <div className="text-right">
                                <p className="text-gray-500 text-xs mb-0.5">National Rank:</p>
                                <p className="text-2xl text-blue-400/90 font-medium">{market.national_rank.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        )}
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
                        <h3 className="text-lg font-semibold text-white">
                          {region.county_name}, {region.state_name}
                        </h3>
                        <p className="text-sm text-gray-300">Education Rate: {region.education_rate_percent.toFixed(1)}%</p>
                        <p className="text-sm text-gray-300">Total Educated: {region.total_educated.toLocaleString()}</p>
                        <p className="text-sm text-gray-300">Median Age: {Math.round(region.median_age)}</p>
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
        ? `${futureSaturationData[0].county_name}`
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
      <h2 className="text-3xl font-bold text-white">Market Insights at a Glance</h2>
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

function getStateNameFromFIPS(fips: string): string {
  const stateMap: { [key: string]: string } = {
    '01': 'Alabama',
    '02': 'Alaska',
    '04': 'Arizona',
    '05': 'Arkansas',
    '06': 'California',
    '08': 'Colorado',
    '09': 'Connecticut',
    '10': 'Delaware',
    '11': 'District of Columbia',
    '12': 'Florida',
    '13': 'Georgia',
    '15': 'Hawaii',
    '16': 'Idaho',
    '17': 'Illinois',
    '18': 'Indiana',
    '19': 'Iowa',
    '20': 'Kansas',
    '21': 'Kentucky',
    '22': 'Louisiana',
    '23': 'Maine',
    '24': 'Maryland',
    '25': 'Massachusetts',
    '26': 'Michigan',
    '27': 'Minnesota',
    '28': 'Mississippi',
    '29': 'Missouri',
    '30': 'Montana',
    '31': 'Nebraska',
    '32': 'Nevada',
    '33': 'New Hampshire',
    '34': 'New Jersey',
    '35': 'New Mexico',
    '36': 'New York',
    '37': 'North Carolina',
    '38': 'North Dakota',
    '39': 'Ohio',
    '40': 'Oklahoma',
    '41': 'Oregon',
    '42': 'Pennsylvania',
    '44': 'Rhode Island',
    '45': 'South Carolina',
    '46': 'South Dakota',
    '47': 'Tennessee',
    '48': 'Texas',
    '49': 'Utah',
    '50': 'Vermont',
    '51': 'Virginia',
    '53': 'Washington',
    '54': 'West Virginia',
    '55': 'Wisconsin',
    '56': 'Wyoming'
  };
  return stateMap[fips] || fips;
}
