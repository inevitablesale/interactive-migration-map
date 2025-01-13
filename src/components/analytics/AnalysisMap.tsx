import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',
  secondary: '#00FFE0',
  accent: '#FFF903',
  highlight: '#94EC0E',
  active: '#FA0098',
  inactive: '#000000'
};

interface MSAData {
  msa: string;
  msa_name: string;
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
}

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [msaData, setMsaData] = useState<MSAData[]>([]);

  const fetchMSAData = async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      // First get unique counties from canary_firms_data for this state
      const { data: countyData, error: countyError } = await supabase
        .from('canary_firms_data')
        .select('COUNTYNAME')
        .eq('STATEFP', parseInt(stateId))
        .not('COUNTYNAME', 'is', null);

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        return;
      }

      if (!countyData || countyData.length === 0) {
        console.log('No counties found for state:', stateId);
        return;
      }

      const uniqueCounties = [...new Set(countyData.map(c => c.COUNTYNAME))];
      console.log('Found unique counties:', uniqueCounties.length);

      // Get MSAs for these counties from crosswalk table
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .in('county_name', uniqueCounties)
        .eq('state_fips', stateId);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        return;
      }

      if (!msaCrosswalk || msaCrosswalk.length === 0) {
        console.log('No MSAs found for counties');
        return;
      }

      console.log('Found MSAs in crosswalk:', msaCrosswalk.length);

      // Get unique MSA codes
      const uniqueMsaCodes = [...new Set(msaCrosswalk.map(m => m.msa))];

      // Get economic data for these MSAs
      const { data: regionData, error: regionError } = await supabase
        .from('region_data')
        .select('msa, EMP, PAYANN, ESTAB')
        .in('msa', uniqueMsaCodes);

      if (regionError) {
        console.error('Error fetching region data:', regionError);
        return;
      }

      console.log('Found region data entries:', regionData?.length);

      // Combine the data
      const combinedData = msaCrosswalk.map(msa => ({
        ...msa,
        ...regionData?.find(rd => rd.msa === msa.msa)
      }));

      setMsaData(combinedData);
      console.log('Combined MSA data:', combinedData);
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
    }
  };

  const verifyLayers = () => {
    if (!map.current) {
      console.log('Map not initialized');
      return;
    }
    
    const layers = map.current.getStyle().layers;
    console.log('All available layers:', layers?.map(l => l.id));
    
    // Check sources
    const sources = map.current.getStyle().sources;
    console.log('All available sources:', Object.keys(sources));
    
    // Verify specific layers
    const stateLayer = map.current.getLayer('state-base');
    const msaLayer = map.current.getLayer('msa-base');
    
    console.log('State layer exists:', !!stateLayer);
    console.log('MSA layer exists:', !!msaLayer);

    // Check MSA source data
    const msaSource = map.current.getSource('msas');
    console.log('MSA source exists:', !!msaSource);
    
    if (msaSource) {
      try {
        const msaFeatures = map.current.querySourceFeatures('msas', {
          sourceLayer: 'tl_2020_us_cbsa-aoky0u'
        });
        console.log('Number of MSA features found:', msaFeatures.length);
      } catch (error) {
        console.error('Error querying MSA features:', error);
      }
    }
  };

  const fitStateAndShowMSAs = async (stateId: string) => {
    if (!map.current) {
      console.log('Map not initialized in fitStateAndShowMSAs');
      return;
    }
    console.log('Fitting state and showing MSAs for state:', stateId);

    // Fetch MSA data first
    await fetchMSAData(stateId);

    verifyLayers();

    // Query for the selected state's features
    const stateFeatures = map.current.querySourceFeatures('states', {
      sourceLayer: 'tl_2020_us_state-52k5uw',
      filter: ['==', ['get', 'STATEFP'], stateId]
    });

    console.log('Found state features:', stateFeatures.length);

    if (stateFeatures.length > 0) {
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

      // Fit the map to the state bounds with padding and animation
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1500,
        pitch: 60,
        bearing: 0,
        maxZoom: 8 // Limit zoom to ensure MSAs are visible
      });

      // Show MSA layers before starting animation
      try {
        console.log('Attempting to show MSA layers...');
        map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
        map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
        console.log('MSA layers visibility set to visible');
        
        // Update MSA layer with new data
        if (msaData.length > 0) {
          console.log('Updating MSA layer with data:', msaData);
          map.current.setPaintProperty('msa-base', 'fill-extrusion-height', [
            'interpolate',
            ['linear'],
            ['get', 'EMP'],
            0, 20000,
            100000, 100000
          ]);
        }
        
      } catch (error) {
        console.error('Error setting MSA layer visibility:', error);
      }

      // Filter MSAs to show only those in the selected state
      try {
        console.log('Setting MSA layer filter for state:', stateId);
        map.current.setFilter('msa-base', ['==', ['get', 'STATEFP'], stateId]);
        map.current.setFilter('msa-borders', ['==', ['get', 'STATEFP'], stateId]);
      } catch (error) {
        console.error('Error setting MSA layer filter:', error);
      }

      setSelectedState(stateId);
      setViewMode('msa');
    }
  };

  const resetView = () => {
    if (!map.current) return;

    // Reset to default view with animation
    map.current.easeTo({
      pitch: 45,
      zoom: 3,
      center: [-98.5795, 39.8283],
      duration: 1500
    });

    // Fade out MSA layer and fade in state layer
    const fadeAnimation = (progress: number) => {
      if (!map.current) return;
      
      map.current.setPaintProperty('state-base', 'fill-extrusion-opacity', 
        0.6 * progress);
      map.current.setPaintProperty('msa-base', 'fill-extrusion-opacity', 
        0.8 * (1 - progress));
    };

    let start: number | null = null;
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      fadeAnimation(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Hide MSA layers after animation completes
        map.current?.setLayoutProperty('msa-base', 'visibility', 'none');
        map.current?.setLayoutProperty('msa-borders', 'visibility', 'none');
      }
    };

    requestAnimationFrame(animate);

    setSelectedState(null);
    setViewMode('state');
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map...');
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
      if (!map.current) return;
      console.log('Map style loaded, adding sources and layers');
      
      setMapLoaded(true);

      // Add state source
      try {
        map.current.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });
        console.log('Added states source');
      } catch (error) {
        console.error('Error adding states source:', error);
      }

      // Add MSA source
      try {
        map.current.addSource('msas', {
          type: 'vector',
          url: 'mapbox://inevitablesale.29jcxgnm'
        });
        console.log('Added MSAs source');
      } catch (error) {
        console.error('Error adding MSAs source:', error);
      }

      // Add state base layer
      try {
        map.current.addLayer({
          'id': 'state-base',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': MAP_COLORS.inactive,
            'fill-extrusion-height': 20000,
            'fill-extrusion-opacity': 0.6
          }
        });
        console.log('Added state base layer');
      } catch (error) {
        console.error('Error adding state base layer:', error);
      }

      // Add MSA base layer
      try {
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
        console.log('Added MSA base layer');
      } catch (error) {
        console.error('Error adding MSA base layer:', error);
      }

      // Add border layers
      try {
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
        console.log('Added border layers');
      } catch (error) {
        console.error('Error adding border layers:', error);
      }

      verifyLayers();

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
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const updateViewMode = (mode: 'state' | 'msa') => {
    if (mode === 'state') {
      resetView();
    }
  };

  useEffect(() => {
    if (viewMode === 'state' && selectedState) {
      resetView();
    }
  }, [viewMode]);

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
