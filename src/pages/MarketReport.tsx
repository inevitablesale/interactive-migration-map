import { useParams, useNavigate } from "react-router-dom";
import { 
  Users, Building2, TrendingUp, DollarSign, ArrowLeft, 
  LayoutGrid, Globe, Users2, Calendar, Briefcase, Star, 
  Search, MapPin, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorScaleLegend } from "@/components/market-report/ColorScaleLegend";
import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { EducationDistributionCard } from "@/components/market-report/EducationDistributionCard";
import { EmploymentMetricsCard } from "@/components/market-report/EmploymentMetricsCard";
import { AccountingIndustryCard } from "@/components/market-report/AccountingIndustryCard";
import { MarketRankingBadges } from "@/components/market-report/MarketRankingBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketReportData } from "@/hooks/useMarketReportData";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
const FIRMS_PER_PAGE = 6;

export default function MarketReport() {
  const { county, state } = useParams();
  const navigate = useNavigate();
  
  const formattedCounty = county?.endsWith(" County") ? county : `${county} County`;
  const { marketData, isLoading, hasMarketData } = useMarketReportData(formattedCounty, state);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-white/80">Loading comprehensive market data...</div>
        </div>
      </div>
    );
  }

  if (!hasMarketData || !marketData) {
    return (
      <div className="min-h-screen bg-[#0B1120] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Market not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  const filteredFirms = marketData.top_firms?.filter(firm => 
    firm.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const totalPages = Math.ceil(filteredFirms.length / FIRMS_PER_PAGE);
  const paginatedFirms = filteredFirms.slice(
    (currentPage - 1) * FIRMS_PER_PAGE,
    currentPage * FIRMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#1a1c2a]">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {county}, {state}
              </h1>
              <p className="text-gray-400">Market Analysis Report</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="p-4 rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 mb-4">
            <h3 className="text-sm font-medium text-white mb-2">Metric Scale:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-white/60">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-xs text-white/60">Strong</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-white/60">Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-xs text-white/60">Below Avg</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-xs text-white/60">Low</span>
              </div>
            </div>
          </div>
          <MarketRankingBadges marketData={marketData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MarketMetricsCard
                title="Population Overview"
                icon={Users}
                metrics={[
                  {
                    label: "Total Population",
                    value: marketData.total_population?.toLocaleString(),
                    type: "population",
                    rank: marketData.population_rank
                  },
                  {
                    label: "Median Household Income",
                    value: `$${marketData.median_household_income?.toLocaleString()}`,
                    type: "money",
                    rank: marketData.income_rank
                  }
                ]}
              />
              <MarketMetricsCard
                title="Housing Market"
                icon={Building2}
                metrics={[
                  {
                    label: "Median Gross Rent",
                    value: `$${marketData.median_gross_rent?.toLocaleString()}`,
                    type: "money",
                    rank: marketData.rent_rank
                  },
                  {
                    label: "Vacancy Rate",
                    value: `${marketData.vacancy_rate?.toFixed(1)}%`,
                    type: "saturation",
                    rank: marketData.vacancy_rank
                  }
                ]}
              />
              <MarketMetricsCard
                title="Market Dynamics"
                icon={TrendingUp}
                metrics={[
                  {
                    label: "Firms per 10k Population",
                    value: marketData.firms_per_10k_population?.toFixed(1),
                    type: "density",
                    rank: marketData.density_rank
                  },
                  {
                    label: "Growth Rate",
                    value: `${marketData.growth_rate_percentage?.toFixed(1)}%`,
                    type: "growth",
                    rank: marketData.growth_rank
                  }
                ]}
              />
            </div>

            <AccountingIndustryCard marketData={marketData} />
          </div>

          <div className="space-y-6">
            <EducationDistributionCard marketData={marketData} />
            <EmploymentMetricsCard marketData={marketData} />
          </div>
        </div>

        {marketData.top_firms && marketData.top_firms.length > 0 && (
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center text-white">
                  <LayoutGrid className="w-5 h-5 mr-2" />
                  Leading Firms
                </CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search firms..."
                    className="pl-8 bg-black/20 border-white/10 text-white"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedFirms.map((firm, index) => (
                  <Card key={index} className="group overflow-hidden bg-gradient-to-br from-black/60 to-black/40 hover:from-black/70 hover:to-black/50 border-white/5 transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative h-32">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
                        <img
                          src={firm.logoResolutionResult || firm.originalCoverImage || DEFAULT_IMAGE}
                          alt={`${firm.company_name} cover`}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <h3 className="text-white font-medium truncate text-lg">
                            {firm.company_name}
                          </h3>
                          {firm.Location && (
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{firm.Location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        {firm.Summary && (
                          <div className="space-y-1">
                            <p className="text-gray-400 text-sm">Summary</p>
                            <p className="text-white text-sm line-clamp-3">{firm.Summary}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-400 text-sm">
                              <Users2 className="w-4 h-4 mr-1" />
                              <span>Employees</span>
                            </div>
                            <p className="text-white font-medium">
                              {firm.employeeCountRangeLow && firm.employeeCountRangeHigh
                                ? `${firm.employeeCountRangeLow}-${firm.employeeCountRangeHigh}`
                                : firm.employee_count}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-400 text-sm">
                              <Users className="w-4 h-4 mr-1" />
                              <span>Followers</span>
                            </div>
                            <p className="text-white font-medium">
                              {firm.follower_count.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {firm.foundedOn && (
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-400 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Founded</span>
                            </div>
                            <p className="text-white font-medium">{firm.foundedOn}</p>
                          </div>
                        )}

                        {firm.specialities && (
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-400 text-sm">
                              <Star className="w-4 h-4 mr-1" />
                              <span>Specialities</span>
                            </div>
                            <p className="text-white text-sm">{firm.specialities}</p>
                          </div>
                        )}

                        {firm.websiteUrl && (
                          <div className="pt-2 border-t border-white/5">
                            <a
                              href={firm.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-400 hover:text-blue-300 text-sm group"
                            >
                              <Globe className="w-4 h-4 mr-1" />
                              <span className="truncate">{firm.websiteUrl}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className="text-white hover:text-white"
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="text-white hover:text-white"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className="text-white hover:text-white"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}