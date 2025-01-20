import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";
import { DataSourcesSection } from "@/components/DataSourcesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { Card } from "@/components/ui/card";
import { PricingSection } from "@/components/PricingSection";
import { BetaAccessSection } from "@/components/BetaAccessSection";
import CountdownBanner from "@/components/CountdownBanner";
import { DailyRevealsSection } from "@/components/DailyRevealsSection";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Fixed Map Background */}
      <div className="fixed inset-0 z-0">
        <Map />
      </div>

      {/* Fixed Header - Adjusted top padding to account for banner */}
      <div className="fixed top-12 left-4 z-50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
          <span className="text-xl font-bold text-yellow-400">Canary</span>
        </div>
      </div>

      {/* Scrollable Content - Adjusted top padding to account for banner */}
      <div className="relative z-10 pt-8">
        {/* Hero Section */}
        <div className="min-h-screen">
          <Hero />
        </div>

        {/* Beta Access Section */}
        <BetaAccessSection />

        {/* Daily Reveals Section */}
        <DailyRevealsSection />

        {/* Data Sources Section */}
        <DataSourcesSection />

        {/* Solutions Section */}
        <SolutionsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Stats Section */}
        <div className="py-20 px-4">
          <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">493</div>
                <div className="text-gray-600">Regions Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">2,297</div>
                <div className="text-gray-600">Firms Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">872</div>
                <div className="text-gray-600">Cities Tracked</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;