import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { getStateName } from '@/utils/stateUtils';
import { MAP_COLORS, STATE_COLORS } from '@/constants/colors';

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

interface DensityMetric {
  STATEFP: string;
  density: number;
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const getFirmDensityColor = useCallback((density: number) => {
    if (density >= 6.5) return MAP_COLORS.primary;     // Very high density
    if (density >= 5.5) return MAP_COLORS.secondary;   // High density
    if (density >= 4.5) return MAP_COLORS.accent;      // Medium-high density
    if (density >= 3.5) return MAP_COLORS.highlight;   // Medium density
    return MAP_COLORS.active;                          // Lower density
  }, []);

  const fetchStateData = async () => {
    try {
      console.log('Fetching state data...');
      // First, get density metrics
      const { data: densityMetrics, error: densityError } = await supabase
        .from('state_density_metrics')
        .select('STATEFP, density')
        .not('STATEFP', 'is', null)
        .not('density', 'is', null);

      if (densityError) {
        console.error('Error fetching density metrics:', densityError);
        return;
      }

      // Then, get full state data
      const { data: fullStateData, error: stateError } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E')
        .in('STATEFP', densityMetrics.map(d => d.STATEFP));

      if (stateError) {
        console.error('Error fetching state data:', stateError);
        return;
      }

      // Combine the data
      const combinedData = await Promise.all(
        fullStateData.map(async (state) => {
          const densityMetric = densityMetrics.find(d => d.STATEFP === state.STATEFP);
          const stateName = await getStateName(state.STATEFP);
          return {
            ...state,
            displayName: stateName,
            firmDensity: densityMetric?.density || 0
          };
        })
      );

      console.log('Combined state data:', combinedData);
      setStateData(combinedData);
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 3,
      center: [-98.5795, 39.8283],
      pitch: 45,
      bearing: -10,
      antialias: true
    });

    map.current = mapInstance;

    const isHeroSection = document.querySelector('.hero-section');
    if (!isHeroSection) {
      mapInstance.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
    }

    mapInstance.on('style.load', () => {
      setMapLoaded(true);

      // Add atmosphere and fog effects
      mapInstance.setFog({
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

      // Add click handler to show state names
      map.current.on('click', 'state-base', async (e) => {
        if (e.features && e.features[0]) {
          const stateId = e.features[0].properties.STATEFP;
          const stateName = await getStateName(stateId);
          console.log(`Clicked state: ${stateName} (FIPS: ${stateId})`);
          
          // Update active state with name
          const stateInfo = stateData.find(s => s.STATEFP === stateId);
          if (stateInfo) {
            setActiveState({
              ...stateInfo,
              displayName: stateName
            });
          }
        }
      });

      fetchStateData();
    });

    // Add smooth rotation animation
    let rotateCamera = true;
    let animationFrameId: number;

    const rotateMap = () => {
      if (!mapInstance || !rotateCamera) return;
      
      const rotation = mapInstance.getBearing();
      mapInstance.easeTo({
        bearing: rotation + 0.5,
        duration: 100,
        easing: (t) => t
      });
      animationFrameId = requestAnimationFrame(rotateMap);
    };

    mapInstance.on('mousedown', () => {
      rotateCamera = false;
    });

    mapInstance.on('mouseup', () => {
      rotateCamera = true;
      rotateMap();
    });

    rotateMap();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mapInstance) {
        mapInstance.remove();
      }
      map.current = null;
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
      
      {/* Display active state name */}
      {activeState && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-lg p-4 rounded-xl border border-white/10">
          <h3 className="text-white text-lg font-medium">{activeState.displayName}</h3>
          {activeState.firmDensity && (
            <p className="text-white/80 text-sm">
              Firm Density: {activeState.firmDensity.toFixed(2)}
            </p>
          )}
        </div>
      )}
      
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
