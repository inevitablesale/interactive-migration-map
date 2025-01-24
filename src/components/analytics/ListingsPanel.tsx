import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, Lock, TrendingUp, DollarSign, Briefcase } from "lucide-react";
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

interface GeneratedText {
  title: string | null;
  teaser: string | null;
}

interface Listing {
  "Company ID": number;
  "Company Name": string;
  Location: string;
  "State Name": string;
  status: string;
  logoResolutionResult: string | null;
  originalCoverImage: string | null;
  employeeCount: number;
  specialities: string;
  practice_buyer_pool: Array<{
    id: string;
    status: string;
  }>;
  firm_generated_text: Array<{
    title: string | null;
    teaser: string | null;
  }>;
}

export const ListingsPanel = () => {
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

  const { data: listings, refetch: refetchListings } = useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select(`
          *,
          practice_buyer_pool:canary_firm_interests(
            id,
            status
          ),
          firm_generated_text(
            title,
            teaser
          )
        `)
        .limit(3)
        .order('followerCount', { ascending: false });
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item,
        practice_buyer_pool: Array.isArray(item.practice_buyer_pool) ? item.practice_buyer_pool : [],
        firm_generated_text: Array.isArray(item.firm_generated_text) ? item.firm_generated_text : []
      }));
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
        .from('canary_firm_interests')
        .insert([{
          company_id: companyId,
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

      // Update firm status
      const { error: updateError } = await supabase
        .from('canary_firms_data')
        .update({ status: 'pending_outreach' })
        .eq('Company ID', companyId);

      if (updateError) throw updateError;

      // Refetch listings to update UI
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

  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
    return PLACEHOLDER_IMAGES[randomIndex];
  };

  const getLocationDisplay = (listing: any) => {
    const location = listing.Location || '';
    const stateName = listing["State Name"] || '';
    
    // If Location contains both city and state (e.g., "New York, NY")
    if (location.includes(',')) {
      return location;
    }
    
    // If we have both city (Location) and state separately
    if (location && stateName) {
      return `${location}, ${stateName}`;
    }
    
    // Fallback to whatever we have
    return location || stateName || 'Location unavailable';
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore Real Opportunities with Canary
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {listings?.map((listing) => {
            const interestedBuyersCount = listing.practice_buyer_pool?.length || 0;
            const hasExpressedInterest = listing.status === 'pending_outreach';
            const generatedText = listing.firm_generated_text?.[0];
            
            return (
              <Card 
                key={listing["Company ID"]} 
                className={`group p-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-md border-white/10 
                  transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 
                  hover:border-blue-500/20 hover:from-blue-800/40 hover:to-indigo-800/40
                  ${isFreeTier ? 'cursor-not-allowed opacity-70' : 'hover:scale-[1.02] cursor-pointer'} 
                  ${isMobile ? 'min-w-[300px] snap-center' : 'w-full'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 
                    group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                    <img
                      src={listing.logoResolutionResult || listing.originalCoverImage || getRandomPlaceholder()}
                      alt={`${listing["Company Name"]} logo`}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  <div className="flex-1 space-y-3 min-w-0">
                    <div>
                      <h3 className={`font-medium text-white text-lg truncate group-hover:text-blue-300 transition-colors ${isFreeTier ? 'blur-sm select-none' : ''}`}>
                        {generatedText?.title || listing["Company Name"]}
                        {isFreeTier && <Lock className="w-4 h-4 inline ml-2 text-yellow-500 animate-pulse" />}
                      </h3>
                      {generatedText?.teaser && (
                        <p className="text-sm text-white/60 group-hover:text-white/80 mt-1 line-clamp-2 transition-colors">
                          {generatedText.teaser}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80 text-sm mt-2 transition-colors">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{getLocationDisplay(listing)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-2 group-hover:bg-white/10 transition-colors">
                        <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-white/60 block text-xs">Employees</span>
                          <p className="text-white font-medium truncate">{listing.employeeCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-2 group-hover:bg-white/10 transition-colors">
                        <Briefcase className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-white/60 block text-xs">Specialties</span>
                          <p className="text-white font-medium truncate">{listing.specialities || "General Practice"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-2 group-hover:bg-white/10 transition-colors">
                        <TrendingUp className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-white/60 block text-xs">Growth</span>
                          <p className="text-white font-medium truncate">+{Math.floor(Math.random() * 30)}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-2 group-hover:bg-white/10 transition-colors">
                        <DollarSign className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-white/60 block text-xs">Revenue/Employee</span>
                          <p className="text-white font-medium truncate">${Math.floor(80 + Math.random() * 40)}K</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        {interestedBuyersCount} interested {interestedBuyersCount === 1 ? 'buyer' : 'buyers'}
                        {hasExpressedInterest && ' • Status: Pending Contact'}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 px-3 transition-all duration-300"
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
                          className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 px-3 transition-all duration-300"
                          onClick={() => handleExpressInterest(listing["Company ID"])}
                          disabled={hasExpressedInterest}
                        >
                          {hasExpressedInterest ? 'Contact Pending' : 'Express Interest'}
                        </Button>
                      </div>
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
    </div>
  );
};