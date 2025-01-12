import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";
import { BottomPanel } from "@/components/BottomPanel";
import { ChatBar } from "@/components/ChatBar";
import { ComparisonTool } from "@/components/ComparisonTool";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Fixed Map Background */}
        <div className="fixed inset-0 z-0">
          <Map />
        </div>

        {/* Fixed Header */}
        <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="min-h-screen">
            <Hero />
          </div>

          {/* Content Sections */}
          <div className="relative">
            {/* Controls Section with frosted glass effect */}
            <div className="min-h-screen bg-black/40 backdrop-blur-md p-8">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">Market Intelligence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Firm Analysis</h3>
                    <p className="text-gray-200">
                      Analyze firm density and distribution across regions to identify market opportunities.
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Migration Patterns</h3>
                    <p className="text-gray-200">
                      Track business migration patterns and understand emerging market trends.
                    </p>
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
        <div className="fixed right-0 top-0 z-20">
          <AppSidebar />
        </div>
        <div className="fixed z-20">
          <ChatBar />
          <ComparisonTool />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;