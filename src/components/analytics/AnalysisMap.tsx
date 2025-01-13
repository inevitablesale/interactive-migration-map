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
import { GeographicLevel } from "@/types/geography";

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'growth';
  geographicLevel: GeographicLevel;
}

const AnalysisMap = ({ className, data, type, geographicLevel }: AnalysisMapProps) => {
  const [viewMode, setViewMode] = useState<'state' | 'region'>('state');
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
        .rpc(type === 'density' ? 'get_firm_density_metrics' : 'get_growth_trend_metrics');

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
  }, [type, toast]);

  const updateAnalysisTable = useCallback((stateId: string) => {
    if (!stateData.length) return;
    const stateInfo = stateData.find(s => s.region === stateId);
    if (stateInfo) {
      setSelectedState(stateInfo);
      setShowReportPanel(true);
    }
  }, [stateData]);

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;

    try {
      // Update map view for selected state
      map.current.setFilter('state-base', ['==', ['get', 'STATEFP'], stateId]);
      
      // Fetch and show MSA data for the state
      const msaResults = await fetchMSAData(stateId);
      if (msaResults && msaResults.length > 0) {
        setViewMode('msa');
        map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
        map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
      }

      // Fit map bounds to the selected state
      const stateBounds = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], stateId]
      });

      if (stateBounds.length > 0 && stateBounds[0].geometry.type === 'Polygon') {
        const bounds = new mapboxgl.LngLatBounds();
        const geometry = stateBounds[0].geometry as GeoJSON.Polygon;
        geometry.coordinates[0].forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error('Error in fitStateAndShowMSAs:', error);
      toast({
        title: "Error",
        description: "Failed to load MSA data",
        variant: "destructive",
      });
    }
  }, [map, fetchMSAData, toast]);

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
        
        // Update layer visibility based on geographic level
        if (map.current) {
          try {
            if (geographicLevel === 'state') {
              map.current.setLayoutProperty('state-base', 'visibility', 'visible');
              map.current.setLayoutProperty('msa-base', 'visibility', 'none');
              map.current.setLayoutProperty('county-base', 'visibility', 'none');
            } else if (geographicLevel === 'msa') {
              map.current.setLayoutProperty('state-base', 'visibility', 'none');
              map.current.setLayoutProperty('region-base', 'visibility', 'visible');
              map.current.setLayoutProperty('county-base', 'visibility', 'none');
            } else {
              map.current.setLayoutProperty('state-base', 'visibility', 'none');
              map.current.setLayoutProperty('msa-base', 'visibility', 'none');
              map.current.setLayoutProperty('county-base', 'visibility', 'visible');
            }
          } catch (error) {
            console.error('Error updating layer visibility:', error);
          }
        }
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
  }, [initializeLayers, mapContainer, toast, fetchStateData, geographicLevel]);

  useEffect(() => {
    if (mapLoaded && layersAdded) {
      fetchStatesWithMSA();
    }
  }, [mapLoaded, layersAdded, fetchStatesWithMSA]);

  useEffect(() => {
    if (!map.current) return;

    let hoveredStateId: string | null = null;

    const handleMouseMove = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId) {
          map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        }
        hoveredStateId = e.features[0].properties?.STATEFP;
        
        if (hoveredStateId) {
          map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0.3);
          map.current?.setFilter('state-hover', ['==', ['get', 'STATEFP'], hoveredStateId]);
          updateAnalysisTable(hoveredStateId);
          
          const state = stateData.find(s => s.STATEFP === hoveredStateId);
          if (state) {
            setHoveredState(state);
            setTooltipPosition({ x: e.point.x, y: e.point.y });
          }
        }
      }
    };

    const handleMouseLeave = () => {
      if (hoveredStateId) {
        map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        hoveredStateId = null;
        setHoveredState(null);
      }
    };

    const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          fitStateAndShowMSAs(stateId);
          updateAnalysisTable(stateId);
          setShowReportPanel(true);
        }
      }
    };

    map.current.on('mousemove', 'state-base', handleMouseMove);
    map.current.on('mouseleave', 'state-base', handleMouseLeave);
    map.current.on('click', 'state-base', handleClick);

    return () => {
      if (map.current) {
        map.current.off('mousemove', 'state-base', handleMouseMove);
        map.current.off('mouseleave', 'state-base', handleMouseLeave);
        map.current.off('click', 'state-base', handleClick);
      }
    };
  }, [fitStateAndShowMSAs, updateAnalysisTable, stateData]);

  useEffect(() => {
    // Update visibility based on geographic level
    if (!map.current || !mapLoaded) return;

    try {
      if (geographicLevel === 'state') {
        map.current.setLayoutProperty('state-base', 'visibility', 'visible');
        map.current.setLayoutProperty('msa-base', 'visibility', 'none');
        map.current.setLayoutProperty('county-base', 'visibility', 'none');
      } else if (geographicLevel === 'msa') {
        map.current.setLayoutProperty('state-base', 'visibility', 'none');
        map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
        map.current.setLayoutProperty('county-base', 'visibility', 'none');
      } else {
        map.current.setLayoutProperty('state-base', 'visibility', 'none');
        map.current.setLayoutProperty('msa-base', 'visibility', 'none');
        map.current.setLayoutProperty('county-base', 'visibility', 'visible');
      }
    } catch (error) {
      console.error('Error updating layer visibility:', error);
    }
  }, [geographicLevel, mapLoaded]);

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
