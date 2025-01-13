import { AppSidebar } from "@/components/analytics/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

const Analysis = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <AppSidebar />
        <div className="flex-1 p-6 overflow-auto">
          <AnalyticsDashboard />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analysis;