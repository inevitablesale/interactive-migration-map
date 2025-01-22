import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { SearchFilters, FilterState } from "@/components/crm/SearchFilters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Users, DollarSign, Clock, Eye, MessageSquare, Heart } from "lucide-react";
import { FirmDetailsSheet } from "@/components/crm/FirmDetailsSheet";
import { CanaryFirmInterest, Practice } from "@/types/interests";

export const ListingsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Practice | null>(null);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 6;

  const { data: listings } = useQuery<Practice[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log("Fetching listings...");
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*');
      
      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }

      // Transform the data into Practice type
      const practices: Practice[] = data.map(item => ({
        id: item["Company ID"].toString(),
        industry: item["Primary Subtitle"] || "",
        "State Name": item["State Name"] || "",
        employee_count: item.employeeCount || 0,
        annual_revenue: 0,
        service_mix: { "General": 100 },
        status: 'not_contacted',
        last_updated: new Date().toISOString(),
        practice_buyer_pool: [],
        buyer_count: 0,
        notes: item.notes,
        specialities: item.specialities,
        "Company Name": item["Company Name"]
      }));

      console.log("Fetched listings:", practices.length);
      return practices;
    }
  });

  const { data: userInterests } = useQuery<CanaryFirmInterest[]>({
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

  const filteredListings = listings?.filter((listing) => {
    if (!searchQuery && !filters.state && !filters.minEmployees && !filters.maxEmployees) {
      return true;
    }

    const matchesSearch = !searchQuery || 
      (listing.specialities && listing.specialities.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesState = !filters.state || 
      listing["State Name"] === filters.state;
    
    const matchesEmployeeCount = (!filters.minEmployees || listing.employee_count >= parseInt(filters.minEmployees)) &&
      (!filters.maxEmployees || listing.employee_count <= parseInt(filters.maxEmployees));

    return matchesSearch && matchesState && matchesEmployeeCount;
  });

  const totalPages = Math.ceil((filteredListings?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedListings = filteredListings?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <SearchFilters 
        onSearch={handleSearch}
        onFilter={setFilters}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedListings?.map((listing) => {
          const hasExpressedInterest = userInterests?.some(
            interest => interest.company_id === parseInt(listing.id) && interest.status === 'interested'
          );
          const hasNotes = listing.notes && listing.notes.trim().length > 0;
          
          return (
            <Card 
              key={listing.id} 
              className="p-6"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold leading-tight line-clamp-2 flex-1 mr-3">
                    {listing["Company Name"]}
                  </h3>
                  <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                    {hasExpressedInterest ? 'Contact Pending' : 'Not Contacted'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="truncate">{listing["State Name"]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>{listing.employee_count} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span>${listing.annual_revenue}k revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{listing.specialities || 'No specialties'}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                  <div>Last update: {format(new Date(listing.last_updated), 'MMM dd, yyyy')}</div>
                  <div>View details for more info</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline"
                    className={`w-full flex items-center justify-center gap-2 ${!hasNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!hasNotes}
                    onClick={() => hasNotes && setSelectedNotes(listing.notes || null)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">View Notes</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      setSelectedListing(listing);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Details</span>
                  </Button>
                  
                  <Button 
                    variant={hasExpressedInterest ? "outline" : "default"}
                    className={`w-full flex items-center justify-center gap-2 ${
                      hasExpressedInterest ? 'text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={() => handleExpressInterest(parseInt(listing.id))}
                    disabled={hasExpressedInterest || isSubmitting}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {hasExpressedInterest ? 'Interested' : 'Express Interest'}
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedNotes} onOpenChange={() => setSelectedNotes(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap">
            {selectedNotes}
          </div>
        </DialogContent>
      </Dialog>

      {selectedListing && (
        <FirmDetailsSheet
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedListing(null);
          }}
          practice={selectedListing}
        />
      )}
    </div>
  );
};
