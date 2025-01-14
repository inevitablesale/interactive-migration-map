import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Building2, TrendingUp, GraduationCap, Briefcase, Car, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";

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
        .maybeSingle();

      if (error) {
        console.error('Error fetching state FIPS:', error);
        toast.error('Error fetching state data');
        throw error;
      }

      return data?.fips_code;
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

      const marketData = data[0] as unknown as ComprehensiveMarketData;
      
      // Ensure top_firms and adjacent_counties are properly typed arrays
      marketData.top_firms = Array.isArray(marketData.top_firms) 
        ? marketData.top_firms 
        : [];
      
      marketData.adjacent_counties = Array.isArray(marketData.adjacent_counties)
        ? marketData.adjacent_counties
        : [];

      return marketData;
    },
    enabled: !!stateFips,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const formatCommuteTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    // Convert seconds to minutes
    const minutesPerDay = Math.round(seconds / 60);
    return `${minutesPerDay} minutes/day`;
  };

  const formatRank = (rank: number | null) => {
    if (!rank) return '';
    return `(Rank: ${rank.toLocaleString()})`;
  };

  const getMetricColor = (value: number, type: 'growth' | 'density' | 'saturation' | 'money' | 'population') => {
    switch(type) {
      case 'growth':
        if (value >= 5) return 'text-emerald-400';
        if (value >= 0) return 'text-yellow-400';
        return 'text-red-400';
      case 'density':
        if (value >= 2) return 'text-blue-400';
        if (value >= 1) return 'text-indigo-400';
        return 'text-purple-400';
      case 'saturation':
        if (value <= 0.3) return 'text-teal-400';
        if (value <= 0.5) return 'text-cyan-400';
        return 'text-sky-400';
      case 'money':
        return 'text-green-400';
      case 'population':
        return 'text-violet-400';
      default:
        return 'text-white';
    }
  };

  const calculateAccountantsPerFirm = (private_accountants: number, public_accountants: number, total_firms: number) => {
    if (!total_firms) return 0;
    return ((private_accountants + public_accountants) / total_firms).toFixed(1);
  };

  const ColorScaleLegend = () => (
    <div className="bg-black/40 backdrop-blur-md border-white/10 p-4 rounded-lg mb-6">
      <h3 className="text-white text-sm font-medium mb-3">Metric Color Scale</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">Population</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-400"></div>
              <span className="text-xs text-white/60">High (&gt;1M)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-300"></div>
              <span className="text-xs text-white/60">Medium (500k-1M)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-200"></div>
              <span className="text-xs text-white/60">Low (&lt;500k)</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Financial</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs text-white/60">High (&gt;$75k)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-300"></div>
              <span className="text-xs text-white/60">Medium ($50k-$75k)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-200"></div>
              <span className="text-xs text-white/60">Low (&lt;$50k)</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Growth</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-white/60">High growth (≥5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-xs text-white/60">Stable (0-5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-xs text-white/60">Declining (&lt;0%)</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Density</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-xs text-white/60">High (≥2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
              <span className="text-xs text-white/60">Medium (1-2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-xs text-white/60">Low (&lt;1)</span>
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
                  <span className="text-sm text-gray-400">Rank: {marketData.population_rank}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Median Household Income</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.median_household_income || 0, 'money')}`}>
                    ${marketData.median_household_income?.toLocaleString() ?? 'N/A'}
                  </p>
                  <span className="text-sm text-gray-400">Rank: {marketData.income_rank}</span>
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
                  <span className="text-sm text-gray-400">Rank: {marketData.rent_rank}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Vacancy Rate</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.vacancy_rate || 0, 'saturation')}`}>
                    {marketData.vacancy_rate?.toFixed(1) ?? 'N/A'}%
                  </p>
                  <span className="text-sm text-gray-400">Rank: {marketData.vacancy_rank}</span>
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
                  <span className="text-sm text-gray-400">Rank: {marketData.density_rank}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Growth Rate</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getMetricColor(marketData.growth_rate_percentage || 0, 'growth')}`}>
                    {marketData.growth_rate_percentage?.toFixed(1) ?? 'N/A'}%
                  </p>
                  <span className="text-sm text-gray-400">Rank: {marketData.growth_rank}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Average Commute Time</p>
                <p className={`text-xl font-bold ${getMetricColor(marketData.avg_commute_time || 0, 'saturation')}`}>
                  {marketData.avg_commute_time ? formatCommuteTime(marketData.avg_commute_time) : 'N/A'}
                </p>
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
                Employment Metrics
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
            </CardContent>
          </Card>
        </div>

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
