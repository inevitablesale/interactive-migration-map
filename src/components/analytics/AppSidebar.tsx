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

  return (
    <Sidebar className="bg-[#1a1a1a] border-r border-white/10 w-64 min-w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Market Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full ${activeTab === "analytics" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <BarChart className="w-4 h-4" />
                  <span>Analytics Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("reports")}
                  className={`w-full ${activeTab === "reports" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Reports & Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("trackers")}
                  className={`w-full ${activeTab === "trackers" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Market Trackers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handlePremiumFeature}
                  className="w-full text-white/50 hover:bg-white/10"
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

        <div className="p-4">
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "reports" && <ReportsPanel />}
          {activeTab === "trackers" && <TrackersPanel />}
          {activeTab === "directory" && <FirmDirectory />}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};