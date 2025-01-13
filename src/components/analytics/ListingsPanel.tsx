import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, Lock } from "lucide-react";
import { UpgradePrompt } from "./UpgradePrompt";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ListingsPanel = () => {
  const { toast } = useToast();
  
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

  const { data: listings } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const isFreeTier = !profile || profile.subscription_tier === 'free';

  const handleListingClick = () => {
    if (isFreeTier) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to view detailed firm information",
      });
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {listings?.map((listing) => (
          <Card 
            key={listing["Company ID"]} 
            className={`p-4 bg-black/40 backdrop-blur-md border-white/10 transition-all duration-200 ${isFreeTier ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/5 cursor-pointer'}`}
            onClick={handleListingClick}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <h3 className="font-medium text-white">
                    {listing["Company Name"]}
                    {isFreeTier && <Lock className="w-4 h-4 inline ml-2 text-yellow-500" />}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{listing.employeeCount} employees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing["State Name"]}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
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
};