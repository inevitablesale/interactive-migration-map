import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBar, ArrowRight } from "lucide-react";

export function MarketGrowthSection() {
  const { data: sectorGrowth } = useQuery({
    queryKey: ['sectorGrowth'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_service_distribution')
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChartBar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Market Growth by Sector</h3>
        </div>
        <Button variant="outline" className="border-white/10">
          Dive into Sector Data
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorGrowth}>
            <XAxis 
              dataKey="specialities" 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px'
              }}
            />
            <Bar 
              dataKey="specialty_percentage" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}