import { Card } from "@/components/ui/card";

export function ActionableInsights() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
        <div className="p-6">
          <p className="text-sm text-white/60">
            Analytics are being rebuilt...
          </p>
        </div>
      </Card>
    </div>
  );
}