import { supabase } from "@/integrations/supabase/client";

export const getStateName = async (stateId: string): Promise<string> => {
  console.log('getStateName called with stateId:', stateId);
  
  try {
    const { data, error } = await supabase
      .from('msa_county_reference')
      .select('county_name')
      .eq('fipstate', stateId.padStart(2, '0'))
      .limit(1);

    console.log('msa_county_reference query result:', { data, error });

    if (error) {
      console.error('Error in getStateName:', error);
      return `State ${stateId}`;
    }

    if (!data || data.length === 0) {
      console.log('No data found for stateId:', stateId);
      return `State ${stateId}`;
    }

    // Extract the state name from the county name (it's usually "County Name, State Name")
    const countyName = data[0].county_name;
    console.log('Found county_name:', countyName);
    
    const commaIndex = countyName.lastIndexOf(',');
    if (commaIndex !== -1) {
      const stateName = countyName.substring(commaIndex + 1).trim();
      console.log('Extracted state name:', stateName);
      return stateName;
    }

    console.log('No comma found in county_name, returning default');
    return `State ${stateId}`;
  } catch (error) {
    console.error('Unexpected error in getStateName:', error);
    return `State ${stateId}`;
  }
};