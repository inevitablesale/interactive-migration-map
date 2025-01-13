import { InteractiveToolsSection } from "@/components/InteractiveToolsSection";
import { CommandBar } from "@/components/CommandBar";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const Analysis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'market-entry';

  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="w-full">
        <div className="bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-8 px-6">
              <button
                onClick={() => handleFilterChange('market-entry')}
                className={cn(
                  "py-4 text-white/80 hover:text-white transition-colors relative",
                  activeFilter === 'market-entry' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                )}
              >
                Market Entry
              </button>
              <button
                onClick={() => handleFilterChange('growth-strategy')}
                className={cn(
                  "py-4 text-white/80 hover:text-white transition-colors relative",
                  activeFilter === 'growth-strategy' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                )}
              >
                Growth Strategy
              </button>
              <button
                onClick={() => handleFilterChange('opportunities')}
                className={cn(
                  "py-4 text-white/80 hover:text-white transition-colors relative",
                  activeFilter === 'opportunities' && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                )}
              >
                Opportunities
              </button>
            </div>
          </div>
        </div>

        <div className="py-8 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm" />
          <div className="relative z-10 space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
              Find Your Next Move
            </h2>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-sm">
              Transform market data into strategic decisions
            </p>
          </div>
        </div>
        <InteractiveToolsSection />
      </div>
    </div>
  );
};

export default Analysis;