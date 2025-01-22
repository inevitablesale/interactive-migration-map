import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { PracticeCard } from "@/components/crm/PracticeCard";
import { SearchFilters, FilterState } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Practice } from "@/types/interests";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 6;

  const { data: firms } = useQuery({
    queryKey: ['firms'],
    queryFn: async () => {
      console.log("Fetching firms...");
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*');
      
      if (error) {
        console.error("Error fetching firms:", error);
        throw error;
      }
      console.log("Fetched firms:", data?.length);
      return data;
    }
  });

  const { data: userInterests } = useQuery({
    queryKey: ['user-interests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('canary_firm_interests')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleExpressInterest = async (companyId: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to express interest.",
          variant: "destructive",
        });
        return;
      }

      const { error: interestError } = await supabase
        .from('canary_firm_interests')
        .insert({
          company_id: companyId,
          user_id: user.id,
          status: 'interested',
          is_anonymous: true
        });

      if (interestError) {
        if (interestError.code === '23505') {
          toast({
            title: "Already Interested",
            description: "You have already expressed interest in this company.",
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
          description: "Successfully expressed interest in the company.",
        });
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: "Error",
        description: "Failed to express interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFirms = firms?.filter((firm) => {
    if (!searchQuery && !filters.state && !filters.minEmployees && !filters.maxEmployees) {
      return true;
    }

    const matchesSearch = !searchQuery || 
      (firm.specialities && firm.specialities.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesState = !filters.state || 
      firm["State Name"] === filters.state;
    
    const matchesEmployeeCount = (!filters.minEmployees || firm.employeeCount >= parseInt(filters.minEmployees)) &&
      (!filters.maxEmployees || firm.employeeCount <= parseInt(filters.maxEmployees));

    return matchesSearch && matchesState && matchesEmployeeCount;
  });

  const totalPages = Math.ceil((filteredFirms?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFirms = filteredFirms?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        "State Name": data["State Name"] || "",
        employee_count: data.employeeCount || 0,
        annual_revenue: 0,
        service_mix: { "General": 100 },
        status: 'not_contacted',
        last_updated: new Date().toISOString(),
        practice_buyer_pool: [],
        buyer_count: 0
      } as Practice;
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
            onFilter={setFilters}
          />
          
          <div className="mt-6 space-y-4">
            {paginatedFirms?.map((firm) => {
              const hasExpressedInterest = userInterests?.some(
                interest => interest.company_id === firm["Company ID"] && interest.status === 'interested'
              );
              
              const practice: Practice = {
                id: firm["Company ID"].toString(),
                industry: firm["Primary Subtitle"] || "",
                "State Name": firm["State Name"] || "",
                employee_count: firm.employeeCount || 0,
                annual_revenue: 0,
                service_mix: { "General": 100 },
                status: hasExpressedInterest ? 'pending_outreach' : 'not_contacted',
                last_updated: new Date().toISOString(),
                practice_buyer_pool: [],
                buyer_count: 0
              };
              
              return (
                <PracticeCard
                  key={firm["Company ID"]}
                  practice={practice}
                  onWithdraw={() => {}} // Not implemented yet
                  onExpressInterest={() => handleExpressInterest(firm["Company ID"])}
                  disabled={isSubmitting}
                />
              );
            })}
          </div>
        </div>
        <div>
          {practiceOfDay && (
            <PracticeOfDay 
              practice={practiceOfDay}
              onInterested={() => practiceOfDay && handleExpressInterest(parseInt(practiceOfDay.id))}
            />
          )}
        </div>
      </div>
    </div>
  );
}