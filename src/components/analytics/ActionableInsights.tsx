import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { ServiceDistribution } from "@/types/analytics";

export function ActionableInsights() {
  const { data: serviceDistribution, isError } = useQuery<ServiceDistribution[]>({
    queryKey: ['serviceDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_service_distribution');
      
      if (error) {
        console.error('Error fetching service distribution:', error);
        throw error;
      }

      // Transform the data to match the ServiceDistribution type
      return data.map(item => ({
        STATEFP: item.statefp,
        specialities: item.specialities,
        specialty_count: item.specialty_count,
        specialty_percentage: item.specialty_percentage
      }));
    }
  });

  if (isError) {
    return (
      <Card className="bg-red-500/10 border-red-500/20 p-6">
        <p className="text-red-400">Error loading service distribution data</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Service Line Opportunities</h3>
          </div>
          <p className="text-sm text-white/60 mb-4">
            Identify underserved specialties and market gaps
          </p>
          
          <div className="space-y-4">
            {serviceDistribution?.map((service, index) => (
              <div key={`${service.STATEFP}-${service.specialities}-${index}`} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">{service.specialities}</div>
                  <div className="text-sm text-white/60">{Math.round(service.specialty_percentage)}% Coverage</div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-purple-500 rounded-full h-2 transition-all duration-300" 
                    style={{ width: `${Math.min(100, service.specialty_percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}