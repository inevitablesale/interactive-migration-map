import { Layers, Map as MapIcon, BarChart } from "lucide-react";
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
    <Sidebar className="bg-[#222222] text-white">
      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
}