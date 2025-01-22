import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, Lock, DollarSign, Calculator } from "lucide-react";
import { UpgradePrompt } from "./UpgradePrompt";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
];

export function ListingsPanel() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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

  const calculateEstimatedRevenue = (employeeCount: number) => {
    const avgRevenuePerEmployee = 150000; // Average revenue per employee for accounting firms
    return employeeCount * avgRevenuePerEmployee;
  };

  const calculateEstimatedEBITDA = (revenue: number) => {
    const ebitdaMargin = 0.15; // 15% EBITDA margin for accounting firms
    return revenue * ebitdaMargin;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div className={`${isMobile ? 'flex overflow-x-auto pb-4 space-x-4 snap-x snap-mandatory' : 'space-y-4'}`}>
        {listings?.map((listing) => {
          const interestedBuyersCount = listing.practice_buyer_pool?.length || 0;
          const hasExpressedInterest = listing.status === 'pending_outreach';
          const estimatedRevenue = calculateEstimatedRevenue(listing.employeeCount || 0);
          const estimatedEBITDA = calculateEstimatedEBITDA(estimatedRevenue);
          
          return (
            <Card 
              key={listing["Company ID"]} 
              className={`p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                isFreeTier ? 'cursor-not-allowed opacity-70' : 'hover:bg-gray-50 cursor-pointer'
              } ${isMobile ? 'min-w-[300px] snap-center' : 'w-full'}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {listing["Primary Subtitle"] || "Accounting"}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{listing["State Name"] || listing.Location}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Employees</p>
                      <p className="font-medium">{listing.employeeCount || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Est. Revenue</p>
                      <p className="font-medium">{formatCurrency(estimatedRevenue)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Est. EBITDA</p>
                      <p className="font-medium">{formatCurrency(estimatedEBITDA)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm text-gray-500">
                    {interestedBuyersCount} interested {interestedBuyersCount === 1 ? 'buyer' : 'buyers'}
                    {hasExpressedInterest && ' • Status: Pending Contact'}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleExpressInterest(listing["Company ID"])}
                      disabled={hasExpressedInterest}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      {hasExpressedInterest ? 'Contact Pending' : 'Express Interest'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600"
                    >
                      View Details
                    </Button>
                  </div>
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
    </div>
  );
}