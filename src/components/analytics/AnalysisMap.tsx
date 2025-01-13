import React, { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
import { getDensityColor, getGrowthColor, formatNumber } from '@/utils/heatmapUtils';
import { GeographicLevel, DataVisualizationType } from "@/types/geography";

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: DataVisualizationType;
  geographicLevel?: GeographicLevel;
}

const AnalysisMap = ({ className, data, type, geographicLevel = 'state' }: AnalysisMapProps) => {
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

  const fetchStateData = useCallback(async () => {
    try {
      const { data: stateMetrics, error } = await supabase
        .from('state_data')
        .select('STATEFP, EMP, PAYANN, ESTAB, B01001_001E');

      if (error) {
        console.error('Error fetching state data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch state data",
          variant: "destructive",
        });
        return;
      }

      // Calculate density using ESTAB numbers
      const processedData = stateMetrics.map(state => ({
        ...state,
        density: state.ESTAB && state.B01001_001E ? 
          (state.ESTAB / state.B01001_001E) * 10000 : 0
      }));

      setStateData(processedData);
      
      if (map.current && mapLoaded) {
        // Update the map colors based on density
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'interpolate',
          ['linear'],
          ['get', 'density'],
          0, MAP_COLORS.inactive,
          5, MAP_COLORS.primary,
          10, MAP_COLORS.secondary,
          15, MAP_COLORS.accent,
          20, MAP_COLORS.highlight
        ]);
      }
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [map, mapLoaded, toast]);

  useEffect(() => {
    if (mapLoaded && !layersAdded) {
      initializeLayers();
      fetchStateData();
    }
  }, [mapLoaded, layersAdded, initializeLayers, fetchStateData]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !stateData.length) return;

    // Update colors based on the visualization type
    const colors = type === 'density' ? {
      base: MAP_COLORS.primary,
      highlight: MAP_COLORS.accent
    } : {
      base: MAP_COLORS.secondary,
      highlight: MAP_COLORS.active
    };

    map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
      'interpolate',
      ['linear'],
      ['get', 'density'],
      0, colors.base,
      20, colors.highlight
    ]);
  }, [type, stateData, mapLoaded]);

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
