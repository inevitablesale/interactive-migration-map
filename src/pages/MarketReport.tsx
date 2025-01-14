import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  Users,
  DollarSign,
  Home,
  Briefcase,
  Clock,
  TrendingUp,
  School,
  Building,
} from "lucide-react";

interface TopFirm {
  company_name: string;
  employee_count: number;
  follower_count: number;
  follower_ratio: number;
}

interface AdjacentCounty {
  county_name: string;
  population: number;
  median_income: number;
}

interface MarketData {
  total_population: number;
  median_household_income: number;
  median_gross_rent: number;
  median_home_value: number;
  employed_population: number;
  private_sector_accountants: number;
  public_sector_accountants: number;
  firms_per_10k_population: number;
  growth_rate_percentage: number;
  market_saturation_index: number;
  total_education_population: number;
  bachelors_degree_holders: number;
  masters_degree_holders: number;
  doctorate_degree_holders: number;
  avg_accountant_payroll: number;
  public_to_private_ratio: number;
  avg_commute_time: number;
  commute_rank: number;
  poverty_rate: number;
  poverty_rank: number;
  vacancy_rate: number;
  vacancy_rank: number;
  income_rank: number;
  population_rank: number;
  rent_rank: number;
  top_firms: TopFirm[];
  state_avg_income: number;
  adjacent_counties: AdjacentCounty[];
}

const useStateFips = (stateAbbr: string | undefined) => {
  return useQuery({
    queryKey: ['stateFips', stateAbbr],
    queryFn: async () => {
      if (!stateAbbr) return null;
      const { data, error } = await supabase
        .from('state_fips_codes')
        .select('fips_code')
        .eq('postal_abbr', stateAbbr.toUpperCase())
        .single();

      if (error) throw error;
      return data?.fips_code;
    }
  });
};

export function MarketReport() {
  const { county, state } = useParams();
  const { toast } = useToast();
  const stateFips = useStateFips(state);

  const { data: marketData, isLoading } = useQuery({
    queryKey: ['marketData', county, stateFips.data],
    enabled: !!county && !!stateFips.data,
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_comprehensive_county_data', {
          p_county_name: county,
          p_state_fp: stateFips.data
        });

      if (error) {
        toast({
          title: "Error fetching market data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data found');
      }

      // Parse and validate the JSON fields
      const rawData = data[0];
      const parsedData: MarketData = {
        ...rawData,
        top_firms: Array.isArray(rawData.top_firms) 
          ? rawData.top_firms.map((firm: any) => ({
              company_name: firm.company_name || '',
              employee_count: firm.employee_count || 0,
              follower_count: firm.follower_count || 0,
              follower_ratio: firm.follower_ratio || 0
            }))
          : [],
        adjacent_counties: Array.isArray(rawData.adjacent_counties)
          ? rawData.adjacent_counties.map((county: any) => ({
              county_name: county.county_name || '',
              population: county.population || 0,
              median_income: county.median_income || 0
            }))
          : []
      };

      return parsedData;
    }
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Total Population</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {marketData?.total_population?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    National Rank: #{marketData?.population_rank || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Median Household Income</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    ${marketData?.median_household_income?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    National Rank: #{marketData?.income_rank || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Median Gross Rent</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    ${marketData?.median_gross_rent?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    National Rank: #{marketData?.rent_rank || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Employment Population</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {marketData?.employed_population?.toLocaleString() || "N/A"}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Average Commute Time</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {marketData?.avg_commute_time?.toFixed(1) || "N/A"} minutes
                  </p>
                  <p className="text-sm text-gray-500">
                    National Rank: #{marketData?.commute_rank || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Firms per 10k Population</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {marketData?.firms_per_10k_population?.toFixed(1) || "N/A"}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Growth Rate</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {marketData?.growth_rate_percentage?.toFixed(1) || "N/A"}%
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Education Population</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {marketData?.total_education_population?.toLocaleString() || "N/A"}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium">Market Saturation</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold">
                  {marketData?.market_saturation_index?.toFixed(1) || "N/A"}%
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}