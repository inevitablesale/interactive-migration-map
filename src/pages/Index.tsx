import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";
import { BottomPanel } from "@/components/BottomPanel";
import { DataSourcesSection } from "@/components/DataSourcesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { TimeCalculator } from "@/components/TimeCalculator";

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

        {/* Time Calculator Section */}
        <div className="py-20 px-4">
          <TimeCalculator />
        </div>

        {/* Data Sources Section */}
        <DataSourcesSection />

        {/* Solutions Section */}
        <SolutionsSection />
      </div>

      {/* Fixed UI Elements */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <BottomPanel />
      </div>
    </div>
  );
};

export default Index;