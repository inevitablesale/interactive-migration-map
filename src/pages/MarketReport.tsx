import { useParams, useNavigate } from "react-router-dom";
import { Users, Building2, TrendingUp, ArrowLeft, Brain, GraduationCap, DollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";
import { getMetricColor } from '@/utils/market-report/formatters';

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();
  
  const formattedCounty = county?.endsWith(" County") ? county : `${county} County`;
  const { marketData, isLoading, hasMarketData } = useMarketReportData(formattedCounty, state);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111111] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-white">Loading comprehensive market data...</div>
        </div>
      </div>
    );
  }

  if (!hasMarketData || !marketData) {
    return (
      <div className="min-h-screen bg-[#111111] p-8">
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

  const marketStatus = marketData.market_saturation_index && marketData.market_saturation_index > 50 
    ? 'Mature Market' 
    : 'Growth Market';

  const educationStatus = marketData.masters_degree_holders && marketData.total_education_population
    ? ((marketData.masters_degree_holders / marketData.total_education_population) > 0.1
      ? 'Strong Talent Pool'
      : 'Developing Talent')
    : 'Analyzing Talent';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111111] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={() => navigate(-1)} variant="ghost" className="text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">{county}, {state}</h1>
            <p className="text-gray-400 mt-2">Comprehensive Market Analysis</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
              {marketStatus}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30">
              {educationStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Population & Growth */}
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Population & Growth</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Total Population</p>
                <p className="text-2xl font-bold text-white">
                  {marketData.total_population?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Growth Rate</p>
                <p className={`text-xl font-semibold ${getMetricColor(marketData.growth_rate_percentage || 0, 'growth')}`}>
                  {marketData.growth_rate_percentage?.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          {/* Economic Indicators */}
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Economic Indicators</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Median Income</p>
                <p className="text-2xl font-bold text-white">
                  ${marketData.median_household_income?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Income Rank</p>
                <p className="text-xl font-semibold text-green-400">
                  #{marketData.income_rank?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Housing Market */}
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Housing Market</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Median Home Value</p>
                <p className="text-2xl font-bold text-white">
                  ${marketData.median_home_value?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Median Rent</p>
                <p className="text-xl font-semibold text-yellow-400">
                  ${marketData.median_gross_rent?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Market Dynamics */}
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Market Dynamics</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Firms per 10k Population</p>
                <p className="text-2xl font-bold text-white">
                  {marketData.firms_per_10k_population?.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Density Rank</p>
                <p className="text-xl font-semibold text-purple-400">
                  #{marketData.density_rank?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Education & Workforce */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Education & Workforce</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Total Workforce</p>
              <p className="text-2xl font-bold text-white">
                {marketData.employed_population?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Bachelor's Degree</p>
              <p className="text-2xl font-bold text-white">
                {marketData.bachelors_degree_holders?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Master's Degree</p>
              <p className="text-2xl font-bold text-white">
                {marketData.masters_degree_holders?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Doctorate Degree</p>
              <p className="text-2xl font-bold text-white">
                {marketData.doctorate_degree_holders?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Top Firms */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Top Firms</h2>
          </div>
          <div className="space-y-4">
            {marketData.top_firms?.map((firm, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{firm.company_name}</h3>
                    <p className="text-sm text-gray-400">{firm.primarySubtitle || 'Professional Services'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{firm.employee_count} employees</p>
                    <p className="text-sm text-blue-400">{firm.follower_count} followers</p>
                  </div>
                </div>
                {firm.specialities && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">Specialties:</p>
                    <p className="text-sm text-gray-300">{firm.specialities}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}