import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, TrendingUp, GraduationCap, Briefcase, Car, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ComprehensiveMarketData } from "@/types/rankings";
import { ColorScaleLegend } from "@/components/market-report/ColorScaleLegend";
import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { formatCommuteTime, getMetricColor } from "@/utils/market-report/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();

  const { data: stateFips } = useQuery({
    queryKey: ['stateFips', state],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error('Error in stateFips query:', error);
        throw error;
      }
    },
  });

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateFips],
    queryFn: async () => {
      if (!stateFips) return null;
      
      console.log('Fetching data for:', { county, stateFips });
      
      try {
        const { data: rawData, error } = await supabase.rpc(
          'get_comprehensive_county_data',
          {
            p_county_name: county,
            p_state_fp: stateFips
          }
        );

        if (error) {
          console.error('Error fetching comprehensive market data:', error);
          toast.error('Error fetching market data');
          throw error;
        }

        if (!rawData || rawData.length === 0) {
          toast.error('No data found for this location');
          return null;
        }

        // Ensure we're working with the first result and proper typing
        const marketData = rawData[0] as unknown as ComprehensiveMarketData;
        
        // Ensure arrays are properly initialized
        return {
          ...marketData,
          top_firms: Array.isArray(marketData.top_firms) ? marketData.top_firms : [],
          adjacent_counties: Array.isArray(marketData.adjacent_counties) ? marketData.adjacent_counties : []
        };
      } catch (error) {
        console.error('Error in market data query:', error);
        toast.error('Failed to fetch market data');
        throw error;
      }
    },
    enabled: !!stateFips,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

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

  const populationMetrics = [
    {
      label: "Total Population",
      value: marketData.total_population?.toLocaleString(),
      type: "population" as const,
      rank: marketData.population_rank
    },
    {
      label: "Median Household Income",
      value: `$${marketData.median_household_income?.toLocaleString()}`,
      type: "money" as const,
      rank: marketData.income_rank
    }
  ];

  const housingMetrics = [
    {
      label: "Median Gross Rent",
      value: `$${marketData.median_gross_rent?.toLocaleString()}`,
      type: "money" as const,
      rank: marketData.rent_rank
    },
    {
      label: "Vacancy Rate",
      value: `${marketData.vacancy_rate?.toFixed(1)}%`,
      type: "saturation" as const,
      rank: marketData.vacancy_rank
    }
  ];

  const marketDynamicsMetrics = [
    {
      label: "Firms per 10k Population",
      value: marketData.firms_per_10k_population?.toFixed(1),
      type: "density" as const,
      rank: marketData.density_rank
    },
    {
      label: "Growth Rate",
      value: `${marketData.growth_rate_percentage?.toFixed(1)}%`,
      type: "growth" as const,
      rank: marketData.growth_rank
    },
    {
      label: "Average Commute Time",
      value: marketData.avg_commute_time ? formatCommuteTime(marketData.avg_commute_time) : null,
      type: "saturation" as const
    }
  ];

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
          <MarketMetricsCard
            title="Population Overview"
            icon={Users}
            metrics={populationMetrics}
          />
          <MarketMetricsCard
            title="Housing Metrics"
            icon={Building2}
            metrics={housingMetrics}
          />
          <MarketMetricsCard
            title="Market Dynamics"
            icon={TrendingUp}
            metrics={marketDynamicsMetrics}
          />
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