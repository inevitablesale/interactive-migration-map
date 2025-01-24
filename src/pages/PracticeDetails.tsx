import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { PracticeHeader } from "@/components/practice-details/PracticeHeader";
import { KeyMetricsBar } from "@/components/practice-details/KeyMetricsBar";
import { BusinessOverview } from "@/components/practice-details/BusinessOverview";
import { PracticeInfo } from "@/components/practice-details/PracticeInfo";
import { MarketMetricsGrid } from "@/components/practice-details/MarketMetricsGrid";
import { BadgesAndCallouts } from "@/components/practice-details/BadgesAndCallouts";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Users, Building, TrendingUp, Bird, ChevronDown, CheckCircle, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import type { TopFirm, ComprehensiveMarketData } from "@/types/rankings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PracticeDetails() {
  const { practiceId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMarketDataOpen, setIsMarketDataOpen] = useState(false);

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
        firms_per_10k_population: countyData?.firms_per_10k,
        population_growth_rate: countyData?.population_growth_rate,
        market_saturation_index: countyData?.market_saturation,
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

  const handleInterested = async () => {
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

      const companyId = Number(practiceId);
      if (!companyId || isNaN(companyId)) {
        throw new Error('Invalid practice ID');
      }

      // Check if user has already expressed interest
      const { data: existingInterest } = await supabase
        .from('canary_firm_interests')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingInterest) {
        toast({
          title: "Already Interested",
          description: "You have already expressed interest in this practice",
        });
        return;
      }

      // Add interest record
      const { error: interestError } = await supabase
        .from('canary_firm_interests')
        .insert([{
          company_id: companyId,
          user_id: user.id,
          status: 'interested',
          is_anonymous: false
        }]);

      if (interestError) throw interestError;

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
            <div className="flex items-center gap-2">
              <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">Canary</span>
            </div>
          </div>
          <Link 
            to="/auth" 
            className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section with Prominent CTA */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-white/10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <PracticeHeader 
                    practice={practice} 
                    generatedText={generatedText}
                  />
                  {generatedText?.teaser && (
                    <p className="mt-4 text-white/80">{generatedText.teaser}</p>
                  )}
                </div>
                <div className="w-full md:w-auto">
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <KeyMetricsBar practice={practice} countyData={countyData} />
            </div>

            {/* Callouts Section - Moved here */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <BadgesAndCallouts 
                generatedText={generatedText} 
                specialties={practice.specialities}
              />
            </div>

            {/* Business Overview */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <BusinessOverview practice={practice} />
            </div>

            {/* Collapsible Market Analysis */}
            <Collapsible
              open={isMarketDataOpen}
              onOpenChange={setIsMarketDataOpen}
              className="bg-black/40 backdrop-blur-md rounded-lg border border-white/10 animate-fade-in"
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
                {countyData && <MarketMetricsGrid marketData={countyData} />}
              </CollapsibleContent>
            </Collapsible>

            {/* Callouts Section */}
            {generatedText?.callouts && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                {generatedText.callouts.split('.,').map((callout, index) => {
                  const [title, description] = callout.split(':').map(part => part.trim());
                  if (!title || !description) return null;
                  
                  return (
                    <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-white">{title}</h4>
                            <p className="text-sm text-white/70 mt-1">
                              {description.replace(/\.$/, '')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6 h-fit">
            {/* Practice Info Card */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <PracticeInfo practice={practice} onInterested={handleInterested} />
            </div>

            {/* Advertiser Space Card */}
            <div className="bg-[#1A1F2C] backdrop-blur-md rounded-lg p-6 border border-white/10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/60">
                  <BriefcaseBusiness className="w-4 h-4" />
                  <span>Premium Advertising Space</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Grow Your Professional Network</h3>
                  <p className="text-sm text-white/60 mt-2">Reach practice buyers and sellers looking for M&A advisors, attorneys, and lenders. Showcase your expertise to decision-makers actively exploring practice transitions.</p>
                </div>
                <Button variant="secondary" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}