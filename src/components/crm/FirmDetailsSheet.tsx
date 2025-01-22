import { Building2, MapPin, Users, DollarSign, GraduationCap, Home, TrendingUp, Calendar } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FirmDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  practice: {
    id: string;
    industry: string;
    region: string;
    employee_count: number;
    annual_revenue: number;
    specialities?: string;
    "Company Name"?: string;
    "Primary Subtitle"?: string;
    Summary?: string;
    websiteUrl?: string;
    followerCount?: number;
    foundedOn?: number;
    logoResolutionResult?: string;
    originalCoverImage?: string;
  };
}

export function FirmDetailsSheet({ isOpen, onClose, practice }: FirmDetailsSheetProps) {
  // Extract state from region (assuming format "County, State")
  const state = practice.region?.split(',')[1]?.trim();

  const { data: countyData, isLoading } = useQuery({
    queryKey: ['county-rankings', practice.region],
    queryFn: async () => {
      if (!state) {
        console.error('No state found in region:', practice.region);
        return null;
      }

      // Split region into county and state
      const [county] = practice.region.split(',').map(s => s.trim());
      
      // First get the state FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', state)
        .maybeSingle();

      if (stateError) {
        console.error('Error fetching state FIPS:', stateError);
        return null;
      }

      if (!stateData) {
        console.error('No state data found for:', state);
        return null;
      }

      // Then get the county rankings data
      const { data: countyDetails, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('statefp', stateData.STATEFP)
        .eq('countyname', county)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        return null;
      }

      return countyDetails;
    },
    enabled: isOpen && !!state
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Firm & Market Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Firm Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Firm Information</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="font-medium">{practice["Company Name"] || practice.industry}</span>
                  {practice["Primary Subtitle"] && (
                    <p className="text-sm text-gray-500">{practice["Primary Subtitle"]}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{practice.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span>{practice.employee_count} employees</span>
              </div>
              {practice.foundedOn && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Founded in {practice.foundedOn}</span>
                </div>
              )}
              {practice.specialities && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span>{practice.specialities}</span>
                </div>
              )}
              {practice.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-gray-500" />
                  <a href={practice.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Website
                  </a>
                </div>
              )}
              {practice.followerCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{practice.followerCount.toLocaleString()} followers</span>
                </div>
              )}
              {practice.Summary && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>{practice.Summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* County Data Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">County Market Data</h3>
            <div className="grid gap-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : countyData ? (
                <>
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Population</p>
                        <p className="font-medium">{countyData.total_population?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Growth Rate</p>
                        <p className="font-medium">{(countyData.population_growth_rate * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Firms</p>
                        <p className="font-medium">{countyData.total_establishments?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Market Saturation</p>
                        <p className="font-medium">{(countyData.market_saturation * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">County Ranking</p>
                        <p className="font-medium">
                          #{countyData.firm_density_rank} in state, #{countyData.national_firm_density_rank} nationally
                        </p>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <p className="text-gray-500">No county data available</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}