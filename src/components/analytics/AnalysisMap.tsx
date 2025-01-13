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

interface AnalysisMapProps {
  className?: string;
}

interface StateData {
  STATEFP: string;
  B01001_001E: number | null; // Total Population
  B19013_001E: number | null; // Median Income
  C24060_001E: number | null; // Total Accountant Employment
  C24010_001E: number | null; // Total Workforce
  C24010_033E: number | null; // Additional workforce metric
  C24010_034E: number | null; // Additional workforce metric
  PAYANN: number | null;      // Total Annual Payroll
  ESTAB: number | null;       // Total Establishments
  B08303_001E: number | null; // Average Commute Time
  B15003_022E: number | null; // Bachelor's Degree Holders
  B01002_001E: number | null; // Median Age
  EMP: number | null;         // Employment
  buyerScore?: number;        // Added buyerScore to the interface
}

const calculateBuyerScore = (state: StateData, allStates: StateData[]): number => {
  if (!state || !allStates.length) return 0;

  // Find maximum values across all states
  const maxPopulation = Math.max(...allStates.map(s => s.B01001_001E || 0));
  const maxWorkforce = Math.max(...allStates.map(s => s.C24010_001E || 0));
  const maxBachelors = Math.max(...allStates.map(s => s.B15003_022E || 0));
  const maxCommuteTime = Math.max(...allStates.map(s => s.B08303_001E || 0));

  // Calculate normalized component scores
  const populationScore = ((state.B01001_001E || 0) / maxPopulation) * 0.3;
  const workforceScore = ((state.C24010_001E || 0) / maxWorkforce) * 0.4;
  const educationScore = ((state.B15003_022E || 0) / maxBachelors) * 0.2;
  const commuteScore = (1 - ((state.B08303_001E || 0) / maxCommuteTime)) * 0.1;

  // Calculate total score
  const totalScore = populationScore + workforceScore + educationScore + commuteScore;

  // Ensure score is between 0 and 1
  return Math.min(Math.max(totalScore, 0), 1);
};

const getHeatmapColor = (score: number): string => {
  // Create a color gradient from cool to warm colors
  if (score >= 0.8) return '#FF4444';      // Very high - warm red
  if (score >= 0.6) return '#FF7F50';      // High - coral
  if (score >= 0.4) return '#FFD700';      // Medium - gold
  if (score >= 0.2) return '#98FB98';      // Low - pale green
  return '#87CEEB';                        // Very low - sky blue
};

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

  const getStateColor = useCallback((stateId: string) => {
    const state = stateData.find(s => s.STATEFP === stateId);
    if (!state || typeof state.buyerScore === 'undefined') return MAP_COLORS.inactive;
    return getHeatmapColor(state.buyerScore);
  }, [stateData]);

  const updateAnalysisTable = useCallback((stateId: string) => {
    const state = stateData.find(s => s.STATEFP === stateId);
    if (!state) return;

    // Create a plain object with only the serializable data we need
    const eventData = {
      stateId,
      data: {
        STATEFP: state.STATEFP,
        B19013_001E: state.B19013_001E,
        C24010_001E: state.C24010_001E,
        ESTAB: state.ESTAB,
        PAYANN: state.PAYANN,
        buyerScore: state.buyerScore
      }
    };

    // Dispatch event with serializable data
    const event = new CustomEvent('analysisStateChanged', {
      detail: JSON.parse(JSON.stringify(eventData))
    });
    window.dispatchEvent(event);
  }, [stateData]);

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;

    setSelectedState(stateId);
    setViewMode('msa');

    // Query the state boundaries
    const stateFeatures = map.current.querySourceFeatures('states', {
      sourceLayer: 'tl_2020_us_state-52k5uw',
      filter: ['==', ['get', 'STATEFP'], stateId]
    });

    if (stateFeatures.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      const geometry = stateFeatures[0].geometry as GeoJSON.Polygon;
      geometry.coordinates[0].forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });

      // Adjust padding based on state size
      const padding = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      };

      map.current.fitBounds(bounds, {
        padding,
        duration: 1000
      });

      // Show MSA layers
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');

      // Fetch and display MSA data
      const msaData = await fetchMSAData(stateId);
      console.log('MSA data loaded:', msaData);
    }
  }, [map, fetchMSAData]);

  const resetToStateView = useCallback(() => {
    if (!map.current) return;

    setSelectedState(null);
    setViewMode('state');

    // Hide MSA layers
    map.current.setLayoutProperty('msa-base', 'visibility', 'none');
    map.current.setLayoutProperty('msa-borders', 'visibility', 'none');

    // Reset map view
    map.current.easeTo({
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 45,
      bearing: 0,
      duration: 1000
    });
  }, [map]);

  const fetchStateData = async () => {
    try {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, B01001_001E, B19013_001E, C24060_001E, C24010_001E, PAYANN, ESTAB, B08303_001E, B15003_022E, B01002_001E');

      if (error) throw error;

      const processedData = data.map(state => ({
        ...state,
        buyerScore: calculateBuyerScore(state, data)
      }));

      setStateData(processedData);
      
      if (map.current) {
        // Update the fill-extrusion-color property for the state layer
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'case',
          ['has', ['to-string', ['get', 'STATEFP']], ['literal', processedData.reduce((acc, state) => ({
            ...acc,
            [state.STATEFP]: getHeatmapColor(state.buyerScore || 0)
          }), {})]],
          ['get', ['to-string', ['get', 'STATEFP']], ['literal', processedData.reduce((acc, state) => ({
            ...acc,
            [state.STATEFP]: getHeatmapColor(state.buyerScore || 0)
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