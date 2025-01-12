import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [mapLoaded, setMapLoaded] = useState(false);

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

      // Add state layer
      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      map.current.addLayer({
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

      // Add MSA layer (you'll need to add your MSA source and layer here)
      // This is a placeholder - you'll need to add the actual MSA data source
      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://your-msa-tileset-url'
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle view mode changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (viewMode === 'state') {
      map.current.setLayoutProperty('state-base', 'visibility', 'visible');
      // Hide MSA layer when implemented
    } else {
      map.current.setLayoutProperty('state-base', 'visibility', 'none');
      // Show MSA layer when implemented
    }
  }, [viewMode, mapLoaded]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'state' | 'msa')}>
          <ToggleGroupItem value="state" aria-label="Toggle state view">
            <MapIcon className="h-4 w-4" />
            <span className="ml-2">States</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="msa" aria-label="Toggle MSA view">
            <Building2 className="h-4 w-4" />
            <span className="ml-2">MSAs</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;