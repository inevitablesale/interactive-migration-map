import { ChartBar, Users, TrendingUp } from "lucide-react";
import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import { AlertsPanel } from "@/components/analytics/AlertsPanel";
import { ComparisonTool } from "@/components/ComparisonTool";

const stats = [
  {
    label: "Regions Analyzed",
    value: "545",
    icon: ChartBar,
  },
  {
    label: "Firms Monitored",
    value: "10,000+",
    icon: Users,
  },
  {
    label: "Avg Growth Rate (YoY)",
    value: "12.5%",
    icon: TrendingUp,
  },
];

export default function Analysis() {
  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Transform Market Data into Clear, Actionable Insights
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 animate-fade-in hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <KeyInsightsPanel />
        <MarketHighlights />
        <AlertsPanel />
        <ComparisonTool />
      </div>
    </div>
  );
}