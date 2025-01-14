import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { getMetricColor } from "@/utils/market-report/formatters";

interface MarketMetric {
  label: string;
  value: string | undefined;
  type: 'population' | 'money' | 'density' | 'growth' | 'saturation';
  rank?: number | null;
  sublabel?: string;
}

interface MarketMetricsCardProps {
  title: string;
  icon: LucideIcon;
  metrics: MarketMetric[];
}

export function MarketMetricsCard({ title, icon: Icon, metrics }: MarketMetricsCardProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-medium text-white/80">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-4">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">
                {metric.label}
                {metric.sublabel && (
                  <span className="block mt-0.5 text-xs">{metric.sublabel}</span>
                )}
              </h3>
              <div className="flex items-baseline justify-between">
                <p className={`text-4xl font-bold tracking-tight break-words ${getMetricColor(Number(metric.value?.replace(/[^0-9.-]/g, '')), metric.type)}`}>
                  {metric.value || 'N/A'}
                </p>
                {metric.rank && (
                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-0.5">Rank</p>
                    <p className="text-2xl text-white/90 font-medium">{metric.rank.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}