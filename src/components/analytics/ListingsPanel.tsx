import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, Clock, DollarSign, MessageSquare, Eye, Heart } from "lucide-react";
import { UpgradePrompt } from "./UpgradePrompt";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export const ListingsPanel = () => {
  const { toast } = useToast();
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  
  const { data: profile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: listings, refetch: refetchListings } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select(`
          *,
          practice_buyer_pool (*)
        `)
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  const isFreeTier = !profile || profile.subscription_tier === 'free';

  const handleExpressInterest = async (companyId: number) => {
    if (isFreeTier) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to view detailed firm information",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to express interest",
          variant: "destructive",
        });
        return;
      }

      const { error: poolError } = await supabase
        .from('practice_buyer_pool')
        .insert([{
          practice_id: companyId.toString(),
          user_id: user.id,
          status: 'pending_outreach',
          is_anonymous: false
        }]);

      if (poolError) {
        if (poolError.code === '23505') {
          toast({
            title: "Already Expressed Interest",
            description: "You have already expressed interest in this practice",
          });
        } else {
          throw poolError;
        }
        return;
      }

      const { error: updateError } = await supabase
        .from('canary_firms_data')
        .update({ status: 'pending_outreach' })
        .eq('Company ID', companyId);

      if (updateError) throw updateError;

      refetchListings();

      toast({
        title: "Interest Submitted",
        description: "Our team has been alerted and will initiate contact within 4 hours.",
      });
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: "Error",
        description: "Failed to express interest. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {listings?.map((listing) => {
          const interestedBuyersCount = listing.practice_buyer_pool?.length || 0;
          const hasExpressedInterest = listing.status === 'pending_outreach';
          const hasNotes = listing.notes && listing.notes.trim().length > 0;
          
          return (
            <Card 
              key={listing["Company ID"]} 
              className="p-6 w-full"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {listing["Primary Subtitle"] || "Accounting"}
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm whitespace-nowrap">
                    {listing.status === 'pending_outreach' ? 'Contact Pending' : 'Not Contacted'}
                  </div>
                </div>

                {/* Main Info */}
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{listing["State Name"] || listing.Location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{listing.employeeCount} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">$0k revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">Specialties</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                  <div>
                    Last update: {format(new Date(), 'MMM dd, yyyy')}
                  </div>
                  <div>
                    {interestedBuyersCount} interested buyers
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline"
                    className={`w-full flex items-center justify-center gap-2 min-w-0 ${!hasNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!hasNotes}
                    onClick={() => hasNotes && setSelectedNotes(listing.notes)}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">View Notes</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 min-w-0"
                  >
                    <Eye className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">View Details</span>
                  </Button>
                  
                  <Button 
                    variant={hasExpressedInterest ? "outline" : "default"}
                    className={`w-full flex items-center justify-center gap-2 min-w-0 ${
                      hasExpressedInterest ? 'text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={() => handleExpressInterest(listing["Company ID"])}
                    disabled={hasExpressedInterest}
                  >
                    <Heart className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {hasExpressedInterest ? 'Contact Pending' : 'Express Interest'}
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {isFreeTier && (
        <UpgradePrompt
          title="Unlock Full Access"
          description="Get detailed information about firms, including contact details and growth metrics"
          features={[
            "View complete firm profiles",
            "Access contact information",
            "Track growth metrics",
            "Export data to CSV"
          ]}
        />
      )}

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