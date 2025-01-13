import { Card } from "@/components/ui/card";
import { Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FirmDirectory() {
  return (
    <div className="p-4 space-y-4">
      <Card className="p-4 bg-black/40 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-medium text-white">Premium Feature</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Upgrade to access detailed information about firms in your target markets
        </p>
        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
          Upgrade Now
        </Button>
      </Card>
    </div>
  );
}