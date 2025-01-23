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
  practice_buyer_pool: Array<any>;
  firm_generated_text: GeneratedText[];
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
          practice_buyer_pool (
            id,
            status
          ),
          firm_generated_text (
            title,
            teaser
          )
        `)
        .limit(3);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        practice_buyer_pool: item.practice_buyer_pool || [],
        firm_generated_text: item.firm_generated_text || []
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

      // Add to practice_buyer_pool
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
    <div className="space-y-6">
      <div className={`${isMobile ? 'flex overflow-x-auto pb-4 space-x-4 snap-x snap-mandatory' : 'space-y-4'}`}>
        {listings?.map((listing) => {
          const interestedBuyersCount = listing.practice_buyer_pool?.length || 0;
          const hasExpressedInterest = listing.status === 'pending_outreach';
          const generatedText = listing.firm_generated_text?.[0];
          
          return (
            <Card 
              key={listing["Company ID"]} 
              className={`p-4 bg-black/40 backdrop-blur-md border-white/10 transition-all duration-200 ${
                isFreeTier ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/5 cursor-pointer'
              } ${isMobile ? 'min-w-[300px] snap-center' : 'w-full'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                  <img
                    src={listing.logoResolutionResult || listing.originalCoverImage || getRandomPlaceholder()}
                    alt={`${listing["Company Name"]} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <h3 className={`font-medium text-white text-lg truncate ${isFreeTier ? 'blur-sm select-none' : ''}`}>
                      {generatedText?.title || listing["Company Name"]}
                      {isFreeTier && <Lock className="w-4 h-4 inline ml-2 text-yellow-500" />}
                    </h3>
                    {generatedText?.teaser && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {generatedText.teaser}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-white/60 text-sm mt-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{getLocationDisplay(listing)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-white/60 block">Employees</span>
                        <p className="text-white font-medium truncate">{listing.employeeCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-white/60 block">Specialties</span>
                        <p className="text-white font-medium truncate">{listing.specialities || "General Practice"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-white/60 block">Growth</span>
                        <p className="text-white font-medium truncate">+{Math.floor(Math.random() * 30)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-white/60 block">Revenue/Employee</span>
                        <p className="text-white font-medium truncate">${Math.floor(80 + Math.random() * 40)}K</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <div className="text-sm text-white/60">
                      {interestedBuyersCount} interested {interestedBuyersCount === 1 ? 'buyer' : 'buyers'}
                      {hasExpressedInterest && ' • Status: Pending Contact'}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3"
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
                        className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3"
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
  );
};