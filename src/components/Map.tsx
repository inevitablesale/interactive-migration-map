import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import StateReportCard from './StateReportCard';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',    // Electric Blue
  secondary: '#00FFE0',  // Cyan
  accent: '#FFF903',     // Yellow
  highlight: '#94EC0E',  // Lime Green
  active: '#FA0098',     // Hot Pink
  inactive: '#000000'    // Black
};

const STATE_COLORS = [
  '#037CFE', // Electric Blue
  '#00FFE0', // Cyan
  '#FFF903', // Yellow
  '#94EC0E', // Lime Green
  '#FA0098', // Hot Pink
  '#9D00FF', // Electric Purple
  '#FF3366', // Electric Pink
  '#00FF66', // Electric Green
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
  const stateDataRef = useRef<StateData[]>([]);
  const mapLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const statesWithDataRef = useRef<Set<string>>(new Set());
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStateIndexRef = useRef(0);

  const getStateColor = (stateId: string) => {
    const colorIndex = parseInt(stateId) % STATE_COLORS.length;
    return STATE_COLORS[colorIndex];
  };

  const updateActiveState = (state: StateData | null) => {
    setActiveState(state);
    if (state) {
      const event = new CustomEvent('stateChanged', { detail: state });
      window.dispatchEvent(event);
    }
  };

  const flyToState = (stateId: string) => {
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
  };

  const startCyclingStates = () => {
    if (cycleIntervalRef.current) return;
    
    cycleIntervalRef.current = setInterval(() => {
      if (stateDataRef.current.length === 0 || !mapLoadedRef.current) return;
      
      currentStateIndexRef.current = (currentStateIndexRef.current + 1) % stateDataRef.current.length;
      const nextState = stateDataRef.current[currentStateIndexRef.current];
      updateActiveState(nextState);
      
      if (nextState && nextState.STATEFP) {
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
    }, 3000);
  };

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

      setTimeout(() => {
        if (data && data.length > 0) {
          updateActiveState(data[0]);
          if (mapLoadedRef.current) {
            flyToState(data[0].STATEFP);
            
            if (map.current) {
              map.current.setPaintProperty('state-active', 'fill-extrusion-color', [
                'case',
                ['==', ['get', 'STATEFP'], data[0].STATEFP],
                getStateColor(data[0].STATEFP),
                'transparent'
              ]);
            }
          }
        }
      }, 2000);

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
      mapLoadedRef.current = true;

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
    });
  };

  useEffect(() => {
    if (stateDataRef.current.length > 0 && mapLoadedRef.current && !cycleIntervalRef.current) {
      startCyclingStates();
    }
  }, [stateDataRef.current, mapLoadedRef.current]);

  useEffect(() => {
    fetchStateData();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoadedRef.current || !activeState?.STATEFP) return;

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
