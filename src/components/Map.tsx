import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [companyData, setCompanyData] = useState<any[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchCompanyData = async () => {
      const { data, error } = await supabase
        .from('company_data')
        .select('latitude, longitude, "Company Name", employeeCount')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('employeeCount', { ascending: false });

      if (error) {
        console.error('Error fetching company data:', error);
        return;
      }

      setCompanyData(data || []);
    };

    fetchCompanyData();
  }, []);

  const animateToNextLocation = (locations: any[], currentIndex: number) => {
    if (!map.current || !locations.length) return;

    const nextIndex = (currentIndex + 1) % locations.length;
    const nextLocation = locations[nextIndex];

    map.current.easeTo({
      center: [nextLocation.longitude, nextLocation.latitude],
      zoom: 8,
      duration: 2000,
      pitch: 45,
      bearing: Math.random() * 180 - 90,
      essential: true
    });

    // Schedule next animation
    animationRef.current = window.setTimeout(() => {
      animateToNextLocation(locations, nextIndex);
    }, 2000);
  };

  useEffect(() => {
    if (!mapContainer.current || !companyData.length) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 3,
        center: [-95.7129, 37.0902],
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
          color: 'rgb(0, 0, 0)',
          'high-color': 'rgb(30, 30, 50)',
          'horizon-blend': 0.2,
        });

        // Add heatmap layer for company locations
        map.current.addSource('companies', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: companyData.map(company => ({
              type: 'Feature',
              properties: {
                name: company['Company Name'],
                employeeCount: company.employeeCount,
              },
              geometry: {
                type: 'Point',
                coordinates: [company.longitude, company.latitude]
              }
            }))
          }
        });

        map.current.addLayer({
          id: 'companies-heat',
          type: 'heatmap',
          source: 'companies',
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'employeeCount'],
              0, 0,
              100, 0.5,
              1000, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'rgb(0, 179, 255)',
              0.4, 'rgb(0, 255, 255)',
              0.6, 'rgb(0, 255, 179)',
              0.8, 'rgb(0, 255, 0)',
              1, 'rgb(179, 255, 0)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20
            ],
            'heatmap-opacity': 0.8
          }
        });

        // Start the location animation
        const densestLocations = companyData
          .filter(company => company.employeeCount > 1000)
          .slice(0, 20); // Take top 20 densest locations
        
        if (densestLocations.length > 0) {
          animateToNextLocation(densestLocations, -1);
        }
      });

      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [companyData]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" style={{ zIndex: 0 }} />
    </div>
  );
};

export default Map;