import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Map from "@/components/Map";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-4 left-4 z-10">
            <SidebarTrigger />
          </div>
          <Map />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;