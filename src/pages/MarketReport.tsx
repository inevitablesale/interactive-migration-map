import { useParams, useNavigate } from "react-router-dom";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  ArrowLeft,
  Brain,
  GraduationCap,
  ChartBar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";
import { getMetricColor } from '@/utils/market-report/formatters';
import { ColorScaleLegend } from "@/components/market-report/ColorScaleLegend";

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();
  
  const formattedCounty = county?.endsWith(" County") ? county : `${county} County`;
  const { marketData, isLoading, hasMarketData } = useMarketReportData(formattedCounty, state);

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-yellow-400" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111111] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-700 rounded w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasMarketData || !marketData) {
    return (
      <div className="min-h-screen bg-[#111111] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Market data not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg backdrop-blur-sm">
          <Button onClick={() => navigate(-1)} variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            Report generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4 bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {county}, {state}
              </h1>
              <p className="text-xl text-gray-400">Market Analysis Report</p>
            </div>
            <div className="mt-4 md:mt-0">
              <ColorScaleLegend />
            </div>
          </div>
        </div>

        {/* Market Status Badges */}
        <div className="flex flex-wrap gap-3 bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-white/10">
          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5">
            <TrendingUp className="w-4 h-4 mr-2" />
            Growth Market
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5">
            <GraduationCap className="w-4 h-4 mr-2" />
            High Education Rate
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 px-3 py-1.5">
            <Users className="w-4 h-4 mr-2" />
            Strong Demographics
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Population & Demographics */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Demographics</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Total Population</p>
                  <p className="text-3xl font-bold text-white">
                    {marketData.total_population?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.population_rank}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Median Income</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${marketData.median_household_income?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.income_rank}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Market Dynamics */}
          <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ChartBar className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Market Dynamics</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Firms per 10k Population</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-white">
                      {marketData.firms_per_10k_population?.toFixed(1)}
                    </p>
                    {getTrendIcon(marketData.growth_rate_percentage || 0)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.density_rank}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {marketData.growth_rate_percentage?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.growth_rank}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Education Distribution */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Education</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400">Bachelor's Degree</span>
                  <span className="text-lg font-medium text-white">
                    {((marketData.bachelors_degree_holders || 0) / (marketData.total_education_population || 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400">Master's Degree</span>
                  <span className="text-lg font-medium text-white">
                    {((marketData.masters_degree_holders || 0) / (marketData.total_education_population || 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400">Doctorate Degree</span>
                  <span className="text-lg font-medium text-white">
                    {((marketData.doctorate_degree_holders || 0) / (marketData.total_education_population || 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Industry Analysis */}
          <Card className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 border-white/10 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Industry Analysis</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Average Annual Payroll</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${((marketData.payann || 0) * 1000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Establishments</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {marketData.total_establishments?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Metrics */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Market Performance</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Employment</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {marketData.emp?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Public/Private Ratio</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {marketData.public_to_private_ratio?.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Vacancy Rate</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {(marketData.vacancy_rate || 0).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Market Rank</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    #{marketData.density_rank}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}