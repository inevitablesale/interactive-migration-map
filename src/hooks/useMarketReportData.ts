import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData, TopFirm } from "@/types/rankings";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('1. useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) {
        console.log('2. Missing required parameters:', { county, stateName });
        return null;
      }

      // First get the state FIPS code
      console.log('3. Getting state FIPS code for:', stateName);
      const { data: stateFips, error: stateFipsError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', stateName)
        .maybeSingle();

      if (stateFipsError) {
        console.error('4. Error fetching state FIPS:', stateFipsError.message);
        throw new Error('Error fetching state FIPS');
      }

      if (!stateFips) {
        console.error('5. No state FIPS found for:', stateName);
        return null;
      }

      console.log('6. Found state FIPS:', stateFips.STATEFP);

      // Get data from county_rankings materialized view
      console.log('7. Fetching county rankings data for:', { county, stateFips: stateFips.STATEFP });
      
      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('STATEFP', stateFips.STATEFP)
        .eq('COUNTYNAME', county)
        .maybeSingle();

      if (countyError) {
        console.error('8. Error fetching county data:', countyError.message);
        throw new Error('Error fetching county data');
      }

      if (!countyData) {
        console.error('9. No county data found for:', { county, stateName });
        return null;
      }

      console.log('10. Retrieved county data:', countyData);

      // Get top firms data
      const { data: topFirmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('State Name', stateName)
        .order('employeeCount', { ascending: false })
        .limit(10);

      if (firmsError) {
        console.error('Error fetching top firms:', firmsError.message);
        throw new Error('Error fetching top firms');
      }

      console.log('11. Retrieved top firms:', topFirmsData?.length);

      // Transform top firms data to match TopFirm interface
      const topFirms: TopFirm[] = topFirmsData?.map(firm => ({
        company_name: firm['Company Name'] || '',
        employee_count: firm.employeeCount || 0,
        follower_count: firm.followerCount || 0,
        follower_ratio: firm.followerCount && firm.employeeCount ? 
          firm.followerCount / firm.employeeCount : 0,
        logoResolutionResult: firm.logoResolutionResult,
        originalCoverImage: firm.originalCoverImage,
        primarySubtitle: firm['Primary Subtitle'],
        employeeCountRangeLow: firm.employeeCountRangeLow,
        employeeCountRangeHigh: firm.employeeCountRangeHigh,
        foundedOn: firm.foundedOn?.toString(),
        specialities: firm.specialities,
        websiteUrl: firm.websiteUrl,
        Location: firm.Location,
        Summary: firm.Summary
      })) || [];

      // Transform the data using the county_rankings view data
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.population || null,
        median_household_income: countyData.median_household_income || null,
        median_gross_rent: countyData.median_gross_rent || null,
        median_home_value: countyData.median_home_value || null,
        employed_population: countyData.employed_population || null,
        private_sector_accountants: countyData.private_sector_accountants || null,
        public_sector_accountants: countyData.public_sector_accountants || null,
        firms_per_10k_population: countyData.calculated_firm_density || null,
        growth_rate_percentage: countyData.calculated_growth_rate ? countyData.calculated_growth_rate * 100 : null,
        market_saturation_index: countyData.market_saturation || null,
        total_education_population: countyData.total_education_population || null,
        bachelors_degree_holders: countyData.bachelors_degree_holders || null,
        masters_degree_holders: countyData.masters_degree_holders || null,
        doctorate_degree_holders: countyData.doctorate_degree_holders || null,
        payann: countyData.payann || null,
        total_establishments: countyData.total_establishments || null,
        emp: countyData.emp || null,
        public_to_private_ratio: countyData.public_to_private_ratio || null,
        vacancy_rate: countyData.vacancy_rate || null,
        vacancy_rank: countyData.vacancy_rank || null,
        income_rank: countyData.income_rank || null,
        population_rank: countyData.population_rank || null,
        rent_rank: countyData.rent_rank || null,
        density_rank: countyData.density_rank || null,
        growth_rank: countyData.growth_rank || null,
        top_firms: topFirms,
      };

      console.log('12. Transformed data:', transformedData);

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('13. Query complete:', { 
    hasData: hasMarketData, 
    isLoading, 
    hasError: !!error,
    firmsCount: marketData?.top_firms?.length 
  });

  return { marketData, isLoading, hasMarketData, error };
};