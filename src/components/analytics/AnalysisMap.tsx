import React, { useState, useCallback, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapReportPanel } from './MapReportPanel';
import { MAP_COLORS } from '@/constants/colors';

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'growth';
  geographicLevel: 'state' | 'county' | 'msa';
}

const AnalysisMap = ({ className, data, type, geographicLevel }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [stateData, setStateData] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');

  const fetchStateData = useCallback(async () => {
    try {
      console.log('Fetching state data...');
      const { data: stateMetrics, error } = await supabase
        .from('state_data')
        .select('STATEFP, ESTAB, B01001_001E')
        .not('STATEFP', 'is', null)
        .not('ESTAB', 'is', null)
        .not('B01001_001E', 'is', null);

      if (error) {
        console.error('Error fetching state data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch state data",
          variant: "destructive",
        });
        return;
      }

      // Calculate density and ensure data is serializable
      const statesWithDensity = stateMetrics.map(state => {
        const density = state.ESTAB && state.B01001_001E ? 
          (state.ESTAB / state.B01001_001E) * 10000 : 0;
        
        console.log(`State ${state.STATEFP} - ESTAB: ${state.ESTAB}, Population: ${state.B01001_001E}, Density: ${density}`);
        
        return {
          ...JSON.parse(JSON.stringify(state)),
          density
        };
      });

      console.log('Processed state data:', statesWithDensity);
      setStateData(statesWithDensity);

      if (map.current && mapLoaded) {
        map.current.setPaintProperty('state-fills', 'fill-color', [
          'interpolate',
          ['linear'],
          ['coalesce', ['get', 'density'], 0],
          0, '#FA0098',
          20, '#94EC0E',
          40, '#FFF903',
          60, '#00FFE0',
          80, '#037CFE'
        ]);
      }
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [toast, mapLoaded]);

  const handleStateClick = async (stateId: string) => {
    try {
      const { data: stateInfo, error } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', stateId)
        .single();

      if (error) throw error;

      const serializableStateInfo = JSON.parse(JSON.stringify(stateInfo));
      setSelectedState(serializableStateInfo);
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
        
        currentMap.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        currentMap.addLayer({
          'id': 'state-fills',
          'type': 'fill',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'density'], 0],
              0, '#FA0098',
              20, '#94EC0E',
              40, '#FFF903',
              60, '#00FFE0',
              80, '#037CFE'
            ],
            'fill-opacity': 0.8
          }
        });

        currentMap.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'line-color': '#ffffff',
            'line-width': 1
          }
        });

        currentMap.addLayer({
          'id': 'state-hover',
          'type': 'fill',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-color': MAP_COLORS.highlight,
            'fill-opacity': 0
          }
        });

        fetchStateData();
      });

      let hoveredStateId: string | null = null;

      currentMap.on('mousemove', 'state-fills', (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredStateId) {
            currentMap.setPaintProperty('state-hover', 'fill-opacity', 0);
          }
          hoveredStateId = e.features[0].properties?.STATEFP;
          currentMap.setPaintProperty('state-hover', 'fill-opacity', 0.3);
          currentMap.setFilter('state-hover', ['==', ['get', 'STATEFP'], hoveredStateId]);
        }
      });

      currentMap.on('mouseleave', 'state-fills', () => {
        if (hoveredStateId) {
          currentMap.setPaintProperty('state-hover', 'fill-opacity', 0);
          hoveredStateId = null;
        }
      });

      currentMap.on('click', 'state-fills', async (e) => {
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