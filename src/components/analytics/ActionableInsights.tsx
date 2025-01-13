import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Building2 } from "lucide-react";
import { ServiceDistribution } from "@/types/supabase";

export function ActionableInsights() {
  const { data: serviceDistribution } = useQuery<ServiceDistribution[]>({
    queryKey: ['serviceDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_service_distribution')
        .order('specialty_percentage', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Service Line Opportunities</h3>
          <p className="text-sm text-white/60 mb-4">
            Identify underserved specialties and market gaps
          </p>
          
          <div className="space-y-4">
            {serviceDistribution?.map((service, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">{service.specialities}</div>
                  <div className="text-sm text-white/60">{Math.round(service.specialty_percentage)}% Coverage</div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2" 
                    style={{ width: `${service.specialty_percentage}%` }}
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