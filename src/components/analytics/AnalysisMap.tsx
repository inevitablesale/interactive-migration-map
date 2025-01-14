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

interface StateMetrics {
  STATEFP: string;
  ESTAB: number;
  B01001_001E: number;
  density: number;
}

const AnalysisMap: React.FC<AnalysisMapProps> = ({ className, data, type, geographicLevel }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedState, setSelectedState] = useState<StateMetrics | null>(null);
  const [stateData, setStateData] = useState<StateMetrics[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');

  const fetchStateData = useCallback(async () => {
    try {
      console.log('Fetching state data from materialized view...');
      const { data: stateMetrics, error } = await supabase
        .from('state_density_metrics')
        .select('STATEFP, ESTAB, B01001_001E, density')
        .not('STATEFP', 'is', null)
        .not('density', 'is', null);

      if (error) {
        console.error('Error fetching state data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch state data",
          variant: "destructive",
        });
        return;
      }

      console.log('Processed state data:', stateMetrics);
      setStateData(stateMetrics);
      setDataLoaded(true);

      // Only update map if it's loaded
      if (map.current && mapLoaded) {
        updateMapData(stateMetrics);
      }
    } catch (error) {
      console.error('Error in fetchStateData:', error);
    }
  }, [toast, mapLoaded]);

  const updateMapData = useCallback((data: StateMetrics[]) => {
    if (!map.current || !mapLoaded) return;

    try {
      map.current.setPaintProperty('state-fills', 'fill-color', [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', 'density'], 0],
        2.5, '#FA0098',
        3.5, '#94EC0E',
        4.5, '#FFF903',
        5.5, '#00FFE0',
        6.5, '#037CFE'
      ]);
    } catch (error) {
      console.error('Error updating map data:', error);
    }
  }, [mapLoaded]);

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
        console.log('Map style loaded');
        
        if (!map.current) return;

        map.current.addSource('states', {
          type: 'vector',
          url: 'mapbox://inevitablesale.9fnr921z'
        });

        map.current.addLayer({
          'id': 'state-fills',
          'type': 'fill',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'fill-color': MAP_COLORS.inactive,
            'fill-opacity': 0.8
          }
        });

        map.current.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'source-layer': 'tl_2020_us_state-52k5uw',
          'paint': {
            'line-color': '#ffffff',
            'line-width': 1
          }
        });

        // Fetch data after map is loaded
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
  }, [fetchStateData, toast]);

  // Update map when both map and data are ready
  useEffect(() => {
    if (mapLoaded && dataLoaded && stateData.length > 0) {
      updateMapData(stateData);
    }
  }, [mapLoaded, dataLoaded, stateData, updateMapData]);

  return (
    <React.Fragment>
      <div className="w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black/60 p-4 rounded-lg">
          <h3 className="text-white text-sm font-medium mb-2">Firm Density</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#037CFE' }} />
              <span className="text-white text-xs">Very High (5.5+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00FFE0' }} />
              <span className="text-white text-xs">High (4.5-5.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFF903' }} />
              <span className="text-white text-xs">Medium (3.5-4.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#94EC0E' }} />
              <span className="text-white text-xs">Low (2.5-3.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FA0098' }} />
              <span className="text-white text-xs">&lt;2.5</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AnalysisMap;
