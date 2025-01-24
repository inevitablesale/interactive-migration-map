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
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Bird } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import type { TopFirm, ComprehensiveMarketData } from "@/types/rankings";

export default function PracticeDetails() {
  const { practiceId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMarketDataOpen, setIsMarketDataOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['practice-details', practiceId],
    queryFn: async () => {
      if (!practiceId) throw new Error('Practice ID is required');
      
      const companyId = Number(practiceId);
      if (isNaN(companyId)) {
        throw new Error('Invalid practice ID format');
      }

      console.log('Fetching practice with Company ID:', companyId);
      
      const { data: practice, error: practiceError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('Company ID', companyId)
        .maybeSingle();

      if (practiceError) {
        console.error('Error fetching practice:', practiceError);
        throw practiceError;
      }
      
      if (!practice) {
        console.log('No practice found for ID:', companyId);
        throw new Error('Practice not found');
      }

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
        return { practice: transformedPractice, countyData: null };
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
        // State-level rankings
        vacancy_rank: countyData?.vacancy_rank,
        income_rank: countyData?.income_rank,
        population_rank: countyData?.population_rank,
        rent_rank: countyData?.rent_rank,
        growth_rank: countyData?.growth_rank,
        firm_density_rank: countyData?.firm_density_rank,
        density_rank: countyData?.firm_density_rank,
        state_rank: countyData?.growth_rank,
        // National-level rankings
        national_income_rank: countyData?.national_income_rank,
        national_population_rank: countyData?.national_population_rank,
        national_rent_rank: countyData?.national_rent_rank,
        national_firm_density_rank: countyData?.national_firm_density_rank,
        national_growth_rank: countyData?.national_growth_rank,
        national_vacancy_rank: countyData?.national_vacancy_rank,
        national_market_saturation_rank: countyData?.national_market_saturation_rank,
        // Averages
        avg_firms_per_10k: countyData?.avg_firms_per_10k,
        avg_growth_rate: countyData?.avg_growth_rate,
        avg_market_saturation: countyData?.avg_market_saturation
      };

      return { practice: transformedPractice, countyData: transformedCountyData };
    },
    retry: false
  });

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading practice details';
      toast({
        title: "Error loading practice details",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6 bg-black/95 min-h-screen text-white pt-24">
        <Skeleton className="h-12 w-[300px] bg-white/10" />
        <Skeleton className="h-20 w-full bg-white/10" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] bg-white/10" />
          <Skeleton className="h-[400px] bg-white/10" />
        </div>
      </div>
    );
  }

  if (!data?.practice) return (
    <div className="container mx-auto p-6 bg-black/95 min-h-screen text-white pt-24">
      <h1 className="text-2xl font-bold">Practice not found</h1>
      <p className="text-white/60">The practice you're looking for could not be found.</p>
    </div>
  );

  const { practice, countyData } = data;

  const handleInterested = async () => {
    const { error } = await supabase
      .from('canary_firm_interests')
      .insert([
        { company_id: practice["Company ID"] }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to express interest. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Successfully expressed interest in the practice.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          <Link to="/auth" className="text-white hover:text-yellow-400 transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      {/* Main Content - Added pt-24 to prevent header overlap */}
      <div className="container mx-auto p-6 space-y-8 pt-24">
        <Button
          variant="ghost"
          className="text-white hover:text-white/80 hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>

        <div className="space-y-6">
          {/* Primary Content */}
          <div className="rounded-lg p-6">
            <PracticeHeader practice={practice} />
          </div>

          <KeyMetricsBar practice={practice} countyData={countyData} />
          
          <BadgesAndCallouts companyId={practice["Company ID"]} />

          {/* Market Data Section - Collapsible */}
          <Collapsible
            open={isMarketDataOpen}
            onOpenChange={setIsMarketDataOpen}
            className="bg-black/40 backdrop-blur-md rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Geographic & Demographic Data</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-white/10">
                  {isMarketDataOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="mt-4">
              {countyData && <MarketMetricsGrid marketData={countyData} />}
            </CollapsibleContent>
          </Collapsible>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <BusinessOverview practice={practice} />
            </div>
            <div>
              <PracticeInfo practice={practice} onInterested={handleInterested} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
