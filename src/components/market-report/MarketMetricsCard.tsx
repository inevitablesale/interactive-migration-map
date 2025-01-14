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
        <CardTitle className="flex items-center gap-3 text-2xl text-white">
          <Icon className="w-6 h-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="space-y-1">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">{metric.label}</span>
                {metric.sublabel && (
                  <span className="text-gray-400 text-sm">{metric.sublabel}</span>
                )}
              </div>
              <p className={`text-4xl font-bold tracking-tight ${getMetricColor(Number(metric.value?.replace(/[^0-9.-]/g, '')), metric.type)}`}>
                {metric.value || 'N/A'}
              </p>
              {metric.rank && (
                <div className="space-y-0.5">
                  <p className="text-sm text-gray-400">Rank:</p>
                  <p className="text-lg text-gray-300">{metric.rank.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}