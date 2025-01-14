import { Lock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export const CommandBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'market-entry';

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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        <nav className="flex items-center gap-8">
          <button
            onClick={() => handleFilterClick('market-entry')}
            className={cn(
              "py-4 text-white/80 hover:text-white transition-colors relative",
              activeFilter === 'market-entry' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
            )}
          >
            Market Entry
          </button>
          
          <button
            onClick={() => handleFilterClick('growth-strategy')}
            className={cn(
              "py-4 text-white/80 hover:text-white transition-colors relative",
              activeFilter === 'growth-strategy' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
            )}
          >
            Growth Strategy
          </button>
          
          <button
            onClick={() => handleFilterClick('opportunities')}
            className={cn(
              "py-4 text-white/80 hover:text-white transition-colors relative group flex items-center gap-2",
              activeFilter === 'opportunities' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
            )}
          >
            Opportunities
            <Lock className="w-4 h-4 text-yellow-500" />
          </button>
        </nav>
      </div>
    </div>
  );
};