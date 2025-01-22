import { Building2, MapPin, Users, DollarSign, GraduationCap, Home, TrendingUp } from "lucide-react";
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
  };
}

export function FirmDetailsSheet({ isOpen, onClose, practice }: FirmDetailsSheetProps) {
  const { data: countyData, isLoading } = useQuery({
    queryKey: ['county-data', practice.region],
    queryFn: async () => {
      // Split region into county and state
      const [county, stateStr] = practice.region.split(',').map(s => s.trim());
      
      // First get the state FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', stateStr)
        .single();

      if (stateError) throw stateError;

      // Then get the county data using both STATEFP and COUNTYNAME
      const { data: countyDetails, error: countyError } = await supabase
        .from('county_data')
        .select(`
          B01001_001E,
          B19013_001E,
          B25077_001E,
          B15003_022E,
          B15003_023E,
          B15003_001E,
          ESTAB,
          MOVEDIN2022
        `)
        .eq('STATEFP', stateData.STATEFP)
        .eq('COUNTYNAME', county)
        .single();

      if (countyError) throw countyError;
      return countyDetails;
    },
    enabled: isOpen
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
                <span className="font-medium">{practice.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{practice.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span>{practice.employee_count} employees</span>
              </div>
              {practice.specialities && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span>{practice.specialities}</span>
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
                        <p className="font-medium">{countyData.B01001_001E?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Median Household Income</p>
                        <p className="font-medium">${countyData.B19013_001E?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Median Home Value</p>
                        <p className="font-medium">${countyData.B25077_001E?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Establishments</p>
                        <p className="font-medium">{countyData.ESTAB?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Recent Movers (2022)</p>
                        <p className="font-medium">{countyData.MOVEDIN2022?.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Education Rate</p>
                        <p className="font-medium">
                          {((countyData.B15003_022E + countyData.B15003_023E) / countyData.B15003_001E * 100).toFixed(1)}% with Bachelor's or higher
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