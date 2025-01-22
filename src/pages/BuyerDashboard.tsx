import { useState } from "react";
import { Building2, Clock, Users, Search, Filter, Eye, MessageSquare, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { format } from "date-fns";

export default function BuyerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: firms, isLoading } = useQuery({
    queryKey: ['firms', searchQuery],
    queryFn: async () => {
      console.log("Fetching firms with search:", searchQuery);
      let query = supabase
        .from('canary_firms_data')
        .select('*');
      
      if (searchQuery) {
        query = query.or(`Company Name.ilike.%${searchQuery}%,Primary Subtitle.ilike.%${searchQuery}%,specialities.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);
      
      if (error) {
        console.error("Error fetching firms:", error);
        throw error;
      }

      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: totalFirms } = await supabase
        .from('canary_firms_data')
        .select('*', { count: 'exact' });

      const { data: pendingFirms } = await supabase
        .from('canary_firms_data')
        .select('*', { count: 'exact' })
        .eq('status', 'pending_response');

      const { data: buyerPool } = await supabase
        .from('practice_buyer_pool')
        .select('practice_id');

      const avgPoolSize = buyerPool ? buyerPool.length / (totalFirms?.length || 1) : 0;

      return {
        total: totalFirms?.length || 0,
        pending: pendingFirms?.length || 0,
        avgPoolSize: Math.round(avgPoolSize)
      };
    }
  });

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Practices</h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">practices in progress</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Awaiting Response</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          <p className="text-xs text-muted-foreground">practices pending</p>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Avg. Pool Size</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats?.avgPoolSize || 0}</div>
          <p className="text-xs text-muted-foreground">buyers per practice</p>
        </Card>
      </div>
      
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search firms by industry or region..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading firms...</p>
            ) : firms?.length === 0 ? (
              <p className="text-center text-muted-foreground">No firms found</p>
            ) : (
              firms?.map((firm) => (
                <Card key={firm["Company ID"]} className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">Accounting</h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Not Contacted
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>{firm["State Name"]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{firm.employeeCount} employees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{firm.specialities || "Specialties"}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                      <div>Last update: {format(new Date(), 'MMM dd, yyyy')}</div>
                      <div>0 interested buyers</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        View Notes
                      </Button>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="default" className="w-full flex items-center justify-center gap-2">
                        <Heart className="h-4 w-4" />
                        Express Interest
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
        <div>
          <PracticeOfDay />
        </div>
      </div>
    </main>
  );
}