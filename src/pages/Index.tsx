import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";
import { BottomPanel } from "@/components/BottomPanel";
import { ComparisonTool } from "@/components/ComparisonTool";
import { DataSourcesSection } from "@/components/DataSourcesSection";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Fixed Map Background */}
      <div className="fixed inset-0 z-0">
        <Map />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
          <span className="text-xl font-bold text-yellow-400">Canary</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen">
          <Hero />
        </div>

        {/* Data Sources Section */}
        <DataSourcesSection />

        {/* Interactive Analysis Section */}
        <div className="relative bg-black/95">
          <div className="min-h-screen flex">
            {/* Left Panel - Analysis Tools */}
            <div className="w-80 bg-black/40 backdrop-blur-md p-6 border-r border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Data Value Principles</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Value Creation</h4>
                  <p className="text-sm text-gray-300">Data doesn't inherently contain value. It becomes valuable through actionable insights and decision-making.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Behavior Change</h4>
                  <p className="text-sm text-gray-300">Focus on what people should do differently with the data, not just what data to collect.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Future-Focused Solutions</h4>
                  <p className="text-sm text-gray-300">Build for the next 3 years, not just solving past problems.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Customer Commitment</h4>
                  <p className="text-sm text-gray-300">Success requires commitment from actual users, not just technical teams.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Incentive Alignment</h4>
                  <p className="text-sm text-gray-300">Create strong incentives for workflow changes or integrate naturally into existing processes.</p>
                </div>
              </div>
            </div>

            {/* Center - Content Area */}
            <div className="flex-1 p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Data Transformation Journey</h2>
                <p className="text-gray-300 mb-4">
                  The path to data-driven decision making isn't just about collecting more data. It's about creating meaningful change in how people work and make decisions.
                </p>
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-3">Beyond Data Collection</h3>
                    <p className="text-gray-300">
                      Success in data transformation comes not from the quantity of data collected, but from how effectively it drives actionable insights and behavioral changes.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-3">Creating True Value</h3>
                    <p className="text-gray-300">
                      Focus on creating data assets that solve persistent problems and drive meaningful organizational change, rather than responding to momentary challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed UI Elements */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <BottomPanel />
      </div>
    </div>
  );
};

export default Index;