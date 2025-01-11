import { useState } from "react";
import { GripHorizontal, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function ComparisonTool() {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleCompare = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to unlock detailed firm comparisons",
    });
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed right-4 top-20 bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/70"
      >
        <GripHorizontal className="h-4 w-4 mr-2" />
        Compare
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-20 w-80 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl animate-fade-in">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <h3 className="text-sm font-medium text-white">Compare Firms</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/60">
            <Lock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">Premium Feature</span>
          </div>
          <p className="text-xs text-white/60">
            Compare firms side by side with detailed metrics and insights
          </p>
          <Button
            onClick={handleCompare}
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Upgrade to Compare
          </Button>
        </div>
      </div>
    </div>
  );
}