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
      try {
        const { data, error } = await supabase
          .from('canary_firms_data')
          .select('latitude, longitude, "Company Name", employeeCount, STATE')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .order('employeeCount', { ascending: false });

        if (error) {
          console.error('Error fetching company data:', error);
          return;
        }

        setCompanyData(data || []);
      } catch (err) {
        console.error('Error in fetchCompanyData:', err);
      }
    };

    fetchCompanyData();

    return () => {
      if (animationRef.current) {
        window.clearTimeout(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !companyData.length || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Using a default Mapbox style instead of custom style
        projection: 'globe',
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

      mapInstance.on('style.load', () => {
        if (!mapInstance || mapInstance._removed) return;
        
        mapInstance.setFog({
          color: 'rgb(0, 0, 0)',
          'high-color': 'rgb(30, 30, 50)',
          'horizon-blend': 0.2,
        });

        // Add source with clustering enabled
        mapInstance.addSource('companies', {
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

        // Add heatmap layer
        mapInstance.addLayer({
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
              0, 2,
              9, 4
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
              0, 4,
              9, 30
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              6, 1,
              9, 0
            ]
          }
        });

        // Add clusters layer
        mapInstance.addLayer({
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
            ],
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 0,
              9, 1
            ]
          }
        });

        // Add cluster count labels
        mapInstance.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'companies',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          paint: {
            'text-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 0,
              9, 1
            ]
          }
        });

        // Add unclustered point layer
        mapInstance.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'companies',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 0,
              9, 1
            ]
          }
        });

        // Add click events for clusters
        mapInstance.on('click', 'clusters', (e) => {
          if (!mapInstance) return;
          const features = mapInstance.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          if (!features.length) return;
          
          const clusterId = features[0].properties?.cluster_id;
          const source = mapInstance.getSource('companies');
          
          if (clusterId && 'getClusterExpansionZoom' in source) {
            (source as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
              if (err) return;
              mapInstance?.easeTo({
                center: (features[0].geometry as any).coordinates,
                zoom: zoom
              });
            });
          }
        });

        // Change cursor on hover
        mapInstance.on('mouseenter', 'clusters', () => {
          if (mapInstance) mapInstance.getCanvas().style.cursor = 'pointer';
        });
        mapInstance.on('mouseleave', 'clusters', () => {
          if (mapInstance) mapInstance.getCanvas().style.cursor = '';
        });
      });

      return () => {
        if (mapInstance && !mapInstance._removed) {
          mapInstance.remove();
        }
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