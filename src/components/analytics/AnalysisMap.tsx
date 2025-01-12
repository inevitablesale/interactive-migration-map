import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
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
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 2.5,
      center: [-98.5795, 39.8283],
      pitch: 60,
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
          'fill-extrusion-height': 15000,
          'fill-extrusion-opacity': 0.6
        }
      });

      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://inevitablesale.29jcxgnm'
      });

      map.current.addLayer({
        'id': 'msa-base',
        'type': 'fill-extrusion',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.secondary,
          'fill-extrusion-height': 150000,
          'fill-extrusion-opacity': 0.9,
          'fill-extrusion-base': 15000
        },
        'layout': {
          'visibility': 'none'
        },
        'filter': ['==', 'state_fips', '']
      });

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
          'line-width': 2,
          'line-opacity': 1
        },
        'layout': {
          'visibility': 'none'
        },
        'filter': ['==', 'state_fips', '']
      });

      // Add click event for states
      map.current.on('click', 'state-base', (e) => {
        if (!e.features?.[0] || !map.current) return;
        
        const feature = e.features[0];
        const stateFips = feature.properties?.STATEFP;
        
        if (!stateFips) return;

        setSelectedState(stateFips);
        setViewMode('msa');

        // Update MSA filters
        map.current.setFilter('msa-base', ['==', 'state_fips', stateFips]);
        map.current.setFilter('msa-borders', ['==', 'state_fips', stateFips]);

        // Show MSA layers
        map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
        map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');

        // Zoom to state bounds
        const bounds = new mapboxgl.LngLatBounds();
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((coord: number[]) => {
          bounds.extend(coord as [number, number]);
        });

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    if (viewMode === 'state') {
      setSelectedState(null);
      map.current.setLayoutProperty('msa-base', 'visibility', 'none');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'none');
      
      map.current.easeTo({
        pitch: 45,
        zoom: 2.5,
        duration: 1000
      });
    }
  }, [viewMode]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'state' | 'msa')}>
          <ToggleGroupItem value="state" aria-label="Toggle state view">
            <MapIcon className="h-4 w-4" />
            <span className="ml-2">States</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="msa" aria-label="Toggle MSA view" disabled={!selectedState}>
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