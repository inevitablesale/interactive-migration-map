import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const FirmsForSalePanel = () => {
  const { data: firms, isLoading } = useQuery({
    queryKey: ['firmsForSale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sold_firms_data')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Firms For Sale</h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-white/60">Loading firms...</div>
        ) : firms?.length === 0 ? (
          <div className="text-sm text-white/60">No firms currently listed for sale.</div>
        ) : (
          firms?.map((firm, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium text-white">
                    {firm.City}, {firm.State}
                  </div>
                  <div className="text-xs text-white/60">
                    {firm.service_lines}
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(firm.asking_price)}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {firm.employee_count} employees
                </div>
                <div>
                  Revenue: ${new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(firm.annual_revenue)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};