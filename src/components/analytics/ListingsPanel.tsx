import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { SearchFilters, FilterState } from "@/components/crm/SearchFilters";
import { PracticeOfDay } from "@/components/crm/PracticeOfDay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Users, DollarSign, Clock, Eye, MessageSquare, Heart } from "lucide-react";

export const ListingsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: listings, refetch: refetchListings } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select(`
          *,
          practice_buyer_pool (*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const handleExpressInterest = async (companyId: number) => {
    try {
      setIsSubmitting(true);
      
      // Update the firm's status
      const { error: updateError } = await supabase
        .from('canary_firms_data')
        .update({ status: 'pending_outreach' })
        .eq('Company ID', companyId);

      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to update practice status. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to express interest",
          variant: "destructive",
        });
        return;
      }

      // Add to practice_buyer_pool
      const { error: poolError } = await supabase
        .from('practice_buyer_pool')
        .insert({
          practice_id: companyId,
          user_id: user.id,
          status: 'pending_outreach',
          is_anonymous: false
        });

      if (poolError) {
        if (poolError.code === '23505') {
          toast({
            title: "Already Interested",
            description: "You have already expressed interest in this practice.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to express interest. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      await refetchListings();
      
      toast({
        title: "Success",
        description: "Successfully expressed interest in the practice.",
      });
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

  const filteredListings = listings?.filter(listing => {
    const searchMatches = !searchQuery || 
      listing["Primary Subtitle"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing["State Name"]?.toLowerCase().includes(searchQuery.toLowerCase());

    const industryMatches = !filters.industry || listing["Primary Subtitle"] === filters.industry;
    const employeeMatches = (!filters.minEmployees || listing.employeeCount >= parseInt(filters.minEmployees)) &&
                           (!filters.maxEmployees || listing.employeeCount <= parseInt(filters.maxEmployees));
    const regionMatches = !filters.region || listing["State Name"] === filters.region;

    return searchMatches && industryMatches && employeeMatches && regionMatches;
  });

  return (
    <div className="space-y-6">
      <SearchFilters 
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings?.map((listing) => {
          const interestedBuyersCount = listing.practice_buyer_pool?.length || 0;
          const hasExpressedInterest = listing.status === 'pending_outreach';
          const hasNotes = listing.notes && listing.notes.trim().length > 0;
          
          return (
            <Card 
              key={listing["Company ID"]} 
              className="p-6"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">
                    {listing["Primary Subtitle"] || "Accounting"}
                  </h3>
                  <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                    {listing.status === 'pending_outreach' ? 'Contact Pending' : 'Not Contacted'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span>{listing["State Name"] || listing.Location}</span>
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
                    <span>Specialties</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                  <div>Last update: {format(new Date(), 'MMM dd, yyyy')}</div>
                  <div>{interestedBuyersCount} interested buyers</div>
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
                      {hasExpressedInterest ? 'Contact Pending' : 'Express Interest'}
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
    </div>
  );
};