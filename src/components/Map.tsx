import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { getStateName } from '@/utils/stateUtils';

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
  displayName?: string;
  firmDensity?: number;
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

  const getFirmDensityColor = useCallback((density: number) => {
    if (density >= 80) return '#037CFE';  // High density - blue
    if (density >= 60) return '#00FFE0';  // Good density - cyan
    if (density >= 40) return '#FFF903';  // Medium density - yellow
    if (density >= 20) return '#94EC0E';  // Low-medium density - green
    return '#FA0098';                     // Low density - pink
  }, []);

  const updateActiveState = useCallback(async (state: StateData | null) => {
    if (!state) return;
    
    try {
      const stateName = await getStateName(state.STATEFP);
      const stateWithName = {
        ...state,
        displayName: stateName
      };
      
      setActiveState(stateWithName);
      
      // Create a simplified event payload with only necessary data
      const eventData = {
        STATEFP: state.STATEFP,
        displayName: stateName,
        firmDensity: state.firmDensity,
        EMP: state.EMP,
        PAYANN: state.PAYANN,
        ESTAB: state.ESTAB
      };
      
      // Ensure the data is cloneable by stringifying and parsing
      const event = new CustomEvent('stateChanged', { 
        detail: JSON.parse(JSON.stringify(eventData))
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error dispatching state change event:', error);
    }
  }, []);

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
          updateActiveState(nextState);
          flyToState(nextState.STATEFP);
          
          if (map.current) {
            map.current.setPaintProperty('state-active', 'fill-extrusion-color', [
              'case',
              ['==', ['get', 'STATEFP'], nextState.STATEFP],
              nextState.firmDensity ? getFirmDensityColor(nextState.firmDensity) : getStateColor(nextState.STATEFP),
              'transparent'
            ]);
          }
        }
        return nextIndex;
      });
    }, 5000);

    return interval;
  }, [stateData, mapLoaded, updateActiveState, getStateColor, getFirmDensityColor]);

  const fetchStateData = async () => {
    try {
      const { data, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E, B01001_001E')
        .not('STATEFP', 'is', null)
        .not('ESTAB', 'is', null);

      if (error) {
        console.error('Error fetching state data:', error);
        return;
      }

      const statesWithDensity = data.map(state => ({
        ...state,
        firmDensity: state.ESTAB && state.B01001_001E ? 
          (state.ESTAB / state.B01001_001E) * 10000 : 0
      }));

      // Ensure the data is cloneable
      const serializedData = JSON.parse(JSON.stringify(statesWithDensity));
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
          'fill-extrusion-color': [
            'case',
            ['has', 'firmDensity'],
            ['interpolate', ['linear'], ['get', 'firmDensity'], 0, '#FA0098', 20, '#94EC0E', 40, '#FFF903', 60, '#00FFE0', 80, '#037CFE'],
            MAP_COLORS.inactive
          ],
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
            activeState?.firmDensity ? getFirmDensityColor(activeState.firmDensity) : getStateColor(activeState?.STATEFP || '0'),
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
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/60 p-4 rounded-lg">
        <h3 className="text-white text-sm font-medium mb-2">Firm Density</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#037CFE' }} />
            <span className="text-white text-xs">Very High (80+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00FFE0' }} />
            <span className="text-white text-xs">High (60-80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFF903' }} />
            <span className="text-white text-xs">Medium (40-60)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#94EC0E' }} />
            <span className="text-white text-xs">Low (20-40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FA0098' }} />
            <span className="text-white text-xs">Very Low (0-20)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;