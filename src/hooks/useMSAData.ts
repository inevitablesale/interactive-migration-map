import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MSAData } from '@/types/map';

export const useMSAData = () => {
  const [msaData, setMsaData] = useState<MSAData[]>([]);
  const [statesWithMSA, setStatesWithMSA] = useState<string[]>([]);
  const [msaCountByState, setMsaCountByState] = useState<{ [key: string]: number }>({});

  const fetchMSAData = useCallback(async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      // Create both padded and unpadded versions of the state ID
      const paddedStateId = stateId.padStart(2, '0');
      const unpaddenStateId = parseInt(stateId, 10).toString();
      console.log('Using padded state ID:', paddedStateId);
      console.log('Using unpadded state ID:', unpaddenStateId);
      
      // Query using both padded and unpadded state IDs
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .or(`state_fips.eq.${paddedStateId},state_fips.eq.${unpaddenStateId}`);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        return [];
      }

      console.log('MSA crosswalk data:', msaCrosswalk);

      // Create a Set of unique MSA codes
      const uniqueMsaCodes = [...new Set(msaCrosswalk?.map(m => m.msa) || [])];
      console.log('Found unique MSA codes:', uniqueMsaCodes);

      if (uniqueMsaCodes.length === 0) {
        console.log('No MSA codes found for state:', paddedStateId);
        return [];
      }

      const { data: regionData, error: regionError } = await supabase
        .from('region_data')
        .select('msa, EMP, PAYANN, ESTAB, B01001_001E, B19013_001E, B23025_004E')
        .in('msa', uniqueMsaCodes);

      if (regionError) {
        console.error('Error fetching region data:', regionError);
        return [];
      }

      console.log('Region data:', regionData);

      // Create a Map to store unique MSA data
      const msaMap = new Map();
      
      msaCrosswalk?.forEach(msa => {
        const regionInfo = regionData?.find(rd => rd.msa === msa.msa);
        if (regionInfo) {
          // Only add if not already in the map
          if (!msaMap.has(msa.msa)) {
            msaMap.set(msa.msa, {
              ...msa,
              ...regionInfo
            });
          }
        }
      });

      // Convert Map values to array
      const combinedData = Array.from(msaMap.values());
      console.log('Combined MSA data:', combinedData);

      setMsaData(combinedData);
      console.log('Found MSAs:', combinedData);
      return combinedData;
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
      return [];
    }
  }, []);

  const fetchStatesWithMSA = useCallback(async () => {
    console.log('Fetching states with MSA data...');
    try {
      const { data: msaData, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips, msa')
        .not('state_fips', 'is', null);

      if (msaError) {
        console.error('Error fetching states with MSA:', msaError);
        return;
      }

      console.log('Raw MSA state data:', msaData);

      const msaCountByState = msaData?.reduce((acc: { [key: string]: number }, curr) => {
        if (curr.state_fips) {
          const stateFips = curr.state_fips.toString().padStart(2, '0');
          acc[stateFips] = (acc[stateFips] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const uniqueStates = Object.keys(msaCountByState).map(state => 
        state.toString().padStart(2, '0')
      );
      
      console.log('States with MSA data:', uniqueStates);
      console.log('MSA count by state:', msaCountByState);
      
      setStatesWithMSA(uniqueStates);
      setMsaCountByState(msaCountByState);
    } catch (error) {
      console.error('Error in fetchStatesWithMSA:', error);
    }
  }, []);

  return {
    msaData,
    setMsaData,
    statesWithMSA,
    setStatesWithMSA,
    msaCountByState,
    setMsaCountByState,
    fetchMSAData,
    fetchStatesWithMSA
  };
};