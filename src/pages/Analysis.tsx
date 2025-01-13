import { InteractiveToolsSection } from "@/components/InteractiveToolsSection";

const Analysis = () => {
  return (
    <div className="min-h-screen bg-black/95">
      <div className="w-full px-0 py-16">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            Interactive Market Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-4">
            Transform data into actionable insights with our comprehensive analysis tools
          </p>
        </div>
        <InteractiveToolsSection />
      </div>
    </div>
  );
};

export default Analysis;