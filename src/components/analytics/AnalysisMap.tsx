import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',
  secondary: '#00FFE0',
  accent: '#FFF903',
  highlight: '#94EC0E',
  active: '#FA0098',
  inactive: '#1e293b',
  stateWithMSA: '#3b82f6',
  stateWithoutMSA: '#1e293b'
};

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

  const fetchStatesWithMSA = useCallback(async () => {
    console.log('Fetching states with MSA data...');
    if (!map.current || !layersAdded) {
      console.warn('Map or layers not ready for fetching states with MSA');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips')
        .not('state_fips', 'is', null);

      if (error) {
        console.error('Error fetching states with MSA:', error);
        toast({
          title: "Error",
          description: "Failed to fetch states with MSA data",
          variant: "destructive",
        });
        return;
      }

      const uniqueStates = [...new Set(data.map(d => d.state_fips))];
      console.log('States with MSA data:', uniqueStates);
      setStatesWithMSA(uniqueStates);

      if (map.current.getLayer('state-base')) {
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'match',
          ['get', 'STATEFP'],
          uniqueStates,
          MAP_COLORS.stateWithMSA,
          MAP_COLORS.stateWithoutMSA
        ]);
      }
    } catch (error) {
      console.error('Error in fetchStatesWithMSA:', error);
      toast({
        title: "Error",
        description: "Failed to update state colors",
        variant: "destructive",
      });
    }
  }, [layersAdded, toast]);

  const fetchMSAData = async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .eq('state_fips', stateId);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        toast({
          title: "Error",
          description: "Failed to fetch MSA data",
          variant: "destructive",
        });
        return;
      }

      const uniqueMsaCodes = [...new Set(msaCrosswalk.map(m => m.msa))];
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

      const combinedData = msaCrosswalk.map(msa => ({
        ...msa,
        ...regionData?.find(rd => rd.msa === msa.msa)
      }));

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
  };

  const updateMSAVisualization = (msaData: MSAData[]) => {
    if (!map.current) {
      console.warn('Map not ready for MSA visualization update');
      return;
    }

    const msaCodes = msaData.map(d => d.msa);
    console.log('Updating MSA visualization for codes:', msaCodes);

    try {
      // Show MSA layers
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');

      // Update MSA layer with economic data
      map.current.setPaintProperty('msa-base', 'fill-extrusion-height', [
        'match',
        ['get', 'CBSAFP'],
        msaCodes,
        50000,
        0
      ]);

      map.current.setPaintProperty('msa-base', 'fill-extrusion-color', [
        'match',
        ['get', 'CBSAFP'],
        msaCodes,
        MAP_COLORS.secondary,
        MAP_COLORS.inactive
      ]);

      // Set filters for MSA layers
      map.current.setFilter('msa-base', ['in', 'CBSAFP', ...msaCodes]);
      map.current.setFilter('msa-borders', ['in', 'CBSAFP', ...msaCodes]);

    } catch (error) {
      console.error('Error updating MSA visualization:', error);
      toast({
        title: "Error",
        description: "Failed to update MSA visualization",
        variant: "destructive",
      });
    }
  };

  const fitStateAndShowMSAs = async (stateId: string) => {
    if (!map.current) {
      console.warn('Map not ready for state fitting');
      return;
    }

    if (!statesWithMSA.includes(stateId)) {
      console.log('State has no MSA data:', stateId);
      toast({
        title: "No Data Available",
        description: "This state has no Metropolitan Statistical Areas data available",
        variant: "default",
      });
      return;
    }
    
    console.log('Fitting state and showing MSAs for state:', stateId);

    try {
      // Query for the selected state's features
      const stateFeatures = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], stateId]
      });

      if (stateFeatures.length === 0) {
        console.warn('No features found for state:', stateId);
        return;
      }

      // Calculate bounds for the state
      const bounds = new mapboxgl.LngLatBounds();
      stateFeatures.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0];
          coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
        }
      });

      // Fit the map to the state bounds
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1500,
        pitch: 60,
        bearing: 0
      });

      setSelectedState(stateId);
      setViewMode('msa');

      // Fetch and show MSA data
      await fetchMSAData(stateId);

    } catch (error) {
      console.error('Error in fitStateAndShowMSAs:', error);
      toast({
        title: "Error",
        description: "Failed to focus on selected state",
        variant: "destructive",
      });
    }
  };

  const initializeLayers = useCallback(() => {
    if (!map.current) return;
    
    try {
      // Add state source
      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      // Add MSA source
      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://inevitablesale.29jcxgnm'
      });

      // Add state base layer with hover effect
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.stateWithoutMSA,
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add MSA base layer
      map.current.addLayer({
        'id': 'msa-base',
        'type': 'fill-extrusion',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.secondary,
          'fill-extrusion-height': 50000,
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': 0
        },
        'layout': {
          'visibility': 'none'
        }
      });

      // Add border layers
      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': MAP_COLORS.primary,
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      map.current.addLayer({
        'id': 'msa-borders',
        'type': 'line',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'line-color': MAP_COLORS.secondary,
          'line-width': 1.5,
          'line-opacity': 0.8
        },
        'layout': {
          'visibility': 'none'
        }
      });

      setLayersAdded(true);
      console.log('All layers added successfully');
    } catch (error) {
      console.error('Error initializing layers:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map layers",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
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
        console.log('Map style loaded');
        setMapLoaded(true);
        initializeLayers();
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
  }, [initializeLayers]);

  useEffect(() => {
    if (mapLoaded && layersAdded) {
      console.log('Map and layers ready, fetching states with MSA');
      fetchStatesWithMSA();
    }
  }, [mapLoaded, layersAdded, fetchStatesWithMSA]);

  // Add hover effect for states
  let hoveredStateId: string | null = null;

  useEffect(() => {
    if (!map.current) return;

    map.current.on('mousemove', 'state-base', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.current?.setPaintProperty('state-base', 'fill-extrusion-opacity', 0.6);
        }
        hoveredStateId = e.features[0].id as string;
        map.current?.setPaintProperty('state-base', 'fill-extrusion-opacity', 0.8);
      }
    });

    map.current.on('mouseleave', 'state-base', () => {
      if (hoveredStateId !== null) {
        map.current?.setPaintProperty('state-base', 'fill-extrusion-opacity', 0.6);
        hoveredStateId = null;
      }
    });

    // Add click event for state selection
    map.current.on('click', 'state-base', (e) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          console.log('State clicked:', stateId);
          fitStateAndShowMSAs(stateId);
        }
      }
    });
  }, [fitStateAndShowMSAs]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'state' | 'msa')}>
          <ToggleGroupItem value="state" aria-label="Toggle state view">
            <MapIcon className="h-4 w-4" />
            <span className="ml-2">States</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="msa" aria-label="Toggle MSA view">
            <Building2 className="h-4 w-4" />
            <span className="ml-2">MSAs</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;
