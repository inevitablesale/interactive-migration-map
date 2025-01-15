import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function ValuationEstimator() {
  const { data: soldFirmsData } = useQuery({
    queryKey: ['soldFirmsValuation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sold_firms_data')
        .select('*')
        .not('asking_price', 'is', null);
      if (error) throw error;
      return data;
    }
  });

  const valuationMetrics = soldFirmsData?.map(firm => ({
    revenue: Number(firm.annual_revenue) || 0,
    askingPrice: Number(firm.asking_price) || 0,
    employeeCount: Number(firm.employee_count) || 0,
    multiple: firm.annual_revenue && firm.asking_price ? 
      Number(firm.asking_price) / Number(firm.annual_revenue) : 0
  })) || [];

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Valuation Analysis</h3>
      
      <div className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valuationMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="revenue" 
                tickFormatter={(value) => `$${(Number(value)/1000000).toFixed(1)}M`}
              />
              <YAxis 
                tickFormatter={(value) => `${Number(value).toFixed(1)}x`}
              />
              <Tooltip 
                formatter={(value: number, name) => [
                  name === 'multiple' ? `${value.toFixed(2)}x` : `$${(value/1000000).toFixed(1)}M`,
                  name === 'multiple' ? 'Revenue Multiple' : 'Annual Revenue'
                ]}
              />
              <Bar dataKey="multiple" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/60">Average Multiple</h4>
            <p className="text-2xl font-bold text-white">
              {(valuationMetrics.reduce((acc, curr) => acc + curr.multiple, 0) / valuationMetrics.length).toFixed(2)}x
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/60">Median Price</h4>
            <p className="text-2xl font-bold text-white">
              ${(valuationMetrics.map(m => m.askingPrice).sort((a, b) => a - b)[Math.floor(valuationMetrics.length/2)] / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white/60">Avg Employee Count</h4>
            <p className="text-2xl font-bold text-white">
              {Math.round(valuationMetrics.reduce((acc, curr) => acc + curr.employeeCount, 0) / valuationMetrics.length)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}