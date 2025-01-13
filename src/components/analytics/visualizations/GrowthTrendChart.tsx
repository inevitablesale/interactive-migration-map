import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

export const GrowthTrendChart = () => {
  const { data: trendData } = useQuery({
    queryKey: ['growthTrends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_market_trends')
        .limit(10);
      
      if (error) throw error;
      
      return data?.map(trend => ({
        name: `State ${trend.statefp}`,
        "2020": trend.year_2020_moves,
        "2021": trend.year_2021_moves,
        "2022": trend.year_2022_moves,
        growthRate: parseFloat(trend.growth_rate.toFixed(2))
      }));
    }
  });

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Growth Trends</h3>
      </div>
      
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
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
            <Line 
              type="monotone" 
              dataKey="2022" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981' }}
            />
            <Line 
              type="monotone" 
              dataKey="2021" 
              stroke="#60A5FA" 
              strokeWidth={2}
              dot={{ fill: '#60A5FA' }}
            />
            <Line 
              type="monotone" 
              dataKey="2020" 
              stroke="#818CF8" 
              strokeWidth={2}
              dot={{ fill: '#818CF8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};