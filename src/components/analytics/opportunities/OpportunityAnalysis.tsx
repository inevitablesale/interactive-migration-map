import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OpportunityAnalysis() {
  const { data: opportunities } = useQuery({
    queryKey: ['opportunityAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_opportunity_analysis');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {opportunities?.slice(0, 5).map((company) => (
          <Card key={company.company_name} className="p-4 bg-black/40 backdrop-blur-md border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{company.company_name}</h3>
                <p className="text-sm text-white/60">{company.location}</p>
              </div>
              <Button variant="secondary" size="sm" className="bg-blue-500/20 text-blue-400">
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm text-white/60">Employees</div>
                  <div className="text-white font-medium">
                    {company.employee_count?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-sm text-white/60">Growth</div>
                  <div className="text-white font-medium">
                    {company.growth_rate.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="text-sm text-white/60">Revenue/Employee</div>
                  <div className="text-white font-medium">
                    ${(company.revenue_per_employee / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}