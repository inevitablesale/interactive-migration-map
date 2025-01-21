import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { PracticeCard } from "@/components/crm/PracticeCard";
import { SearchFilters, FilterState } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const { toast } = useToast();

  const { data: practices, isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: async () => {
      // First get all practices with their engagement status
      const { data: practiceEngagements, error: engagementError } = await supabase
        .from('practice_buyer_pool')
        .select('practice_id, status')
        .order('joined_at', { ascending: false });

      if (engagementError) throw engagementError;

      // Then get the practice data
      const { data: practicesData, error } = await supabase
        .from('canary_firms_data')
        .select('*, practice_notes(content, created_at)')
        .order('followerCount', { ascending: false });

      if (error) throw error;

      // Map the data to include engagement status
      return practicesData.map(practice => {
        const engagement = practiceEngagements?.find(
          e => e.practice_id === practice["Company ID"].toString()
        );

        return {
          id: practice["Company ID"].toString(),
          industry: practice["Primary Subtitle"] || "",
          region: practice["State Name"] || "",
          employee_count: practice.employeeCount || 0,
          annual_revenue: 0,
          service_mix: { "General": 100 },
          status: engagement?.status || "owner_engaged", // Default to owner_engaged if no status
          last_updated: new Date().toISOString(),
          practice_buyer_pool: [],
          notes: practice.practice_notes || []
        };
      });
    }
  });

  const handleWithdraw = async (practiceId: string) => {
    const { error } = await supabase
      .from('practice_buyer_pool')
      .delete()
      .match({ practice_id: practiceId, user_id: (await supabase.auth.getUser()).data.user?.id });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw interest. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Successfully withdrew interest from the practice.",
      });
    }
  };

  const handleExpressInterest = async (practiceId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to express interest in practices.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('practice_buyer_pool')
      .insert([
        { practice_id: practiceId, user_id: user.id }
      ]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast({
          title: "Already Interested",
          description: "You have already expressed interest in this practice.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to express interest. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success",
        description: "Successfully expressed interest in the practice.",
      });
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
    const employeeMatches = (!filters.minEmployees || practice.employee_count >= parseInt(filters.minEmployees)) &&
                           (!filters.maxEmployees || practice.employee_count <= parseInt(filters.maxEmployees));
    const regionMatches = !filters.region || practice.region === filters.region;

    return searchMatches && industryMatches && employeeMatches && regionMatches;
  });

  const { data: practiceOfDay } = useQuery({
    queryKey: ['practice-of-day'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) return null;
      if (!data) return null;
      
      return {
        id: data["Company ID"].toString(),
        industry: data["Primary Subtitle"] || "",
        region: data["State Name"] || "",
        employee_count: data.employeeCount || 0,
        service_mix: { "General": 100 },
        buyer_count: 0,
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
            onInterested={() => practiceOfDay && handleExpressInterest(practiceOfDay.id)}
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
              practice={practice}
              onWithdraw={handleWithdraw}
              onExpressInterest={() => handleExpressInterest(practice.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
