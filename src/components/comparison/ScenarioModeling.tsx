import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ScenarioModelingProps {
  stateData: any[];
  statesList: any[];
  onUpdateScenario: (scenarioData: any[]) => void;
}

export function ScenarioModeling({ stateData, statesList, onUpdateScenario }: ScenarioModelingProps) {
  const [growthRate, setGrowthRate] = useState(0);
  const [employeeGrowth, setEmployeeGrowth] = useState(0);
  const [payrollIncrease, setPayrollIncrease] = useState(0);

  const applyScenario = () => {
    const updatedData = stateData.map(state => ({
      ...state,
      EMP: Math.round(state.EMP * (1 + employeeGrowth / 100)),
      PAYANN: Math.round(state.PAYANN * (1 + payrollIncrease / 100)),
      ESTAB: Math.round(state.ESTAB * (1 + growthRate / 100))
    }));
    onUpdateScenario(updatedData);
  };

  if (!stateData?.length) return null;

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-4">Scenario Modeling</h3>
          <p className="text-sm text-white/60 mb-6">
            Adjust parameters to model different market scenarios
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Market Growth Rate (%)</label>
            <Slider
              value={[growthRate]}
              onValueChange={(value) => setGrowthRate(value[0])}
              max={50}
              step={1}
            />
            <span className="text-sm text-white/60">{growthRate}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Employee Growth (%)</label>
            <Slider
              value={[employeeGrowth]}
              onValueChange={(value) => setEmployeeGrowth(value[0])}
              max={50}
              step={1}
            />
            <span className="text-sm text-white/60">{employeeGrowth}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Payroll Increase (%)</label>
            <Slider
              value={[payrollIncrease]}
              onValueChange={(value) => setPayrollIncrease(value[0])}
              max={50}
              step={1}
            />
            <span className="text-sm text-white/60">{payrollIncrease}%</span>
          </div>
        </div>

        <Button 
          onClick={applyScenario}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Apply Scenario
        </Button>
      </div>
    </Card>
  );
}