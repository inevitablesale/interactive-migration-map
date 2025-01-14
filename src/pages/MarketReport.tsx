import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Building2, TrendingUp, GraduationCap, Briefcase, Car, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ComprehensiveMarketData {
  total_population: number;
  median_household_income: number;
  median_gross_rent: number;
  median_home_value: number;
  employed_population: number;
  private_sector_accountants: number;
  public_sector_accountants: number;
  firms_per_10k_population: number;
  growth_rate_percentage: number;
  market_saturation_index: number;
  total_education_population: number;
  bachelors_degree_holders: number;
  masters_degree_holders: number;
  doctorate_degree_holders: number;
  avg_accountant_payroll: number;
  public_to_private_ratio: number;
  avg_commute_time: number;
  poverty_rate: number;
  vacancy_rate: number;
  top_firms: Array<{
    company_name: string;
    employee_count: number;
    follower_count: number;
    follower_ratio: number;
  }>;
  state_avg_income: number;
  adjacent_counties: Array<{
    county_name: string;
    population: number;
    median_income: number;
  }>;
}

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['comprehensiveMarketData', county, state],
    queryFn: async () => {
      console.log('Fetching data for:', { county, state });
      const { data, error } = await supabase.rpc('get_comprehensive_county_data', {
        p_county_name: county,
        p_state_fp: state
      });
      
      if (error) {
        console.error('Error fetching comprehensive market data:', error);
        throw error;
      }

      if (!data) {
        console.log('No market data found for:', { county, state });
        return null;
      }

      return data as ComprehensiveMarketData;
    },
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
                <p className="text-2xl font-bold text-white">{marketData.total_population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Median Household Income</p>
                <p className="text-2xl font-bold text-green-400">${marketData.median_household_income.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-white">${marketData.median_gross_rent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Vacancy Rate</p>
                <p className="text-2xl font-bold text-white">{marketData.vacancy_rate.toFixed(1)}%</p>
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
                <p className="text-2xl font-bold text-white">{marketData.firms_per_10k_population.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {marketData.growth_rate_percentage > 0 ? '+' : ''}{marketData.growth_rate_percentage.toFixed(1)}%
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
                  {((marketData.bachelors_degree_holders / marketData.total_education_population) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Master's Degree Holders</p>
                <p className="text-xl font-bold text-white">
                  {((marketData.masters_degree_holders / marketData.total_education_population) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Doctorate Degree Holders</p>
                <p className="text-xl font-bold text-white">
                  {((marketData.doctorate_degree_holders / marketData.total_education_population) * 100).toFixed(1)}%
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
                <p className="text-xl font-bold text-white">{marketData.employed_population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Average Accountant Payroll</p>
                <p className="text-xl font-bold text-green-400">${marketData.avg_accountant_payroll.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Public/Private Sector Ratio</p>
                <p className="text-xl font-bold text-white">{marketData.public_to_private_ratio.toFixed(2)}</p>
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
                <p className="text-xl font-bold text-white">{marketData.avg_commute_time} minutes</p>
              </div>
              <div>
                <p className="text-gray-400">Poverty Rate</p>
                <p className="text-xl font-bold text-white">{marketData.poverty_rate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Market Saturation Index</p>
                <p className="text-xl font-bold text-white">{marketData.market_saturation_index.toFixed(3)}</p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}