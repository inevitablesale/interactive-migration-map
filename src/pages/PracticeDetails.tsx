import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function PracticeDetails() {
  const { practiceId } = useParams();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['practice-details', practiceId],
    queryFn: async () => {
      if (!practiceId) throw new Error('Practice ID is required');
      
      // First get the practice data
      const { data: practice, error: practiceError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('Company ID', parseInt(practiceId))
        .single();

      if (practiceError) throw practiceError;
      if (!practice) throw new Error('Practice not found');

      // Then get the county data
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYFP', practice.COUNTYFP?.toString())
        .eq('STATEFP', practice.STATEFP?.toString())
        .single();

      if (countyError) throw countyError;

      return {
        practice,
        countyData
      };
    }
  });

  if (error) {
    toast({
      title: "Error loading practice details",
      description: error.message,
      variant: "destructive",
    });
  }

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

  if (!data) return null;

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}