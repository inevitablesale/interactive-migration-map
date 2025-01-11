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
        .select('latitude, longitude, "Company Name", employeeCount, STATE')
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

        // Add clustered points source
        map.current.addSource('companies', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: companyData.map(company => ({
              type: 'Feature',
              properties: {
                name: company['Company Name'],
                employeeCount: company.employeeCount,
                state: company.STATE
              },
              geometry: {
                type: 'Point',
                coordinates: [company.longitude, company.latitude]
              }
            }))
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        // Add clusters layer
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'companies',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        });

        // Add cluster count labels
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'companies',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        // Add unclustered point layer
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'companies',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // Add heatmap layer
        map.current.addLayer({
          id: 'companies-heat',
          type: 'heatmap',
          source: 'companies',
          maxzoom: 15,
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
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              9, 0
            ]
          }
        });

        // Add click events for clusters
        map.current.on('click', 'clusters', (e) => {
          if (!map.current) return;
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          const clusterId = features[0].properties.cluster_id;
          map.current.getSource('companies').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;
              map.current?.easeTo({
                center: (features[0].geometry as any).coordinates,
                zoom: zoom
              });
            }
          );
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });

        // Start the location animation
        const densestLocations = companyData
          .filter(company => company.employeeCount > 1000)
          .slice(0, 20);
        
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