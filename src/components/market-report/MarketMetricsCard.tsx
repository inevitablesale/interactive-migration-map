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
      <CardHeader className="pb-8">
        <CardTitle className="flex items-center gap-3 text-4xl font-bold text-white">
          <Icon className="w-8 h-8" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-16">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-8">
            <div>
              <h3 className="text-gray-400 text-2xl mb-4">
                {metric.label}
                {metric.sublabel && (
                  <span className="block mt-1">{metric.sublabel}</span>
                )}
              </h3>
              <p className={`text-7xl font-bold tracking-tight ${getMetricColor(Number(metric.value?.replace(/[^0-9.-]/g, '')), metric.type)}`}>
                {metric.value || 'N/A'}
              </p>
              {metric.rank && (
                <div className="mt-6">
                  <p className="text-gray-400 text-xl mb-2">Rank:</p>
                  <p className="text-4xl text-gray-300 font-semibold">{metric.rank.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}