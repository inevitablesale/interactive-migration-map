import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, TrendingUp } from "lucide-react";

export const MarketMetricsChart = () => {
  const { data: marketData } = useQuery({
    queryKey: ['marketMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB')
        .order('EMP', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data?.map(state => ({
        name: `State ${state.STATEFP}`,
        employees: state.EMP || 0,
        firms: state.ESTAB || 0,
        payroll: state.PAYANN || 0
      }));
    }
  });

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <ChartBar className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Market Distribution</h3>
      </div>
      
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marketData}>
            <XAxis 
              dataKey="name" 
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
              dataKey="firms" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};