import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { PracticeHeader } from "@/components/practice-details/PracticeHeader";
import { PracticeInfo } from "@/components/practice-details/PracticeInfo";
import { MarketMetricsGrid } from "@/components/practice-details/MarketMetricsGrid";
import type { TopFirm } from "@/types/rankings";

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
      
      // First get the practice data
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

      // Transform practice data to match TopFirm interface
      const transformedPractice: TopFirm = {
        company_name: practice["Company Name"],
        employee_count: practice.employeeCount,
        follower_count: practice.followerCount,
        follower_ratio: practice.followerCount / (practice.employeeCount || 1),
        logoResolutionResult: practice.logoResolutionResult,
        originalCoverImage: practice.originalCoverImage,
        primarySubtitle: practice["Primary Subtitle"],
        employeeCountRangeLow: practice.employeeCountRangeLow,
        employeeCountRangeHigh: practice.employeeCountRangeHigh,
        specialities: practice.specialities,
        websiteUrl: practice.websiteUrl,
        Location: practice.Location,
        Summary: practice.Summary,
        foundedOn: practice.foundedOn?.toString()
      };

      // Ensure COUNTYFP and STATEFP are converted to strings and properly padded
      const countyFp = practice.COUNTYFP?.toString().padStart(3, '0');
      const stateFp = practice.STATEFP?.toString().padStart(2, '0');

      if (!countyFp || !stateFp) {
        console.log('Missing FIPS codes:', { countyFp, stateFp });
        return { practice: transformedPractice, countyData: null };
      }

      console.log('Fetching county data with FIPS:', { countyFp, stateFp });

      // Get the county rankings data using COUNTYFP and STATEFP from practice
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

      return { practice: transformedPractice, countyData };
    },
    retry: false
  });

  // Handle error toast in useEffect to avoid infinite renders
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
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] bg-white/10" />
          <Skeleton className="h-[200px] bg-white/10" />
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
        {/* Header Section */}
        <div className="neo-blur rounded-lg p-6">
          <PracticeHeader practice={practice} />
        </div>
        
        {/* Info Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="neo-blur rounded-lg">
            <PracticeInfo practice={practice} />
          </div>
        </div>

        {/* Market Metrics Section */}
        {countyData && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gradient">Market Analysis</h2>
            <MarketMetricsGrid marketData={countyData} />
          </div>
        )}
      </div>
    </div>
  );
}