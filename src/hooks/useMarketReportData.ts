import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export function useMarketReportData(county?: string, state?: string) {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["market-data", county, state],
    queryFn: async () => {
      try {
        // First, get the state FIPS code
        const { data: stateFips, error: stateFipsError } = await supabase
          .from("state_fips_codes")
          .select("fips_code")
          .eq("state", state)
          .single();

        if (stateFipsError) throw stateFipsError;
        if (!stateFips) throw new Error("State not found");

        // Then get the county data using the state FIPS code
        const { data: countyData, error: countyError } = await supabase
          .from("county_data")
          .select("*")
          .eq("STATEFP", stateFips.fips_code)
          .ilike("COUNTYNAME", county || "")
          .single();

        if (countyError) throw countyError;
        if (!countyData) throw new Error("County not found");

        // Get firms in this county
        const { data: firms, error: firmsError } = await supabase
          .from("canary_firms_data")
          .select("*")
          .eq("STATEFP", Number(stateFips.fips_code))
          .eq("COUNTYFP", countyData.COUNTYFP);

        if (firmsError) throw firmsError;

        // Calculate additional metrics
        const totalEducationPopulation = countyData.B15003_001E || 0;
        const bachelorsDegreeHolders = countyData.B15003_022E || 0;
        const mastersDegreeHolders = countyData.B15003_023E || 0;
        const doctorateDegreeHolders = countyData.B15003_025E || 0;

        const comprehensiveData: ComprehensiveMarketData = {
          ...countyData,
          top_firms: firms || [],
          total_education_population: totalEducationPopulation,
          bachelors_degree_holders: bachelorsDegreeHolders,
          masters_degree_holders: mastersDegreeHolders,
          doctorate_degree_holders: doctorateDegreeHolders,
          firms_per_10k_population: countyData.ESTAB && countyData.B01001_001E
            ? (countyData.ESTAB / countyData.B01001_001E) * 10000
            : 0,
          total_population: countyData.B01001_001E,
          median_household_income: countyData.B19013_001E,
          median_gross_rent: countyData.B25064_001E,
          vacancy_rate: countyData.B25002_003E && countyData.B25001_001E
            ? (countyData.B25002_003E / countyData.B25001_001E) * 100
            : 0,
          growth_rate_percentage: countyData.MOVEDIN2022 && countyData.MOVEDIN2021
            ? ((countyData.MOVEDIN2022 - countyData.MOVEDIN2021) / countyData.MOVEDIN2021) * 100
            : 0,
          total_establishments: countyData.ESTAB,
          private_sector_accountants: countyData.C24060_004E,
          public_sector_accountants: countyData.C24060_007E,
          public_to_private_ratio: countyData.C24060_004E && countyData.C24060_007E
            ? countyData.C24060_007E / countyData.C24060_004E
            : 0,
        };

        return comprehensiveData;
      } catch (error) {
        console.error("Error fetching market data:", error);
        throw error;
      }
    },
  });

  const hasMarketData = !!marketData;

  return {
    marketData,
    isLoading,
    hasMarketData,
  };
}