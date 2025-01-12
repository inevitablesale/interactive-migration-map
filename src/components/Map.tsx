import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import StateReportCard from './StateReportCard';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const COLORS = {
  primary: '#FCD34D', // Warmer yellow
  secondary: '#222222', // Black
  inactive: '#000000', // Black for states without data
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

  // Cleanup function
  const cleanup = () => {
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
    }
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    mapLoadedRef.current = false;
    mapInitializedRef.current = false;
    setActiveState(null);
  };

  // Function to cycle through states
  const cycleToNextState = () => {
    if (stateDataRef.current.length === 0) return;
    
    const currentIndex = activeState 
      ? stateDataRef.current.findIndex(state => state.STATEFP === activeState.STATEFP)
      : -1;
    
    const nextIndex = (currentIndex + 1) % stateDataRef.current.length;
    setActiveState(stateDataRef.current[nextIndex]);
  };

  useEffect(() => {
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

        // Set first state as active by default
        if (data && data.length > 0) {
          setActiveState(data[0]);
        }

        if (!mapInitializedRef.current) {
          initializeMap();
          mapInitializedRef.current = true;
        }

        // Start cycling through states
        cycleIntervalRef.current = setInterval(cycleToNextState, 5000);
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
        center: [-95.7129, 37.0902],
        pitch: 45,
        interactive: true,
      });

      map.current.on('style.load', () => {
        if (!map.current) return;
        mapLoadedRef.current = true;

        map.current.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        // Add base layer for all states (black)
        map.current.addLayer({
          'id': 'state-base',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': COLORS.inactive,
            'fill-extrusion-height': 0,
            'fill-extrusion-opacity': 0.9
          }
        });

        // Add layer for active state only
        map.current.addLayer({
          'id': 'state-active',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': COLORS.primary,
            'fill-extrusion-height': [
              'case',
              ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
              500000,
              0
            ],
            'fill-extrusion-opacity': 0.8
          }
        });

        // Add borders with warmer yellow color
        map.current.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'line-color': '#FCD34D',
            'line-width': 1
          }
        });
      });

      // Update active state when map is clicked
      map.current.on('click', 'state-base', (e) => {
        if (!e.features?.[0]) return;
        
        const clickedStateId = e.features[0].properties?.STATEFP;
        if (!clickedStateId || !statesWithDataRef.current.has(clickedStateId)) return;

        // Clear the auto-cycle interval when user interacts
        if (cycleIntervalRef.current) {
          clearInterval(cycleIntervalRef.current);
          cycleIntervalRef.current = null;
        }

        const newActiveState = stateDataRef.current.find(state => state.STATEFP === clickedStateId);
        if (newActiveState) {
          setActiveState(newActiveState);
        }
      });
    };

    fetchStateData();
    return cleanup;
  }, []);

  // Update map when active state changes
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;

    map.current.setPaintProperty('state-active', 'fill-extrusion-height', [
      'case',
      ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
      500000,
      0
    ]);
  }, [activeState]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute right-4 top-20">
        <StateReportCard data={activeState} isVisible={!!activeState} />
      </div>
    </div>
  );
};

export default Map;