import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

interface DealMapProps {
  firms: any[];
}

export const DealMap: React.FC<DealMapProps> = ({ firms }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !firms.length) return;

    // Wait for the map style to load
    map.current.on('style.load', () => {
      // Add markers for each firm
      firms.forEach(firm => {
        if (!firm.latitude || !firm.longitude) return;

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${firm['Company Name']}</h3>
              <p class="text-sm">${firm.Location}</p>
              <p class="text-sm">${firm.employeeCount || 0} employees</p>
            </div>
          `);

        new mapboxgl.Marker({
          color: '#037CFE'
        })
          .setLngLat([firm.longitude, firm.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });
  }, [firms]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};