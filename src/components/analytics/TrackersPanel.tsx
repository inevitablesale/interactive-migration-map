import { Card } from "@/components/ui/card";
import { Bell, TrendingUp } from "lucide-react";

export function TrackersPanel() {
  return (
    <div className="p-4 space-y-4">
      <Card className="p-4 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Active Trackers</h3>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-white/5 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-white">Market Growth Alert</div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xs text-gray-400">
              Notifies when market growth exceeds 15%
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}