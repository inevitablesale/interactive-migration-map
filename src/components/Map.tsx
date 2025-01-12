import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import StateReportCard from './StateReportCard';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

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
  const currentStateIndex = useRef(0);
  const previousStateId = useRef<string | null>(null);
  const isAnimating = useRef(false);
  const animationTimeoutRef = useRef<number | null>(null);
  const mapLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  const [activeState, setActiveState] = useState<StateData | null>(null);

  const cleanup = () => {
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    mapLoadedRef.current = false;
    mapInitializedRef.current = false;
    isAnimating.current = false;
    previousStateId.current = null;
    currentStateIndex.current = 0;
    setActiveState(null);
  };

  const zoomToState = async (stateId: string) => {
    if (!map.current || !mapLoadedRef.current) return;

    try {
      const features = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], stateId]
      });

      if (features.length > 0 && features[0].geometry) {
        const bounds = new mapboxgl.LngLatBounds();
        
        if (features[0].geometry.type === 'Polygon') {
          features[0].geometry.coordinates[0].forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
        } else if (features[0].geometry.type === 'MultiPolygon') {
          features[0].geometry.coordinates.forEach((poly: [number, number][][]) => {
            poly[0].forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
          });
        }

        await map.current.fitBounds(bounds, {
          padding: { top: 150, bottom: 150, left: 300, right: 300 },
          duration: 1500,
          pitch: 45,
          bearing: 0,
          maxZoom: 4.8
        });
      }
    } catch (err) {
      console.error('Error zooming to state:', err);
    }
  };

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const { data, error } = await supabase
          .from('state_data')
          .select('STATEFP, EMP, PAYANN, ESTAB, B19013_001E, B23025_004E, B25077_001E')
          .not('EMP', 'is', null);

        if (error) {
          console.error('Error fetching state data:', error);
          return;
        }

        stateDataRef.current = data || [];
      } catch (err) {
        console.error('Error in fetchStateData:', err);
      }
    };

    const initializeMap = () => {
      if (!mapContainer.current || map.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: 3,
        center: [-95.7129, 37.0902],
        pitch: 45,
        interactive: true,
      });

      map.current = newMap;

      newMap.on('style.load', () => {
        mapLoadedRef.current = true;

        newMap.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        // Calculate scores for various metrics
        const calculateMetricScores = () => {
          const metrics = {
            emp: stateDataRef.current.map(d => d.EMP).filter((v): v is number => v != null),
            payann: stateDataRef.current.map(d => d.PAYANN).filter((v): v is number => v != null),
            estab: stateDataRef.current.map(d => d.ESTAB).filter((v): v is number => v != null),
            income: stateDataRef.current.map(d => d.B19013_001E).filter((v): v is number => v != null),
            employment: stateDataRef.current.map(d => d.B23025_004E).filter((v): v is number => v != null),
            homeValue: stateDataRef.current.map(d => d.B25077_001E).filter((v): v is number => v != null),
          };

          const ranges = {
            emp: { min: Math.min(...metrics.emp), max: Math.max(...metrics.emp) },
            payann: { min: Math.min(...metrics.payann), max: Math.max(...metrics.payann) },
            estab: { min: Math.min(...metrics.estab), max: Math.max(...metrics.estab) },
            income: { min: Math.min(...metrics.income), max: Math.max(...metrics.income) },
            employment: { min: Math.min(...metrics.employment), max: Math.max(...metrics.employment) },
            homeValue: { min: Math.min(...metrics.homeValue), max: Math.max(...metrics.homeValue) },
          };

          return { metrics, ranges };
        };

        const { ranges } = calculateMetricScores();

        newMap.addLayer({
          'id': 'state-extrusions',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['coalesce', ['feature-state', 'score'], 0],
              0, '#FF6B6B',
              0.2, '#FFB347',
              0.4, '#48D1CC',
              0.6, '#4682B4',
              0.8, '#9370DB',
              1, '#FF69B4'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['coalesce', ['feature-state', 'height'], 0],
              0, 0,
              1, 500000
            ],
            'fill-extrusion-opacity': 1
          }
        });

        newMap.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'line-color': '#D6BCFA',
            'line-width': 1
          }
        });

        const animateNextState = async () => {
          if (!mapLoadedRef.current || isAnimating.current) return;
          
          try {
            isAnimating.current = true;
            
            if (previousStateId.current && map.current) {
              map.current.setFeatureState(
                {
                  source: 'states',
                  sourceLayer: 'tl_2020_us_state-52k5uw',
                  id: previousStateId.current
                },
                {
                  score: 0,
                  height: 0
                }
              );
            }

            setActiveState(null);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const state = stateDataRef.current[currentStateIndex.current];
            if (!state?.STATEFP) {
              isAnimating.current = false;
              return;
            }

            const normalizeValue = (value: number | null, min: number, max: number) => {
              if (value === null) return 0;
              return (value - min) / (max - min) + (Math.random() * 0.01);
            };

            const growthScore = (
              normalizeValue(state.EMP, ranges.emp.min, ranges.emp.max) * 0.2 +
              normalizeValue(state.PAYANN, ranges.payann.min, ranges.payann.max) * 0.2 +
              normalizeValue(state.ESTAB, ranges.estab.min, ranges.estab.max) * 0.15 +
              normalizeValue(state.B19013_001E, ranges.income.min, ranges.income.max) * 0.15 +
              normalizeValue(state.B23025_004E, ranges.employment.min, ranges.employment.max) * 0.15 +
              normalizeValue(state.B25077_001E, ranges.homeValue.min, ranges.homeValue.max) * 0.15
            );

            if (map.current) {
              map.current.setFeatureState(
                {
                  source: 'states',
                  sourceLayer: 'tl_2020_us_state-52k5uw',
                  id: state.STATEFP
                },
                {
                  score: growthScore,
                  height: 1
                }
              );
            }

            setActiveState(state);
            await zoomToState(state.STATEFP);

            previousStateId.current = state.STATEFP;
            currentStateIndex.current = (currentStateIndex.current + 1) % stateDataRef.current.length;

            await new Promise(resolve => setTimeout(resolve, 5000));
          } finally {
            isAnimating.current = false;
            if (mapLoadedRef.current) {
              animationTimeoutRef.current = window.setTimeout(animateNextState, 1000);
            }
          }
        };

        fetchStateData().then(() => {
          if (mapLoadedRef.current) {
            animateNextState();
          }
        });
      });
    };

    initializeMap();

    return cleanup;
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      <StateReportCard data={activeState} isVisible={!!activeState} />
    </div>
  );
};

export default Map;