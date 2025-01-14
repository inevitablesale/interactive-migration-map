import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { getMetricColor } from "@/utils/market-report/formatters";

interface MarketMetric {
  label: string;
  value: string | undefined;
  type: 'population' | 'money' | 'density' | 'growth' | 'saturation';
  rank?: number | null;
}

interface MarketMetricsCardProps {
  title: string;
  icon: LucideIcon;
  metrics: MarketMetric[];
}

export function MarketMetricsCard({ title, icon: Icon, metrics }: MarketMetricsCardProps) {
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
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">{metric.label}</p>
            </div>
            <div className="space-y-1">
              <p className={`text-xl font-bold ${getMetricColor(Number(metric.value?.replace(/[^0-9.-]/g, '')), metric.type)}`}>
                {metric.value || 'N/A'}
              </p>
              {metric.rank && (
                <p className="text-sm text-gray-400">
                  Rank:<br />
                  {metric.rank.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}