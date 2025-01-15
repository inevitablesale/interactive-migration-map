import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users2, Home, GraduationCap, InfoIcon, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function MarketInsightsPanel() {
  const { data: employeeRentData } = useQuery({
    queryKey: ['employeeRentAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_employee_rent_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: followerData } = useQuery({
    queryKey: ['followerAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_follower_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: vacancyData } = useQuery({
    queryKey: ['vacancyAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vacancy_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: educationData } = useQuery({
    queryKey: ['educationAgeAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_education_age_analysis');
      if (error) throw error;
      return data;
    }
  });

  const insights = [
    {
      title: "Employee Density",
      value: employeeRentData?.[0] ? 
        `${Math.round(employeeRentData[0].employees_per_1k_population)} per 1k` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {employeeRentData?.[0] ? (
            <>
              {`${employeeRentData[0].total_employees.toLocaleString()} employees in ${employeeRentData[0].county_name}`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Region Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Population: {employeeRentData[0].total_population.toLocaleString()}</p>
                        <p>Median Rent: ${employeeRentData[0].median_gross_rent.toLocaleString()}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Details</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Employee Density Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {employeeRentData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">State {region.state_fp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{Math.round(region.employees_per_1k_population)} per 1k</p>
                            <p className="text-sm text-gray-400">{region.total_employees.toLocaleString()} employees</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing employee data..."
          )}
        </div>
      ),
      icon: Building2,
    },
    {
      title: "Social Engagement",
      value: followerData?.[0] ? 
        `${Math.round(followerData[0].followers_per_employee)}x` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {followerData?.[0] ? (
            <>
              {`${followerData[0].follower_count.toLocaleString()} followers, ${followerData[0].employee_count} employees`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <p className="text-sm text-gray-300">Followers per employee ratio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Top Companies</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Social Media Engagement Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {followerData?.map((company, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{company.company_name}</h4>
                            <p className="text-sm text-gray-400">{company.employee_count} employees</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{Math.round(company.followers_per_employee)}x</p>
                            <p className="text-sm text-gray-400">{company.follower_count.toLocaleString()} followers</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing social data..."
          )}
        </div>
      ),
      icon: Users2,
    },
    {
      title: "Housing Availability",
      value: vacancyData?.[0] ? 
        `${(vacancyData[0].vacant_to_occupied_ratio * 100).toFixed(1)}%` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {vacancyData?.[0] ? (
            <>
              {`${vacancyData[0].county_name}, ${Math.round(vacancyData[0].firms_per_10k_population)} firms per 10k residents`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Vacancy Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Total Firms: {vacancyData[0].firm_count}</p>
                        <p>Vacancy Ratio: {(vacancyData[0].vacant_to_occupied_ratio * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Markets</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Housing Market Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {vacancyData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">State {region.state_fp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {(region.vacant_to_occupied_ratio * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-400">
                              {Math.round(region.firms_per_10k_population)} firms/10k pop
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing housing data..."
          )}
        </div>
      ),
      icon: Home,
    },
    {
      title: "Education Level",
      value: educationData?.[0] ? 
        `${educationData[0].masters_degree_percent.toFixed(1)}%` : 
        "Loading...",
      insight: (
        <div className="flex items-center gap-2 text-sm text-white/80">
          {educationData?.[0] ? (
            <>
              {`${educationData[0].county_name}, median age ${Math.round(educationData[0].median_age)}`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border-white/10 backdrop-blur-md">
                    <div className="space-y-2 p-1">
                      <p className="text-sm font-medium text-white">Education Details:</p>
                      <div className="text-sm text-gray-300">
                        <p>Masters Degree: {educationData[0].masters_degree_percent.toFixed(1)}%</p>
                        <p>Total Firms: {educationData[0].firm_count}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">View Demographics</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Education Demographics</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    {educationData?.map((region, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{region.county_name}</h4>
                            <p className="text-sm text-gray-400">State {region.state_fp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {region.masters_degree_percent.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-400">
                              Median Age: {Math.round(region.median_age)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            "Analyzing education data..."
          )}
        </div>
      ),
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight) => (
        <Card key={insight.title} className="p-4 bg-white/95 backdrop-blur-md border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <insight.icon className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
            <div className="text-xs text-gray-700">{insight.insight}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}