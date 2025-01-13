import React, { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon } from 'lucide-react';
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MAP_COLORS } from '@/constants/colors';
import { supabase } from "@/integrations/supabase/client";
import { MapReportPanel } from './MapReportPanel';
import { formatNumber } from '@/utils/heatmapUtils';
import { GeographicLevel } from "@/types/geography";

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'migration';
  geographicLevel: GeographicLevel;
}

const AnalysisMap = ({ className, data, type, geographicLevel }: AnalysisMapProps) => {
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [hoveredState, setHoveredState] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [stateData, setStateData] = useState<any[]>([]);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const fetchStateData = useCallback(async () => {
    try {
      const { data: densityMetrics, error } = await supabase
        .rpc('get_firm_density_metrics');

      if (error) {
        console.error('Error fetching state data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch state data",
          variant: "destructive",
        });
        return;
      }

      setStateData(densityMetrics);
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [toast]);

  useEffect(() => {
    if (!mapContainer || map) return;

    try {
      mapboxgl.accessToken = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";
      
      const newMap = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: 3,
        center: [-98.5795, 39.8283],
        pitch: 45,
        bearing: 0,
        interactive: true,
      });

      newMap.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      newMap.on('style.load', () => {
        setMapLoaded(true);
        if (!newMap) return;

        newMap.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        newMap.addLayer({
          'id': 'state-base',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'firm_density'], 0],
              0, MAP_COLORS.primary,
              50, MAP_COLORS.secondary,
              100, MAP_COLORS.accent
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'firm_density'], 0],
              0, 20000,
              100, 200000
            ],
            'fill-extrusion-opacity': 0.8,
            'fill-extrusion-base': 0
          }
        });

        // Add borders layer
        newMap.addLayer({
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

        // Add click event
        newMap.on('click', 'state-base', (e) => {
          if (e.features && e.features[0]) {
            setSelectedState(e.features[0].properties);
            setShowReportPanel(true);
          }
        });

        // Add hover events
        newMap.on('mousemove', 'state-base', (e) => {
          if (e.features && e.features.length > 0) {
            setHoveredState(e.features[0].properties);
            setTooltipPosition({ x: e.point.x, y: e.point.y });
          }
        });

        newMap.on('mouseleave', 'state-base', () => {
          setHoveredState(null);
        });

        fetchStateData();
      });

      setMap(newMap);

      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  }, [fetchStateData]);

  useEffect(() => {
    if (!map || !mapLoaded || !stateData.length) return;

    try {
      // Update the state colors based on firm density
      map.setPaintProperty('state-base', 'fill-extrusion-color', [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', 'firm_density'], 0],
        0, MAP_COLORS.primary,
        50, MAP_COLORS.secondary,
        100, MAP_COLORS.accent
      ]);
    } catch (error) {
      console.error('Error updating map colors:', error);
    }
  }, [stateData, mapLoaded]);

  return (
    <div className="w-full h-full">
      <div ref={setMapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      {showReportPanel && selectedState && (
        <MapReportPanel
          selectedState={selectedState}
          onClose={() => setShowReportPanel(false)}
        />
      )}
      {hoveredState && (
        <div
          className="absolute pointer-events-none bg-black/80 text-white p-2 rounded"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <p className="font-semibold">{hoveredState.name}</p>
          <p className="text-sm">Firm Density: {formatNumber(hoveredState.firm_density || 0)}</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisMap;