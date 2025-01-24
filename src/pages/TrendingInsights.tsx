import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";

export default function TrendingInsights() {
  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Real-Time Market Intelligence
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Stay ahead with fresh insights and opportunities as they emerge in the accounting firm market
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <KeyInsightsPanel />
      </div>
    </div>
  );
}