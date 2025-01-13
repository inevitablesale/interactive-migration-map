import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',
  secondary: '#00FFE0',
  accent: '#FFF903',
  highlight: '#94EC0E',
  active: '#FA0098',
  inactive: '#1e293b'
};

interface MSAData {
  msa: string;
  msa_name: string;
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
  B01001_001E?: number;
  B19013_001E?: number;
  B23025_004E?: number;
}

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersAdded, setLayersAdded] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [msaData, setMsaData] = useState<MSAData[]>([]);
  const [statesWithMSA, setStatesWithMSA] = useState<string[]>([]);
  const { toast } = useToast();
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const fetchStatesWithMSA = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips')
        .not('state_fips', 'is', null);

      if (error) {
        console.error('Error fetching states with MSA:', error);
        toast({
          title: "Error",
          description: "Failed to fetch states with MSA data",
          variant: "destructive",
        });
        return;
      }

      const uniqueStates = [...new Set(data.map(d => d.state_fips))];
      setStatesWithMSA(uniqueStates);
    } catch (error) {
      console.error('Error in fetchStatesWithMSA:', error);
      toast({
        title: "Error",
        description: "Failed to process states with MSA data",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateAnalysisTable = useCallback((stateId: string) => {
    console.log('Updating analysis table for state:', stateId);
  }, []);

  const createPopup = (msaInfo: MSAData) => {
    return `
      <div class="p-2 bg-white rounded shadow">
        <h3 class="font-bold">${msaInfo.msa_name}</h3>
        <div class="text-sm">
          <p>Employment: ${msaInfo.EMP?.toLocaleString() || 'N/A'}</p>
          <p>Establishments: ${msaInfo.ESTAB?.toLocaleString() || 'N/A'}</p>
          <p>Annual Payroll: $${msaInfo.PAYANN?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
    `;
  };

  const resetToStateView = useCallback(() => {
    if (!map.current) return;

    map.current.easeTo({
      center: [-98.5795, 39.8283],
      zoom: 3,
      pitch: 45,
      bearing: 0,
      duration: 1000
    });

    map.current.setLayoutProperty('state-base', 'visibility', 'visible');
    map.current.setLayoutProperty('state-borders', 'visibility', 'visible');
    map.current.setLayoutProperty('msa-base', 'visibility', 'none');
    map.current.setLayoutProperty('msa-borders', 'visibility', 'none');

    setSelectedState(null);
    setViewMode('state');
  }, []);

  const initializeLayers = useCallback(() => {
    if (!map.current) return;

    try {
      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-adm1-v3'
      });

      map.current.addLayer({
        id: 'state-base',
        type: 'fill-extrusion',
        source: 'states',
        'source-layer': 'boundaries_admin_1',
        paint: {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 20000,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.8
        }
      });

      map.current.addLayer({
        id: 'state-borders',
        type: 'line',
        source: 'states',
        'source-layer': 'boundaries_admin_1',
        paint: {
          'line-color': '#fff',
          'line-width': 1
        }
      });

      map.current.addLayer({
        id: 'state-hover',
        type: 'fill-extrusion',
        source: 'states',
        'source-layer': 'boundaries_admin_1',
        paint: {
          'fill-extrusion-color': MAP_COLORS.primary,
          'fill-extrusion-height': 30000,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0
        }
      });

      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-metro-v3'
      });

      map.current.addLayer({
        id: 'msa-base',
        type: 'fill-extrusion',
        source: 'msas',
        'source-layer': 'boundaries_metro_1',
        paint: {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 20000,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.8
        },
        layout: {
          visibility: 'none'
        }
      });

      map.current.addLayer({
        id: 'msa-borders',
        type: 'line',
        source: 'msas',
        'source-layer': 'boundaries_metro_1',
        paint: {
          'line-color': '#fff',
          'line-width': 1
        },
        layout: {
          visibility: 'none'
        }
      });

      setLayersAdded(true);
      console.log('Map layers initialized');
    } catch (error) {
      console.error('Error initializing map layers:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map layers",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchMSAData = useCallback(async (stateId: string) => {
    try {
      const { data, error } = await supabase
        .from('msa_state_crosswalk')
        .select('*')
        .eq('state_fips', stateId);

      if (error) {
        console.error('Error fetching MSA data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch MSA data",
          variant: "destructive",
        });
        return;
      }

      setMsaData(data || []);
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
      toast({
        title: "Error",
        description: "Failed to process MSA data",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;

    try {
      const stateBounds = map.current.querySourceFeatures('states', {
        sourceLayer: 'boundaries_admin_1',
        filter: ['==', ['get', 'STATEFP'], stateId]
      });

      if (stateBounds.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        const feature = stateBounds[0];
        
        if (feature.geometry.type === 'Polygon') {
          (feature.geometry.coordinates as number[][][]).forEach((ring) => {
            ring.forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
          });
        } else if (feature.geometry.type === 'MultiPolygon') {
          (feature.geometry.coordinates as number[][][][]).forEach((polygon) => {
            polygon.forEach((ring) => {
              ring.forEach((coord: [number, number]) => {
                bounds.extend(coord);
              });
            });
          });
        }

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });

        setViewMode('msa');
        setSelectedState(stateId);
        await fetchMSAData(stateId);

        map.current.setLayoutProperty('state-base', 'visibility', 'none');
        map.current.setLayoutProperty('state-borders', 'visibility', 'none');
        map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
        map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
      }
    } catch (error) {
      console.error('Error in fitStateAndShowMSAs:', error);
      toast({
        title: "Error",
        description: "Failed to zoom to state and show MSAs",
        variant: "destructive",
      });
    }
  }, [map, fetchMSAData, toast]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: 3,
        center: [-98.5795, 39.8283],
        pitch: 45,
        bearing: 0,
        interactive: true,
      });

      // Store only the map instance, not the entire class
      map.current = mapInstance;

      mapInstance.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      mapInstance.on('style.load', () => {
        console.log('Map style loaded');
        setMapLoaded(true);
        initializeLayers();
      });

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  }, [initializeLayers, toast]);

  useEffect(() => {
    if (mapLoaded && layersAdded) {
      console.log('Map and layers ready, fetching states with MSA');
      fetchStatesWithMSA();
    }
  }, [mapLoaded, layersAdded, fetchStatesWithMSA]);

  useEffect(() => {
    if (!map.current) return;

    let hoveredStateId: string | null = null;

    const handleStateClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          fitStateAndShowMSAs(stateId);
        }
      }
    };

    map.current.on('click', 'state-base', handleStateClick);

    return () => {
      if (map.current) {
        map.current.off('click', 'state-base', handleStateClick);
      }
    };
  }, [fitStateAndShowMSAs]);

  useEffect(() => {
    if (!map.current) return;

    let hoveredMsaId: string | null = null;
    let popup: mapboxgl.Popup | null = null;

    const handleMsaHover = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features.length > 0) {
        if (hoveredMsaId) {
          map.current?.setPaintProperty('msa-base', 'fill-extrusion-opacity', 0.8);
        }
        
        hoveredMsaId = e.features[0].properties?.CBSAFP;
        
        if (hoveredMsaId) {
          map.current?.setPaintProperty('msa-base', 'fill-extrusion-opacity', [
            'case',
            ['==', ['get', 'CBSAFP'], hoveredMsaId],
            1,
            0.4
          ]);

          const msaInfo = msaData.find(m => m.msa === hoveredMsaId);
          if (msaInfo) {
            if (popup) {
              popup.remove();
            }

            popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'custom-popup'
            })
              .setLngLat(e.lngLat)
              .setHTML(createPopup(msaInfo))
              .addTo(map.current!);
          }
        }
      }
    };

    const handleMsaLeave = () => {
      if (hoveredMsaId) {
        map.current?.setPaintProperty('msa-base', 'fill-extrusion-opacity', 0.8);
        hoveredMsaId = null;
      }
      if (popup) {
        popup.remove();
        popup = null;
      }
    };

    map.current.on('mousemove', 'msa-base', handleMsaHover);
    map.current.on('mouseleave', 'msa-base', handleMsaLeave);

    return () => {
      if (map.current) {
        map.current.off('mousemove', 'msa-base', handleMsaHover);
        map.current.off('mouseleave', 'msa-base', handleMsaLeave);
      }
      if (popup) {
        popup.remove();
      }
    };
  }, [msaData, createPopup]);

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
          <ToggleGroupItem value="msa" aria-label="Toggle MSA view">
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
