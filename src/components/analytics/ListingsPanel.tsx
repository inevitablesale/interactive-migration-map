import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, Lock, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import { UpgradePrompt } from "./UpgradePrompt";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
];

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
        .limit(3);
      
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

  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
    return PLACEHOLDER_IMAGES[randomIndex];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {listings?.map((listing, index) => (
          <Card 
            key={listing["Company ID"]} 
            className={`p-4 bg-black/40 backdrop-blur-md border-white/10 transition-all duration-200 ${
              isFreeTier ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/5 cursor-pointer'
            }`}
            onClick={handleListingClick}
          >
            <div className="flex items-start gap-4">
              {/* Firm Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                <img
                  src={listing.logoResolutionResult || listing.originalCoverImage || getRandomPlaceholder()}
                  alt={isFreeTier ? "Firm logo" : `${listing["Company Name"]} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Firm Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className={`font-medium text-white text-lg ${isFreeTier ? 'blur-sm select-none' : ''}`}>
                    {listing["Company Name"]}
                    {isFreeTier && <Lock className="w-4 h-4 inline ml-2 text-yellow-500" />}
                  </h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.Location || listing["State Name"]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-white/60">Employees</span>
                      <p className="text-white font-medium">{listing.employeeCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-green-400" />
                    <div>
                      <span className="text-white/60">Specialties</span>
                      <p className="text-white font-medium line-clamp-1">{listing.specialities || "General Practice"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <div>
                      <span className="text-white/60">Growth</span>
                      <p className="text-white font-medium">+{Math.floor(Math.random() * 30)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-white/60">Revenue/Employee</span>
                      <p className="text-white font-medium">${Math.floor(80 + Math.random() * 40)}K</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    onClick={() => {
                      if (isFreeTier) {
                        toast({
                          title: "Premium Feature",
                          description: "Upgrade to save opportunities",
                        });
                      }
                    }}
                  >
                    Save Opportunity
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    onClick={() => {
                      if (isFreeTier) {
                        toast({
                          title: "Premium Feature",
                          description: "Upgrade to contact firms",
                        });
                      }
                    }}
                  >
                    Contact Firm
                  </Button>
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