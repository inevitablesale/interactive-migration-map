import React, { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2, LineChart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapLayers } from '@/hooks/useMapLayers';
import { useMSAData } from '@/hooks/useMSAData';
import { MAP_COLORS } from '@/constants/colors';
import { supabase } from "@/integrations/supabase/client";
import type { MSAData } from '@/types/map';

interface AnalysisMapProps {
  className?: string;
}

interface StateData {
  STATEFP: string;
  B19013_001E: number; // Median household income
  C24010_033E: number; // Financial sector employment (male)
  C24010_034E: number; // Financial sector employment (female)
  EMP: number;         // Total employment
  ESTAB: number;       // Number of establishments
  PAYANN: number;      // Annual payroll
  buyerScore?: number;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const { toast } = useToast();
  
  const { mapContainer, map, mapLoaded, setMapLoaded } = useMapInitialization();
  const { layersAdded, setLayersAdded, initializeLayers } = useMapLayers(map);
  const { 
    msaData,
    setMsaData,
    statesWithMSA,
    setStatesWithMSA,
    msaCountByState,
    setMsaCountByState,
    fetchMSAData,
    fetchStatesWithMSA
  } = useMSAData();

  const calculateBuyerScore = (state: StateData): number => {
    if (!state.B19013_001E || !state.EMP || !state.ESTAB || !state.PAYANN) return 0;
    
    // Calculate financial sector employment (combining male and female)
    const financialSectorEmp = (state.C24010_033E || 0) + (state.C24010_034E || 0);
    
    // Normalize values between 0 and 1
    const incomeScore = state.B19013_001E / 100000; // Assuming max income of 100k
    const establishmentScore = Math.min(state.ESTAB / 1000, 1); // Cap at 1000 establishments
    const employmentScore = Math.min(state.EMP / 10000, 1); // Cap at 10000 employees
    const payrollScore = Math.min(state.PAYANN / 1000000, 1); // Cap at 1M annual payroll
    const financialSectorScore = Math.min(financialSectorEmp / 5000, 1); // Cap at 5000 financial sector employees
    
    // Weight the scores (adjust weights based on importance)
    const weightedScore = (
      incomeScore * 0.2 +           // 20% weight on income
      establishmentScore * 0.2 +    // 20% weight on number of establishments
      employmentScore * 0.2 +       // 20% weight on total employment
      payrollScore * 0.2 +          // 20% weight on annual payroll
      financialSectorScore * 0.2    // 20% weight on financial sector employment
    );
    
    return Math.max(0, Math.min(1, weightedScore));
  };

  const fetchStateData = async () => {
    try {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, B19013_001E, C24010_033E, C24010_034E, EMP, ESTAB, PAYANN');

      if (error) throw error;

      const processedData = data.map(state => ({
        ...state,
        buyerScore: calculateBuyerScore(state)
      }));

      setStateData(processedData);
      
      if (map.current) {
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'case',
          ['has', ['to-string', ['get', 'STATEFP']], ['literal', processedData.reduce((acc, state) => ({
            ...acc,
            [state.STATEFP]: getStateColor(state.STATEFP)
          }), {})]],
          ['get', ['to-string', ['get', 'STATEFP']], ['literal', processedData.reduce((acc, state) => ({
            ...acc,
            [state.STATEFP]: getStateColor(state.STATEFP)
          }), {})]],
          MAP_COLORS.inactive
        ]);
      }
    } catch (error) {
      console.error('Error fetching state data:', error);
      toast({
        title: "Error",
        description: "Failed to load state data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: 3,
        center: [-98.5795, 39.8283],
        pitch: 45,
        bearing: 0,
        interactive: true,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('style.load', () => {
        setMapLoaded(true);
        initializeLayers();
        fetchStateData();
      });

      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  }, [initializeLayers, mapContainer, toast]);

  useEffect(() => {
    if (mapLoaded && layersAdded) {
      fetchStatesWithMSA();
    }
  }, [mapLoaded, layersAdded, fetchStatesWithMSA]);

  useEffect(() => {
    if (!map.current) return;

    let hoveredStateId: string | null = null;

    map.current.on('mousemove', 'state-base', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        }
        hoveredStateId = e.features[0].properties?.STATEFP;
        
        if (hoveredStateId) {
          map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0.3);
          map.current?.setFilter('state-hover', ['==', ['get', 'STATEFP'], hoveredStateId]);
          updateAnalysisTable(hoveredStateId);
        }
      }
    });

    map.current.on('mouseleave', 'state-base', () => {
      if (hoveredStateId) {
        map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        hoveredStateId = null;
      }
    });

    map.current.on('click', 'state-base', (e) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          fitStateAndShowMSAs(stateId);
          updateAnalysisTable(stateId);
        }
      }
    });
  }, [fitStateAndShowMSAs, updateAnalysisTable]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => {
            if (value === 'state') {
              resetToStateView();
            }
            if (value) setViewMode(value as 'state' | 'msa');
          }}
        >
          <ToggleGroupItem value="state" aria-label="Toggle state view">
            <MapIcon className="h-4 w-4" />
            <span className="ml-2">States</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="msa" 
            aria-label="Toggle MSA view"
            disabled={!selectedState}
          >
            <Building2 className="h-4 w-4" />
            <span className="ml-2">MSAs</span>
          </ToggleGroupItem>
        </ToggleGroup>
        
        <ToggleGroup type="single" value={heatmapEnabled ? "enabled" : "disabled"}>
          <ToggleGroupItem
            value="enabled"
            aria-label="Toggle heatmap"
            onClick={() => {
              setHeatmapEnabled(!heatmapEnabled);
              fetchStateData();
            }}
          >
            <LineChart className="h-4 w-4" />
            <span className="ml-2">Buyer Score</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;
