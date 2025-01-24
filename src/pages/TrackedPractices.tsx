import { Button } from "@/components/ui/button";
import { ChartBar, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrackedPractices() {
  return (
    <div className="min-h-screen bg-[#222222]">
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Tracked Practices
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Manage and analyze your tracked practices effectively.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-2">
          <Link to="/trending-insights">
            <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400/20">
              <ChartBar className="h-4 w-4 mr-2" />
              Trending Insights
            </Button>
          </Link>
          <Link to="/market-analyst">
            <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400/20">
              <LineChart className="h-4 w-4 mr-2" />
              Market Analyst
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
