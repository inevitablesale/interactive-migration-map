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

        // Get firms in this county - Convert STATEFP to number for comparison
        const { data: firmsData, error: firmsError } = await supabase
          .from("canary_firms_data")
          .select("*")
          .eq("STATEFP", parseInt(stateFips.fips_code))
          .eq("COUNTYFP", countyData.COUNTYFP);

        if (firmsError) throw firmsError;

        // Map the firms data to match our TopFirm type
        const firms = firmsData?.map(firm => ({
          company_name: firm["Company Name"] || "",
          employee_count: firm.employeeCount || 0,
          follower_count: firm.followerCount || 0,
          follower_ratio: firm.followerCount && firm.employeeCount ? firm.followerCount / firm.employeeCount : 0,
          logoResolutionResult: firm.logoResolutionResult,
          originalCoverImage: firm.originalCoverImage,
          primarySubtitle: firm["Primary Subtitle"],
          employeeCountRangeLow: firm.employeeCountRangeLow,
          employeeCountRangeHigh: firm.employeeCountRangeHigh,
          foundedOn: firm.foundedOn?.toString(),
          specialities: firm.specialities,
          websiteUrl: firm.websiteUrl,
          Location: firm.Location,
          Summary: firm.Summary
        }));

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
          median_home_value: countyData.B25077_001E,
          employed_population: countyData.B23025_004E,
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
          market_saturation_index: countyData.ESTAB && countyData.B23025_004E
            ? (countyData.ESTAB / countyData.B23025_004E) * 100
            : 0,
          payann: countyData.PAYANN,
          emp: countyData.EMP,
          vacancy_rank: 0,
          income_rank: 0,
          population_rank: 0,
          rent_rank: 0,
          density_rank: 0,
          growth_rank: 0
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