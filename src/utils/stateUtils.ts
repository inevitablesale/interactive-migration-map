import { supabase } from "@/integrations/supabase/client";

export const getStateName = async (stateId: string): Promise<string> => {
  const { data, error } = await supabase
    .from('msa_county_reference')
    .select('county_name')
    .eq('fipstate', stateId.padStart(2, '0'))
    .limit(1);

  if (error || !data || data.length === 0) {
    return `State ${stateId}`;
  }

  // Extract the state name from the county name (it's usually "County Name, State Name")
  const stateName = data[0].county_name.split(',')[1]?.trim();
  return stateName || `State ${stateId}`;
};