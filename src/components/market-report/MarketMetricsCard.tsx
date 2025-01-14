import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { getMetricColor } from '@/utils/market-report/formatters';

interface MetricProps {
  label: string;
  value: string | number | null;
  type: 'growth' | 'density' | 'saturation' | 'money' | 'population';
  rank?: number;
}

interface MarketMetricsCardProps {
  title: string;
  icon: LucideIcon;
  metrics: MetricProps[];
}

export const MarketMetricsCard: React.FC<MarketMetricsCardProps> = ({ title, icon: Icon, metrics }) => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-gray-400">{metric.label}</p>
            <div className="flex items-center justify-between">
              <p className={`text-2xl font-bold ${getMetricColor(Number(metric.value) || 0, metric.type)}`}>
                {metric.value ?? 'N/A'}
              </p>
              {metric.rank !== undefined && (
                <span className="text-sm text-gray-400">Rank: {metric.rank}</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};