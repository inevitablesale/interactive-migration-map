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
import { getHeatmapColor, calculateBuyerScore } from '@/utils/mapUtils';
import { getDensityColor, getGrowthColor, formatNumber } from '@/utils/heatmapUtils';

interface AnalysisMapProps {
  className?: string;
  data?: any[];
  type: 'density' | 'growth';
}

const AnalysisMap = ({ className, data, type }: AnalysisMapProps) => {
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [stateData, setStateData] = useState<any[]>([]);
  const [activeState, setActiveState] = useState<any | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');
  const { mapContainer, map, mapLoaded, setMapLoaded } = useMapInitialization();
  const { layersAdded, setLayersAdded, initializeLayers } = useMapLayers(map);
  const { msaData, setMsaData, statesWithMSA, setStatesWithMSA, fetchMSAData, fetchStatesWithMSA } = useMSAData();
  const [hoveredState, setHoveredState] = useState<any | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showReportPanel, setShowReportPanel] = useState(false);

  const flyToState = useCallback((stateId: string) => {
    if (!map.current) return;

    const stateFeatures = map.current.querySourceFeatures('states', {
      sourceLayer: 'tl_2020_us_state-52k5uw',
      filter: ['==', ['get', 'STATEFP'], stateId]
    });

    if (stateFeatures.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      const geometry = stateFeatures[0].geometry as GeoJSON.Polygon;
      const coordinates = geometry.coordinates[0];
      coordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });

      map.current.easeTo({
        center: bounds.getCenter(),
        pitch: 45,
        bearing: Math.random() * 90 - 45,
        duration: 2000
      });
    }
  }, []);

  // Update map view based on filter
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    switch (activeFilter) {
      case 'market-entry':
        map.current.easeTo({
          pitch: 45,
          bearing: 0,
          zoom: 3.5,
          duration: 1000
        });
        setHeatmapEnabled(true);
        fetchStateData(); // Refetch data when filter changes
        break;
      case 'growth-strategy':
        map.current.easeTo({
          pitch: 60,
          bearing: 30,
          zoom: 4,
          duration: 1000
        });
        setHeatmapEnabled(true);
        fetchStateData(); // Refetch data when filter changes
        break;
      case 'opportunities':
        map.current.easeTo({
          pitch: 0,
          bearing: 0,
          zoom: 3,
          duration: 1000
        });
        setHeatmapEnabled(false);
        break;
      default:
        map.current.easeTo({
          pitch: 45,
          bearing: 0,
          zoom: 3,
          duration: 1000
        });
        setHeatmapEnabled(false);
    }
  }, [activeFilter, map, mapLoaded]);

  // Update heatmap when enabled state changes
  useEffect(() => {
    if (heatmapEnabled) {
      fetchStateData();
    }
  }, [heatmapEnabled]);

  const getStateColor = useCallback((stateId: string) => {
    if (!heatmapEnabled) return MAP_COLORS.inactive;

    const state = stateData.find(s => s.STATEFP === stateId);
    if (!state || typeof state.buyerScore === 'undefined') return MAP_COLORS.inactive;

    // Only show heatmap for states that have MSAs
    const msaStateSet = new Set(statesWithMSA?.map(s => s.padStart(2, '0')) || []);
    if (!msaStateSet.has(stateId.padStart(2, '0'))) {
      return MAP_COLORS.inactive;
    }

    return getHeatmapColor(state.buyerScore);
  }, [stateData, heatmapEnabled, statesWithMSA]);

  const updateAnalysisTable = useCallback((stateId: string) => {
    const state = stateData.find(s => s.STATEFP === stateId);
    if (!state) return;

    // Create a plain object with only the serializable data we need
    const eventData = {
      stateId,
      data: {
        STATEFP: state.STATEFP,
        B19013_001E: state.B19013_001E,
        C24010_001E: state.C24010_001E,
        ESTAB: state.ESTAB,
        PAYANN: state.PAYANN,
        buyerScore: state.buyerScore
      }
    };

    // Dispatch event with serializable data
    const event = new CustomEvent('analysisStateChanged', {
      detail: JSON.parse(JSON.stringify(eventData))
    });
    window.dispatchEvent(event);
  }, [stateData]);

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;

    setSelectedState(stateId);
    setViewMode('msa');

    // Query the state boundaries
    const stateFeatures = map.current.querySourceFeatures('states', {
      sourceLayer: 'tl_2020_us_state-52k5uw',
      filter: ['==', ['get', 'STATEFP'], stateId]
    });

    if (stateFeatures.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      const geometry = stateFeatures[0].geometry as GeoJSON.Polygon;
      geometry.coordinates[0].forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });

      // Adjust padding based on state size
      const padding = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      };

      map.current.fitBounds(bounds, {
        padding,
        duration: 1000
      });

      // Show MSA layers
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');

      // Fetch and display MSA data
      const msaData = await fetchMSAData(stateId);
      console.log('MSA data loaded:', msaData);
    }
  }, [map, fetchMSAData]);

  const resetToStateView = useCallback(() => {
    if (!map.current) return;

    setSelectedState(null);
    setViewMode('state');

    // Hide MSA layers
    map.current.setLayoutProperty('msa-base', 'visibility', 'none');
    map.current.setLayoutProperty('msa-borders', 'visibility', 'none');

    // Reset map view
    map.current.easeTo({
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 45,
      bearing: 0,
      duration: 1000
    });
  }, [map]);

  const fetchStateData = async () => {
    try {
      const { data, error } = await supabase
        .from('state_data')
        .select(`
          STATEFP, B01001_001E, B19013_001E, C24060_001E, 
          C24010_001E, PAYANN, ESTAB, B08303_001E, B15003_022E, 
          B01002_001E, B23025_004E, C24010_033E, C24010_034E, EMP
        `);

      if (error) throw error;

      // Get states with MSAs for filtering
      const { data: msaStates } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips')
        .not('state_fips', 'is', null);

      // Create a Set of state FIPS codes that have MSAs, ensuring they're padded
      const msaStateSet = new Set(msaStates?.map(s => s.state_fips.padStart(2, '0')) || []);

      // Filter and process data based on active filter
      let processedData = data.map(state => ({
        ...state,
        buyerScore: calculateBuyerScore(state, data)
      }));

      // Filter states based on active filter criteria
      if (activeFilter === 'market-entry') {
        processedData = processedData.filter(state => {
          const hasMSA = msaStateSet.has(state.STATEFP.padStart(2, '0'));
          const hasHighIncome = (state.B19013_001E || 0) > 50000; // Median income threshold
          const hasBusinessDensity = (state.ESTAB || 0) / (state.B01001_001E || 1) > 0.01; // Business density threshold
          return hasMSA && hasHighIncome && hasBusinessDensity;
        });
      } else if (activeFilter === 'growth-strategy') {
        processedData = processedData.filter(state => {
          const hasEmploymentGrowth = (state.EMP || 0) > 100000; // Employment threshold
          const hasHighPayroll = (state.PAYANN || 0) > 1000000; // Annual payroll threshold
          return hasEmploymentGrowth && hasHighPayroll;
        });
      }

      setStateData(processedData);
      
      if (processedData.length > 0) {
        setActiveState(processedData[0]); // Update activeState here
        if (mapLoaded) {
          flyToState(processedData[0].STATEFP);
        }
      }

      // Update map colors for filtered states
      if (map.current) {
        const stateIds = processedData.map(s => s.STATEFP);
        map.current.setPaintProperty('state-base', 'fill-extrusion-color', [
          'case',
          ['in', ['get', 'STATEFP'], ['literal', stateIds]],
          getStateColor(activeState?.STATEFP || '0'), // Use optional chaining here
          MAP_COLORS.inactive
        ]);
      }
    } catch (error) {
      console.error('Error fetching state data:', error);
      toast({
        title: "Error",
        description: "Failed to load state data",
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
          const state = stateData.find(s => s.STATEFP === hoveredStateId);
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
  }, [fitStateAndShowMSAs, updateAnalysisTable, stateData]);

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

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;
