import { InteractiveToolsSection } from "@/components/InteractiveToolsSection";
import { CommandBar } from "@/components/CommandBar";

const Analysis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <CommandBar />
      <div className="w-full pt-16">
        <div className="py-8 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm" />
          <div className="relative z-10 space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
              Find Your Next Move
            </h2>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-sm">
              Transform market data into strategic decisions
            </p>
          </div>
        </div>
        <InteractiveToolsSection />
      </div>
    </div>
  );
};

export default Analysis;