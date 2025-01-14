import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, InfoIcon, ArrowUpRight, Building2, 
  Users2, Home, GraduationCap, ChartBarIcon, BookOpen, Coins } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import type { CountyRanking } from "@/types/analytics";

interface KeyInsightsPanelProps {
  rankingsData?: CountyRanking[];
}

export function KeyInsightsPanel({ rankingsData }: KeyInsightsPanelProps) {
  const navigate = useNavigate();

  // Process rankings data for insights
  const topGrowthRegions = rankingsData 
    ? [...rankingsData].sort((a, b) => (b.growth_rate || 0) - (a.growth_rate || 0)).slice(0, 5)
    : [];

  const topDensityRegions = rankingsData
    ? [...rankingsData].sort((a, b) => b.firm_density - a.firm_density).slice(0, 5)
    : [];

  const insights = [
    {
      title: "Top Growth Region",
      value: topGrowthRegions[0] 
        ? `${topGrowthRegions[0].countyname}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topGrowthRegions[0] ? (
            <>
              {`${topGrowthRegions[0].growth_rate?.toFixed(1)}% growth, ${topGrowthRegions[0].total_firms.toLocaleString()} firms`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Growth Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Total Firms: {topGrowthRegions[0].total_firms.toLocaleString()}</p>
                        <p>Growth Rate: {topGrowthRegions[0].growth_rate?.toFixed(1)}%</p>
                        <p>Population: {topGrowthRegions[0].population.toLocaleString()}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Regions</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Top Growth Regions</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {topGrowthRegions.map((region, index) => (
                        <div 
                          key={`${region.countyfp}-${region.statefp}`}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            navigate(`/market-report/${encodeURIComponent(region.countyname)}/${encodeURIComponent(region.statefp)}`);
                          }}
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-accent">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{region.countyname}</p>
                            <p className="text-sm text-white/60">State {region.statefp}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400">+{region.growth_rate?.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center">
                            {region.total_firms.toLocaleString()} firms
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing growth data..."
          )}
        </div>
      ),
      icon: TrendingUp,
    },
    {
      title: "Top Density Region",
      value: topDensityRegions[0] 
        ? `${topDensityRegions[0].countyname}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topDensityRegions[0] ? (
            <>
              {`${topDensityRegions[0].firm_density.toFixed(1)} firms/10k, ${topDensityRegions[0].total_firms.toLocaleString()} firms`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Density Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Total Firms: {topDensityRegions[0].total_firms.toLocaleString()}</p>
                        <p>Firm Density: {topDensityRegions[0].firm_density.toFixed(1)} firms/10k</p>
                        <p>Population: {topDensityRegions[0].population.toLocaleString()}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Regions</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Top Density Regions</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {topDensityRegions.map((region, index) => (
                        <div 
                          key={`${region.countyfp}-${region.statefp}`}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            navigate(`/market-report/${encodeURIComponent(region.countyname)}/${encodeURIComponent(region.statefp)}`);
                          }}
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-accent">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{region.countyname}</p>
                            <p className="text-sm text-white/60">State {region.statefp}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400">{region.firm_density.toFixed(1)} firms/10k</span>
                          </div>
                          <div className="flex items-center">
                            {region.total_firms.toLocaleString()} firms
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing density data..."
          )}
        </div>
      ),
      icon: Users,
    },
    {
      title: "Top Opportunity Region",
      value: topDensityRegions[0] 
        ? `${topDensityRegions[0].countyname}`
        : "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {topDensityRegions[0] ? (
            <>
              {`${topDensityRegions[0].firm_density.toFixed(1)} firms/10k, ${topDensityRegions[0].total_firms.toLocaleString()} firms`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Opportunity Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Total Firms: {topDensityRegions[0].total_firms.toLocaleString()}</p>
                        <p>Firm Density: {topDensityRegions[0].firm_density.toFixed(1)} firms/10k</p>
                        <p>Population: {topDensityRegions[0].population.toLocaleString()}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Regions</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Top Opportunity Regions</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      {topDensityRegions.map((region, index) => (
                        <div 
                          key={`${region.countyfp}-${region.statefp}`}
                          className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            navigate(`/market-report/${encodeURIComponent(region.countyname)}/${encodeURIComponent(region.statefp)}`);
                          }}
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-accent">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{region.countyname}</p>
                            <p className="text-sm text-white/60">State {region.statefp}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400">{region.firm_density.toFixed(1)} firms/10k</span>
                          </div>
                          <div className="flex items-center">
                            {region.total_firms.toLocaleString()} firms
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing opportunity data..."
          )}
        </div>
      ),
      icon: Target,
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Market Insights at a Glance</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {insights.map((insight) => (
          <Card
            key={insight.title}
            className="p-6 bg-black/40 backdrop-blur-md border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <insight.icon className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-lg text-white">{insight.title}</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{insight.value}</p>
            <div className="text-sm text-white/80">{insight.insight}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
