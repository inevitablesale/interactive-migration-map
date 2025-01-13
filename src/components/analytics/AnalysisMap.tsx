import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { calculateGrowthScore, getColorFromScore, getHeightFromScore } from '@/utils/growthScoreCalculator';

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',
  secondary: '#00FFE0',
  accent: '#FFF903',
  highlight: '#94EC0E',
  active: '#FA0098',
  inactive: '#1e293b',
  disabled: '#000000'
};

const STATE_COLORS = [
  '#e6f3ff',
  '#bde0ff',
  '#94cdff',
  '#6bb9ff',
  '#42a6ff',
  '#1992ff',
  '#007fff',
  '#0066cc'
];

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
  const [msaCountByState, setMsaCountByState] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const getStateColor = useCallback((stateId: string) => {
    const msaCount = msaCountByState[stateId] || 0;
    const maxMSAs = Math.max(...Object.values(msaCountByState));
    const colorIndex = Math.floor((msaCount / maxMSAs) * (STATE_COLORS.length - 1));
    return STATE_COLORS[colorIndex] || MAP_COLORS.disabled;
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

  const createPopup = useCallback((msaData: MSAData) => {
    const growthScore = calculateGrowthScore(msaData);
    const formattedEmployment = msaData.EMP?.toLocaleString() || 'N/A';
    const formattedEstablishments = msaData.ESTAB?.toLocaleString() || 'N/A';
    const formattedPayroll = msaData.PAYANN ? `$${(msaData.PAYANN / 1000000).toFixed(1)}M` : 'N/A';
    const formattedPopulation = msaData.B01001_001E?.toLocaleString() || 'N/A';
    
    return `
      <div class="bg-black/90 p-4 rounded-lg shadow-lg text-white min-w-[240px]">
        <h3 class="font-bold text-lg mb-2">${msaData.msa_name}</h3>
        <div class="space-y-1 text-sm">
          <p class="flex justify-between">
            <span class="text-gray-400">Growth Score:</span>
            <span class="font-medium">${(growthScore * 100).toFixed(1)}%</span>
          </p>
          <p class="flex justify-between">
            <span class="text-gray-400">Employment:</span>
            <span class="font-medium">${formattedEmployment}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-gray-400">Businesses:</span>
            <span class="font-medium">${formattedEstablishments}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-gray-400">Annual Payroll:</span>
            <span class="font-medium">${formattedPayroll}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-gray-400">Population:</span>
            <span class="font-medium">${formattedPopulation}</span>
          </p>
        </div>
      </div>
    `;
  }, []);

  const updateMSAVisualization = useCallback((msaData: MSAData[]) => {
    if (!map.current) {
      console.warn('Map not ready for MSA visualization update');
      return;
    }

    const uniqueMsaCodes = [...new Set(msaData.map(d => d.msa))];
    console.log('Updating MSA visualization for unique codes:', uniqueMsaCodes);

    try {
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
      map.current.setLayoutProperty('state-base', 'visibility', 'none');
      map.current.setLayoutProperty('state-borders', 'visibility', 'none');

      const msaScores = msaData.reduce((acc, msa) => {
        if (msa.msa) {
          acc[msa.msa] = calculateGrowthScore(msa);
        }
        return acc;
      }, {} as { [key: string]: number });

      const heightMatchExpression: mapboxgl.Expression = [
        'match',
        ['get', 'CBSAFP'],
        ...uniqueMsaCodes.flatMap(code => [
          code,
          getHeightFromScore(msaScores[code] || 0)
        ]),
        20000
      ];

      const colorMatchExpression: mapboxgl.Expression = [
        'match',
        ['get', 'CBSAFP'],
        ...uniqueMsaCodes.flatMap(code => [
          code,
          getColorFromScore(msaScores[code] || 0)
        ]),
        MAP_COLORS.inactive
      ];

      map.current.setPaintProperty(
        'msa-base',
        'fill-extrusion-height',
        heightMatchExpression
      );
      
      map.current.setPaintProperty(
        'msa-base',
        'fill-extrusion-color',
        colorMatchExpression
      );

      map.current.setFilter('msa-base', ['in', 'CBSAFP', ...uniqueMsaCodes]);
      map.current.setFilter('msa-borders', ['in', 'CBSAFP', ...uniqueMsaCodes]);

    } catch (error) {
      console.error('Error updating MSA visualization:', error);
      toast({
        title: "Error",
        description: "Failed to update MSA visualization",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchMSAData = useCallback(async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .eq('state_fips', stateId);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        toast({
          title: "Error",
          description: "Failed to fetch MSA data",
          variant: "destructive",
        });
        return;
      }

      const uniqueMsaCodes = [...new Set(msaCrosswalk.map(m => m.msa))];
      console.log('Found MSAs:', uniqueMsaCodes);

      if (uniqueMsaCodes.length === 0) {
        toast({
          title: "No MSA Data",
          description: "This state has no Metropolitan Statistical Areas",
          variant: "default",
        });
        return;
      }

      const { data: regionData, error: regionError } = await supabase
        .from('region_data')
        .select('msa, EMP, PAYANN, ESTAB, B01001_001E, B19013_001E, B23025_004E')
        .in('msa', uniqueMsaCodes);

      if (regionError) {
        console.error('Error fetching region data:', regionError);
        toast({
          title: "Error",
          description: "Failed to fetch region economic data",
          variant: "destructive",
        });
        return;
      }

      const combinedData = msaCrosswalk.map(msa => ({
        ...msa,
        ...regionData?.find(rd => rd.msa === msa.msa)
      }));

      setMsaData(combinedData);
      console.log('Combined MSA data:', combinedData);

      updateMSAVisualization(combinedData);
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
      toast({
        title: "Error",
        description: "Failed to process MSA data",
        variant: "destructive",
      });
    }
  }, [toast, updateMSAVisualization]);

  const resetToStateView = useCallback(() => {
    if (!map.current) return;

    map.current.setLayoutProperty('msa-base', 'visibility', 'none');
    map.current.setLayoutProperty('msa-borders', 'visibility', 'none');
    map.current.setLayoutProperty('state-base', 'visibility', 'visible');
    map.current.setLayoutProperty('state-borders', 'visibility', 'visible');

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
      await fetchMSAData(stateId);
      
      const stateFeatures = map.current.querySourceFeatures('states', {
        sourceLayer: 'tl_2020_us_state-52k5uw',
        filter: ['==', ['get', 'STATEFP'], stateId]
      });

      if (stateFeatures.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        const feature = stateFeatures[0];
        
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

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });

        setViewMode('msa');
        updateAnalysisTable(stateId);
      }
    } catch (error) {
      console.error('Error in fitStateAndShowMSAs:', error);
      toast({
        title: "Error",
        description: "Failed to update map view",
        variant: "destructive",
      });
    }
  }, [fetchMSAData, updateAnalysisTable, toast]);

  const initializeLayers = useCallback(() => {
    if (!map.current) return;
    
    try {
      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://inevitablesale.29jcxgnm'
      });

      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0.6,
          'fill-extrusion-base': 0
        }
      });

      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': MAP_COLORS.primary,
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      map.current.addLayer({
        'id': 'state-hover',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.highlight,
          'fill-extrusion-height': 30000,
          'fill-extrusion-opacity': 0,
          'fill-extrusion-base': 0
        }
      });

      map.current.addLayer({
        'id': 'msa-base',
        'type': 'fill-extrusion',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.secondary,
          'fill-extrusion-height': 50000,
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-base': 0
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.current.addLayer({
        'id': 'msa-borders',
        'type': 'line',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'line-color': MAP_COLORS.secondary,
          'line-width': 1.5,
          'line-opacity': 0.8
        },
        'layout': {
          'visibility': 'none'
        }
      });

      setLayersAdded(true);
      console.log('All layers added successfully');
    } catch (error) {
      console.error('Error initializing layers:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map layers",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchStatesWithMSA = useCallback(async () => {
    console.log('Fetching states with MSA data...');
    if (!map.current || !layersAdded) {
      console.warn('Map or layers not ready for fetching states with MSA');
      return;
    }

    try {
      const { data: msaData, error: msaError } = await supabase
        .from('msa_state_crosswalk')
        .select('state_fips, msa');

      if (msaError) {
        console.error('Error fetching states with MSA:', msaError);
        toast({
          title: "Error",
          description: "Failed to fetch states with MSA data",
          variant: "destructive",
        });
        return;
      }

      const msaCountByState = msaData.reduce((acc: { [key: string]: number }, curr) => {
        if (curr.state_fips) {
          const stateFips = curr.state_fips.toString().padStart(2, '0');
          acc[stateFips] = (acc[stateFips] || 0) + 1;
        }
        return acc;
      }, {});

      setMsaCountByState(msaCountByState);

      const uniqueStates = Object.keys(msaCountByState);
      console.log('States with MSA data:', uniqueStates);
      console.log('MSA counts by state:', msaCountByState);

      if (map.current.getLayer('state-base')) {
        const colorMatchExpression: mapboxgl.Expression = [
          'match',
          ['get', 'STATEFP'],
          ...uniqueStates.flatMap(state => [
            state,
            getStateColor(state)
          ]),
          MAP_COLORS.disabled
        ];

        console.log('Updating state colors with expression:', JSON.stringify(colorMatchExpression));
        
        map.current.setPaintProperty(
          'state-base',
          'fill-extrusion-color',
          colorMatchExpression
        );
      }

      setStatesWithMSA(uniqueStates);
    } catch (error) {
      console.error('Error in fetchStatesWithMSA:', error);
      toast({
        title: "Error",
        description: "Failed to update state colors",
        variant: "destructive",
      });
    }
  }, [layersAdded, toast, getStateColor]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
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
        console.log('Map style loaded');
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
        }
      }
    };

    const handleMouseLeave = () => {
      if (hoveredStateId) {
        map.current?.setPaintProperty('state-hover', 'fill-extrusion-opacity', 0);
        hoveredStateId = null;
      }
    };

    const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features[0]) {
        const stateId = e.features[0].properties?.STATEFP;
        if (stateId) {
          console.log('State clicked:', stateId);
          fitStateAndShowMSAs(stateId);
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
  }, [fitStateAndShowMSAs, updateAnalysisTable]);

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

          const msaData = msaData.find(m => m.msa === hoveredMsaId);
          if (msaData) {
            if (popup) {
              popup.remove();
            }

            popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'custom-popup'
            })
              .setLngLat(e.lngLat)
              .setHTML(createPopup(msaData))
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