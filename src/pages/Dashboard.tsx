import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: savedReports } = useQuery({
    queryKey: ['savedReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: recentSearches } = useQuery({
    queryKey: ['recentSearches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recent_searches')
        .select('*')
        .order('searched_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Saved Reports</h2>
            {savedReports?.length ? (
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <Card key={report.id} className="bg-black/40 backdrop-blur-md border-white/10 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">{report.location_name}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => navigate(`/market-report/${report.location_name}`)}
                      >
                        View Report
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No saved reports yet</p>
            )}
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Searches</h2>
            {recentSearches?.length ? (
              <div className="space-y-4">
                {recentSearches.map((search) => (
                  <Card key={search.id} className="bg-black/40 backdrop-blur-md border-white/10 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">{search.query}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(search.searched_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => navigate(`/analysis?q=${encodeURIComponent(search.query)}`)}
                      >
                        Search Again
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No recent searches</p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
              onClick={() => navigate('/analysis')}
            >
              <span className="text-lg">New Analysis</span>
              <span className="text-sm text-gray-400">Analyze a new market</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
              onClick={() => navigate('/opportunities')}
            >
              <span className="text-lg">View Opportunities</span>
              <span className="text-sm text-gray-400">Explore growth markets</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2"
              onClick={() => navigate('/settings')}
            >
              <span className="text-lg">Settings</span>
              <span className="text-sm text-gray-400">Manage your preferences</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}