import { Search } from "lucide-react";
import { Button } from "./ui/button";

export const CommandBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white/80 hover:text-white">
            Market Entry
          </Button>
          <Button variant="ghost" className="text-white/80 hover:text-white">
            Growth Strategy
          </Button>
          <Button variant="ghost" className="text-white/80 hover:text-white">
            Opportunities
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search markets..."
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};