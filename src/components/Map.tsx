import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from '@/components/ui/use-toast';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 3,
        center: [-95.7129, 37.0902], // Center on US
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        if (!map.current) return;
        
        map.current.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });

        // Add heatmap layer for migration flows
        map.current.addSource('migration', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [] // We'll add real data here later
          }
        });

        map.current.addLayer({
          id: 'migration-heat',
          type: 'heatmap',
          source: 'migration',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'rgb(103, 169, 207)',
              0.4, 'rgb(209, 229, 240)',
              0.6, 'rgb(253, 219, 199)',
              0.8, 'rgb(239, 138, 98)',
              1, 'rgb(178, 24, 43)'
            ],
            'heatmap-radius': 30
          }
        });

        toast({
          title: "Map loaded successfully",
          description: "Try zooming and panning to explore the data",
        });
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error loading map",
        description: "Please check your Mapbox token and try again",
        variant: "destructive",
      });
    }
  }, [mapboxToken, toast]);

  return (
    <div className="relative w-full h-screen">
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Enter your Mapbox token</h2>
            <p className="text-sm text-gray-600 mb-4">
              To use this map, you need a Mapbox public token. Get one at{' '}
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <input
              type="text"
              placeholder="pk.eyJ1..."
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;