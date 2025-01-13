import React, { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapLayers } from '@/hooks/useMapLayers';
import { useMSAData } from '@/hooks/useMSAData';
import { MAP_COLORS } from '@/constants/colors';
import type { MSAData } from '@/types/map';

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { mapContainer, map, mapLoaded, setMapLoaded } = useMapInitialization();
  const { layersAdded, setLayersAdded, initializeLayers } = useMapLayers(map);
  const { 
    msaData,
    setMsaData,
    statesWithMSA,
    setStatesWithMSA,
    msaCountByState,
    setMsaCountByState,
    fetchMSAData,
    fetchStatesWithMSA
  } = useMSAData();

  const getStateColor = useCallback((stateId: string) => {
    const msaCount = msaCountByState[stateId] || 0;
    const maxMSAs = Math.max(...Object.values(msaCountByState));
    const colorIndex = Math.floor((msaCount / maxMSAs) * (MAP_COLORS.secondary.length - 1));
    return MAP_COLORS.secondary[colorIndex] || MAP_COLORS.inactive;
  }, [msaCountByState]);

  const updateAnalysisTable = useCallback((stateId: string) => {
    if (!map.current) return;
    
    const eventData = {
      stateId: stateId.toString(),
      timestamp: Date.now()
    };
    
    try {
      const event = new CustomEvent('stateSelected', {
        detail: eventData
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error dispatching state selection event:', error);
    }
  }, []);

  const resetToStateView = useCallback(() => {
    if (!map.current) return;

    // Hide MSA layers
    map.current.setLayoutProperty('msa-base', 'visibility', 'none');
    map.current.setLayoutProperty('msa-borders', 'visibility', 'none');
    
    // Show state layers
    map.current.setLayoutProperty('state-base', 'visibility', 'visible');
    map.current.setLayoutProperty('state-borders', 'visibility', 'visible');

    // Reset zoom and position
    map.current.easeTo({
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 45,
      bearing: 0,
      duration: 1500
    });

    setViewMode('state');
    setSelectedState(null);
  }, []);

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;
    
    try {
      setSelectedState(stateId);
      console.log('Fetching MSA data for state:', stateId);
      const msaData = await fetchMSAData(stateId);
      console.log('Found MSAs:', msaData);
      
      if (!msaData || msaData.length === 0) {
        toast({
          title: "No MSA Data",
          description: "No Metropolitan Statistical Areas found for this state.",
          variant: "destructive",
        });
        return;
      }

      // Create a bounding box for the state
      const stateFeatures = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], stateId]
      });

      if (stateFeatures.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        const feature = stateFeatures[0];
        
        // Add state boundaries to the bounds
        if (feature.geometry.type === 'Polygon') {
          (feature.geometry as GeoJSON.Polygon).coordinates[0].forEach((coord) => {
            bounds.extend(coord as [number, number]);
          });
        } else if (feature.geometry.type === 'MultiPolygon') {
          (feature.geometry as GeoJSON.MultiPolygon).coordinates.forEach(polygon => {
            polygon[0].forEach(coord => {
              bounds.extend(coord as [number, number]);
            });
          });
        }

        // Calculate the state's dimensions in degrees
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const stateLngSpan = Math.abs(ne.lng - sw.lng);
        const stateLatSpan = Math.abs(ne.lat - sw.lat);
        const stateArea = stateLngSpan * stateLatSpan;

        // Get viewport dimensions
        const container = map.current.getContainer();
        const viewportWidth = container.offsetWidth;
        const viewportHeight = container.offsetHeight;

        // Adjust padding based on state size and viewport
        const isLargeState = stateArea > 400; // Threshold for large states like CA, TX
        const basePadding = isLargeState ? 100 : 50;
        const paddingFactor = Math.max(1, Math.sqrt(stateArea) / 10);
        
        // Calculate dynamic padding with different logic for large states
        const horizontalPadding = isLargeState
          ? Math.min(viewportWidth * 0.15, basePadding * paddingFactor)
          : Math.min(Math.max(basePadding * paddingFactor, viewportWidth * 0.1), viewportWidth * 0.3);
        
        const verticalPadding = isLargeState
          ? Math.min(viewportHeight * 0.15, basePadding * paddingFactor)
          : Math.min(Math.max(basePadding * paddingFactor, viewportHeight * 0.1), viewportHeight * 0.3);

        // Calculate zoom based on state size with special handling for large states
        const baseMaxZoom = isLargeState ? 5 : 7;
        const zoomReduction = Math.log(stateArea) / Math.log(2) * (isLargeState ? 0.15 : 0.2);
        const maxZoom = Math.max(
          Math.min(baseMaxZoom, baseMaxZoom - zoomReduction),
          4.5  // Lower minimum zoom for large states
        );

        console.log('State metrics:', {
          stateId,
          stateArea,
          isLargeState,
          maxZoom,
          horizontalPadding,
          verticalPadding
        });

        // Important: Show MSA layers BEFORE fitting bounds
        if (map.current.getLayer('msa-base')) {
          map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
          map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
        }
        
        if (map.current.getLayer('state-base')) {
          map.current.setLayoutProperty('state-base', 'visibility', 'none');
          map.current.setLayoutProperty('state-borders', 'visibility', 'none');
        }

        // Fit the map to the state bounds with dynamic padding and maxZoom
        map.current.fitBounds(bounds, {
          padding: {
            top: verticalPadding,
            bottom: verticalPadding,
            left: horizontalPadding,
            right: horizontalPadding
          },
          maxZoom: maxZoom,
          duration: 1500
        });

        setViewMode('msa');
        updateAnalysisTable(stateId);
      }
    } catch (error) {
      console.error('Error in fitStateAndShowMSAs:', error);
      toast({
        title: "Error",
        description: "Failed to load MSA data for this state",
        variant: "destructive",
      });
    }
  }, [fetchMSAData, updateAnalysisTable, toast]);

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
        }
      }
    });

    map.current.on('mouseleave', 'state-base', () => {
      if (hoveredStateId) {
        map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        hoveredStateId = null;
      }
    });

    map.current.on('click', 'state-base', (e) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          fitStateAndShowMSAs(stateId);
          updateAnalysisTable(stateId);
        }
      }
    });
  }, [fitStateAndShowMSAs, updateAnalysisTable]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10">
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => {
            if (value === 'state') {
              resetToStateView();
            }
            if (value) setViewMode(value as 'state' | 'msa');
          }}
        >
          <ToggleGroupItem value="state" aria-label="Toggle state view">
            <MapIcon className="h-4 w-4" />
            <span className="ml-2">States</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="msa" 
            aria-label="Toggle MSA view"
            disabled={!selectedState} // Disable MSA toggle until a state is selected
          >
            <Building2 className="h-4 w-4" />
            <span className="ml-2">MSAs</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
};

export default AnalysisMap;
