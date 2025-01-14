import { supabase } from "@/integrations/supabase/client";

export const getStateName = async (stateId: string): Promise<string> => {
  console.log('getStateName called with stateId:', stateId);
  
  try {
    // Ensure stateId is padded with leading zero if needed
    const paddedStateId = stateId.padStart(2, '0');
    console.log('Padded stateId:', paddedStateId);
    
    // Query the state_fips_codes table
    const { data, error } = await supabase
      .from('state_fips_codes')
      .select('state')
      .eq('fips_code', paddedStateId)
      .single();

    if (error) {
      console.error('Error fetching state name:', error);
      return `State ${stateId}`;
    }

    if (!data || !data.state) {
      console.log('No state name found for stateId:', stateId);
      return `State ${stateId}`;
    }

    console.log('Found state name:', data.state);
    return data.state;
  } catch (error) {
    console.error('Unexpected error in getStateName:', error);
    return `State ${stateId}`;
  }
};