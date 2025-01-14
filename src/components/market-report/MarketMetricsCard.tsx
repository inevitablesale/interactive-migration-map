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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-3xl font-bold text-white">
          <Icon className="w-7 h-7" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-6">
            <div>
              <div className="space-y-1 mb-3">
                <h3 className="text-gray-400 text-lg">
                  {metric.label}
                  {metric.sublabel && (
                    <span className="block">{metric.sublabel}</span>
                  )}
                </h3>
                <p className={`text-6xl font-bold tracking-tight ${getMetricColor(Number(metric.value?.replace(/[^0-9.-]/g, '')), metric.type)}`}>
                  {metric.value || 'N/A'}
                </p>
              </div>
              {metric.rank && (
                <div className="space-y-1">
                  <p className="text-gray-400 text-base">Rank:</p>
                  <p className="text-2xl text-gray-300 font-semibold">{metric.rank.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}