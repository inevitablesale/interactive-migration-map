import React, { useState, useCallback, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon, Building2 } from 'lucide-react';
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapLayers } from '@/hooks/useMapLayers';
import { useMSAData } from '@/hooks/useMSAData';
import { MAP_COLORS } from '@/constants/colors';
import { supabase } from "@/integrations/supabase/client";
import { MapReportPanel } from './MapReportPanel';
import { getDensityColor, formatNumber } from '@/utils/heatmapUtils';
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

      // Calculate firm density for each state
      const statesWithDensity = stateMetrics.map((state: any) => ({
        ...state,
        firmDensity: state.total_firms && state.population ? 
          (state.total_firms / state.population) * 10000 : 0
      }));

      console.log('Received state data with density:', statesWithDensity);
      setStateData(statesWithDensity);

      // Update map layer with new data if map is loaded
      if (map.current && mapLoaded) {
        // Create a GeoJSON source with the state data
        const statesData = {
          type: 'FeatureCollection',
          features: statesWithDensity.map((state: any) => ({
            type: 'Feature',
            properties: {
              firmDensity: state.firmDensity,
              stateName: state.region,
              totalFirms: state.total_firms,
              population: state.population
            },
            geometry: state.geometry
          }))
        };

        // Update the source data
        if (map.current.getSource('states')) {
          (map.current.getSource('states') as mapboxgl.GeoJSONSource).setData(statesData);
        }

        // Update the layer paint properties
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'interpolate',
          ['linear'],
          ['get', 'firmDensity'],
          0, '#FA0098',  // Very Low (0-20) - Pink
          20, '#94EC0E', // Low (20-40) - Light Green
          40, '#FFF903', // Medium (40-60) - Yellow
          60, '#00FFE0', // High (60-80) - Cyan
          80, '#037CFE'  // Very High (80+) - Blue
        ]);
      }
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [type, toast, mapLoaded]);

  const handleStateClick = async (stateId: string) => {
    try {
      const { data: stateInfo, error } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateId)
        .single();

      if (error) throw error;

      setSelectedState(stateInfo);
      setShowReportPanel(true);
    } catch (error) {
      console.error('Error fetching state data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch state details",
        variant: "destructive",
      });
    }
  };

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

        // Add base layer with data-driven styling
        if (!currentMap.getLayer('state-base')) {
          currentMap.addLayer({
            'id': 'state-base',
            'type': 'fill-extrusion',
            'source': 'states',
            'source-layer': 'tl_2020_us_state-52k5uw',
            'paint': {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'firmDensity'],
                0, '#FA0098',  // Very Low (0-20) - Pink
                20, '#94EC0E', // Low (20-40) - Light Green
                40, '#FFF903', // Medium (40-60) - Yellow
                60, '#00FFE0', // High (60-80) - Cyan
                80, '#037CFE'  // Very High (80+) - Blue
              ],
              'fill-extrusion-height': 20000,
              'fill-extrusion-opacity': 0.8
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
              'fill-extrusion-height': 30000,
              'fill-extrusion-opacity': 0,
              'fill-extrusion-base': 20000
            }
          });
        }

        fetchStateData();
      });

      let hoveredStateId: string | null = null;

      currentMap.on('mousemove', 'state-base', (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredStateId) {
            currentMap.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
          }
          hoveredStateId = e.features[0].properties?.STATEFP;
          currentMap.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0.3);
          currentMap.setFilter('state-hover', ['==', ['get', 'STATEFP'], hoveredStateId]);
        }
      });

      currentMap.on('mouseleave', 'state-base', () => {
        if (hoveredStateId) {
          currentMap.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
          hoveredStateId = null;
        }
      });

      currentMap.on('click', 'state-base', async (e) => {
        if (e.features && e.features[0]) {
          const stateId = e.features[0].properties?.STATEFP;
          if (stateId) {
            await handleStateClick(stateId);
          }
        }
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
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/60 p-4 rounded-lg">
        <h3 className="text-white text-sm font-medium mb-2">Firm Density</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#037CFE' }} />
            <span className="text-white text-xs">Very High (80+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00FFE0' }} />
            <span className="text-white text-xs">High (60-80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFF903' }} />
            <span className="text-white text-xs">Medium (40-60)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#94EC0E' }} />
            <span className="text-white text-xs">Low (20-40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FA0098' }} />
            <span className="text-white text-xs">Very Low (0-20)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMap;