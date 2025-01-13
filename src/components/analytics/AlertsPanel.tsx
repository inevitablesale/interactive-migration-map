import { Bell, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AlertsPanel = () => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Alerts</h3>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">New Match</span>
            <span className="text-xs text-blue-100/60">2h ago</span>
          </div>
          <p className="text-sm text-blue-100/60">
            A new firm in California matches your criteria
          </p>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Market Update</span>
            <span className="text-xs text-blue-100/60">1d ago</span>
          </div>
          <p className="text-sm text-blue-100/60">
            Significant growth detected in your target region
          </p>
        </div>

        <Button className="w-full bg-white/5 hover:bg-white/10 border-white/10">
          View All Alerts
        </Button>
      </div>
    </Card>
  );
};