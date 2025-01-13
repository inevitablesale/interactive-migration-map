import { useState } from "react";
import { AppSidebar } from "@/components/analytics/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ReportsPanel } from "@/components/analytics/ReportsPanel";
import { TrackersPanel } from "@/components/analytics/TrackersPanel";
import { FirmDirectory } from "@/components/analytics/FirmDirectory";

const Analysis = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <AppSidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Market Intelligence</h1>
          <p className="text-gray-400">Select a tab in the sidebar to get started</p>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analysis;