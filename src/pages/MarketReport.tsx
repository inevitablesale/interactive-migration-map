import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Building2, TrendingUp, GraduationCap, Briefcase, Calculator, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TopFirm {
  company_name: string;
  employee_count: number;
  follower_count: number;
  follower_ratio: number;
}

interface AdjacentCounty {
  county_name: string;
  population: number;
  median_income: number;
}

interface ComprehensiveMarketData {
  total_population: number | null;
  median_household_income: number | null;
  median_gross_rent: number | null;
  median_home_value: number | null;
  employed_population: number | null;
  private_sector_accountants: number | null;
  public_sector_accountants: number | null;
  firms_per_10k_population: number | null;
  growth_rate_percentage: number | null;
  market_saturation_index: number | null;
  total_education_population: number | null;
  bachelors_degree_holders: number | null;
  masters_degree_holders: number | null;
  doctorate_degree_holders: number | null;
  avg_accountant_payroll: number | null;
  public_to_private_ratio: number | null;
  avg_commute_time: number | null;
  commute_rank: number | null;
  poverty_rate: number | null;
  poverty_rank: number | null;
  vacancy_rate: number | null;
  vacancy_rank: number | null;
  income_rank: number | null;
  population_rank: number | null;
  rent_rank: number | null;
  density_rank: number | null;
  growth_rank: number | null;
  top_firms: TopFirm[] | null;
  state_avg_income: number | null;
  adjacent_counties: AdjacentCounty[] | null;
}

const calculateAccountantsPerFirm = (private_accountants: number, public_accountants: number, total_firms: number) => {
  if (total_firms === 0) return 0;
  return ((private_accountants + public_accountants) / total_firms).toFixed(2);
};

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();

  const { data: stateFips } = useQuery({
    queryKey: ['stateFips', state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('fips_code')
        .eq('state', state)
        .single();

      if (error) {
        console.error('Error fetching state FIPS:', error);
        toast.error('Error fetching state data');
        throw error;
      }

      return data.fips_code;
    },
  });

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips) return null;
      
      console.log('Fetching data for:', { county, stateFips });
      
      const { data, error } = await supabase.rpc('get_comprehensive_county_data', {
        p_county_name: county,
        p_state_fp: stateFips
      });

      if (error) {
        console.error('Error fetching comprehensive market data:', error);
        toast.error('Error fetching market data');
        throw error;
      }

      if (!data || data.length === 0) {
        toast.error('No data found for this location');
        return null;
      }

      const rawData = data[0] as unknown;
      const typedData = rawData as ComprehensiveMarketData;
      
      if (typedData.top_firms) {
        typedData.top_firms = JSON.parse(JSON.stringify(typedData.top_firms));
      }
      if (typedData.adjacent_counties) {
        typedData.adjacent_counties = JSON.parse(JSON.stringify(typedData.adjacent_counties));
      }

      return typedData;
    },
    enabled: !!stateFips,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const formatCommuteTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutesPerDay = Math.round(seconds / 60);
    return `${minutesPerDay} minutes/day`;
  };

  const formatRank = (rank: number | null) => {
    if (!rank) return 'N/A';
    return `#${rank.toLocaleString()}`;
  };

  const getMetricColor = (value: number, type: 'growth' | 'density' | 'saturation' | 'money' | 'population' | 'education' | 'housing' | 'employment') => {
    switch(type) {
      case 'population':
        if (value >= 1000000) return 'text-purple-400'; // High population
        if (value >= 500000) return 'text-purple-500'; // Medium population
        return 'text-purple-600'; // Low population
      case 'money':
        if (value >= 75000) return 'text-green-400';
        if (value >= 50000) return 'text-green-500';
        return 'text-green-600';
      case 'housing':
        if (value >= 2000) return 'text-sky-400';
        if (value >= 1000) return 'text-sky-500';
        return 'text-sky-600';
      case 'employment':
        if (value >= 70) return 'text-rose-400';
        if (value >= 50) return 'text-rose-500';
        return 'text-rose-600';
      case 'education':
        if (value >= 40) return 'text-indigo-400';
        if (value >= 25) return 'text-indigo-500';
        return 'text-indigo-600';
      case 'growth':
        if (value >= 5) return 'text-teal-400';
        if (value >= 0) return 'text-teal-500';
        return 'text-red-500';
      case 'density':
        if (value >= 2) return 'text-blue-400';
        if (value >= 1) return 'text-blue-500';
        return 'text-blue-600';
      case 'saturation':
        if (value <= 0.3) return 'text-emerald-400';
        if (value <= 0.5) return 'text-emerald-500';
        return 'text-emerald-600';
      default:
        return 'text-white';
    }
  };

  const ColorScaleLegend = () => (
    <div className="bg-black/40 backdrop-blur-md border-white/10 p-6 rounded-lg mb-8">
      <h3 className="text-white text-lg font-medium mb-4">Metric Color Scale</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Population & Demographics</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-sm text-white/60">High (&gt;1M)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-white/60">Medium (500k-1M)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-white/60">Low (&lt;500k)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Education Levels</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                <span className="text-sm text-white/60">High (&gt;40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-white/60">Medium (25-40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-sm text-white/60">Low (&lt;25%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Housing Market</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                <span className="text-sm text-white/60">High Value (&gt;$2000)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                <span className="text-sm text-white/60">Medium ($1000-$2000)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-600"></div>
                <span className="text-sm text-white/60">Low (&lt;$1000)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Market Growth</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                <span className="text-sm text-white/60">High Growth (≥5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="text-sm text-white/60">Stable (0-5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-white/60">Declining (&lt;0%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Market Density</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm text-white/60">High (≥2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-white/60">Medium (1-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-white/60">Low (&lt;1)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Employment</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <span className="text-sm text-white/60">High (&gt;70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-sm text-white/60">Medium (50-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-600"></div>
                <span className="text-sm text-white/60">Low (&lt;50%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Market Saturation</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-white/60">Low (&lt;30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-white/60">Medium (30-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span className="text-sm text-white/60">High (&gt;50%)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Financial Metrics</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-white/60">High (&gt;$75k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-white/60">Medium ($50k-$75k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm text-white/60">Low (&lt;$50k)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading comprehensive market data...</div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Market not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  const accountantsPerFirm = calculateAccountantsPerFirm(
    marketData.private_sector_accountants || 0,
    marketData.public_sector_accountants || 0,
    marketData.firms_per_10k_population ? (marketData.firms_per_10k_population * marketData.total_population / 10000) : 0
  );

  return (
    <div className="min-h-screen bg-[#222222] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
          <h1 className="text-4xl font-bold text-white">
            {county}, {state}
          </h1>
          <p className="text-gray-400 mt-2">Comprehensive Market Analysis</p>
        </div>

        <ColorScaleLegend />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2" />
                Population Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Total Population</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.total_population || 0, 'population')}`}>
                    {marketData.total_population?.toLocaleString() ?? 'N/A'}
                  </p>
                  <span className="text-sm text-gray-400">{formatRank(marketData.population_rank)}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Median Household Income</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.median_household_income || 0, 'money')}`}>
                    ${marketData.median_household_income?.toLocaleString() ?? 'N/A'}
                  </p>
                  <span className="text-sm text-gray-400">{formatRank(marketData.income_rank)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Building2 className="w-5 h-5 mr-2" />
                Housing Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Median Gross Rent</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.median_gross_rent || 0, 'money')}`}>
                    ${marketData.median_gross_rent?.toLocaleString() ?? 'N/A'}
                  </p>
                  <span className="text-sm text-gray-400">{formatRank(marketData.rent_rank)}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Vacancy Rate</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.vacancy_rate || 0, 'saturation')}`}>
                    {marketData.vacancy_rate?.toFixed(1) ?? 'N/A'}%
                  </p>
                  <span className="text-sm text-gray-400">{formatRank(marketData.vacancy_rank)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="w-5 h-5 mr-2" />
                Market Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Firms per 10k Population</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.firms_per_10k_population || 0, 'density')}`}>
                    {marketData.firms_per_10k_population?.toFixed(1) ?? 'N/A'}
                  </p>
                  <span className="text-sm text-gray-400">{formatRank(marketData.density_rank)}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Growth Rate</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.growth_rate_percentage || 0, 'growth')}`}>
                    {marketData.growth_rate_percentage?.toFixed(1) ?? 'N/A'}%
                  </p>
                  <span className="text-sm text-gray-400">{formatRank(marketData.growth_rank)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Bachelor's Degree Holders</p>
                <p className={`text-xl font-bold ${getMetricColor(
                  marketData.total_education_population && marketData.bachelors_degree_holders
                    ? (marketData.bachelors_degree_holders / marketData.total_education_population) * 100
                    : 0,
                  'density'
                )}`}>
                  {marketData.total_education_population && marketData.bachelors_degree_holders
                    ? ((marketData.bachelors_degree_holders / marketData.total_education_population) * 100).toFixed(1)
                    : 'N/A'}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Master's Degree Holders</p>
                <p className={`text-xl font-bold ${getMetricColor(
                  marketData.total_education_population && marketData.masters_degree_holders
                    ? (marketData.masters_degree_holders / marketData.total_education_population) * 100
                    : 0,
                  'density'
                )}`}>
                  {marketData.total_education_population && marketData.masters_degree_holders
                    ? ((marketData.masters_degree_holders / marketData.total_education_population) * 100).toFixed(1)
                    : 'N/A'}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Doctorate Degree Holders</p>
                <p className={`text-xl font-bold ${getMetricColor(
                  marketData.total_education_population && marketData.doctorate_degree_holders
                    ? (marketData.doctorate_degree_holders / marketData.total_education_population) * 100
                    : 0,
                  'density'
                )}`}>
                  {marketData.total_education_population && marketData.doctorate_degree_holders
                    ? ((marketData.doctorate_degree_holders / marketData.total_education_population) * 100).toFixed(1)
                    : 'N/A'}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Briefcase className="w-5 h-5 mr-2" />
                Employment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Employed Population</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.employed_population || 0, 'population')}`}>
                  {marketData.employed_population?.toLocaleString() ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Average Commute Time</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.avg_commute_time || 0, 'saturation')}`}>
                  {marketData.avg_commute_time ? formatCommuteTime(marketData.avg_commute_time) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Poverty Rate</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.poverty_rate || 0, 'saturation')}`}>
                  {marketData.poverty_rate?.toFixed(1) ?? 'N/A'}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Calculator className="w-5 h-5 mr-2" />
                Accounting Industry Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Average Accountant Salary</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.avg_accountant_payroll || 0, 'money')}`}>
                  ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Public/Private Sector Ratio</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.public_to_private_ratio || 0, 'density')}`}>
                  {marketData.public_to_private_ratio?.toFixed(2) ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Private Sector Accountants</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.private_sector_accountants || 0, 'population')}`}>
                  {marketData.private_sector_accountants?.toLocaleString() ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Public Sector Accountants</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.public_sector_accountants || 0, 'population')}`}>
                  {marketData.public_sector_accountants?.toLocaleString() ?? 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="w-5 h-5 mr-2" />
                Top Firms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData.top_firms?.slice(0, 5).map((firm, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{firm.company_name}</p>
                    <p className="text-sm text-gray-400">{firm.employee_count} employees</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Follower Ratio</p>
                    <p className={`text-white ${getMetricColor(firm.follower_ratio, 'density')}`}>
                      {firm.follower_ratio.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
              {(!marketData.top_firms || marketData.top_firms.length === 0) && (
                <p className="text-gray-400">No firm data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
