import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

interface StateData {
  STATEFP: string;
  EMP: number | null;
  PAYANN: number | null;
  ESTAB: number | null;
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [stateData, setStateData] = useState<StateData[]>([]);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const { data, error } = await supabase
          .from('state_data')
          .select('STATEFP, EMP, PAYANN, ESTAB')
          .not('EMP', 'is', null);

        if (error) {
          console.error('Error fetching state data:', error);
          return;
        }

        setStateData(data || []);
      } catch (err) {
        console.error('Error in fetchStateData:', err);
      }
    };

    fetchStateData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 3,
        center: [-95.7129, 37.0902],
        pitch: 45,
      });

      mapInstance.current = map;

      map.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      const handleStyleLoad = () => {
        if (!map || map._removed) return;

        // Add the custom tileset source
        map.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        // Calculate min and max values for normalization
        const empValues = stateData.map(d => d.EMP).filter((v): v is number => v != null);
        const payannValues = stateData.map(d => d.PAYANN).filter((v): v is number => v != null);
        const estabValues = stateData.map(d => d.ESTAB).filter((v): v is number => v != null);

        const minEmp = Math.min(...empValues);
        const maxEmp = Math.max(...empValues);
        const minPayann = Math.min(...payannValues);
        const maxPayann = Math.max(...payannValues);
        const minEstab = Math.min(...estabValues);
        const maxEstab = Math.max(...estabValues);

        // Add the fill layer for states
        map.addLayer({
          'id': 'state-fills',
          'type': 'fill',
          'source': 'states',
          'source-layer': 'STATEFP', // Updated to match the correct source layer
          'paint': {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'score'],
              0, '#f7fbff',
              0.2, '#deebf7',
              0.4, '#c6dbef',
              0.6, '#9ecae1',
              0.8, '#6baed6',
              1, '#2171b5'
            ],
            'fill-opacity': 0.8
          }
        });

        // Add state border lines
        map.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'source-layer': 'STATEFP', // Updated to match the correct source layer
          'paint': {
            'line-color': '#627BC1',
            'line-width': 1
          }
        });

        // Set feature states for the score calculations
        stateData.forEach(state => {
          if (!state.STATEFP || !state.EMP || !state.PAYANN || !state.ESTAB) return;

          const normalizedEmp = (state.EMP - minEmp) / (maxEmp - minEmp);
          const normalizedPayann = (state.PAYANN - minPayann) / (maxPayann - minPayann);
          const normalizedEstab = (state.ESTAB - minEstab) / (maxEstab - minEstab);

          const compositeScore = (
            (normalizedEmp * 0.4) + 
            (normalizedPayann * 0.4) + 
            (normalizedEstab * 0.2)
          );

          map.setFeatureState(
            {
              source: 'states',
              sourceLayer: 'STATEFP',
              id: state.STATEFP
            },
            {
              score: compositeScore
            }
          );
        });
      };

      map.on('style.load', handleStyleLoad);

      return () => {
        map.off('style.load', handleStyleLoad);
        if (map && !map._removed) {
          map.remove();
          mapInstance.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [stateData]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" style={{ zIndex: 0 }} />
    </div>
  );
};

export default Map;