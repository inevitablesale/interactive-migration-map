import { useParams, useNavigate } from "react-router-dom";
import { Users, Building2, TrendingUp, ArrowLeft, Brain, GraduationCap, ChartBar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";
import { getMetricColor } from '@/utils/market-report/formatters';
import { AccountingIndustryCard } from "@/components/market-report/AccountingIndustryCard";
import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { EmploymentMetricsCard } from "@/components/market-report/EmploymentMetricsCard";

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
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
              Developing Market
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
              Moderate Growth
            </Badge>
          </div>
        </div>

        {/* Accounting Industry Metrics */}
        <div className="mb-6">
          <AccountingIndustryCard marketData={marketData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Population Overview */}
          <MarketMetricsCard
            title="Population Overview"
            icon={Users}
            metrics={[
              {
                label: "Total Population",
                value: marketData.total_population?.toLocaleString(),
                type: 'population',
                rank: marketData.population_rank
              },
              {
                label: "Median Household Income",
                value: `$${marketData.median_household_income?.toLocaleString()}`,
                type: 'money',
                rank: marketData.income_rank
              }
            ]}
          />

          {/* Housing Metrics */}
          <MarketMetricsCard
            title="Housing Metrics"
            icon={Building2}
            metrics={[
              {
                label: "Median Gross Rent",
                value: `$${marketData.median_gross_rent?.toLocaleString()}`,
                type: 'money',
                rank: marketData.rent_rank
              },
              {
                label: "Vacancy Rate",
                value: `${marketData.vacancy_rate?.toFixed(1)}%`,
                type: 'saturation',
                rank: marketData.vacancy_rank
              }
            ]}
          />

          {/* Market Dynamics */}
          <MarketMetricsCard
            title="Market Dynamics"
            icon={TrendingUp}
            metrics={[
              {
                label: "Firms per 10k Population",
                value: marketData.firms_per_10k_population?.toFixed(1),
                type: 'density',
                rank: marketData.density_rank
              },
              {
                label: "Growth Rate",
                value: `${marketData.growth_rate_percentage?.toFixed(1)}%`,
                type: 'growth',
                rank: marketData.growth_rank
              }
            ]}
          />

          {/* Education Distribution */}
          <MarketMetricsCard
            title="Education Distribution"
            icon={GraduationCap}
            metrics={[
              {
                label: "Bachelor's Degree",
                value: `${((marketData.bachelors_degree_holders || 0) / (marketData.total_education_population || 1) * 100).toFixed(1)}%`,
                type: 'density'
              },
              {
                label: "Master's Degree",
                value: `${((marketData.masters_degree_holders || 0) / (marketData.total_education_population || 1) * 100).toFixed(1)}%`,
                type: 'density'
              },
              {
                label: "Doctorate Degree",
                value: `${((marketData.doctorate_degree_holders || 0) / (marketData.total_education_population || 1) * 100).toFixed(1)}%`,
                type: 'density'
              }
            ]}
          />
        </div>

        {/* Employment Distribution */}
        <div className="mb-6">
          <EmploymentMetricsCard marketData={marketData} />
        </div>

        {/* Top Firms Section */}
        {marketData.top_firms && marketData.top_firms.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChartBar className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg text-white">Top Firms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketData.top_firms.slice(0, 6).map((firm, index) => (
                <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      {firm.logoResolutionResult && (
                        <img
                          src={firm.logoResolutionResult}
                          alt={firm.company_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-medium">{firm.company_name}</h3>
                        <p className="text-gray-400 text-sm">{firm.primarySubtitle}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Employees</p>
                            <p className="text-white">{firm.employee_count.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Followers</p>
                            <p className="text-white">{firm.follower_count.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(firm.Location || firm.Summary || firm.specialities) && (
                      <div className="border-t border-white/10 pt-3 mt-2">
                        {firm.Location && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-gray-300 text-sm">{firm.Location}</p>
                          </div>
                        )}
                        {firm.Summary && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500">Summary</p>
                            <p className="text-gray-300 text-sm line-clamp-2">{firm.Summary}</p>
                          </div>
                        )}
                        {firm.specialities && (
                          <div>
                            <p className="text-xs text-gray-500">Specialties</p>
                            <p className="text-gray-300 text-sm line-clamp-2">{firm.specialities}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}