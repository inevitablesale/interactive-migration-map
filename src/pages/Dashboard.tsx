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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// ... keep existing code (imports and type definitions)

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  const { data: practices, isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: async () => {
      const { data: practicesData, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .order('followerCount', { ascending: false });

      if (error) throw error;

      // Map the data to include required fields
      return practicesData.map(practice => ({
        id: practice["Company ID"].toString(),
        industry: practice["Primary Subtitle"] || "",
        region: practice["State Name"] || "",
        employee_count: practice.employeeCount || 0,
        annual_revenue: 0,
        service_mix: { "General": 100 },
        status: "owner_engaged",
        last_updated: new Date().toISOString(),
        practice_buyer_pool: [],
        notes: [],
        specialities: practice.specialities
      }));
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

  // Calculate pagination
  const totalPages = filteredPractices ? Math.ceil(filteredPractices.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPractices = filteredPractices?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          
          {isLoading ? (
            <div>Loading practices...</div>
          ) : (
            <>
              <div className={`mt-6 grid gap-4 ${
                viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
              }`}>
                {paginatedPractices?.map((practice) => (
                  <PracticeCard
                    key={practice.id}
                    practice={practice}
                    onWithdraw={handleWithdraw}
                    onExpressInterest={() => handleExpressInterest(practice.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
        <div>
          <PracticeOfDay 
            practice={practiceOfDay}
            onInterested={() => practiceOfDay && handleExpressInterest(practiceOfDay.id)}
          />
        </div>
      </div>
    </div>
  );
}
