import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, DollarSign, Briefcase, Users2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const FirmsForSalePanel = () => {
  const { toast } = useToast();
  
  const { data: firms } = useQuery({
    queryKey: ['firmsForSale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sold_firms_data')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Firms For Sale</h3>
        <Button variant="link" className="text-blue-400 hover:text-blue-300">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {firms?.map((firm, index) => (
          <Card 
            key={index}
            className="p-4 bg-black/40 backdrop-blur-md border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white">
                    {firm.City}, {firm.State}
                  </h4>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{firm.City}</span>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  Contact Seller
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-white/60">Employees</span>
                    <p className="text-white font-medium">{firm.employee_count || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <div>
                    <span className="text-white/60">Asking Price</span>
                    <p className="text-white font-medium">{formatCurrency(firm.asking_price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-yellow-400" />
                  <div>
                    <span className="text-white/60">Revenue</span>
                    <p className="text-white font-medium">{formatCurrency(firm.annual_revenue)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users2 className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-white/60">Clientele</span>
                    <p className="text-white font-medium line-clamp-1">{firm.clientele || 'Various'}</p>
                  </div>
                </div>
              </div>

              {firm.service_lines && (
                <div className="flex items-center gap-2 text-sm pt-2">
                  <Briefcase className="w-4 h-4 text-white/60" />
                  <p className="text-white/80 line-clamp-1">{firm.service_lines}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};