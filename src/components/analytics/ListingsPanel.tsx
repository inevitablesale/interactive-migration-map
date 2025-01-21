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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: profile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      console.log('Fetching buyer profile...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Fetching subscription tier for user:', user.id);
      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching buyer profile:', error);
        throw error;
      }
      console.log('Buyer profile fetched:', data);
      return data;
    }
  });

  const { data: listings, refetch: refetchListings } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching listings...');
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select(`
          *,
          practice_buyer_pool (*)
        `)
        .limit(3);
      
      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      console.log('Listings fetched:', data?.length, 'results');
      return data;
    }
  });

  const isFreeTier = !profile || profile.subscription_tier === 'free';

  const handleExpressInterest = async (companyId: number) => {
    console.log('=== Starting Express Interest Process ===');
    console.log('Company ID:', companyId);
    console.log('Current state - isSubmitting:', isSubmitting);
    
    try {
      setIsSubmitting(true);
      console.log('Set isSubmitting to true');
      
      // First verify authentication
      console.log('Verifying user authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error encountered:', authError);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again",
          variant: "destructive",
        });
        return;
      }
      
      if (!user) {
        console.log('No authenticated user found');
        toast({
          title: "Authentication Required",
          description: "Please sign in to express interest",
          variant: "destructive",
        });
        return;
      }
      console.log('User authenticated successfully:', user.id);

      if (isFreeTier) {
        console.log('Free tier user attempting to access premium feature');
        toast({
          title: "Premium Feature",
          description: "Upgrade to view detailed firm information",
        });
        return;
      }

      // Find the practice in our data
      console.log('Looking up practice details for company ID:', companyId);
      const practice = listings?.find(p => p["Company ID"] === companyId);
      if (!practice) {
        console.error('Practice not found in listings data');
        toast({
          title: "Error",
          description: "Practice not found",
          variant: "destructive",
        });
        return;
      }
      console.log('Practice found:', practice);

      console.log('Creating tracked practice...');
      console.log('Practice details:', {
        user_id: user.id,
        industry: practice["Primary Subtitle"] || "Accounting",
        region: practice["State Name"] || practice.Location,
        employee_count: practice.employeeCount
      });
      
      // First create a tracked practice
      const { data: trackedPractice, error: trackedError } = await supabase
        .from('tracked_practices')
        .insert({
          user_id: user.id,
          industry: practice["Primary Subtitle"] || "Accounting",
          region: practice["State Name"] || practice.Location,
          employee_count: practice.employeeCount,
          service_mix: { "General": 100 },
          status: 'pending_response'
        })
        .select()
        .single();

      if (trackedError) {
        console.error('Error creating tracked practice:', trackedError);
        console.error('Error details:', {
          code: trackedError.code,
          message: trackedError.message,
          details: trackedError.details
        });
        toast({
          title: "Error",
          description: "Failed to track practice. Please try again.",
          variant: "destructive",
        });
        return;
      }
      console.log('Tracked practice created successfully:', trackedPractice);

      // Then add to practice_buyer_pool using the tracked practice ID
      console.log('Adding to buyer pool:', {
        practice_id: trackedPractice.id,
        user_id: user.id
      });

      const { error: poolError } = await supabase
        .from('practice_buyer_pool')
        .insert({
          practice_id: trackedPractice.id,
          user_id: user.id,
          status: 'pending_outreach',
          is_anonymous: false
        });

      if (poolError) {
        console.error('Error adding to buyer pool:', poolError);
        console.error('Pool error details:', {
          code: poolError.code,
          message: poolError.message,
          details: poolError.details
        });
        
        if (poolError.code === '23505') { // Unique violation
          console.log('User has already expressed interest');
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
      console.log('Successfully added to buyer pool');

      // Update the firm's status
      console.log('Updating firm status to pending_outreach');
      const { error: updateError } = await supabase
        .from('canary_firms_data')
        .update({ status: 'pending_outreach' })
        .eq('Company ID', companyId);

      if (updateError) {
        console.error('Error updating firm status:', updateError);
        console.error('Update error details:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details
        });
        toast({
          title: "Error",
          description: "Failed to update practice status. Please try again.",
          variant: "destructive",
        });
        return;
      }
      console.log('Firm status updated successfully');

      console.log('Refetching listings...');
      await refetchListings();
      console.log('Listings refetched successfully');

      console.log('=== Express Interest Process Completed Successfully ===');
      toast({
        title: "Success",
        description: "Successfully expressed interest in the practice.",
      });
    } catch (error) {
      console.error('Unexpected error in express interest process:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  // ... keep existing code (render JSX)

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
                    disabled={hasExpressedInterest || isSubmitting}
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