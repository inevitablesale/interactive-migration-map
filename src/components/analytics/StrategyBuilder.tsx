import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StrategyBuilder() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-white/10">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Market Entry Strategy</h3>
          <p className="text-sm text-white/60 mb-4">
            Build your roadmap for successful market entry
          </p>
          
          <div className="space-y-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">1. Market Assessment</h4>
              <p className="text-sm text-white/60 mb-3">Evaluate market conditions and competition</p>
              <Button className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                Start Assessment
              </Button>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">2. Resource Planning</h4>
              <p className="text-sm text-white/60 mb-3">Plan staffing and infrastructure needs</p>
              <Button className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                Plan Resources
              </Button>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">3. Timeline Development</h4>
              <p className="text-sm text-white/60 mb-3">Create implementation timeline</p>
              <Button className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                Build Timeline
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}