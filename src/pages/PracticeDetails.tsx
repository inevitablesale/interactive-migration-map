import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { PracticeHeader } from "@/components/practice-details/PracticeHeader";
import { KeyMetricsBar } from "@/components/practice-details/KeyMetricsBar";
import { BusinessOverview } from "@/components/practice-details/BusinessOverview";
import { PracticeInfo } from "@/components/practice-details/PracticeInfo";
import { MarketMetricsGrid } from "@/components/practice-details/MarketMetricsGrid";
import { BadgesAndCallouts } from "@/components/practice-details/BadgesAndCallouts";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Users, Building, TrendingUp, Bird, ChevronDown, Briefcase, Mail, Megaphone, Target } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { TopFirm, ComprehensiveMarketData } from "@/types/rankings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PracticeDetails() {
  const { practiceId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMarketDataOpen, setIsMarketDataOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: practiceData, isLoading: isPracticeLoading, error: practiceError } = useQuery({
    queryKey: ['practice-details', practiceId],
    queryFn: async () => {
      if (!practiceId) throw new Error('Practice ID is required');
      
      const companyId = Number(practiceId);
      if (isNaN(companyId)) {
        throw new Error('Invalid practice ID format');
      }

      console.log('Fetching practice with Company ID:', companyId);
      
      const [practiceResult, generatedTextResult] = await Promise.all([
        supabase
          .from('canary_firms_data')
          .select('*')
          .eq('Company ID', companyId)
          .maybeSingle(),
        supabase
          .from('firm_generated_text')
          .select('*')
          .eq('company_id', companyId)
          .maybeSingle()
      ]);

      if (practiceResult.error) {
        console.error('Error fetching practice:', practiceResult.error);
        throw practiceResult.error;
      }
      
      if (!practiceResult.data) {
        console.log('No practice found for ID:', companyId);
        throw new Error('Practice not found');
      }

      const practice = practiceResult.data;
      const generatedText = generatedTextResult.data;

      const transformedPractice: TopFirm = {
        "Company Name": practice["Company Name"],
        employeeCount: practice.employeeCount,
        followerCount: practice.followerCount || 0,
        "Primary Subtitle": practice["Primary Subtitle"],
        Location: practice.Location,
        Summary: practice.Summary,
        "Company ID": practice["Company ID"],
        "Profile URL": practice["Profile URL"],
        specialities: practice.specialities,
        employeeCountRangeLow: practice.employeeCountRangeLow,
        employeeCountRangeHigh: practice.employeeCountRangeHigh,
        description: practice.description,
        websiteUrl: practice.websiteUrl,
        foundedOn: practice.foundedOn,
        latitude: practice.latitude,
        longitude: practice.longitude,
        "Block FIPS": practice["Block FIPS"],
        "State Name": practice["State Name"],
        STATE: practice.STATE,
        STATEFP: Number(practice.STATEFP),
        COUNTYFP: Number(practice.COUNTYFP),
        COUNTYNAME: practice.COUNTYNAME,
        PLACEFP: practice.PLACEFP,
        PLACENS: practice.PLACENS,
        PLACENAME: practice.PLACENAME,
        originalCoverImage: practice.originalCoverImage,
        logoResolutionResult: practice.logoResolutionResult,
        status: practice.status,
        notes: practice.notes
      };

      const countyFp = practice.COUNTYFP?.toString().padStart(3, '0');
      const stateFp = practice.STATEFP?.toString().padStart(2, '0');

      if (!countyFp || !stateFp) {
        console.log('Missing FIPS codes:', { countyFp, stateFp });
        return { practice: transformedPractice, countyData: null, generatedText };
      }

      console.log('Fetching county data with FIPS:', { countyFp, stateFp });

      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYFP', countyFp)
        .eq('STATEFP', stateFp)
        .eq('COUNTYNAME', practice.COUNTYNAME)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        throw countyError;
      }

      console.log('County data:', countyData);

      const transformedCountyData: ComprehensiveMarketData = {
        total_population: countyData?.total_population,
        median_household_income: countyData?.median_household_income,
        median_gross_rent: countyData?.median_gross_rent,
        median_home_value: countyData?.median_home_value,
        employed_population: countyData?.employed_population,
        private_sector_accountants: countyData?.private_sector_accountants,
        public_sector_accountants: countyData?.public_sector_accountants,
        firms_per_10k: countyData?.firms_per_10k,
        population_growth_rate: countyData?.population_growth_rate,
        market_saturation: countyData?.market_saturation,
        total_education_population: countyData?.education_population,
        bachelors_holders: countyData?.bachelors_holders,
        masters_holders: countyData?.masters_holders,
        doctorate_holders: countyData?.doctorate_holders,
        payann: countyData?.total_payroll,
        emp: countyData?.total_employees,
        total_establishments: countyData?.total_establishments,
        avgSalaryPerEmployee: countyData?.total_payroll && countyData?.total_employees ? 
          countyData.total_payroll / countyData.total_employees : undefined,
        vacancy_rate: countyData?.vacancy_rate,
        vacancy_rank: countyData?.vacancy_rank,
        income_rank: countyData?.income_rank,
        population_rank: countyData?.population_rank,
        rent_rank: countyData?.rent_rank,
        growth_rank: countyData?.growth_rank,
        firm_density_rank: countyData?.firm_density_rank,
        density_rank: countyData?.firm_density_rank,
        state_rank: countyData?.growth_rank,
        national_income_rank: countyData?.national_income_rank,
        national_population_rank: countyData?.national_population_rank,
        national_rent_rank: countyData?.national_rent_rank,
        national_firm_density_rank: countyData?.national_firm_density_rank,
        national_growth_rank: countyData?.national_growth_rank,
        national_vacancy_rank: countyData?.national_vacancy_rank,
        national_market_saturation_rank: countyData?.national_market_saturation_rank,
        avg_firms_per_10k: countyData?.avg_firms_per_10k,
        avg_growth_rate: countyData?.avg_growth_rate,
        avg_market_saturation: countyData?.avg_market_saturation
      };

      return { practice: transformedPractice, countyData: transformedCountyData, generatedText };
    },
    retry: false
  });

  const handleInterested = async (message?: string) => {
    try {
      console.log('handleInterested called with message:', message);
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        console.log('No user found, showing auth required toast');
        toast({
          title: "Authentication Required",
          description: "Please sign in to express interest",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const companyId = Number(practiceId);
      if (!companyId || isNaN(companyId)) {
        console.error('Invalid practice ID:', practiceId);
        throw new Error('Invalid practice ID');
      }
      console.log('Company ID:', companyId);

      // Check if user has already expressed interest
      const { data: existingInterest, error: checkError } = await supabase
        .from('canary_firm_interests')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing interest:', checkError);
      }

      if (existingInterest) {
        console.log('User already expressed interest');
        toast({
          title: "Already Interested",
          description: "You have already expressed interest in this practice",
        });
        return;
      }

      console.log('Adding interest record to database');
      // Add interest record
      const { error: interestError } = await supabase
        .from('canary_firm_interests')
        .insert([{
          company_id: companyId,
          user_id: user.id,
          status: 'interested',
          is_anonymous: false
        }]);

      if (interestError) {
        console.error('Error inserting interest:', interestError);
        throw interestError;
      }

      console.log('Calling notify-interest edge function');
      // Call the notify-interest edge function with the message
      const { error: notifyError } = await supabase.functions.invoke('notify-interest', {
        body: { 
          companyId: companyId, 
          userId: user.id,
          message: message 
        }
      });

      if (notifyError) {
        console.error('Error notifying admin:', notifyError);
        // Don't throw here - we still want to show success since the interest was recorded
      }

      console.log('Interest registered successfully');
      toast({
        title: "Interest Registered",
        description: "We'll notify you of any updates about this practice",
      });
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: "Error",
        description: "Failed to register interest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  if (isPracticeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto p-6 space-y-6 pt-24">
          <div className="flex items-center gap-4 animate-pulse">
            <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
            <Skeleton className="h-8 w-[200px] bg-white/10" />
          </div>
          <Skeleton className="h-[200px] w-full bg-white/10" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-[400px] lg:col-span-2 bg-white/10" />
            <Skeleton className="h-[400px] bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!practiceData?.practice) return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto p-6 pt-24">
        <h1 className="text-2xl font-bold">Practice not found</h1>
        <p className="text-white/60">The practice you're looking for could not be found.</p>
      </div>
    </div>
  );

  const { practice, countyData, generatedText } = practiceData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white/80 hover:bg-white/10"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">Canary</span>
            </div>
          </div>
          {session ? (
            <Button 
              onClick={handleSignOut}
              variant="ghost"
              className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Sign Out
            </Button>
          ) : (
            <Link 
              to="/auth" 
              className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-br from-black/60 to-gray-900/60 rounded-xl border border-white/10 p-8">
          <PracticeHeader practice={practice} generatedText={generatedText} />
          <div className="mt-6">
            <KeyMetricsBar practice={practice} countyData={countyData} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Badges and Callouts */}
            <section className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Key Highlights</h2>
              <BadgesAndCallouts 
                generatedText={generatedText} 
                specialties={practice.specialities}
              />
            </section>

            {/* Business Overview */}
            <section className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
              <BusinessOverview practice={practice} />
            </section>

            {/* Market Analysis */}
            <Collapsible
              open={isMarketDataOpen}
              onOpenChange={setIsMarketDataOpen}
              className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full p-6 flex items-center justify-between text-white hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-semibold">Market Analysis</h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isMarketDataOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 pt-0">
                {countyData && <MarketMetricsGrid marketData={{
                  ...countyData,
                  avg_firms_per_10k: countyData.firms_per_10k // Use the correct property name
                }} />}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Practice Info Card */}
            <div className="sticky top-24">
              <PracticeInfo practice={practice} onInterested={handleInterested} />

              {/* Advertising Space Card */}
              <Card className="mt-6 bg-gradient-to-br from-gray-900/80 to-black/80 border-yellow-500/20">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Megaphone className="w-5 h-5" />
                      <span className="font-semibold">Advertise with Us</span>
                    </div>
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                      Premium Placement
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Maximum Exposure
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                        <span className="text-sm text-gray-300">
                          Engage Active Buyers & Sellers
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                        <span className="text-sm text-gray-300">
                          Reach a targeted audience actively seeking accounting practices
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                        <span className="text-sm text-gray-300">
                          Direct Access: Connect with qualified buyers and sellers in the accounting industry
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                      onClick={() => window.location.href = 'mailto:advertising@inevitable.sale'}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us Today to Secure Your Spot!
                    </Button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Limited Opportunities Available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
