import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { PracticeHeader } from "@/components/practice-details/PracticeHeader";
import { PracticeInfo } from "@/components/practice-details/PracticeInfo";
import { MarketMetricsGrid } from "@/components/practice-details/MarketMetricsGrid";

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

      console.log('Practice data:', practice);

      // Ensure COUNTYFP and STATEFP are converted to strings and properly padded
      const countyFp = practice.COUNTYFP?.toString().padStart(3, '0');
      const stateFp = practice.STATEFP?.toString().padStart(2, '0');

      if (!countyFp || !stateFp) {
        console.log('Missing FIPS codes:', { countyFp, stateFp });
        return { practice, countyData: null };
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

      return {
        practice,
        countyData
      };
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
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (!data?.practice) return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Practice not found</h1>
      <p className="text-muted-foreground">The practice you're looking for could not be found.</p>
    </div>
  );

  const { practice, countyData } = data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PracticeHeader practice={practice} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PracticeInfo practice={practice} />
      </div>

      {countyData && (
        <MarketMetricsGrid marketData={countyData} />
      )}
    </div>
  );
}