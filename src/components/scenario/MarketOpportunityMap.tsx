import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

interface Connection {
  from: [number, number];
  to: [number, number];
  strength: number;
}

export function MarketOpportunityMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  const { data: soldFirms } = useQuery({
    queryKey: ['soldFirmsData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sold_firms_data')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: activeFirms } = useQuery({
    queryKey: ['canaryFirmsData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Calculate connections between firms based on similarity
  useEffect(() => {
    if (!soldFirms || !activeFirms) return;

    const newConnections: Connection[] = [];
    
    soldFirms.forEach(soldFirm => {
      if (!soldFirm.Latitude || !soldFirm.Longitude) return;

      // Find the most similar active firms
      activeFirms.forEach(activeFirm => {
        if (!activeFirm.latitude || !activeFirm.longitude) return;

        // Calculate similarity score based on multiple factors
        const employeeSimilarity = Math.abs(
          (soldFirm.employee_count || 0) - (activeFirm.employeeCount || 0)
        ) / Math.max(soldFirm.employee_count || 1, activeFirm.employeeCount || 1);

        const distance = calculateDistance(
          soldFirm.Latitude,
          soldFirm.Longitude,
          activeFirm.latitude,
          activeFirm.longitude
        );

        // Only connect firms within reasonable distance and similarity
        if (distance < 100 && employeeSimilarity < 0.3) {
          newConnections.push({
            from: [soldFirm.Longitude, soldFirm.Latitude],
            to: [activeFirm.longitude, activeFirm.latitude],
            strength: 1 - (employeeSimilarity + (distance / 100)) / 2
          });
        }
      });
    });

    setConnections(newConnections);
  }, [soldFirms, activeFirms]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Draw connections when map is loaded and connections are calculated
  useEffect(() => {
    if (!map.current || !connections.length) return;

    map.current.on('load', () => {
      // Remove existing layers if they exist
      if (map.current?.getLayer('connections')) {
        map.current.removeLayer('connections');
      }
      if (map.current?.getSource('connections')) {
        map.current.removeSource('connections');
      }

      // Add connections as a new layer
      map.current?.addSource('connections', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: connections.map(conn => ({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [conn.from, conn.to]
            },
            properties: {
              strength: conn.strength
            }
          }))
        }
      });

      map.current?.addLayer({
        id: 'connections',
        type: 'line',
        source: 'connections',
        paint: {
          'line-color': [
            'interpolate',
            ['linear'],
            ['get', 'strength'],
            0, '#ff0000',
            0.5, '#ffff00',
            1, '#00ff00'
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['get', 'strength'],
            0, 1,
            1, 3
          ],
          'line-opacity': 0.6
        }
      });
    });
  }, [connections]);

  return (
    <Card className="p-4">
      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <div ref={mapContainer} className="h-full w-full" />
        <div className="absolute bottom-4 left-4 bg-black/80 p-2 rounded">
          <div className="flex items-center gap-2 text-xs text-white">
            <div className="w-4 h-0.5 bg-red-500" /> <span>Low Similarity</span>
            <div className="w-4 h-0.5 bg-yellow-500" /> <span>Medium</span>
            <div className="w-4 h-0.5 bg-green-500" /> <span>High Similarity</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}