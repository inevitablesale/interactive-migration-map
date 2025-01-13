import { useState } from "react";
import { BarChart, Target, BookOpen, FileText } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

export function AppSidebar({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState("opportunities");
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
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
                  onClick={() => handleTabChange("opportunities")}
                  className={`w-full ${activeTab === "opportunities" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <Target className="w-4 h-4" />
                  <span>Find Opportunities</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleTabChange("strategy")}
                  className={`w-full ${activeTab === "strategy" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <BarChart className="w-4 h-4" />
                  <span>Build Strategy</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleTabChange("reports")}
                  className={`w-full ${activeTab === "reports" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Community Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleTabChange("builder")}
                  className={`w-full ${activeTab === "builder" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:bg-white/10"}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Report Builder</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}