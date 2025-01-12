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

interface MapProps {
  mode?: 'hero' | 'analysis';
}

const Map: React.FC<MapProps> = ({ mode = 'hero' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const stateDataRef = useRef<any[]>([]);
  const mapLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  const [activeState, setActiveState] = useState<any>(null);
  const statesWithDataRef = useRef<Set<string>>(new Set());
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getStateColor = (stateId: string) => {
    const colorIndex = parseInt(stateId) % STATE_COLORS.length;
    return STATE_COLORS[colorIndex];
  };

  const updateActiveState = (state: any) => {
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
    if (cycleIntervalRef.current || mode === 'analysis') return;
    
    cycleIntervalRef.current = setInterval(() => {
      if (stateDataRef.current.length === 0 || !mapLoadedRef.current) return;
      
      const nextState = stateDataRef.current[Math.floor(Math.random() * stateDataRef.current.length)];
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
      pitch: mode === 'hero' ? 45 : 0,
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
          'fill-extrusion-height': mode === 'hero' ? 10000 : 5000,
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
            mode === 'hero' ? 100000 : 50000,
            0
          ],
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': mode === 'hero' ? 10000 : 5000
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

      if (mode === 'hero') {
        startCyclingStates();
      }
    });

    if (mode === 'analysis') {
      map.current.on('click', 'state-base', (e) => {
        if (!e.features?.[0]) return;
        
        const stateId = e.features[0].properties?.STATEFP;
        const stateData = stateDataRef.current.find(state => state.STATEFP === stateId);
        
        if (stateData) {
          updateActiveState(stateData);
          flyToState(stateId);
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'state-base', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'state-base', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    }
  };

  useEffect(() => {
    fetchStateData();
    return cleanup;
  }, [mode]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      {mode === 'hero' && <StateReportCard data={activeState} isVisible={!!activeState} />}
    </div>
  );
};

export default Map;