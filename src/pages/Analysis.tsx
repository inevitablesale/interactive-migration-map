import { ChartBar, Users, TrendingUp } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import { AlertsPanel } from "@/components/analytics/AlertsPanel";
import { ComparisonTool } from "@/components/ComparisonTool";
import { MarketSimilarityAnalysis } from "@/components/analytics/MarketSimilarityAnalysis";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { BuyerProfileForm } from "@/components/analytics/BuyerProfileForm";
import { ScenarioModeling } from "@/components/scenario/ScenarioModeling";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

async function fetchStats() {
  // Get total regions analyzed from county_rankings view
  const { count: regionsCount } = await supabase
    .from('county_rankings')
    .select('*', { count: 'exact', head: true });

  // Get total firms monitored
  const { count: firmsCount } = await supabase
    .from('canary_firms_data')
    .select('*', { count: 'exact', head: true });

  // Get count of cities tracked
  const { count: citiesCount } = await supabase
    .from('region_data')
    .select('*', { count: 'exact', head: true });

  return {
    regionsCount: regionsCount || 0,
    firmsCount: firmsCount || 0,
    citiesCount: citiesCount || 0
  };
}

export default function Analysis() {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [scenarioData, setScenarioData] = useState<any[]>([]);
  const [analysisFilters, setAnalysisFilters] = useState({
    employeeCountMin: '',
    employeeCountMax: '',
    revenueMin: '',
    revenueMax: '',
    region: 'all'
  });
  
  const { data: stats } = useQuery({
    queryKey: ['analysisStats'],
    queryFn: fetchStats
  });

  const { data: stateData } = useQuery({
    queryKey: ['stateData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: statesList } = useQuery({
    queryKey: ['statesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const handleUpdateScenario = (updatedData: any[]) => {
    setScenarioData(updatedData);
  };

  const handleFilterChange = (key: string, value: string) => {
    setAnalysisFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    // Validate filters
    const numericFields = {
      employeeCountMin: 'Minimum Employee Count',
      employeeCountMax: 'Maximum Employee Count',
      revenueMin: 'Minimum Revenue',
      revenueMax: 'Maximum Revenue'
    };

    for (const [key, label] of Object.entries(numericFields)) {
      const value = analysisFilters[key as keyof typeof analysisFilters];
      if (value && isNaN(Number(value))) {
        toast.error(`${label} must be a valid number`);
        return;
      }
    }

    toast.success("Filters applied successfully");
  };

  const statsData = [
    {
      label: "Regions Analyzed",
      value: stats ? stats.regionsCount.toLocaleString() : "Loading...",
      icon: ChartBar,
    },
    {
      label: "Firms Monitored",
      value: stats ? `${stats.firmsCount.toLocaleString()}+` : "Loading...",
      icon: Users,
    },
    {
      label: "Cities Tracked",
      value: stats ? stats.citiesCount.toLocaleString() : "Loading...",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Transform Market Data into Clear, Actionable Insights
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 animate-fade-in hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Analysis Filters */}
        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Analysis Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="employeeCountMin" className="text-white">Min Employees</Label>
              <Input
                id="employeeCountMin"
                placeholder="0"
                value={analysisFilters.employeeCountMin}
                onChange={(e) => handleFilterChange('employeeCountMin', e.target.value)}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="employeeCountMax" className="text-white">Max Employees</Label>
              <Input
                id="employeeCountMax"
                placeholder="1000+"
                value={analysisFilters.employeeCountMax}
                onChange={(e) => handleFilterChange('employeeCountMax', e.target.value)}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="revenueMin" className="text-white">Min Revenue</Label>
              <Input
                id="revenueMin"
                placeholder="$0"
                value={analysisFilters.revenueMin}
                onChange={(e) => handleFilterChange('revenueMin', e.target.value)}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="revenueMax" className="text-white">Max Revenue</Label>
              <Input
                id="revenueMax"
                placeholder="$10M+"
                value={analysisFilters.revenueMax}
                onChange={(e) => handleFilterChange('revenueMax', e.target.value)}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="region" className="text-white">Region</Label>
              <Select 
                value={analysisFilters.region} 
                onValueChange={(value) => handleFilterChange('region', value)}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="northeast">Northeast</SelectItem>
                  <SelectItem value="southeast">Southeast</SelectItem>
                  <SelectItem value="midwest">Midwest</SelectItem>
                  <SelectItem value="southwest">Southwest</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-full">
              <Button 
                onClick={handleApplyFilters}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AlertsPanel />
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <Dialog open={showProfileForm} onOpenChange={setShowProfileForm}>
              <Button 
                onClick={() => setShowProfileForm(true)}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Create Buyer Profile
              </Button>
              <DialogContent className="bg-gray-900 border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">Create Buyer Profile</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Set up your buyer profile to receive personalized market insights and opportunities that match your investment criteria.
                  </DialogDescription>
                </DialogHeader>
                <BuyerProfileForm onSuccess={() => setShowProfileForm(false)} />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-gray-300">
              Create a buyer profile to get personalized recommendations, market insights, and notifications about opportunities that match your criteria.
            </p>
          </div>
        </div>
        <KeyInsightsPanel />
        <MarketSimilarityAnalysis filters={analysisFilters} />
        {stateData && statesList && (
          <ScenarioModeling 
            stateData={stateData}
            statesList={statesList}
            onUpdateScenario={handleUpdateScenario}
          />
        )}
        <div className="bg-[#111111] backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Compare States</h2>
            <ComparisonTool embedded={true} />
          </div>
        </div>
        <MarketHighlights />
      </div>
    </div>
  );
}
