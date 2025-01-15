import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('[Step 1] useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      // Step 2: Validate inputs
      if (!stateName || !county) {
        console.log('[Step 2] Missing required parameters:', { county, stateName });
        return null;
      }

      // Step 3: Fetch the state FIPS code
      console.log('[Step 3] Starting fetch for state FIPS code');
      const { data: stateFips, error: stateFipsError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', stateName)
        .maybeSingle();

      if (stateFipsError) {
        console.error('[Error] Fetching state FIPS:', stateFipsError.message);
        throw new Error('Error fetching state FIPS');
      }

      if (!stateFips) {
        console.error('[Step 4] No state FIPS found for:', stateName);
        return null;
      }

      console.log('[Step 4] Fetched state FIPS:', stateFips.STATEFP);

      // Step 5: Fetch the county FIPS code
      console.log('[Step 5] Starting fetch for county FIPS code');
      const { data: countyFipsData, error: countyFipsError } = await supabase
        .from('county_rankings')
        .select('*') // Fetch all relevant data for the county
        .eq('STATEFP', stateFips.STATEFP)
        .eq('COUNTYNAME', county)
        .single();

      if (countyFipsError) {
        console.error('[Error] Fetching county FIPS data:', countyFipsError.message);
        throw new Error('Error fetching county FIPS data');
      }

      if (!countyFipsData) {
        console.error('[Step 6] No county FIPS found for:', { county, stateName });
        return null;
      }

      console.log('[Step 6] Fetched county data:', countyFipsData);

      // Step 7: Construct the final data object
      console.log('[Step 7] Constructing transformed data');
      const transformedData: ComprehensiveMarketData = {
        total_population: countyFipsData.population || null,
        median_household_income: countyFipsData.median_household_income || null,
        median_gross_rent: countyFipsData.median_gross_rent || null,
        median_home_value: countyFipsData.median_home_value || null,
        employed_population: countyFipsData.employed_population || null,
        private_sector_accountants: countyFipsData.private_sector_accountants || null,
        public_sector_accountants: countyFipsData.public_sector_accountants || null,
        firms_per_10k_population: countyFipsData.calculated_firm_density || null,
        growth_rate_percentage: countyFipsData.calculated_growth_rate ? countyFipsData.calculated_growth_rate * 100 : null,
        market_saturation_index: countyFipsData.market_saturation || null,
        total_education_population: countyFipsData.total_education_population || null,
        bachelors_degree_holders: countyFipsData.bachelors_degree_holders || null,
        masters_degree_holders: countyFipsData.masters_degree_holders || null,
        doctorate_degree_holders: countyFipsData.doctorate_degree_holders || null,
        payann: countyFipsData.payann || null,
        total_establishments: countyFipsData.total_establishments || null,
        emp: countyFipsData.emp || null,
        public_to_private_ratio: countyFipsData.public_to_private_ratio || null,
        vacancy_rate: countyFipsData.vacancy_rate || null,
        vacancy_rank: countyFipsData.vacancy_rank || null,
        income_rank: countyFipsData.income_rank || null,
        population_rank: countyFipsData.population_rank || null,
        rent_rank: countyFipsData.rent_rank || null,
        density_rank: countyFipsData.density_rank || null,
        growth_rank: countyFipsData.growth_rank || null,
      };

      console.log('[Step 8] Final transformed data:', transformedData);

      // Return the final data
      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  // Step 9: Log the query completion status
  const hasMarketData = !!marketData;
  console.log('[Step 9] Query complete:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
  });

  // Return the query results
  return { marketData, isLoading, hasMarketData, error };
};
