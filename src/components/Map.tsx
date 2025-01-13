import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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

const STATE_COLORS = [
  '#037CFE',
  '#00FFE0',
  '#FFF903',
  '#94EC0E',
  '#FA0098',
  '#9D00FF',
  '#FF3366',
  '#00FF66',
];

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
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  const getStateColor = useCallback((stateId: string) => {
    const colorIndex = parseInt(stateId) % STATE_COLORS.length;
    return STATE_COLORS[colorIndex];
  }, []);

  const updateActiveState = useCallback((state: StateData | null) => {
    if (!state) return;
    
    try {
      const eventData = {
        STATEFP: state.STATEFP,
        EMP: state.EMP ? Number(state.EMP) : null,
        PAYANN: state.PAYANN ? Number(state.PAYANN) : null,
        ESTAB: state.ESTAB ? Number(state.ESTAB) : null,
        B19013_001E: state.B19013_001E ? Number(state.B19013_001E) : null,
        B23025_004E: state.B23025_004E ? Number(state.B23025_004E) : null,
        B25077_001E: state.B25077_001E ? Number(state.B25077_001E) : null
      };
      
      const event = new CustomEvent('stateChanged', { 
        detail: eventData
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error dispatching state change event:', error);
    }
  }, []);

  // Move state update to useEffect
  useEffect(() => {
    if (activeState) {
      updateActiveState(activeState);
    }
  }, [activeState, updateActiveState]);

  const flyToState = useCallback((stateId: string) => {
    if (!map.current) return;
    
    const stateFeatures = map.current.querySourceFeatures('states', {
      sourceLayer: 'tl_2020_us_state-52k5uw',
      filter: ['==', ['get', 'STATEFP'], stateId]
    });

    if (stateFeatures.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      const geometry = stateFeatures[0].geometry as GeoJSON.Polygon;
      const coordinates = geometry.coordinates[0];
      coordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });

      map.current.easeTo({
        center: bounds.getCenter(),
        pitch: 45,
        bearing: Math.random() * 90 - 45,
        duration: 2000
      });
    }
  }, []);

  const startCyclingStates = useCallback(() => {
    const interval = setInterval(() => {
      if (stateData.length === 0 || !mapLoaded) return;
      
      setCurrentStateIndex(prev => {
        const nextIndex = (prev + 1) % stateData.length;
        const nextState = stateData[nextIndex];
        
        if (nextState && nextState.STATEFP) {
          setActiveState(nextState);
          flyToState(nextState.STATEFP);
          
          if (map.current) {
            map.current.setPaintProperty('state-active', 'fill-extrusion-color', [
              'case',
              ['==', ['get', 'STATEFP'], nextState.STATEFP],
              getStateColor(nextState.STATEFP),
              'transparent'
            ]);
          }
        }
        return nextIndex;
      });
    }, 5000);

    return interval;
  }, [stateData, mapLoaded, flyToState, getStateColor]);

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

      const serializedData = JSON.parse(JSON.stringify(data || []));
      setStateData(serializedData);

      if (serializedData.length > 0) {
        updateActiveState(serializedData[0]);
        if (mapLoaded) {
          flyToState(serializedData[0].STATEFP);
        }
      }
    } catch (err) {
      console.error('Error in fetchStateData:', err);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

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

    const isHeroSection = document.querySelector('.hero-section');
    if (!isHeroSection) {
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
    }

    map.current.on('style.load', () => {
      if (!map.current) return;
      setMapLoaded(true);

      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

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

      map.current.addLayer({
        'id': 'state-active',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': [
            'case',
            ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
            getStateColor(activeState?.STATEFP || '0'),
            'transparent'
          ],
          'fill-extrusion-height': [
            'case',
            ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
            100000,
            0
          ],
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': 10000
        }
      });

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

      // Start cycling immediately after map is loaded
      fetchStateData();
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (stateData.length > 0 && mapLoaded) {
      interval = startCyclingStates();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [stateData, mapLoaded, startCyclingStates]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !activeState?.STATEFP) return;

    map.current.setPaintProperty('state-active', 'fill-extrusion-height', [
      'case',
      ['==', ['get', 'STATEFP'], activeState.STATEFP],
      100000,
      0
    ]);

    map.current.setPaintProperty('state-active', 'fill-extrusion-color', [
      'case',
      ['==', ['get', 'STATEFP'], activeState.STATEFP],
      getStateColor(activeState.STATEFP),
      'transparent'
    ]);
  }, [activeState, getStateColor]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default Map;
