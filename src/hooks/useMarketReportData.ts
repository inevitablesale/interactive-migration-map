import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ComprehensiveMarketData } from "@/types/rankings";

export const useMarketReportData = (county?: string, state?: string) => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['marketReport', county, state],
    queryFn: async () => {
      try {
        console.log('Fetching market data for:', { county, state });
        
        // Get state FIPS code
        const { data: stateFips } = await supabase
          .from('state_fips_codes')
          .select('fips_code')
          .eq('state', state)
          .single();

        if (!stateFips?.fips_code) {
          console.error('State FIPS code not found for:', state);
          return null;
        }

        // Get comprehensive county data
        const { data: countyData, error: countyError } = await supabase
          .rpc('get_comprehensive_county_data', {
            p_county: county,
            p_state_fips: stateFips.fips_code
          });

        if (countyError) {
          console.error('Error fetching county data:', countyError);
          throw countyError;
        }

        // Get top firms data
        const { data: firmsData, error: firmsError } = await supabase
          .from('canary_firms_data')
          .select('*')
          .eq('STATEFP', parseInt(stateFips.fips_code))
          .eq('COUNTYNAME', county?.replace(' County', ''))
          .order('followerCount', { ascending: false });

        if (firmsError) {
          console.error('Error fetching firms data:', firmsError);
          throw firmsError;
        }

        console.log('Fetched market data:', { countyData, firmsData });

        if (!countyData || countyData.length === 0) {
          console.log('No county data found');
          return null;
        }

        const comprehensiveData: ComprehensiveMarketData = {
          ...countyData[0],
          top_firms: firmsData?.map(firm => ({
            company_name: firm['Company Name'] || '',
            employee_count: firm.employeeCount || 0,
            follower_count: firm.followerCount || 0,
            follower_ratio: (firm.followerCount || 0) / (firm.employeeCount || 1),
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
          }))
        };

        return comprehensiveData;
      } catch (error) {
        console.error('Error in useMarketReportData:', error);
        throw error;
      }
    }
  });

  const hasMarketData = Boolean(marketData);

  return {
    marketData,
    isLoading,
    hasMarketData
  };
};