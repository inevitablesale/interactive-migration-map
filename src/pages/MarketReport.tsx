import { useParams, useNavigate } from "react-router-dom";
import { Users, Building2, TrendingUp, ArrowLeft, Brain, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";
import { getMetricColor } from '@/utils/market-report/formatters';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();
  
  const formattedCounty = county?.endsWith(" County") ? county : `${county} County`;
  const { marketData, isLoading, hasMarketData } = useMarketReportData(formattedCounty, state);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading comprehensive market data...</div>
        </div>
      </div>
    );
  }

  if (!hasMarketData || !marketData) {
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
    <div className="min-h-screen bg-[#111111]">
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
            <Badge variant="secondary" className="bg-orange-600/20 text-orange-400 hover:bg-orange-600/30">
              Developing Market
            </Badge>
            <Badge variant="secondary" className="bg-orange-600/20 text-orange-400 hover:bg-orange-600/30">
              Emerging Talent
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
              Moderate Growth
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
          <span>Metric Scale:</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Strong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span>Below Avg</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>Low</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Population Overview */}
          <Card className="bg-[#1A1A1A] border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg text-white">Population Overview</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Population</p>
                  <p className="text-4xl font-bold text-indigo-400">
                    {marketData.total_population?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.population_rank}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Median Household Income</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${marketData.median_household_income?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.income_rank}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Housing Metrics */}
          <Card className="bg-[#1A1A1A] border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg text-white">Housing Metrics</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Median Gross Rent</p>
                  <p className="text-4xl font-bold text-green-400">
                    ${marketData.median_gross_rent?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.rent_rank}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Vacancy Rate</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {marketData.vacancy_rate?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.vacancy_rank}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Market Dynamics */}
          <Card className="bg-[#1A1A1A] border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg text-white">Market Dynamics</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Firms per 10k Population</p>
                  <p className="text-4xl font-bold text-blue-400">
                    {marketData.firms_per_10k_population?.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.density_rank}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Growth Rate</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {marketData.growth_rate_percentage?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Rank: {marketData.growth_rank}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Education Distribution */}
          <Card className="bg-[#1A1A1A] border-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg text-white">Education Distribution</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400">Bachelor's Degree</span>
                  <span className="text-white font-medium">20.5%</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400">Master's Degree</span>
                  <span className="text-white font-medium">8.2%</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400">Doctorate Degree</span>
                  <span className="text-white font-medium">1.4%</span>
                </div>
                <div className="flex justify-between items-baseline mt-4">
                  <span className="text-gray-400">Total Population</span>
                  <span className="text-white font-medium">2,995,908</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Accounting Industry Metrics */}
        <Card className="bg-[#1A1A1A] border-gray-800 mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg text-white">Accounting Industry Metrics</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400">Total Establishments</p>
                  <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                    Average
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  4.2 per 10k residents
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400">Average Annual Payroll per Firm</p>
                  <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400">
                    High Performance
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-400">$832.5K</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400">Average Salary per Employee</p>
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                    Strong
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-green-400">$75.9K</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Employment Distribution */}
        <Card className="bg-[#1A1A1A] border-gray-800">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg text-white">Employment Distribution</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Private Sector Accountants</span>
                <span className="text-white font-medium">472,800</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Public Sector Accountants</span>
                <span className="text-white font-medium">1,670,049</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Public/Private Ratio</span>
                <span className="text-blue-400 font-medium">3.53</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}