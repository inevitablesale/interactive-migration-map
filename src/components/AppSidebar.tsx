import { Layers, Map as MapIcon, BarChart, Search as SearchIcon, Lock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Migration Flows",
    icon: MapIcon,
  },
  {
    title: "Firm Density",
    icon: Layers,
  },
  {
    title: "Analytics",
    icon: BarChart,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-[#222222] text-white" side="right">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <SidebarInput 
                placeholder="Search firms, regions..." 
                className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Data Layers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="p-4 bg-gray-800/50 mx-2 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Premium Features</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Unlock detailed firm profiles and advanced analytics
            </p>
            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
              Upgrade Now
            </Button>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}