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
import { getDensityColor, getGrowthColor, formatNumber } from '@/utils/heatmapUtils';

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'growth';
}

const AnalysisMap = ({ className, data, type }: AnalysisMapProps) => {
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showReportPanel, setShowReportPanel] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');
  const { mapContainer, map, mapLoaded, setMapLoaded } = useMapInitialization();
  const { layersAdded, setLayersAdded, initializeLayers } = useMapLayers(map);
  const { msaData, setMsaData, statesWithMSA, setStatesWithMSA, fetchMSAData, fetchStatesWithMSA } = useMSAData();

  useEffect(() => {
    if (!map.current || !data || !mapLoaded) return;

    // Update map colors based on data type
    map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
      'case',
      ['in', ['get', 'STATEFP'], ['literal', data.map(d => d.region)]],
      type === 'density' 
        ? getDensityColor(data.find((d: any) => d.region === ['get', 'STATEFP'])?.firm_density || 0)
        : getGrowthColor(data.find((d: any) => d.region === ['get', 'STATEFP'])?.historical_growth_rate || 0),
      MAP_COLORS.inactive
    ]);
  }, [data, type, mapLoaded]);

  const getTooltipContent = useCallback((feature: any) => {
    if (!data) return null;

    const regionData = data.find(d => d.region === feature.properties.COUNTYNAME);
    if (!regionData) return null;

    if (type === 'density') {
      return (
        <div className="p-3 max-w-xs">
          <h4 className="font-semibold mb-2">{regionData.region}</h4>
          <div className="space-y-1 text-sm">
            <p>Total Firms: {formatNumber(regionData.total_firms)}</p>
            <p>Population: {formatNumber(regionData.population)}</p>
            <p>Firm Density: {(regionData.firm_density * 100).toFixed(2)}%</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 max-w-xs">
        <h4 className="font-semibold mb-2">{regionData.region}</h4>
        <div className="space-y-1 text-sm">
          <p>Current Firms: {formatNumber(regionData.firms_current_year)}</p>
          <p>Growth Rate: {(regionData.historical_growth_rate * 100).toFixed(2)}%</p>
          <p>Projected Firms: {formatNumber(regionData.projected_firms)}</p>
        </div>
      </div>
    );
  }, [data, type]);

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
        initializeLayers();
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
  }, [initializeLayers, mapContainer, toast]);

  useEffect(() => {
    if (mapLoaded && layersAdded) {
      fetchStatesWithMSA();
    }
  }, [mapLoaded, layersAdded, fetchStatesWithMSA]);

  useEffect(() => {
    if (!map.current) return;

    let hoveredStateId: string | null = null;

    map.current.on('mousemove', 'state-base', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        }
        hoveredStateId = e.features[0].properties?.STATEFP;
        
        if (hoveredStateId) {
          map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0.3);
          map.current?.setFilter('state-hover', ['==', ['get', 'STATEFP'], hoveredStateId]);
          updateAnalysisTable(hoveredStateId);
          
          // Update tooltip data and position
          const state = data.find(s => s.STATEFP === hoveredStateId);
          if (state) {
            setHoveredState(state);
            setTooltipPosition({ x: e.point.x, y: e.point.y });
          }
        }
      }
    });

    map.current.on('mouseleave', 'state-base', () => {
      if (hoveredStateId) {
        map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        hoveredStateId = null;
        setHoveredState(null);
      }
    });

    map.current.on('click', 'state-base', (e) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          fitStateAndShowMSAs(stateId);
          updateAnalysisTable(stateId);
          setShowReportPanel(true);
        }
      }
    });
  }, [fitStateAndShowMSAs, updateAnalysisTable, data]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;
