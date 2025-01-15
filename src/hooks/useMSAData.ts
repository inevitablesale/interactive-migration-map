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
      const paddedStateId = stateId.padStart(2, '0');
      const unpaddenStateId = parseInt(stateId, 10).toString();
      
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('MSA, msa_name')
        .or(`STATEFP.eq.${paddedStateId},STATEFP.eq.${unpaddenStateId}`);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        return [];
      }

      const uniqueMsaCodes = [...new Set(msaCrosswalk?.map(m => m.MSA) || [])];

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

      const msaMap = new Map();
      
      msaCrosswalk?.forEach(msa => {
        const regionInfo = regionData?.find(rd => rd.msa === msa.MSA);
        if (regionInfo) {
          if (!msaMap.has(msa.MSA)) {
            msaMap.set(msa.MSA, {
              ...msa,
              ...regionInfo
            });
          }
        }
      });

      const combinedData = Array.from(msaMap.values());
      setMsaData(combinedData);
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
