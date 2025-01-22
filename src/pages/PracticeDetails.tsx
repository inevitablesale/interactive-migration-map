import { useParams } from "react-router-dom";
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
import type { TopFirm, ComprehensiveMarketData } from "@/types/rankings";

export default function PracticeDetails() {
  const { practiceId } = useParams();
  const { toast } = useToast();

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
        company_name: practice["Company Name"],
        employee_count: practice.employeeCount,
        follower_count: practice.followerCount || 0,
        follower_ratio: practice.followerCount ? practice.followerCount / (practice.employeeCount || 1) : 0,
        logoResolutionResult: practice.logoResolutionResult,
        originalCoverImage: practice.originalCoverImage,
        primarySubtitle: practice["Primary Subtitle"],
        employeeCountRangeLow: practice.employeeCountRangeLow,
        employeeCountRangeHigh: practice.employeeCountRangeHigh,
        specialities: practice.specialities,
        websiteUrl: practice.websiteUrl,
        Location: practice.Location,
        Summary: practice.Summary,
        foundedOn: practice.foundedOn?.toString(),
        COUNTYFP: practice.COUNTYFP?.toString(),
        STATEFP: practice.STATEFP?.toString()
      };

      if (!practice.COUNTYFP || !practice.STATEFP) {
        return { practice: transformedPractice, countyData: null };
      }

      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYFP', practice.COUNTYFP.toString())
        .eq('STATEFP', practice.STATEFP.toString())
        .maybeSingle();

      if (countyError) throw countyError;

      const transformedCountyData: ComprehensiveMarketData = {
        total_population: countyData?.total_population,
        median_household_income: countyData?.median_household_income,
        median_gross_rent: countyData?.median_gross_rent,
        median_home_value: countyData?.median_home_value,
        employed_population: countyData?.employed_population,
        private_sector_accountants: countyData?.private_sector_accountants,
        public_sector_accountants: countyData?.public_sector_accountants,
        firms_per_10k_population: countyData?.firms_per_10k,
        growth_rate_percentage: countyData?.population_growth_rate,
        market_saturation_index: countyData?.market_saturation,
        total_education_population: countyData?.education_population,
        bachelors_holders: countyData?.bachelors_holders,
        masters_holders: countyData?.masters_holders,
        doctorate_holders: countyData?.doctorate_holders,
        density_rank: countyData?.density_rank,
        state_rank: countyData?.state_rank,
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
        density_rank: countyData?.density_rank,
        state_rank: countyData?.state_rank,
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
      <div className="container mx-auto p-6 space-y-6 bg-black/95 min-h-screen text-white">
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
    <div className="container mx-auto p-6 bg-black/95 min-h-screen text-white">
      <h1 className="text-2xl font-bold">Practice not found</h1>
      <p className="text-white/60">The practice you're looking for could not be found.</p>
    </div>
  );

  const { practice, countyData } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto p-6 space-y-8">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-6">
          <PracticeHeader practice={practice} />
        </div>

        <KeyMetricsBar practice={practice} />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <BusinessOverview practice={practice} />
            <PracticeInfo practice={practice} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Express Interest
                </button>
                <button className="w-full bg-green-500/20 text-green-400 py-2 px-4 rounded hover:bg-green-500/30 transition">
                  Save Opportunity
                </button>
                <p className="text-center text-white/60">
                  {practice.follower_count || 0} interested buyers
                </p>
              </div>
            </div>

            {countyData && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Market Analysis</h2>
                <MarketMetricsGrid marketData={countyData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
