import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { PracticeCard } from "@/components/crm/PracticeCard";
import { SearchFilters, FilterState } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Bird } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { useMarketDataForPractices } from "@/hooks/useMarketDataForPractices";

export default function TrackedPractices() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 6;

  const { data: practices, isLoading, refetch: refetchPractices } = useQuery({
    queryKey: ['practices'],
    queryFn: async () => {
      const { data: practicesData, error } = await supabase
        .from('canary_firms_data')
        .select(`
          *,
          firm_generated_text!inner (
            title
          )
        `)
        .order('followerCount', { ascending: false });

      if (error) throw error;

      return practicesData.map(practice => ({
        id: practice["Company ID"].toString(),
        industry: practice["Primary Subtitle"] || "",
        region: practice.Location || practice["State Name"] || "",
        employee_count: practice.employeeCount || 0,
        annual_revenue: 0,
        service_mix: { "General": 100 },
        status: "not_contacted",
        last_updated: new Date().toISOString(),
        practice_buyer_pool: [],
        notes: [],
        specialities: practice.specialities,
        generated_title: practice.firm_generated_text?.title || practice["Primary Subtitle"] || "",
        COUNTYFP: practice.COUNTYFP || undefined,
        STATEFP: practice.STATEFP || undefined,
        COUNTYNAME: practice.COUNTYNAME || undefined
      }));
    }
  });

  // Filter practices based on search and filters
  const filteredPractices = practices?.filter(practice => {
    const searchMatches = !searchQuery || 
      practice.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (practice.specialities && practice.specialities.toLowerCase().includes(searchQuery.toLowerCase()));

    const industryMatches = !filters.industry || practice.industry === filters.industry;
    const employeeMatches = (!filters.minEmployees || practice.employee_count >= parseInt(filters.minEmployees)) &&
                           (!filters.maxEmployees || practice.employee_count <= parseInt(filters.maxEmployees));
    const stateMatches = !filters.state || practice.region.includes(filters.state);

    return searchMatches && industryMatches && employeeMatches && stateMatches;
  });

  const totalPages = filteredPractices ? Math.ceil(filteredPractices.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPractices = filteredPractices?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Only fetch market data for visible practices
  const marketQueries = useMarketDataForPractices(paginatedPractices);

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
      refetchPractices();
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
      if (error.code === '23505') {
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
      refetchPractices();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Helper function to generate pagination numbers
  const getPaginationRange = () => {
    const range: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);
    
    if (currentPage > 3) {
      range.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - 2) {
      range.push('ellipsis');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          <Link to="/auth" className="text-white hover:text-yellow-400 transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 pt-36 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-30">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Tracked Practices</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
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
              <div className="text-white">Loading practices...</div>
            ) : (
              <>
                <div className={`mt-6 grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedPractices?.map((practice, index) => {
                    const marketData = marketQueries[index]?.data;
                    return (
                      <PracticeCard
                        key={practice.id}
                        practice={{
                          ...practice,
                          avgSalaryPerEmployee: marketData?.avgSalaryPerEmployee,
                          COUNTYFP: practice.COUNTYFP,
                          STATEFP: practice.STATEFP,
                          COUNTYNAME: practice.COUNTYNAME
                        }}
                        onWithdraw={() => handleWithdraw(practice.id)}
                        onExpressInterest={() => handleExpressInterest(practice.id)}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} text-white hover:text-yellow-400`}
                        />
                      </PaginationItem>
                      
                      {getPaginationRange().map((page, index) => (
                        page === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis className="text-white" />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className={`${currentPage === page ? 'bg-yellow-400 text-black' : 'text-white hover:text-yellow-400'}`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} text-white hover:text-yellow-400`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
          <div className="mt-6 md:mt-0">
            <PracticeOfDay />
          </div>
        </div>
      </main>
    </div>
  );
}