import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData, TopFirm } from "@/types/rankings";
import { toast } from "sonner";

export const useMarketReportData = (county: string | undefined, stateName: string | undefined) => {
  console.log('useMarketReportData called with:', { county, stateName });

  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['comprehensiveMarketData', county, stateName],
    queryFn: async () => {
      if (!stateName || !county) return null;

      console.log('Fetching market data for:', { county, stateName });

      // First, get the state FIPS code
      const { data: stateData, error: stateError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP, state')
        .eq('state', stateName)
        .maybeSingle();

      if (stateError) {
        console.error('Error fetching state FIPS:', stateError);
        toast.error('Error fetching state data');
        throw stateError;
      }

      if (!stateData?.STATEFP) {
        console.log('No state FIPS found for:', stateName);
        return null;
      }

      console.log('Found state FIPS:', stateData.STATEFP);

      // Then, get the county data using the FIPS code
      const { data: countyData, error: countyError } = await supabase
        .from('county_rankings')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.STATEFP)
        .maybeSingle();

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        toast.error('Error fetching county data');
        throw countyError;
      }

      if (!countyData) {
        console.log('No county data found for:', { county, stateName });
        return null;
      }

      console.log('Raw county data:', countyData);

      // Get firms data from canary_firms_data
      const { data: firmsData, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .eq('STATEFP', stateData.STATEFP);

      if (firmsError) {
        console.error('Error fetching firms data:', firmsError);
        toast.error('Error fetching firms data');
        throw firmsError;
      }

      console.log('Raw firms data:', firmsData);

      // Transform firms data to match TopFirm interface
      const transformedTopFirms: TopFirm[] = firmsData ? firmsData.map((firm: any) => ({
        company_name: firm['Company Name'] || '',
        employee_count: firm.employeeCount || 0,
        follower_count: firm.followerCount || 0,
        follower_ratio: firm.followerCount && firm.employeeCount ? firm.followerCount / firm.employeeCount : 0,
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
      })) : [];

      console.log('Transformed top firms:', transformedTopFirms);

      // Transform the data to match ComprehensiveMarketData type
      const transformedData: ComprehensiveMarketData = {
        total_population: countyData.total_population,
        median_household_income: countyData.median_household_income,
        median_gross_rent: countyData.median_gross_rent,
        median_home_value: countyData.median_home_value,
        employed_population: countyData.employed_population,
        private_sector_accountants: countyData.private_sector_accountants,
        public_sector_accountants: countyData.public_sector_accountants,
        firms_per_10k_population: countyData.firms_per_10k_population,
        growth_rate_percentage: countyData.growth_rate_percentage,
        market_saturation_index: countyData.market_saturation_index,
        total_education_population: countyData.total_education_population,
        bachelors_degree_holders: countyData.bachelors_degree_holders,
        masters_degree_holders: countyData.masters_degree_holders,
        doctorate_degree_holders: countyData.doctorate_degree_holders,
        payann: countyData.payann,
        total_establishments: countyData.total_establishments,
        emp: countyData.emp,
        public_to_private_ratio: countyData.public_to_private_ratio,
        vacancy_rate: countyData.vacancy_rate,
        vacancy_rank: countyData.vacancy_rank,
        income_rank: countyData.income_rank,
        population_rank: countyData.population_rank,
        rent_rank: countyData.rent_rank,
        density_rank: countyData.density_rank,
        growth_rank: countyData.growth_rank,
        top_firms: transformedTopFirms,
      };

      console.log('Final transformed market data:', transformedData);

      return transformedData;
    },
    enabled: !!stateName && !!county,
  });

  const hasMarketData = !!marketData;
  console.log('Market data available:', hasMarketData, 'Top firms count:', marketData?.top_firms?.length);

  return { marketData, isLoading, hasMarketData };
};