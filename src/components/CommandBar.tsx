import { Search } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export const CommandBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');

  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', filter);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <TooltipProvider>
          <div className="flex items-center gap-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    activeFilter === 'market-entry' && "bg-white/10 text-white scale-105",
                    "animate-in fade-in-50 duration-300"
                  )}
                  onClick={() => handleFilterClick('market-entry')}
                >
                  Market Entry
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black/90 border-white/10 text-white animate-in fade-in-50 zoom-in-95"
              >
                <p className="text-sm">
                  Identifies ideal locations based on migration patterns and competition levels
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    activeFilter === 'growth-strategy' && "bg-white/10 text-white scale-105",
                    "animate-in fade-in-50 duration-300"
                  )}
                  onClick={() => handleFilterClick('growth-strategy')}
                >
                  Growth Strategy
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black/90 border-white/10 text-white animate-in fade-in-50 zoom-in-95"
              >
                <p className="text-sm">
                  Analyzes business density and expansion opportunities in existing markets
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    activeFilter === 'opportunities' && "bg-white/10 text-white scale-105",
                    "animate-in fade-in-50 duration-300"
                  )}
                  onClick={() => handleFilterClick('opportunities')}
                >
                  Opportunities
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black/90 border-white/10 text-white animate-in fade-in-50 zoom-in-95"
              >
                <p className="text-sm">
                  Discovers underserved markets and potential acquisition targets
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-64 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};