import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Bird className="w-8 h-8 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">Canary</span>
            </div>
          </div>
          <Hero />
          <Map />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;