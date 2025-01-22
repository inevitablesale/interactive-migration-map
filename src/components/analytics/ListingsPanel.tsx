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

export const ListingsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const { toast } = useToast();

  // Basic query to fetch ALL listings without any restrictions
  const { data: listings } = useQuery({
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
      console.log("Fetched listings:", data?.length);
      return data;
    }
  });

  // Separate query for user's interests
  const { data: userInterests } = useQuery({
    queryKey: ['user-interests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('practice_buyer_pool')
        .select('practice_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(d => d.practice_id);
    }
  });

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

      // First, create or get the tracked practice
      const { data: trackedPractice, error: trackedError } = await supabase
        .from('tracked_practices')
        .insert({
          industry: "Accounting",
          region: "US",
          employee_count: 0,
          annual_revenue: 0,
          service_mix: { "General": 100 },
          status: 'pending_response',
          user_id: user.id
        })
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
        .insert({
          practice_id: trackedPractice.id,
          user_id: user.id,
          status: 'interested',
          is_anonymous: true
        });

      if (poolError) {
        toast({
          title: "Error",
          description: "Failed to express interest. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Interest Expressed",
          description: "We've recorded your interest in this practice.",
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

  // Filter listings based on search and filters only
  const filteredListings = listings?.filter((listing) => {
    if (!searchQuery && !filters.state && !filters.minEmployees && !filters.maxEmployees) {
      return true;
    }

    const matchesSearch = !searchQuery || 
      (listing.specialities && listing.specialities.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesState = !filters.state || 
      listing["State Name"] === filters.state;
    
    const matchesEmployeeCount = (!filters.minEmployees || listing.employeeCount >= parseInt(filters.minEmployees)) &&
      (!filters.maxEmployees || listing.employeeCount <= parseInt(filters.maxEmployees));

    return matchesSearch && matchesState && matchesEmployeeCount;
  });

  return (
    <div className="space-y-6">
      <SearchFilters 
        onSearch={setSearchQuery}
        onFilter={setFilters}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings?.map((listing) => {
          const hasExpressedInterest = userInterests?.some(interest => interest.toString() === listing["Company ID"].toString());
          const hasNotes = listing.notes && listing.notes.trim().length > 0;
          
          return (
            <Card 
              key={listing["Company ID"]} 
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
                    <span className="truncate">{listing["State Name"] || listing.Location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span>{listing.employeeCount} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span>$0k revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{listing.specialities || 'No specialties'}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                  <div>Last update: {format(new Date(), 'MMM dd, yyyy')}</div>
                  <div>View details for more info</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline"
                    className={`w-full flex items-center justify-center gap-2 ${!hasNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!hasNotes}
                    onClick={() => hasNotes && setSelectedNotes(listing.notes)}
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
                    onClick={() => handleExpressInterest(listing["Company ID"])}
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