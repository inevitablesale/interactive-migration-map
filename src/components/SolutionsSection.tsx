import { ArrowRight, Brain, LineChart, ShieldCheck } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

export const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("discover");

  const solutions = {
    discover: {
      title: "Problem Discovery",
      description: "Identify untapped opportunities in the accounting practice market",
      steps: [
        "Analyze market demographics and business density",
        "Identify high-growth potential areas",
        "Evaluate competition and market saturation"
      ]
    },
    assess: {
      title: "Risk Assessment",
      description: "Make data-driven decisions with confidence",
      steps: [
        "Evaluate local market stability",
        "Assess demographic trends",
        "Calculate growth potential"
      ]
    },
    decide: {
      title: "Decision Making",
      description: "Transform insights into actionable decisions",
      steps: [
        "Compare opportunities across regions",
        "Prioritize acquisition targets",
        "Build comprehensive investment cases"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-black/95 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Transform Data into Decisions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just collect data - use it to drive meaningful change in your acquisition strategy
          </p>
        </div>

        <Tabs defaultValue="discover" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="assess">Assess</TabsTrigger>
            <TabsTrigger value="decide">Decide</TabsTrigger>
          </TabsList>

          {Object.entries(solutions).map(([key, solution]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    {key === "discover" && <Brain className="w-5 h-5 text-yellow-400" />}
                    {key === "assess" && <ShieldCheck className="w-5 h-5 text-yellow-400" />}
                    {key === "decide" && <LineChart className="w-5 h-5 text-yellow-400" />}
                    <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{solution.description}</p>
                  <ul className="space-y-3">
                    {solution.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <ArrowRight className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                  <div className="relative h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400 mb-4">Interactive visualization coming soon</p>
                        <div className="animate-pulse bg-yellow-400/10 h-32 w-full rounded-lg" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};