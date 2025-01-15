import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

export function MarketOpportunityMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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

  useEffect(() => {
    if (!map.current || !soldFirms || !activeFirms) return;

    // Add sold firms layer
    map.current.addSource('sold-firms', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: soldFirms.map(firm => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [firm.Longitude, firm.Latitude]
          },
          properties: {
            type: 'sold',
            revenue: firm.annual_revenue,
            employees: firm.employee_count
          }
        }))
      }
    });

    // Add active firms layer
    map.current.addSource('active-firms', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: activeFirms.map(firm => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [firm.longitude, firm.latitude]
          },
          properties: {
            type: 'active',
            employees: firm.employeeCount
          }
        }))
      }
    });

    // Add heatmap layer for sold firms
    map.current.addLayer({
      id: 'sold-firms-heat',
      type: 'heatmap',
      source: 'sold-firms',
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'revenue'],
          0, 0,
          1000000, 1
        ],
        'heatmap-intensity': 1,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,255,0)',
          0.2, '#4575b4',
          0.4, '#74add1',
          0.6, '#abd9e9',
          0.8, '#e0f3f8',
          1, '#ffffbf'
        ],
        'heatmap-radius': 30
      }
    });
  }, [soldFirms, activeFirms]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}