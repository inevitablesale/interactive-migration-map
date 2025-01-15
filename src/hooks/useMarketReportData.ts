import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (countyName: string, state: string) => {
  return useQuery({
    queryKey: ['marketReport', countyName, state],
    queryFn: async () => {
      // First get the state FIPS code
      const { data: stateFips, error: stateFipsError } = await supabase
        .from('state_fips_codes')
        .select('STATEFP')
        .eq('state', state)
        .single();

      if (stateFipsError) throw stateFipsError;
      if (!stateFips) throw new Error('State not found');

      // Get state data
      const { data: stateData, error: stateError } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateFips.STATEFP)
        .maybeSingle();

      if (stateError) throw stateError;
      if (!stateData) throw new Error('State data not found');

      console.log('State Data:', stateData);

      // Get county data for detailed census information
      const { data: countyData, error: countyError } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYNAME', countyName)
        .eq('STATEFP', stateFips.STATEFP)
        .maybeSingle();

      if (countyError) throw countyError;
      if (!countyData) throw new Error('County data not found');

      console.log('County Data:', countyData);

      // Get rankings data
      const { data: rankingsData, error: rankingsError } = await supabase
        .rpc('get_county_rankings')
        .eq('statefp', stateFips.STATEFP)
        .eq('countyname', countyName)
        .maybeSingle();

      if (rankingsError) throw rankingsError;
      console.log('Rankings Data:', rankingsData);

      // Get firms in county
      const { data: firms, error: firmsError } = await supabase
        .from('canary_firms_data')
        .select('*')
        .eq('STATEFP', parseInt(stateFips.STATEFP))
        .eq('COUNTYNAME', countyName);

      if (firmsError) throw firmsError;

      // Calculate employment metrics
      const employmentData = {
        private_sector: countyData.C24060_004E,
        public_sector: countyData.C24060_007E
      };
      console.log('Employment Data:', employmentData);

      // Calculate average salary per employee if both payann and emp exist
      const avgSalaryPerEmployee = countyData.PAYANN && countyData.EMP 
        ? countyData.PAYANN / countyData.EMP 
        : null;

      // Calculate average payroll per firm
      const avgPayrollPerFirm = countyData.PAYANN && countyData.ESTAB
        ? countyData.PAYANN / countyData.ESTAB
        : null;

      console.log('Market Data:', {
        payann: countyData.PAYANN,
        total_establishments: countyData.ESTAB,
        emp: countyData.EMP,
        avgPayrollPerFirm,
        avgSalaryPerEmployee
      });

      // Transform the data to match our ComprehensiveMarketData type
      const transformedCountyData: ComprehensiveMarketData = {
        total_population: countyData.B01001_001E,
        median_household_income: countyData.B19013_001E,
        median_gross_rent: countyData.B25064_001E,
        median_home_value: countyData.B25077_001E,
        employed_population: countyData.B23025_004E,
        private_sector_accountants: countyData.C24060_004E,
        public_sector_accountants: countyData.C24060_007E,
        firms_per_10k_population: rankingsData?.firm_density || 0,
        growth_rate_percentage: rankingsData?.growth_rate || 0,
        market_saturation_index: rankingsData?.market_saturation || 0,
        total_education_population: countyData.B15003_001E,
        bachelors_degree_holders: countyData.B15003_022E,
        masters_degree_holders: countyData.B15003_023E,
        doctorate_degree_holders: countyData.B15003_025E,
        payann: countyData.PAYANN,
        emp: countyData.EMP,
        total_establishments: countyData.ESTAB,
        avgSalaryPerEmployee,
        vacancy_rate: countyData.B25002_002E && countyData.B25002_003E
          ? (countyData.B25002_003E / countyData.B25002_002E) * 100
          : 0,
        population_rank: rankingsData?.density_rank || 0,
        income_rank: null,
        rent_rank: null,
        vacancy_rank: null,
        growth_rank: rankingsData?.growth_rank || 0,
        top_firms: firms?.map(firm => ({
          company_name: firm["Company Name"],
          employee_count: firm.employeeCount,
          follower_count: firm.followerCount,
          follower_ratio: firm.followerCount / (firm.employeeCount || 1),
          logoResolutionResult: firm.logoResolutionResult,
          originalCoverImage: firm.originalCoverImage,
          primarySubtitle: firm["Primary Subtitle"],
          employeeCountRangeLow: firm.employeeCountRangeLow,
          employeeCountRangeHigh: firm.employeeCountRangeHigh,
          specialities: firm.specialities,
          websiteUrl: firm.websiteUrl,
          Location: firm.Location,
          Summary: firm.Summary
        })) || []
      };

      return {
        countyData: transformedCountyData,
        stateData,
        firms: firms || []
      };
    }
  });
};