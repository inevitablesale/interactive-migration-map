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
        <CardTitle className="flex items-center gap-3 text-2xl font-medium text-white/80">
          <Icon className="w-6 h-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-8">
            <div>
              <h3 className="text-gray-400 text-lg mb-2">
                {metric.label}
                {metric.sublabel && (
                  <span className="block mt-1">{metric.sublabel}</span>
                )}
              </h3>
              <p className={`text-6xl font-bold tracking-tight ${getMetricColor(Number(metric.value?.replace(/[^0-9.-]/g, '')), metric.type)}`}>
                {metric.value || 'N/A'}
              </p>
              {metric.rank && (
                <div className="mt-4">
                  <p className="text-gray-500 text-base mb-1">Rank:</p>
                  <p className="text-4xl text-white/90 font-medium">{metric.rank.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}