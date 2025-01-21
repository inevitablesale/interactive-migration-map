import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { PracticeCard } from "@/components/crm/PracticeCard";
import { SearchFilters } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FilterState {
  industry?: string;
  minEmployees?: number;
  maxEmployees?: number;
  minRevenue?: number;
  maxRevenue?: number;
  region?: string;
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  const { data: practices, isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracked_practices')
        .select(`
          *,
          practice_buyer_pool (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleWithdraw = async (practiceId: string) => {
    const { error } = await supabase
      .from('practice_buyer_pool')
      .delete()
      .match({ practice_id: practiceId, user_id: (await supabase.auth.getUser()).data.user?.id });

    if (error) {
      console.error('Error withdrawing interest:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredPractices = practices?.filter(practice => {
    // Search query filter
    const searchMatches = !searchQuery || 
      practice.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.region.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply additional filters
    const industryMatches = !filters.industry || practice.industry === filters.industry;
    const employeeMatches = (!filters.minEmployees || (practice.employee_count || 0) >= filters.minEmployees) &&
                           (!filters.maxEmployees || (practice.employee_count || 0) <= filters.maxEmployees);
    const revenueMatches = (!filters.minRevenue || (practice.annual_revenue || 0) >= filters.minRevenue) &&
                          (!filters.maxRevenue || (practice.annual_revenue || 0) <= filters.maxRevenue);
    const regionMatches = !filters.region || practice.region === filters.region;

    return searchMatches && industryMatches && employeeMatches && revenueMatches && regionMatches;
  });

  const { data: practiceOfDay } = useQuery({
    queryKey: ['practice-of-day'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracked_practices')
        .select(`
          *,
          practice_buyer_pool (*)
        `)
        .limit(1)
        .maybeSingle();

      if (error) return null;
      if (!data) return null;
      
      return {
        ...data,
        buyer_count: data.practice_buyer_pool?.length || 0,
      };
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Practice Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DashboardSummary />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <SearchFilters 
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        </div>
        <div>
          <PracticeOfDay 
            practice={practiceOfDay}
            onInterested={() => {}} // TODO: Implement interest action
          />
        </div>
      </div>

      {isLoading ? (
        <div>Loading practices...</div>
      ) : (
        <div className={`grid gap-4 ${
          viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        }`}>
          {filteredPractices?.map((practice) => (
            <PracticeCard
              key={practice.id}
              practice={{
                id: practice.id,
                industry: practice.industry,
                region: practice.region,
                employee_count: practice.employee_count || 0,
                annual_revenue: practice.annual_revenue || 0,
                service_mix: practice.service_mix as Record<string, number> || {},
                status: practice.status || 'pending_response',
                last_updated: practice.last_updated || new Date().toISOString(),
                practice_buyer_pool: practice.practice_buyer_pool
              }}
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>
      )}
    </div>
  );
}