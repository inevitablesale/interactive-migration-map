import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
    <Card className="bg-[#0A0B1A] backdrop-blur-md border-white/10 p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-semibold text-white">Firms For Sale</h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-white/60">Loading firms...</div>
        ) : firms?.length === 0 ? (
          <div className="text-sm text-white/60">No firms currently listed for sale.</div>
        ) : (
          firms?.map((firm, index) => (
            <div key={index} className="bg-[#141832] p-6 rounded-xl hover:bg-[#1A1F3D] transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xl font-medium text-white mb-2">
                    {firm.City}, {firm.State}
                  </div>
                  <div className="text-sm text-white/60">
                    {firm.service_lines || 'General Practice'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-400">
                    ${firm.asking_price?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-white/60">Employees</div>
                    <div className="text-white font-medium">
                      {firm.employee_count?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-sm text-white/60">Revenue</div>
                    <div className="text-white font-medium">
                      ${firm.annual_revenue?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  View Details
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                >
                  Contact Seller
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};