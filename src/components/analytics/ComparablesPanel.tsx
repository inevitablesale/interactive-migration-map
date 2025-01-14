import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ComparablesPanel() {
  const { data: firms } = useQuery({
    queryKey: ['soldFirms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sold_firms_data')
        .select('*')
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Comparables (Firms for Sale)</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {firms?.map((firm, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 space-y-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white">{firm.City}, {firm.State}</h4>
                  <p className="text-sm text-white/60">{firm.service_lines || 'Various Services'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{firm.employee_count || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">{formatCurrency(firm.annual_revenue)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{formatCurrency(firm.asking_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}