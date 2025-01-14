import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { getStateName } from '@/utils/stateUtils';
import { MAP_COLORS, STATE_COLORS } from '@/constants/colors';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

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

  const getFirmDensityColor = useCallback((density: number) => {
    if (density >= 6.5) return MAP_COLORS.primary;     // Very high density
    if (density >= 5.5) return MAP_COLORS.secondary;   // High density
    if (density >= 4.5) return MAP_COLORS.accent;      // Medium-high density
    if (density >= 3.5) return MAP_COLORS.highlight;   // Medium density
    return MAP_COLORS.active;                          // Lower density
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 3,
      center: [-98.5795, 39.8283],
      pitch: 45,
      bearing: -10,
      antialias: true
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

      // Add atmosphere and fog effects
      map.current.setFog({
        'color': 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });

      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      // Add base layer with 3D extrusion
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': 0,
          'fill-extrusion-vertical-gradient': true
        }
      });

      // Add active state layer with enhanced 3D effect
      map.current.addLayer({
        'id': 'state-active',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': [
            'case',
            ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
            activeState?.firmDensity ? getFirmDensityColor(activeState.firmDensity) : STATE_COLORS[0],
            'transparent'
          ],
          'fill-extrusion-height': [
            'case',
            ['==', ['get', 'STATEFP'], activeState?.STATEFP || ''],
            100000,
            0
          ],
          'fill-extrusion-opacity': 0.9,
          'fill-extrusion-base': 20000,
          'fill-extrusion-vertical-gradient': true
        }
      });

      // Add glowing borders
      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': MAP_COLORS.primary,
          'line-width': 1.5,
          'line-opacity': 0.8,
          'line-blur': 1
        }
      });

      fetchStateData();
    });

    // Add smooth rotation animation
    let rotateCamera = true;
    const rotateMap = () => {
      if (!map.current || !rotateCamera) return;
      
      const rotation = map.current.getBearing();
      map.current.easeTo({
        bearing: rotation + 0.5,
        duration: 100,
        easing: (t) => t
      });
      requestAnimationFrame(rotateMap);
    };

    map.current.on('mousedown', () => {
      rotateCamera = false;
    });

    map.current.on('mouseup', () => {
      rotateCamera = true;
      rotateMap();
    });

    rotateMap();

    return () => {
      rotateCamera = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

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
      getFirmDensityColor(activeState.firmDensity || 0),
      'transparent'
    ]);
  }, [activeState, getFirmDensityColor]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/40" />
      
      {/* Legend with updated styling */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-lg p-4 rounded-xl border border-white/10">
        <h3 className="text-white text-sm font-medium mb-2">Firm Density</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MAP_COLORS.primary }} />
            <span className="text-white text-xs">Very High (6.5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MAP_COLORS.secondary }} />
            <span className="text-white text-xs">High (5.5-6.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MAP_COLORS.accent }} />
            <span className="text-white text-xs">Medium-High (4.5-5.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MAP_COLORS.highlight }} />
            <span className="text-white text-xs">Medium (3.5-4.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MAP_COLORS.active }} />
            <span className="text-white text-xs">Lower (&lt;3.5)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
