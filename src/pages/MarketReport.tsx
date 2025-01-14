import { useParams, useNavigate } from "react-router-dom";
import { Users, Building2, TrendingUp, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorScaleLegend } from "@/components/market-report/ColorScaleLegend";
import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { EducationDistributionCard } from "@/components/market-report/EducationDistributionCard";
import { EmploymentMetricsCard } from "@/components/market-report/EmploymentMetricsCard";
import { AccountingIndustryCard } from "@/components/market-report/AccountingIndustryCard";
import { getMetricColor } from '@/utils/market-report/formatters';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AccountingIndustryCard marketData={marketData} />
          <EducationDistributionCard marketData={marketData} />
          <EmploymentMetricsCard marketData={marketData} />
        </div>

        {marketData.top_firms && marketData.top_firms.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="w-5 h-5 mr-2" />
                Top Firms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData.top_firms.map((firm, index) => (
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}