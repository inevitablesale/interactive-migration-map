import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from 'lucide-react';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',
  secondary: '#00FFE0',
  accent: '#FFF903',
  highlight: '#94EC0E',
  active: '#FA0098',
  inactive: '#000000'
};

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showingMSAs, setShowingMSAs] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
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

    map.current.on('style.load', () => {
      if (!map.current) return;
      
      setMapLoaded(true);

      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://inevitablesale.29jcxgnm'
      });

      // Add state layer
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add MSA layer (initially hidden)
      map.current.addLayer({
        'id': 'msa-base',
        'type': 'fill-extrusion',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.secondary,
          'fill-extrusion-height': 50000,
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': 0
        },
        'layout': {
          'visibility': 'none'
        }
      });

      // Add borders
      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': MAP_COLORS.primary,
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      map.current.addLayer({
        'id': 'msa-borders',
        'type': 'line',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'line-color': MAP_COLORS.secondary,
          'line-width': 1.5,
          'line-opacity': 0.8
        },
        'layout': {
          'visibility': 'none'
        }
      });

      // Add click event for state selection
      map.current.on('click', 'state-base', (e) => {
        if (!showingMSAs && e.features && e.features[0]) {
          const stateId = e.features[0].properties?.STATEFP;
          if (stateId) {
            const event = new CustomEvent('stateSelected', { 
              detail: { stateId }
            });
            window.dispatchEvent(event);

            map.current?.setPaintProperty('state-base', 'fill-extrusion-color', [
              'match',
              ['get', 'STATEFP'],
              stateId,
              MAP_COLORS.accent,
              MAP_COLORS.inactive
            ]);
          }
        }
      });

      // Add double click event for MSA view
      map.current.on('dblclick', 'state-base', (e) => {
        if (e.features && e.features[0]) {
          const stateId = e.features[0].properties?.STATEFP;
          if (stateId) {
            setShowingMSAs(true);
            
            // Hide state layers
            map.current?.setLayoutProperty('state-base', 'visibility', 'none');
            map.current?.setLayoutProperty('state-borders', 'visibility', 'none');
            
            // Show and filter MSA layers
            map.current?.setLayoutProperty('msa-base', 'visibility', 'visible');
            map.current?.setLayoutProperty('msa-borders', 'visibility', 'visible');
            map.current?.setFilter('msa-base', ['==', ['get', 'STATEFP'], stateId]);
            map.current?.setFilter('msa-borders', ['==', ['get', 'STATEFP'], stateId]);
            
            map.current?.easeTo({
              pitch: 60,
              zoom: 5,
              duration: 1000
            });
          }
        }
      });

      // Add double click on MSA layer to return to state view
      map.current.on('dblclick', 'msa-base', () => {
        setShowingMSAs(false);
        
        // Show state layers
        map.current?.setLayoutProperty('state-base', 'visibility', 'visible');
        map.current?.setLayoutProperty('state-borders', 'visibility', 'visible');
        
        // Hide MSA layers
        map.current?.setLayoutProperty('msa-base', 'visibility', 'none');
        map.current?.setLayoutProperty('msa-borders', 'visibility', 'none');
        
        // Clear filters
        map.current?.setFilter('msa-base', null);
        map.current?.setFilter('msa-borders', null);
        
        map.current?.easeTo({
          pitch: 45,
          zoom: 3,
          duration: 1000
        });
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [showingMSAs]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="sm">
          <MapIcon className="h-4 w-4 mr-2" />
          States
        </Button>
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;