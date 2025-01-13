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
  type: 'density' | 'migration';
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

  const calculateFirmDensity = (stateData: any) => {
    if (!stateData.ESTAB || !stateData.B01001_001E) return 0;
    return (stateData.ESTAB / stateData.B01001_001E) * 10000; // Firms per 10,000 residents
  };

  const updateAnalysisTable = useCallback(async (stateId: string) => {
    try {
      const { data: stateInfo } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateId)
        .single();

      if (stateInfo) {
        setSelectedState(stateInfo);
      }
    } catch (error) {
      console.error('Error updating analysis table:', error);
    }
  }, []);

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;

    try {
      // Fetch state boundary
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${stateId}.json?access_token=${mapboxgl.accessToken}&types=region`
      );
      const data = await response.json();

      if (data.features && data.features[0]) {
        const [minLng, minLat, maxLng, maxLat] = data.features[0].bbox;
        map.current.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          { padding: 50, duration: 1000 }
        );
      }

      // Show MSA layers for the selected state
      const msaData = await fetchMSAData(stateId);
      if (msaData && msaData.length > 0) {
        map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
        map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
      }
    } catch (error) {
      console.error('Error fitting to state:', error);
      toast({
        title: "Error",
        description: "Failed to zoom to selected state",
        variant: "destructive",
      });
    }
  }, [map, fetchMSAData, toast]);

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

      map.current.on('style.load', async () => {
        if (!map.current) return;

        // Fetch state data for density calculations
        const { data: stateData, error } = await supabase
          .from('state_data')
          .select('STATEFP, ESTAB, B01001_001E');

        if (error) {
          console.error('Error fetching state data:', error);
          return;
        }

        // Create a lookup for firm density by state
        const densityByState = stateData.reduce((acc: any, state: any) => {
          acc[state.STATEFP] = calculateFirmDensity(state);
          return acc;
        }, {});

        // Add state source
        map.current.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        // Add state base layer with density-based colors
        map.current.addLayer({
          'id': 'state-base',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['coalesce', 
                ['number', ['get', ['to-string', ['get', 'STATEFP']]], densityByState], 
                0
              ],
              0, '#037CFE',
              50, '#00FFE0',
              100, '#FFF903'
            ],
            'fill-extrusion-height': 20000,
            'fill-extrusion-opacity': 0.6,
            'fill-extrusion-base': 0
          }
        });

        // Add state borders
        map.current.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'line-color': '#037CFE',
            'line-width': 1.5,
            'line-opacity': 0.8
          }
        });

        // Add hover effect layer
        map.current.addLayer({
          'id': 'state-hover',
          'type': 'fill-extrusion',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-extrusion-color': '#94EC0E',
            'fill-extrusion-height': 30000,
            'fill-extrusion-opacity': 0,
            'fill-extrusion-base': 0
          }
        });

        setMapLoaded(true);
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
  }, [toast]);

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
    // Update visualization based on type
    if (!map.current || !mapLoaded) return;

    try {
      if (type === 'density') {
        // Show density-based visualization
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'interpolate',
          ['linear'],
          ['get', 'firm_density'],
          0, '#037CFE',
          50, '#00FFE0',
          100, '#FFF903'
        ]);
      } else {
        // Show migration-based visualization
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'interpolate',
          ['linear'],
          ['get', 'migration_rate'],
          0, '#9D00FF',
          50, '#FA0098',
          100, '#FF3366'
        ]);
      }
    } catch (error) {
      console.error('Error updating map visualization:', error);
    }
  }, [type, mapLoaded]);

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