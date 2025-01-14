import React, { useState, useCallback, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon, Building2, LineChart } from 'lucide-react';
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapLayers } from '@/hooks/useMapLayers';
import { useMSAData } from '@/hooks/useMSAData';
import { MAP_COLORS } from '@/constants/colors';
import { supabase } from "@/integrations/supabase/client";
import { MapReportPanel } from './MapReportPanel';
import { getDensityColor, getGrowthColor, formatNumber } from '@/utils/heatmapUtils';
import { GeographicLevel } from "@/types/geography";
import { getStateName } from '@/utils/stateUtils';

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'growth';
  geographicLevel: GeographicLevel;
}

const AnalysisMap = ({ className, data, type, geographicLevel }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [hoveredState, setHoveredState] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [stateData, setStateData] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');
  const { fetchMSAData } = useMSAData();

  const fetchStateData = useCallback(async () => {
    try {
      console.log('Fetching state data...');
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

      console.log('Received state data:', stateMetrics);
      setStateData(stateMetrics);
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [type, toast]);

  const updateAnalysisTable = useCallback(async (stateId: string) => {
    console.log('updateAnalysisTable called with stateId:', stateId);
    
    if (!stateData.length) {
      console.log('No stateData available');
      return;
    }
    
    const stateInfo = stateData.find(s => s.STATEFP === stateId);
    console.log('Found stateInfo:', stateInfo);
    
    if (stateInfo) {
      console.log('Fetching state name for:', stateId);
      const stateName = await getStateName(stateId);
      console.log('Retrieved state name:', stateName);
      
      const serializedStateInfo = JSON.parse(JSON.stringify({
        ...stateInfo,
        displayName: stateName
      }));
      
      setSelectedState(serializedStateInfo);
      setShowReportPanel(true);
    } else {
      console.log('No state info found for stateId:', stateId);
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
  }, [fetchMSAData, toast]);

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

      const currentMap = map.current;

      currentMap.on('style.load', () => {
        setMapLoaded(true);
        console.log('Map style loaded');
        
        if (!currentMap.getSource('states')) {
          currentMap.addSource('states', {
            type: 'vector',
            url: 'mapbox://inevitablesale.9fnr921z'
          });
        }

        // Add base layer
        if (!currentMap.getLayer('state-base')) {
          currentMap.addLayer({
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
        }

        // Add hover layer
        if (!currentMap.getLayer('state-hover')) {
          currentMap.addLayer({
            'id': 'state-hover',
            'type': 'fill-extrusion',
            'source': 'states',
            'source-layer': 'tl_2020_us_state-52k5uw',
            'paint': {
              'fill-extrusion-color': MAP_COLORS.highlight,
              'fill-extrusion-height': 20000,
              'fill-extrusion-opacity': 0,
              'fill-extrusion-base': 10000
            }
          });
        }

        fetchStateData();
      });

      return () => {
        currentMap?.remove();
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
  }, [fetchStateData, toast]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const currentMap = map.current;
    let hoveredStateId: string | null = null;

    const handleMouseMove = async (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId) {
          currentMap.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        }
        hoveredStateId = e.features[0].properties?.STATEFP;
        
        if (hoveredStateId) {
          currentMap.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0.3);
          currentMap.setFilter('state-hover', ['==', ['get', 'STATEFP'], hoveredStateId]);
          await updateAnalysisTable(hoveredStateId);
          
          const state = stateData.find(s => s.STATEFP === hoveredStateId);
          if (state) {
            const stateName = await getStateName(hoveredStateId);
            const serializedState = JSON.parse(JSON.stringify({
              ...state,
              displayName: stateName
            }));
            setHoveredState(serializedState);
            setTooltipPosition({ x: e.point.x, y: e.point.y });
          }
        }
      }
    };

    const handleMouseLeave = () => {
      if (hoveredStateId) {
        currentMap.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        hoveredStateId = null;
        setHoveredState(null);
      }
    };

    const handleClick = async (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          await updateAnalysisTable(stateId);
          setShowReportPanel(true);
        }
      }
    };

    currentMap.on('mousemove', 'state-base', handleMouseMove);
    currentMap.on('mouseleave', 'state-base', handleMouseLeave);
    currentMap.on('click', 'state-base', handleClick);

    return () => {
      if (currentMap) {
        currentMap.off('mousemove', 'state-base', handleMouseMove);
        currentMap.off('mouseleave', 'state-base', handleMouseLeave);
        currentMap.off('click', 'state-base', handleClick);
      }
    };
  }, [mapLoaded, updateAnalysisTable, stateData]);

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