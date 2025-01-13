import React, { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2, LineChart } from 'lucide-react';
import { useSearchParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapLayers } from '@/hooks/useMapLayers';
import { useMSAData } from '@/hooks/useMSAData';
import { MAP_COLORS } from '@/constants/colors';
import { supabase } from "@/integrations/supabase/client";
import { MapReportPanel } from './MapReportPanel';
import { getDensityColor, formatNumber } from '@/utils/heatmapUtils';
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
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');
  const { mapContainer, map, mapLoaded, setMapLoaded } = useMapInitialization();
  const { layersAdded, setLayersAdded, initializeLayers } = useMapLayers(map);
  const { msaData, setMsaData, statesWithMSA, setStatesWithMSA, fetchMSAData, fetchStatesWithMSA } = useMSAData();

  const fetchStateData = useCallback(async () => {
    try {
      const { data: stateMetrics, error } = await supabase
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

      setStateData(stateMetrics);
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [toast]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";
      
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
        setMapLoaded(true);
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
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'firm_density'], 0],
              0, MAP_COLORS.primary,
              50, MAP_COLORS.secondary,
              100, MAP_COLORS.accent
            ],
            'fill-extrusion-height': 20000,
            'fill-extrusion-opacity': 0.6,
            'fill-extrusion-base': 0
          }
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

        fetchStateData();
      });

      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  }, [initializeLayers, mapContainer, toast, fetchStateData]);

  useEffect(() => {
    if (mapLoaded && layersAdded) {
      fetchStatesWithMSA();
    }
  }, [mapLoaded, layersAdded, fetchStatesWithMSA]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !stateData.length) return;

    try {
      // Update the state colors based on firm density
      map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
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
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
      {showReportPanel && selectedState && (
        <MapReportPanel
          selectedState={selectedState}
          onClose={() => setShowReportPanel(false)}
        />
      )}
    </div>
  );
};

export default AnalysisMap;