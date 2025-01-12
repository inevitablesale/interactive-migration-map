import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import StateReportCard from './StateReportCard';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const COLORS = {
  primary: '#FCD34D',
  secondary: '#222222',
  inactive: '#000000',
};

interface StateData {
  STATEFP: string;
  EMP: number | null;
  PAYANN: number | null;
  ESTAB: number | null;
  B19013_001E: number | null;
  B23025_004E: number | null;
  B25077_001E: number | null;
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const stateDataRef = useRef<StateData[]>([]);
  const mapLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const statesWithDataRef = useRef<Set<string>>(new Set());
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStateIndexRef = useRef(0);

  // Function to start cycling through states
  const startCyclingStates = () => {
    if (cycleIntervalRef.current) return;
    
    cycleIntervalRef.current = setInterval(() => {
      if (stateDataRef.current.length === 0) return;
      
      currentStateIndexRef.current = (currentStateIndexRef.current + 1) % stateDataRef.current.length;
      const nextState = stateDataRef.current[currentStateIndexRef.current];
      setActiveState(nextState);

      // Fly to the next state if map is available
      if (map.current && nextState) {
        const stateFeatures = map.current.querySourceFeatures('states', {
          sourceLayer: 'tl_2020_us_state-52k5uw',
          filter: ['==', ['get', 'STATEFP'], nextState.STATEFP]
        });

        if (stateFeatures.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          const geometry = stateFeatures[0].geometry as GeoJSON.Polygon;
          const coordinates = geometry.coordinates[0];
          coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });

          map.current.fitBounds(bounds, {
            padding: 100,
            pitch: 60,
            bearing: 0,
            duration: 2000
          });
        }
      }
    }, 5000); // Cycle every 5 seconds
  };

  // Add scroll handler to stop cycling when user scrolls to analysis section
  useEffect(() => {
    const handleScroll = () => {
      const analysisSection = document.querySelector('.analysis-section');
      if (!analysisSection) return;

      const rect = analysisSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        if (cycleIntervalRef.current) {
          clearInterval(cycleIntervalRef.current);
          cycleIntervalRef.current = null;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup function
  const cleanup = () => {
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
      cycleIntervalRef.current = null;
    }
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    mapLoadedRef.current = false;
    mapInitializedRef.current = false;
    setActiveState(null);
  };

  const fetchStateData = async () => {
    try {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E')
        .not('STATEFP', 'is', null)
        .not('EMP', 'is', null);

      if (error) {
        console.error('Error fetching state data:', error);
        return;
      }

      statesWithDataRef.current = new Set(data?.map(state => state.STATEFP) || []);
      stateDataRef.current = data || [];

      if (data && data.length > 0) {
        setActiveState(data[0]);
      }

      if (!mapInitializedRef.current) {
        initializeMap();
        mapInitializedRef.current = true;
      }
    } catch (err) {
      console.error('Error in fetchStateData:', err);
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 3,
      center: [-98.5795, 39.8283], // Center of the US
      pitch: 45, // Reduced pitch for better visibility
      bearing: 0,
      interactive: true,
    });

    // Add navigation controls with pitch control
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('style.load', () => {
      if (!map.current) return;
      mapLoadedRef.current = true;

      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      // Base layer for all states with minimal height
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': COLORS.inactive,
          'fill-extrusion-height': 10000, // Small base height for all states
          'fill-extrusion-opacity': 0.6
        }
      });

      // Layer for active state with enhanced 3D effect
      map.current.addLayer({
        'id': 'state-active',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': [
            'case',
            ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
            COLORS.primary,
            'transparent'
          ],
          'fill-extrusion-height': [
            'case',
            ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
            100000,
            0
          ],
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': 10000 // Start from the base layer height
        }
      });

      // Add borders with warm yellow color
      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': COLORS.primary,
          'line-width': 1
        }
      });
    });

    // Update active state when map is clicked
    map.current.on('click', 'state-base', (e) => {
      if (!e.features?.[0]) return;
      
      const clickedStateId = e.features[0].properties?.STATEFP;
      if (!clickedStateId || !statesWithDataRef.current.has(clickedStateId)) return;

      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }

      const newActiveState = stateDataRef.current.find(state => state.STATEFP === clickedStateId);
      if (newActiveState) {
        setActiveState(newActiveState);
        
        // Fly to clicked state
        const bounds = new mapboxgl.LngLatBounds();
        // Type assertion to handle the Polygon geometry type
        const geometry = e.features[0].geometry as GeoJSON.Polygon;
        const coordinates = geometry.coordinates[0];
        coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });

        map.current?.fitBounds(bounds, {
          padding: 100,
          pitch: 60,
          bearing: 0,
          duration: 2000
        });
      }
    });

    // Add hover effects
    map.current.on('mousemove', 'state-base', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'state-base', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });
  };

  // Start cycling after data is fetched
  useEffect(() => {
    if (stateDataRef.current.length > 0 && !cycleIntervalRef.current) {
      startCyclingStates();
    }
  }, [stateDataRef.current]);

  useEffect(() => {
    fetchStateData();
    return cleanup;
  }, []);

  // Update map when active state changes
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;

    map.current.setPaintProperty('state-active', 'fill-extrusion-height', [
      'case',
      ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
      100000,
      0
    ]);

    map.current.setPaintProperty('state-active', 'fill-extrusion-color', [
      'case',
      ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
      COLORS.primary,
      'transparent'
    ]);
  }, [activeState]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      <StateReportCard data={activeState} isVisible={!!activeState} />
    </div>
  );
};

export default Map;
