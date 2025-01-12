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
        <div className="relative">
          <div className="min-h-screen flex">
            {/* Left Panel - Analysis Tools */}
            <div className="w-80 bg-black/40 backdrop-blur-md p-6 border-r border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Analysis Tools</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <h4 className="text-white font-medium mb-2">Data Layers</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded">
                      <span>Migration Flows</span>
                      <span className="text-cyan-400">On</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded">
                      <span>Firm Density</span>
                      <span>Off</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded">
                      <span>Analytics</span>
                      <span>Off</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="text-white font-medium mb-2">Demographic Analysis</h4>
                  <p className="text-sm text-gray-300">Analyze population and demographic trends</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="text-white font-medium mb-2">Economic Indicators</h4>
                  <p className="text-sm text-gray-300">Track business and economic metrics</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="text-white font-medium mb-2">Migration Patterns</h4>
                  <p className="text-sm text-gray-300">Visualize population movement</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <h4 className="text-white font-medium mb-2">Compare Markets</h4>
                  <p className="text-sm text-gray-300">Compare firms side by side with detailed metrics</p>
                  <p className="text-sm text-gray-300 mt-2">Detect acquisition signals in accounting practices before they list. Our AI analyzes millions of data points to identify growth patterns.</p>
                </div>
              </div>
            </div>

            {/* Center - Map Interaction Area */}
            <div className="flex-1 bg-transparent">
              {/* Map Controls Overlay */}
              <div className="p-4 absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm">
                    Run Analysis
                  </button>
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