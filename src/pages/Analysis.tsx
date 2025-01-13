import { useState } from "react";
import { AppSidebar } from "@/components/analytics/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ReportsPanel } from "@/components/analytics/ReportsPanel";
import { TrackersPanel } from "@/components/analytics/TrackersPanel";
import { FirmDirectory } from "@/components/analytics/FirmDirectory";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "reports":
        return <ReportsPanel />;
      case "trackers":
        return <TrackersPanel />;
      case "directory":
        return <FirmDirectory />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <AppSidebar onTabChange={setActiveTab} />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analysis;