import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Building2, TrendingUp, GraduationCap, Briefcase, Car, DollarSign } from "lucide-react";
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
  firms_density_rank: number | null;
  growth_rank: number | null;
  bachelors_rank: number | null;
  masters_rank: number | null;
  doctorate_rank: number | null;
  employment_rank: number | null;
  salary_rank: number | null;
  sector_ratio_rank: number | null;
  saturation_rank: number | null;
  top_firms: TopFirm[] | null;
  state_avg_income: number | null;
  adjacent_counties: AdjacentCounty[] | null;
}

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

      return data[0] as ComprehensiveMarketData;
    },
    enabled: !!stateFips,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const formatCommuteTime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    return `${minutes.toFixed(1)} minutes/day`;
  };

  const formatRank = (rank: number | null) => {
    if (!rank) return '';
    return `(Rank: ${rank.toLocaleString()})`;
  };

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

        {/* County Overview */}
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
                <p className="text-2xl font-bold text-white">
                  {marketData.total_population?.toLocaleString() ?? 'N/A'}
                  <span className="text-sm ml-2 text-gray-400">
                    {formatRank(marketData.population_rank)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-400">Median Household Income</p>
                <p className="text-2xl font-bold text-green-400">
                  ${marketData.median_household_income?.toLocaleString() ?? 'N/A'}
                  <span className="text-sm ml-2 text-gray-400">
                    {formatRank(marketData.income_rank)}
                  </span>
                </p>
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
                <p className="text-2xl font-bold text-white">
                  ${marketData.median_gross_rent?.toLocaleString() ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Vacancy Rate</p>
                <p className="text-2xl font-bold text-white">
                  {marketData.vacancy_rate?.toFixed(1) ?? 'N/A'}%
                  <span className="text-sm ml-2 text-gray-400">
                    {formatRank(marketData.vacancy_rank)}
                  </span>
                </p>
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
                <p className="text-2xl font-bold text-white">
                  {marketData.firms_per_10k_population?.toFixed(1) ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Growth Rate</p>
                <p className={`text-xl font-bold ${marketData.growth_rate_percentage && marketData.growth_rate_percentage < 0 ? 'text-red-500' : 'text-white'}`}>
                  {marketData.growth_rate_percentage?.toFixed(1) ?? 'N/A'}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workforce Analysis */}
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
                <p className="text-xl font-bold text-white">
                  {marketData.total_education_population && marketData.bachelors_degree_holders
                    ? ((marketData.bachelors_degree_holders / marketData.total_education_population) * 100).toFixed(1)
                    : 'N/A'}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Master's Degree Holders</p>
                <p className="text-xl font-bold text-white">
                  {marketData.total_education_population && marketData.masters_degree_holders
                    ? ((marketData.masters_degree_holders / marketData.total_education_population) * 100).toFixed(1)
                    : 'N/A'}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Doctorate Degree Holders</p>
                <p className="text-xl font-bold text-white">
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
                Employment Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Employed Population</p>
                <p className="text-xl font-bold text-white">
                  {marketData.employed_population?.toLocaleString() ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Average Accountant Salary</p>
                <p className="text-xl font-bold text-green-400">
                  ${marketData.avg_accountant_payroll ? Math.round(marketData.avg_accountant_payroll * 1000).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Public/Private Sector Ratio</p>
                <p className="text-xl font-bold text-white">
                  {marketData.public_to_private_ratio?.toFixed(2) ?? 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Economic Indicators & Top Firms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Car className="w-5 h-5 mr-2" />
                Economic Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400">Average Commute Time</p>
                <p className="text-xl font-bold text-white">
                  {marketData.avg_commute_time ? formatCommuteTime(marketData.avg_commute_time) : 'N/A'}
                  <span className="text-sm ml-2 text-gray-400">
                    {formatRank(marketData.commute_rank)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-400">Poverty Rate</p>
                <p className="text-xl font-bold text-white">
                  {marketData.poverty_rate?.toFixed(1) ?? 'N/A'}%
                  <span className="text-sm ml-2 text-gray-400">
                    {formatRank(marketData.poverty_rank)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-400">Market Saturation Index</p>
                <p className="text-xl font-bold text-white">
                  {marketData.market_saturation_index?.toFixed(3) ?? 'N/A'}
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
                    <p className="text-white">{firm.follower_ratio.toFixed(1)}</p>
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
