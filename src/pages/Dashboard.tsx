import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { PracticeCard } from "@/components/crm/PracticeCard";
import { SearchFilters } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");

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
        .single();

      if (error) return null;
      return {
        ...data,
        buyer_count: data.practice_buyer_pool?.length || 0,
      };
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

  const filteredPractices = practices?.filter(practice => 
    practice.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    practice.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onSearch={setSearchQuery}
            onFilter={() => {}} // TODO: Implement filters
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
                employee_count: practice.employee_count,
                annual_revenue: practice.annual_revenue,
                service_mix: practice.service_mix as { [key: string]: number },
                status: practice.status,
                last_updated: practice.last_updated,
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