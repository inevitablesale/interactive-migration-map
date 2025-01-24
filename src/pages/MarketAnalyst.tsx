import { ComparisonTool } from "@/components/ComparisonTool";

export default function MarketAnalyst() {
  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Accounting Firm Market Analyst
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Compare markets and analyze opportunities with our comprehensive market analysis tools
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
          <div className="p-6">
            <ComparisonTool embedded={true} />
          </div>
        </div>
      </div>
    </div>
  );
}