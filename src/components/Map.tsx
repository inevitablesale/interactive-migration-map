<lov-code>
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import StateReportCard from './StateReportCard';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const COLORS = {
  primary: '#037CFE',    // Electric Blue
  secondary: '#00FFE0',  // Cyan
  accent: '#FFF903',     // Yellow
  highlight: '#94EC0E',  // Lime Green
  active: '#FA0098',     // Hot Pink
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

  const getStateColor = (index: number) => {
    const colors = Object.values(COLORS).filter(color => color !== COLORS.inactive);
    return colors[index % colors.length];
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
        pitch: 45, // Adjusted from 60 to 45 for less extreme angle
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
      
      if (nextState) {
        flyToState(nextState.STATEFP);
        
        if (map.current) {
          map.current.setPaintProperty('state-active', 'fill-extrusion-color', [
            'case',
            ['==', ['get', 'STATEFP'], nextState.STATEFP],
            getStateColor(currentStateIndexRef.current),
            'transparent'
          ]);
        }
      }
    }, 3000); // Changed to 3 seconds
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
                getStateColor(0),
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
      pitch: 45, // Adjusted from 60 to 45 for less extreme angle
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
        'source-layer': 'tl_2020_us_state-52