import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, Home, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Employee Density</h3>
        </div>
        <div className="space-y-2">
          {employeeRentData?.[0] && (
            <>
              <p className="text-2xl font-bold text-white">
                {Math.round(employeeRentData[0].employees_per_1k_population)}
              </p>
              <p className="text-xs text-gray-400">
                Employees per 1k population in {employeeRentData[0].county_name}
              </p>
            </>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-green-400" />
          <h3 className="text-sm font-medium text-white">Social Engagement</h3>
        </div>
        <div className="space-y-2">
          {followerData?.[0] && (
            <>
              <p className="text-2xl font-bold text-white">
                {Math.round(followerData[0].followers_per_employee)}x
              </p>
              <p className="text-xs text-gray-400">
                Followers per employee ratio
              </p>
            </>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5 text-yellow-400" />
          <h3 className="text-sm font-medium text-white">Housing Availability</h3>
        </div>
        <div className="space-y-2">
          {vacancyData?.[0] && (
            <>
              <p className="text-2xl font-bold text-white">
                {(vacancyData[0].vacant_to_occupied_ratio * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400">
                Vacancy rate in top markets
              </p>
            </>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-medium text-white">Education Level</h3>
        </div>
        <div className="space-y-2">
          {educationData?.[0] && (
            <>
              <p className="text-2xl font-bold text-white">
                {educationData[0].masters_degree_percent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400">
                Population with Master's degree
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}