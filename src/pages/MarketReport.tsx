import { useParams, useNavigate } from "react-router-dom";
import { Users, Building2, TrendingUp, DollarSign, ArrowLeft, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorScaleLegend } from "@/components/market-report/ColorScaleLegend";
import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { EducationDistributionCard } from "@/components/market-report/EducationDistributionCard";
import { EmploymentMetricsCard } from "@/components/market-report/EmploymentMetricsCard";
import { AccountingIndustryCard } from "@/components/market-report/AccountingIndustryCard";
import { MarketRankingBadges } from "@/components/market-report/MarketRankingBadges";
import { getMetricColor } from '@/utils/market-report/formatters';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();
  const { marketData, isLoading, hasMarketData } = useMarketReportData(county, state);

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
    }
  ];

  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Header Section */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {county}, {state}
              </h1>
              <p className="text-gray-400 mt-2">Comprehensive Market Analysis</p>
            </div>
            <MarketRankingBadges marketData={marketData} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <ColorScaleLegend />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Industry Analysis */}
            <AccountingIndustryCard marketData={marketData} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <EducationDistributionCard marketData={marketData} />
            <EmploymentMetricsCard marketData={marketData} />
          </div>
        </div>

        {/* Top Firms Section */}
        {marketData.top_firms && marketData.top_firms.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <LayoutGrid className="w-5 h-5 mr-2" />
                Leading Firms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketData.top_firms.map((firm, index) => (
                  <Card key={index} className="bg-black/20 border-white/5">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={firm.logoResolutionResult || firm.originalCoverImage || DEFAULT_IMAGE}
                            alt={`${firm.company_name} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{firm.company_name}</h3>
                          <p className="text-sm text-gray-400">{firm.employee_count} employees</p>
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Follower Ratio</p>
                            <p className={`text-sm ${getMetricColor(firm.follower_ratio, 'density')}`}>
                              {firm.follower_ratio.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {firm.specialities && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-400">Specialization</p>
                          <p className="text-sm text-white mt-1">{firm.specialities}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}