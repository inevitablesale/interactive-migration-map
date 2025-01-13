import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';
import type { MSAData } from '@/types/map';

export const useMSAData = () => {
  const [msaData, setMsaData] = useState<MSAData[]>([]);
  const [statesWithMSA, setStatesWithMSA] = useState<string[]>([]);
  const [msaCountByState, setMsaCountByState] = useState<{ [key: string]: number }>({});

  const fetchMSAData = useCallback(async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .eq('state_fips', stateId);

      if (crosswalkError) throw crosswalkError;

      const uniqueMsaCodes = [...new Set(msaCrosswalk.map(m => m.msa))];
      
      if (uniqueMsaCodes.length === 0) {
        toast({
          title: "No MSA Data",
          description: "This state has no Metropolitan Statistical Areas",
          variant: "default",
        });
        return;
      }

      const { data: regionData, error: regionError } = await supabase
        .from('region_data')
        .select('*')
        .in('msa', uniqueMsaCodes);

      if (regionError) throw regionError;

      const combinedData = msaCrosswalk.map(msa => ({
        ...msa,
        ...regionData?.find(rd => rd.msa === msa.msa)
      }));

      setMsaData(combinedData);
      return combinedData;
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
      toast({
        title: "Error",
        description: "Failed to fetch MSA data",
        variant: "destructive",
      });
      return [];
    }
  }, []);

  const fetchStatesWithMSA = useCallback(async () => {
    try {
      const { data: msaData, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips, msa');

      if (msaError) throw msaError;

      const msaCountByState = msaData.reduce((acc: { [key: string]: number }, curr) => {
        if (curr.state_fips) {
          const stateFips = curr.state_fips.toString().padStart(2, '0');
          acc[stateFips] = (acc[stateFips] || 0) + 1;
        }
        return acc;
      }, {});

      setMsaCountByState(msaCountByState);
      setStatesWithMSA(Object.keys(msaCountByState));
      
      return { msaCountByState, statesWithMSA: Object.keys(msaCountByState) };
    } catch (error) {
      console.error('Error in fetchStatesWithMSA:', error);
      toast({
        title: "Error",
        description: "Failed to fetch states with MSA data",
        variant: "destructive",
      });
      return { msaCountByState: {}, statesWithMSA: [] };
    }
  }, []);

  return {
    msaData,
    statesWithMSA,
    msaCountByState,
    fetchMSAData,
    fetchStatesWithMSA
  };
};