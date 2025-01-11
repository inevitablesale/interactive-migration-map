import Map from "@/components/Map";
import { Hero } from "@/components/Hero";
import { Bird } from "lucide-react";
import { BottomPanel } from "@/components/BottomPanel";
import { ChatBar } from "@/components/ChatBar";
import { ComparisonTool } from "@/components/ComparisonTool";

const Index = () => {
  return (
    <div className="min-h-screen w-full relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bird className="w-8 h-8 text-yellow-400" />
          <span className="text-xl font-bold text-yellow-400">Canary</span>
        </div>
      </div>
      <Hero />
      <Map />
      <div className="relative z-20">
        <ChatBar />
        <ComparisonTool />
        <BottomPanel />
      </div>
    </div>
  );
};

export default Index;