import { supabase } from "@/integrations/supabase/client";

export const getStateName = async (stateId: string): Promise<string> => {
  console.log('getStateName called with stateId:', stateId);
  
  try {
    const { data, error } = await supabase
      .from('state_mappings')
      .select('state_name')
      .eq('STATEFP', stateId.padStart(2, '0'))
      .single();

    console.log('state_mappings query result:', { data, error });

    if (error) {
      console.error('Error in getStateName:', error);
      return `State ${stateId}`;
    }

    if (!data || !data.state_name) {
      console.log('No data found for stateId:', stateId);
      return `State ${stateId}`;
    }

    console.log('Found state_name:', data.state_name);
    return data.state_name;
  } catch (error) {
    console.error('Unexpected error in getStateName:', error);
    return `State ${stateId}`;
  }
};