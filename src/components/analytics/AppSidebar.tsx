import { useState } from "react";
import { BarChart, FileText, Bell, Building2, Lock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { ReportsPanel } from "./ReportsPanel";
import { TrackersPanel } from "./TrackersPanel";
import { FirmDirectory } from "./FirmDirectory";
import { useToast } from "@/components/ui/use-toast";

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("analytics");
  const { toast } = useToast();

  const handlePremiumFeature = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to access detailed firm information and advanced analytics",
    });
  };

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
    <Sidebar className="bg-[#1a1a1a] border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Market Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("analytics")}
                  className={activeTab === "analytics" ? "bg-blue-500/20 text-blue-400" : ""}
                >
                  <BarChart className="w-4 h-4" />
                  <span>Analytics Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("reports")}
                  className={activeTab === "reports" ? "bg-blue-500/20 text-blue-400" : ""}
                >
                  <FileText className="w-4 h-4" />
                  <span>Reports & Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("trackers")}
                  className={activeTab === "trackers" ? "bg-blue-500/20 text-blue-400" : ""}
                >
                  <Bell className="w-4 h-4" />
                  <span>Market Trackers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handlePremiumFeature}
                  className="opacity-75"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Firm Directory</span>
                    <Lock className="w-3 h-3 text-yellow-400 ml-auto" />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {renderContent()}
      </SidebarContent>
    </Sidebar>
  );
}