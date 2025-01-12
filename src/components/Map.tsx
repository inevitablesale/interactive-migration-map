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
  inactive: '#000000',   // Black
  msa: '#FA0098'        // MSA Color (Hot Pink)
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
  const [activeStates, setActiveStates] = useState<any[]>([]);
  const [activeState, setActiveState] = useState<any>(null);
  const statesWithDataRef = useRef<Set<string>>(new Set());
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastToastTimeRef = useRef<number>(0);
  const [showMSA, setShowMSA] = useState(false);
  const [activeStateFP, setActiveStateFP] = useState<string | null>(null);

  const updateActiveState = (state: any) => {
    if (mode === 'hero') {
      setActiveState(state);
      if (state) {
        const event = new CustomEvent('stateChanged', { detail: state });
        window.dispatchEvent(event);
      }
    } else {
      const currentTime = Date.now();
      if (currentTime - lastToastTimeRef.current > 5000) {
        const event = new CustomEvent('stateChanged', { detail: state });
        window.dispatchEvent(event);
        lastToastTimeRef.current = currentTime;
      }
      
      if (state) {
        setActiveStates(prev => {
          const exists = prev.some(s => s.STATEFP === state.STATEFP);
          if (exists) {
            return prev.filter(s => s.STATEFP !== state.STATEFP);
          }
          return [...prev, state];
        });
      }
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
    if (cycleIntervalRef.current || mode !== 'hero') return;
    
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
            MAP_COLORS.accent,
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

  const handleStateDoubleClick = async (stateId: string) => {
    if (mode !== 'analysis') return;
    
    setActiveStateFP(stateId);
    setShowMSA(true);

    if (map.current) {
      map.current.setLayoutProperty('msa-fills', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');

      const msaFilter = ['==', ['get', 'STATEFP'], stateId];
      map.current.setFilter('msa-fills', msaFilter);
      map.current.setFilter('msa-borders', msaFilter);

      // First get MSAs for the state
      const { data: msaData, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa')
        .eq('state_fips', stateId);

      if (msaError) {
        console.error('Error fetching MSA data:', msaError);
        return;
      }

      if (msaData && msaData.length > 0) {
        // Then get region data for those MSAs
        const msaList = msaData.map(m => m.msa);
        const { data: regionData, error: regionError } = await supabase
          .from('region_data')
          .select('*')
          .in('msa', msaList);

        if (regionError) {
          console.error('Error fetching region data:', regionError);
          return;
        }

        console.log('Region Data:', regionData);
      }
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

      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://inevitablesale.29jcxgnm'
      });

      // Base state layer with higher extrusion for hero mode
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': mode === 'hero' ? 100000 : 5000,
          'fill-extrusion-opacity': 0.6
        }
      });

      // Active state layer with even higher extrusion for hero mode
      map.current.addLayer({
        'id': 'state-highlight',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.accent,
          'fill-extrusion-height': mode === 'hero' ? 200000 : 50000,
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': mode === 'hero' ? 100000 : 5000
        },
        'filter': ['in', 'STATEFP', '']
      });

      // MSA layers (initially hidden)
      map.current.addLayer({
        'id': 'msa-fills',
        'type': 'fill',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'layout': {
          'visibility': 'none'
        },
        'paint': {
          'fill-color': MAP_COLORS.msa,
          'fill-opacity': 0.3
        }
      });

      map.current.addLayer({
        'id': 'msa-borders',
        'type': 'line',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'layout': {
          'visibility': 'none'
        },
        'paint': {
          'line-color': MAP_COLORS.msa,
          'line-width': 1
        }
      });

      if (mode === 'hero') {
        startCyclingStates();
      }
    });

    if (mode === 'analysis') {
      map.current.on('dblclick', 'state-base', (e) => {
        if (!e.features?.[0]) return;
        
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          handleStateDoubleClick(stateId);
        }
      });

      map.current.on('click', 'state-base', (e) => {
        if (!e.features?.[0]) return;
        
        const stateId = e.features[0].properties?.STATEFP;
        const stateData = stateDataRef.current.find(state => state.STATEFP === stateId);
        
        if (stateData) {
          updateActiveState(stateData);
        }
      });

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
    if (mode === 'hero') {
      startCyclingStates();
    }
    return cleanup;
  }, [mode]);

  useEffect(() => {
    if (map.current && mapLoadedRef.current && mode === 'analysis') {
      map.current.setFilter('state-highlight', [
        'in',
        'STATEFP',
        ...activeStates.map(s => s.STATEFP)
      ]);
    }
  }, [activeStates, mode]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      {mode === 'hero' && <StateReportCard data={activeState} isVisible={!!activeState} />}
      {mode === 'analysis' && activeStates.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-2 rounded text-white text-sm">
          {activeStates.length} states selected
        </div>
      )}
    </div>
  );
};

export default Map;
