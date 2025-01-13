import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

export function ReportsPanel() {
  return (
    <div className="p-4 space-y-4">
      <Card className="p-4 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Saved Reports</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white/5 rounded">
            <div>
              <div className="text-sm text-white">Q2 Market Analysis</div>
              <div className="text-xs text-gray-400">Updated 2 days ago</div>
            </div>
            <Download className="w-4 h-4 text-blue-400 cursor-pointer" />
          </div>
        </div>
      </Card>
    </div>
  );
}