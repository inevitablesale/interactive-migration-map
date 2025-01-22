import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

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

      // Ensure COUNTYFP and STATEFP are converted to strings for the query
      const countyFp = practice.COUNTYFP?.toString().padStart(3, '0');
      const stateFp = practice.STATEFP?.toString().padStart(2, '0');

      if (!countyFp || !stateFp) {
        console.log('Missing FIPS codes:', { countyFp, stateFp });
        return { practice, countyData: null };
      }

      console.log('Fetching county data with FIPS:', { countyFp, stateFp });

      // Then get the county data using COUNTYFP and STATEFP from practice
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYFP', countyFp)
        .eq('STATEFP', stateFp)
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
      <div className="flex items-center gap-4">
        {practice.logoResolutionResult && (
          <img 
            src={practice.logoResolutionResult} 
            alt={practice["Company Name"]} 
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{practice["Company Name"]}</h1>
          <p className="text-muted-foreground">{practice["Primary Subtitle"]}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Practice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{practice.Location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Employee Count</h3>
              <p>{practice.employeeCount || 'Not available'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Follower Count</h3>
              <p>{practice.followerCount?.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Founded</h3>
              <p>{practice.foundedOn || 'Not available'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Specialties</h3>
              <p>{practice.specialities || 'Not available'}</p>
            </div>
            {practice.Summary && (
              <div>
                <h3 className="font-semibold">Summary</h3>
                <p>{practice.Summary}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countyData ? (
              <>
                <div>
                  <h3 className="font-semibold">County Population</h3>
                  <p>{countyData.B01001_001E?.toLocaleString() || 'Not available'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Median Household Income</h3>
                  <p>${countyData.B19013_001E?.toLocaleString() || 'Not available'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Median Gross Rent</h3>
                  <p>${countyData.B25064_001E?.toLocaleString() || 'Not available'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Establishments</h3>
                  <p>{countyData.ESTAB?.toLocaleString() || 'Not available'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Recent Moves (2022)</h3>
                  <p>{countyData.MOVEDIN2022?.toLocaleString() || 'Not available'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Employment</h3>
                  <p>{countyData.EMP?.toLocaleString() || 'Not available'}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">County data not available for this location</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}