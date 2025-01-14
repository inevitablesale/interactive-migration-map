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
        .select('STATEFP, density')
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

      console.log('Received pre-calculated state data:', stateMetrics);
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

  const getDensityColor = (density: number): string => {
    if (density >= 6.5) return MAP_COLORS.primary;      // Very high density
    if (density >= 5.5) return MAP_COLORS.secondary;    // High density
    if (density >= 4.5) return MAP_COLORS.accent;       // Medium-high density
    if (density >= 3.5) return MAP_COLORS.highlight;    // Medium density
    return MAP_COLORS.active;                           // Lower density
  };

  const updateMapData = useCallback((data: StateMetrics[]) => {
    if (!map.current || !mapLoaded) return;

    try {
      // Create a map of STATEFP to density for easier lookup
      const densityMap = Object.fromEntries(
        data.map(state => [state.STATEFP, state.density])
      );

      // Update the fill color based on density
      map.current.setPaintProperty('state-fills', 'fill-color', [
        'match',
        ['get', 'STATEFP'],
        ...data.flatMap(state => [
          state.STATEFP,
          getDensityColor(state.density)
        ]),
        MAP_COLORS.inactive // Default color for states not in our dataset
      ]);

      // Add hover effect
      map.current.setPaintProperty('state-fills', 'fill-opacity', [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        0.6
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

      let hoveredStateId: string | null = null;

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
            'fill-opacity': 0.6
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

        // Add click event
        map.current.on('click', 'state-fills', (e) => {
          if (e.features && e.features[0]) {
            const stateId = e.features[0].properties.STATEFP;
            const clickedState = stateData.find(state => state.STATEFP === stateId);
            if (clickedState) {
              setSelectedState(clickedState);
              
              // Visual feedback for clicked state
              map.current?.setPaintProperty('state-fills', 'fill-opacity', [
                'case',
                ['==', ['get', 'STATEFP'], stateId],
                0.9,
                0.6
              ]);
            }
          }
        });

        // Add hover effects
        map.current.on('mousemove', 'state-fills', (e) => {
          if (e.features && e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.current?.setFeatureState(
                { source: 'states', sourceLayer: 'tl_2020_us_state-52k5uw', id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = e.features[0].id as string;
            map.current?.setFeatureState(
              { source: 'states', sourceLayer: 'tl_2020_us_state-52k5uw', id: hoveredStateId },
              { hover: true }
            );
          }
        });

        map.current.on('mouseleave', 'state-fills', () => {
          if (hoveredStateId !== null) {
            map.current?.setFeatureState(
              { source: 'states', sourceLayer: 'tl_2020_us_state-52k5uw', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = null;
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
              <div className="w-4 h-4 rounded" style={{ backgroundColor: MAP_COLORS.primary }} />
              <span className="text-white text-xs">Very High (6.5+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: MAP_COLORS.secondary }} />
              <span className="text-white text-xs">High (5.5-6.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: MAP_COLORS.accent }} />
              <span className="text-white text-xs">Medium-High (4.5-5.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: MAP_COLORS.highlight }} />
              <span className="text-white text-xs">Medium (3.5-4.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: MAP_COLORS.active }} />
              <span className="text-white text-xs">Lower (&lt;3.5)</span>
            </div>
          </div>
        </div>

        {/* Show MapReportPanel when a state is selected */}
        {selectedState && (
          <MapReportPanel 
            selectedState={selectedState} 
            onClose={() => setSelectedState(null)} 
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AnalysisMap;