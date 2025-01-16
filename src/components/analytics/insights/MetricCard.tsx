import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  insight: React.ReactNode;
  detailsContent?: React.ReactNode;
}

export function MetricCard({ title, value, icon: Icon, insight, detailsContent }: MetricCardProps) {
  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold text-lg text-white">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-white mb-2 min-h-[4rem] flex items-center">{value}</p>
      <div className="text-sm text-white/80">
        {insight}
        {detailsContent && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                View Details <ArrowUpRight className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {detailsContent}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
}