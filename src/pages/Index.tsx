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

        {/* Interactive Analysis Section */}
        <div className="relative bg-black/95">
          <div className="min-h-screen flex">
            {/* Left Panel - Buyer-Focused Value Principles */}
            <div className="w-80 bg-black/40 backdrop-blur-md p-6 border-r border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Your Path to Successful Acquisitions</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Beyond Market Data</h4>
                  <p className="text-sm text-gray-300">We transform raw data into actionable insights that guide your acquisition decisions. Every metric is chosen to help you identify the right opportunities.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Future Growth Potential</h4>
                  <p className="text-sm text-gray-300">Look beyond current performance. Our analysis helps you spot markets with untapped potential and growing demand for accounting services.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Risk Mitigation</h4>
                  <p className="text-sm text-gray-300">Make informed decisions with comprehensive market analysis that helps you understand and mitigate acquisition risks before they become problems.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Competitive Edge</h4>
                  <p className="text-sm text-gray-300">Stay ahead of the market with insights that help you identify undervalued opportunities before they become obvious to others.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Clear Action Steps</h4>
                  <p className="text-sm text-gray-300">Transform insights into action with clear, practical steps for evaluating and pursuing acquisition opportunities in your target markets.</p>
                </div>
              </div>
            </div>

            {/* Center - Solution-Focused Content */}
            <div className="flex-1 p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Your Acquisition Success Blueprint</h2>
                <p className="text-gray-300 mb-8">
                  Stop wondering if you're making the right acquisition decisions. Our solution combines comprehensive market data with practical insights to help you:
                </p>
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-3">Identify the Right Opportunities</h3>
                    <p className="text-gray-300">
                      Don't just look at what's available - find the opportunities that align with your growth strategy. Our analysis helps you understand market dynamics, growth potential, and competitive landscapes to spot the best fits for your portfolio.
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-3">Make Confident Decisions</h3>
                    <p className="text-gray-300">
                      Replace uncertainty with confidence. Our solution provides you with clear, actionable insights that help you evaluate opportunities, understand their true potential, and make decisions backed by comprehensive market intelligence.
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