import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { calculateGrowthScore, getColorFromScore, getHeightFromScore } from '@/utils/growthScoreCalculator';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#8B5CF6',    // Vivid Purple
  secondary: '#0EA5E9',  // Ocean Blue
  accent: '#F97316',     // Bright Orange
  highlight: '#D946EF',  // Magenta Pink
  active: '#2DD4BF',     // Teal
  inactive: '#1e293b'    // Dark slate for inactive states
};

const STATE_COLORS = [
  '#8B5CF6', // Vivid Purple (softer entry point)
  '#0EA5E9', // Ocean Blue (calming transition)
  '#F97316', // Bright Orange (warm mid-range)
  '#D946EF', // Magenta Pink (vibrant peak)
  '#2DD4BF', // Teal (fresh accent)
  '#6366F1', // Indigo (rich depth)
  '#EC4899', // Pink (warm highlight)
  '#14B8A6'  // Seafoam (balanced finish)
];

interface MSAData {
  msa: string;
  msa_name: string;
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
  B01001_001E?: number;
  B19013_001E?: number;
  B23025_004E?: number;
}

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersAdded, setLayersAdded] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [msaData, setMsaData] = useState<MSAData[]>([]);
  const [statesWithMSA, setStatesWithMSA] = useState<string[]>([]);
  const { toast } = useToast();

  const updateMSAVisualization = useCallback((data: MSAData[]) => {
    // Implementation will be added later
    console.log('Updating MSA visualization with data:', data);
  }, []);

  const fetchMSAData = useCallback(async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      const paddedStateId = stateId.padStart(2, '0');
      console.log('Padded state ID:', paddedStateId);

      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .eq('state_fips', paddedStateId);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        toast({
          title: "Error",
          description: "Failed to fetch MSA data",
          variant: "destructive",
        });
        return;
      }

      const uniqueMsaCodes = [...new Set(msaCrosswalk?.map(m => m.msa) || [])];
      console.log('Found MSAs:', uniqueMsaCodes);

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
        .select('msa, EMP, PAYANN, ESTAB, B01001_001E, B19013_001E, B23025_004E')
        .in('msa', uniqueMsaCodes);

      if (regionError) {
        console.error('Error fetching region data:', regionError);
        toast({
          title: "Error",
          description: "Failed to fetch region economic data",
          variant: "destructive",
        });
        return;
      }

      const combinedData = msaCrosswalk?.map(msa => ({
        ...msa,
        ...regionData?.find(rd => rd.msa === msa.msa)
      })) || [];

      setMsaData(combinedData);
      console.log('Combined MSA data:', combinedData);

      updateMSAVisualization(combinedData);
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
      toast({
        title: "Error",
        description: "Failed to process MSA data",
        variant: "destructive",
      });
    }
  }, [toast, updateMSAVisualization]);

  const initializeLayers = useCallback(() => {
    if (!map.current) {
      console.warn('Map not ready for layer initialization');
      return;
    }

    try {
      // Add state source
      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      // Add state base layer
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 10000,
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add state hover layer
      map.current.addLayer({
        'id': 'state-hover',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.highlight,
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0
        }
      });

      // Add state borders
      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': MAP_COLORS.primary,
          'line-width': 1
        }
      });

      // Add MSA source and layers
      map.current.addSource('msa', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      map.current.addLayer({
        'id': 'msa-base',
        'type': 'fill-extrusion',
        'source': 'msa',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 10000,
          'fill-extrusion-opacity': 0.6
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.current.addLayer({
        'id': 'msa-borders',
        'type': 'line',
        'source': 'msa',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': MAP_COLORS.secondary,
          'line-width': 1
        },
        'layout': {
          'visibility': 'none'
        }
      });

      setLayersAdded(true);
      console.log('Map layers initialized successfully');
    } catch (error) {
      console.error('Error initializing map layers:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map layers",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateAnalysisTable = useCallback((stateId: string) => {
    // This function will be implemented when we add the analysis table component
    console.log('Updating analysis table for state:', stateId);
  }, []);

  const fitStateAndShowMSAs = useCallback((stateId: string) => {
    if (!map.current) return;

    try {
      const paddedStateId = stateId.padStart(2, '0');
      setSelectedState(paddedStateId);
      
      // Fit to state bounds
      const stateFeatures = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], paddedStateId]
      });

      if (stateFeatures.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        const geometry = stateFeatures[0].geometry as GeoJSON.Polygon;
        geometry.coordinates[0].forEach((coord) => {
          bounds.extend(coord as [number, number]);
        });

        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 8
        });

        fetchMSAData(paddedStateId);
      }
    } catch (error) {
      console.error('Error in fitStateAndShowMSAs:', error);
      toast({
        title: "Error",
        description: "Failed to focus on selected state",
        variant: "destructive",
      });
    }
  }, [fetchMSAData, toast]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      initializeLayers();
    });

    return () => {
      map.current?.remove();
    };
  }, [initializeLayers]);

  return (
    <div className={`relative w-full h-[600px] ${className || ''}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'state' | 'msa')}>
          <ToggleGroupItem value="state" aria-label="Toggle state view">
            <MapIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="msa" aria-label="Toggle MSA view">
            <Building2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default AnalysisMap;