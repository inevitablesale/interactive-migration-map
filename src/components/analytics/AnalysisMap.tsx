import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/components/ui/use-toast";
import { MAP_COLORS } from '@/constants/colors';
import { GeographicLevel } from "@/types/geography";

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'growth';
  geographicLevel: GeographicLevel;
}

const AnalysisMap = ({ className, type, geographicLevel }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";
      
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

      const currentMap = map.current;

      currentMap.on('style.load', () => {
        setMapLoaded(true);
        console.log('Map style loaded');
        
        if (!currentMap.getSource('states')) {
          currentMap.addSource('states', {
            type: 'vector',
            url: 'mapbox://inevitablesale.9fnr921z'
          });
        }

        if (!currentMap.getLayer('state-base')) {
          currentMap.addLayer({
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
        }
      });

      return () => {
        currentMap?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;