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
  inactive: '#1e293b'
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
  const { toast } = useToast();

  const updateMSAVisualization = useCallback((msaData: MSAData[]) => {
    if (!map.current) {
      console.warn('Map not ready for MSA visualization update');
      return;
    }

    // Deduplicate MSA codes while preserving the original data
    const uniqueMsaCodes = [...new Set(msaData.map(d => d.msa))];
    console.log('Updating MSA visualization for unique codes:', uniqueMsaCodes);

    try {
      // Show MSA layers and ensure they're visible
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');
      
      // Hide state layers when showing MSAs
      map.current.setLayoutProperty('state-base', 'visibility', 'none');
      map.current.setLayoutProperty('state-borders', 'visibility', 'none');

      // Calculate growth scores for each MSA
      const msaScores = msaData.reduce((acc, msa) => {
        if (msa.msa) {
          acc[msa.msa] = calculateGrowthScore(msa);
        }
        return acc;
      }, {} as { [key: string]: number });

      // Create expressions for height and color based on growth scores
      const heightMatchExpression: mapboxgl.Expression = [
        'match',
        ['get', 'CBSAFP'],
        ...uniqueMsaCodes.flatMap(code => [
          code,
          getHeightFromScore(msaScores[code] || 0)
        ]),
        20000 // default height
      ];

      const colorMatchExpression: mapboxgl.Expression = [
        'match',
        ['get', 'CBSAFP'],
        ...uniqueMsaCodes.flatMap(code => [
          code,
          getColorFromScore(msaScores[code] || 0)
        ]),
        'transparent' // Make non-matching MSAs transparent
      ];

      // Update MSA layer with growth scores
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

      // Remove any filters that might be hiding MSAs
      map.current.setFilter('msa-base', ['in', ['get', 'CBSAFP'], ...uniqueMsaCodes]);
      map.current.setFilter('msa-borders', ['in', ['get', 'CBSAFP'], ...uniqueMsaCodes]);

      console.log('MSA visualization updated with filters:', uniqueMsaCodes);
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

  const fitStateAndShowMSAs = useCallback(async (stateId: string) => {
    if (!map.current) return;

    try {
      setSelectedState(stateId);
      console.log('Fitting to state:', stateId);

      // Get state bounds
      const stateBounds = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${stateId}.json?access_token=${MAPBOX_TOKEN}&types=region`
      ).then(res => res.json());

      if (stateBounds.features && stateBounds.features[0]) {
        const bbox = stateBounds.features[0].bbox;
        const bounds = new mapboxgl.LngLatBounds(
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]]
        );

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });

        // Fetch and show MSA data for the selected state
        await fetchMSAData(stateId);
        setViewMode('msa');
      }
    } catch (error) {
      console.error('Error fitting to state:', error);
      toast({
        title: "Error",
        description: "Failed to zoom to selected state",
        variant: "destructive",
      });
    }
  }, [fetchMSAData, setViewMode, toast]);

  const initializeLayers = useCallback(() => {
    if (!map.current) return;

    try {
      // Add state layers
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

      // Add MSA layers
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

  // Add hover and click effects for states
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
          console.log('State clicked:', stateId);
          fitStateAndShowMSAs(stateId);
        }
      }
    });
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
          // Highlight hovered MSA
          map.current?.setPaintProperty('msa-base', 'fill-extrusion-opacity', [
            'case',
            ['==', ['get', 'CBSAFP'], hoveredMsaId],
            1,
            0.4
          ]);

          // Find MSA data
          const msaInfo = msaData.find(m => m.msa === hoveredMsaId);
          if (msaInfo) {
            // Remove existing popup
            if (popup) {
              popup.remove();
            }

            // Create new popup
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

    // Add event listeners
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
