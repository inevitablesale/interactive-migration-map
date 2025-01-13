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
};

// Color scale for states based on number of MSAs
const STATE_COLORS = [
  '#e6f3ff',
  '#bde0ff',
  '#94cdff',
  '#6bb9ff',
  '#42a6ff',
  '#1992ff',
  '#007fff',
  '#0066cc',
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

  const fetchStatesWithMSA = useCallback(async () => {
    console.log('Fetching states with MSA data...');
    if (!map.current || !layersAdded) {
      console.warn('Map or layers not ready for fetching states with MSA');
      return;
    }

    try {
      const { data: msaData, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips, msa');

      if (msaError) {
        console.error('Error fetching states with MSA:', msaError);
        toast({
          title: "Error",
          description: "Failed to fetch states with MSA data",
          variant: "destructive",
        });
        return;
      }

      // Count MSAs per state and get unique states
      const msaCountByState = msaData.reduce((acc: { [key: string]: number }, curr) => {
        if (curr.state_fips) {
          // Ensure state_fips is treated as string
          const stateFips = curr.state_fips.toString().padStart(2, '0');
          acc[stateFips] = (acc[stateFips] || 0) + 1;
        }
        return acc;
      }, {});

      const uniqueStates = Object.keys(msaCountByState).map(state => 
        state.toString().padStart(2, '0')
      );
      console.log('States with MSA data:', uniqueStates);
      setStatesWithMSA(uniqueStates);

      if (map.current.getLayer('state-base')) {
        // Create color assignments based on MSA count
        const maxMSAs = Math.max(...Object.values(msaCountByState));
        const getStateColor = (stateId: string) => {
          const msaCount = msaCountByState[stateId.toString().padStart(2, '0')] || 0;
          const colorIndex = Math.floor((msaCount / maxMSAs) * (STATE_COLORS.length - 1));
          return STATE_COLORS[colorIndex] || MAP_COLORS.inactive;
        };

        // Update the state colors based on MSA count
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'match',
          ['get', 'STATEFP'],
          ...uniqueStates.flatMap(state => [state, getStateColor(state)]),
          MAP_COLORS.inactive
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

    // Deduplicate MSA codes while preserving the original data
    const uniqueMsaCodes = [...new Set(msaData.map(d => d.msa))];
    console.log('Updating MSA visualization for unique codes:', uniqueMsaCodes);

    try {
      // Show MSA layers
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
      
      // Hide state layers when showing MSAs
      map.current.setLayoutProperty('state-base', 'visibility', 'none');
      map.current.setLayoutProperty('state-borders', 'visibility', 'none');

      // Create a match expression for height
      const heightMatchExpression: mapboxgl.Expression = [
        'match',
        ['get', 'CBSAFP'],
        ...uniqueMsaCodes.flatMap(code => [code, 50000]),
        0
      ];

      // Create a match expression for color
      const colorMatchExpression: mapboxgl.Expression = [
        'match',
        ['get', 'CBSAFP'],
        ...uniqueMsaCodes.flatMap(code => [code, MAP_COLORS.secondary]),
        MAP_COLORS.inactive
      ];

      // Update MSA layer with economic data
      map.current.setPaintProperty(
        'msa-base',
        'fill-extrusion-height',
        heightMatchExpression
      );
      
      map.current.setPaintProperty(
        'msa-base',
        'fill-extrusion-color',
        colorMatchExpression
      );

      // Set filters for MSA layers using unique codes
      map.current.setFilter('msa-base', ['in', 'CBSAFP', ...uniqueMsaCodes]);
      map.current.setFilter('msa-borders', ['in', 'CBSAFP', ...uniqueMsaCodes]);

    } catch (error) {
      console.error('Error updating MSA visualization:', error);
      toast({
        title: "Error",
        description: "Failed to update MSA visualization",
        variant: "destructive",
      });
    }
  };

  // Update the viewMode effect to handle layer visibility
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (viewMode === 'state') {
      map.current.setLayoutProperty('state-base', 'visibility', 'visible');
      map.current.setLayoutProperty('state-borders', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-base', 'visibility', 'none');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'none');
    } else {
      // MSA visibility is handled in updateMSAVisualization
      if (selectedState) {
        fetchMSAData(selectedState);
      }
    }
  }, [viewMode, mapLoaded, selectedState]);

  const fitStateAndShowMSAs = async (stateId: string) => {
    if (!map.current) {
      console.warn('Map not ready for state fitting');
      return;
    }

    // Ensure stateId is padded with leading zero if needed
    const paddedStateId = stateId.toString().padStart(2, '0');
    console.log('Fitting state and showing MSAs for state:', paddedStateId);

    // Fix: Convert stateId to string for comparison
    if (!statesWithMSA.includes(paddedStateId)) {
      console.log('State has no MSA data:', paddedStateId);
      toast({
        title: "No Data Available",
        description: "This state has no Metropolitan Statistical Areas data available",
        variant: "default",
      });
      return;
    }
    
    console.log('Fitting state and showing MSAs for state:', paddedStateId);

    try {
      // Query for the selected state's features
      const stateFeatures = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], paddedStateId]
      });

      if (stateFeatures.length === 0) {
        console.warn('No features found for state:', paddedStateId);
        return;
      }

      // Calculate bounds for the state
      const bounds = new mapboxgl.LngLatBounds();
      let hasValidCoordinates = false;

      stateFeatures.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates;
          if (Array.isArray(coordinates) && coordinates.length > 0 && Array.isArray(coordinates[0])) {
            coordinates[0].forEach((coord: [number, number]) => {
              if (Array.isArray(coord) && coord.length === 2 && 
                  !isNaN(coord[0]) && !isNaN(coord[1])) {
                bounds.extend(coord);
                hasValidCoordinates = true;
              }
            });
          }
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach(polygon => {
            if (Array.isArray(polygon) && polygon.length > 0 && Array.isArray(polygon[0])) {
              polygon[0].forEach((coord: [number, number]) => {
                if (Array.isArray(coord) && coord.length === 2 && 
                    !isNaN(coord[0]) && !isNaN(coord[1])) {
                  bounds.extend(coord);
                  hasValidCoordinates = true;
                }
              });
            }
          });
        }
      });

      if (!hasValidCoordinates) {
        console.error('No valid coordinates found for state:', paddedStateId);
        toast({
          title: "Error",
          description: "Could not find valid coordinates for this state",
          variant: "destructive",
        });
        return;
      }

      // First fit to state bounds with state-level zoom
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1500,
        pitch: 60,
        bearing: 0,
        offset: [0, 0],
      });

      setSelectedState(paddedStateId);
      setViewMode('msa');

      // Fetch MSA data
      await fetchMSAData(paddedStateId);

      // After MSA data is loaded, zoom in closer for MSA view
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
        pitch: 60,
        bearing: 0,
        offset: [0, 0],
        maxZoom: map.current.getZoom() + 1 // Increase zoom level by 1 for MSA view
      });

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
          'fill-extrusion-color': MAP_COLORS.inactive, // Fixed: Use inactive color as default
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
