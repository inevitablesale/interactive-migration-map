import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [stateData, setStateData] = useState<any[]>([]);

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
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/inevitablesale/9fnr921z',
        zoom: 3,
        center: [-95.7129, 37.0902],
        pitch: 45,
      });

      map.current = mapInstance;

      mapInstance.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Wait for both style and state data to be loaded
      mapInstance.on('style.load', () => {
        if (!mapInstance || mapInstance._removed) return;

        // Calculate min and max values for normalization
        const empValues = stateData.map(d => d.EMP).filter(v => v != null);
        const payannValues = stateData.map(d => d.PAYANN).filter(v => v != null);
        const estabValues = stateData.map(d => d.ESTAB).filter(v => v != null);

        const minEmp = Math.min(...empValues);
        const maxEmp = Math.max(...empValues);
        const minPayann = Math.min(...payannValues);
        const maxPayann = Math.max(...payannValues);
        const minEstab = Math.min(...estabValues);
        const maxEstab = Math.max(...estabValues);

        // Normalize and set state colors based on economic indicators
        stateData.forEach(state => {
          if (!state.STATEFP) return;

          // Normalize values between 0 and 1
          const normalizedEmp = (state.EMP - minEmp) / (maxEmp - minEmp);
          const normalizedPayann = (state.PAYANN - minPayann) / (maxPayann - minPayann);
          const normalizedEstab = (state.ESTAB - minEstab) / (maxEstab - minEstab);

          // Calculate composite score (weighted average)
          const compositeScore = (
            (normalizedEmp * 0.4) + 
            (normalizedPayann * 0.4) + 
            (normalizedEstab * 0.2)
          );

          // Set the state's fill color based on the composite score
          mapInstance.setFeatureState(
            {
              source: 'composite',
              sourceLayer: 'state-fills',
              id: state.STATEFP
            },
            {
              score: compositeScore
            }
          );
        });
      });

      return () => {
        if (mapInstance && !mapInstance._removed) {
          mapInstance.remove();
          map.current = null;
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