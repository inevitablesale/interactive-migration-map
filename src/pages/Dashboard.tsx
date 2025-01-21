import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { PracticeCard } from "@/components/crm/PracticeCard";
import { SearchFilters, FilterState } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 6;

  const { data: practices, isLoading, refetch } = useQuery({
    queryKey: ['practices'],
    queryFn: async () => {
      const { data: practicesData, error } = await supabase
        .from('canary_firms_data')
        .select('*');

      if (error) throw error;

      return practicesData.map(practice => ({
        id: practice["Company ID"].toString(),
        industry: practice["Primary Subtitle"] || "",
        region: practice["State Name"] || "",
        employee_count: practice.employeeCount || 0,
        annual_revenue: 0,
        service_mix: { "General": 100 },
        status: "owner_engaged" as const,
        last_updated: new Date().toISOString(),
        practice_buyer_pool: [] as { id: string }[],
        specialities: practice.specialities || "",
        notes: practice.notes || ""
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
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to express interest in practices.",
          variant: "destructive",
        });
        return;
      }

      // Find the practice in our data
      const practice = practices?.find(p => p.id === practiceId);
      if (!practice) {
        toast({
          title: "Error",
          description: "Practice not found.",
          variant: "destructive",
        });
        return;
      }

      // First, create or get the tracked practice
      const { data: trackedPractice, error: trackedError } = await supabase
        .from('tracked_practices')
        .insert([{
          industry: practice.industry,
          region: practice.region,
          employee_count: practice.employee_count,
          annual_revenue: practice.annual_revenue,
          service_mix: practice.service_mix,
          status: 'pending_response',
          user_id: user.id
        }])
        .select()
        .single();

      if (trackedError) {
        toast({
          title: "Error",
          description: "Failed to track practice. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Then, add to practice_buyer_pool using the tracked practice ID
      const { error: poolError } = await supabase
        .from('practice_buyer_pool')
        .insert([{
          practice_id: trackedPractice.id,
          user_id: user.id
        }]);

      if (poolError) {
        if (poolError.code === '23505') { // Unique violation
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
        // Refetch the data to update UI
        refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredPractices = practices?.filter(practice => {
    const searchMatches = !searchQuery || 
      practice.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.region.toLowerCase().includes(searchQuery.toLowerCase());

    const industryMatches = !filters.industry || practice.industry === filters.industry;
    const employeeMatches = (!filters.minEmployees || practice.employee_count >= parseInt(filters.minEmployees)) &&
                           (!filters.maxEmployees || practice.employee_count <= parseInt(filters.maxEmployees));
    const regionMatches = !filters.region || practice.region === filters.region;

    return searchMatches && industryMatches && employeeMatches && regionMatches;
  });

  const totalPages = filteredPractices ? Math.ceil(filteredPractices.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPractices = filteredPractices?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPaginationNumbers = () => {
    const pageNumbers: (number | 'ellipsis')[] = [];
    const currentGroup = Math.floor((currentPage - 1) / 10);
    const startPage = currentGroup * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

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
        buyer_count: 0
      };
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Practice Dashboard</h1>
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
              <div className="mt-6 space-y-4">
                {paginatedPractices?.map((practice) => (
                  <PracticeCard
                    key={practice.id}
                    practice={practice}
                    onWithdraw={handleWithdraw}
                    onExpressInterest={() => handleExpressInterest(practice.id)}
                    disabled={isSubmitting}
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
                    
                    {getPaginationNumbers().map((page, index) => (
                      page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
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
          {practiceOfDay && (
            <PracticeOfDay 
              practice={practiceOfDay}
              onInterested={() => practiceOfDay && handleExpressInterest(practiceOfDay.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}