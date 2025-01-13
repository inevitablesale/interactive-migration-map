import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, Building2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5ldml0YWJsZXNhbGUiLCJhIjoiY200dWtvaXZzMG10cTJzcTVjMGJ0bG14MSJ9.1bPoVxBRnR35MQGsGQgvQw";

const MAP_COLORS = {
  primary: '#037CFE',
  secondary: '#00FFE0',
  accent: '#FFF903',
  highlight: '#94EC0E',
  active: '#FA0098',
  inactive: '#000000'
};

interface MSAData {
  msa: string;
  msa_name: string;
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
  B01001_001E?: number; // Population
  B19013_001E?: number; // Median household income
  B23025_004E?: number; // Employment
}

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'state' | 'msa'>('state');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [msaData, setMsaData] = useState<MSAData[]>([]);

  const fetchMSAData = async (stateId: string) => {
    console.log('Fetching MSA data for state:', stateId);
    try {
      // Step 1: Get unique counties from canary_firms_data
      const { data: countyData, error: countyError } = await supabase
        .from('canary_firms_data')
        .select('COUNTYNAME')
        .eq('STATEFP', parseInt(stateId))
        .not('COUNTYNAME', 'is', null);

      if (countyError) {
        console.error('Error fetching county data:', countyError);
        return;
      }

      const uniqueCounties = [...new Set(countyData.map(c => c.COUNTYNAME))];
      console.log('Found unique counties:', uniqueCounties);

      // Step 2: Get MSAs from crosswalk table
      const { data: msaCrosswalk, error: crosswalkError } = await supabase
        .from('msa_state_crosswalk')
        .select('msa, msa_name')
        .eq('state_fips', stateId)
        .in('county_name', uniqueCounties);

      if (crosswalkError) {
        console.error('Error fetching MSA crosswalk:', crosswalkError);
        return;
      }

      const uniqueMsaCodes = [...new Set(msaCrosswalk.map(m => m.msa))];
      console.log('Found MSAs:', uniqueMsaCodes);

      // Step 3: Get economic data for these MSAs
      const { data: regionData, error: regionError } = await supabase
        .from('region_data')
        .select('msa, EMP, PAYANN, ESTAB, B01001_001E, B19013_001E, B23025_004E')
        .in('msa', uniqueMsaCodes);

      if (regionError) {
        console.error('Error fetching region data:', regionError);
        return;
      }

      // Combine the data
      const combinedData = msaCrosswalk.map(msa => ({
        ...msa,
        ...regionData?.find(rd => rd.msa === msa.msa)
      }));

      setMsaData(combinedData);
      console.log('Combined MSA data:', combinedData);

      // Update map visualization with MSA data
      updateMSAVisualization(combinedData);
    } catch (error) {
      console.error('Error in fetchMSAData:', error);
    }
  };

  const updateMSAVisualization = (msaData: MSAData[]) => {
    if (!map.current) return;

    // Calculate min/max values for normalization
    const maxEmp = Math.max(...msaData.map(d => d.EMP || 0));
    const maxPayann = Math.max(...msaData.map(d => d.PAYANN || 0));

    // Get array of MSA codes for filtering
    const msaCodes = msaData.map(d => d.msa);
    console.log('Filtering MSAs with codes:', msaCodes);

    try {
      // Update MSA layer with economic data
      map.current.setPaintProperty('msa-base', 'fill-extrusion-height', [
        'case',
        ['in', ['get', 'CBSAFP'], ...msaCodes],
        20000,
        0
      ]);

      map.current.setPaintProperty('msa-base', 'fill-extrusion-color', [
        'case',
        ['in', ['get', 'CBSAFP'], ...msaCodes],
        MAP_COLORS.secondary,
        MAP_COLORS.inactive
      ]);

      // Set filters for MSA layers
      map.current.setFilter('msa-base', ['in', 'CBSAFP', ...msaCodes]);
      map.current.setFilter('msa-borders', ['in', 'CBSAFP', ...msaCodes]);

      // Add popup for MSA data
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.current.on('mousemove', 'msa-base', (e) => {
        if (!e.features?.[0]) return;
        
        const msaCode = e.features[0].properties?.CBSAFP;
        const msaInfo = msaData.find(m => m.msa === msaCode);
        
        if (msaInfo) {
          const html = `
            <div class="p-2">
              <h3 class="font-bold">${msaInfo.msa_name}</h3>
              <p>Population: ${msaInfo.B01001_001E?.toLocaleString() || 'N/A'}</p>
              <p>Employment: ${msaInfo.EMP?.toLocaleString() || 'N/A'}</p>
              <p>Annual Payroll: $${msaInfo.PAYANN?.toLocaleString() || 'N/A'}</p>
            </div>
          `;
          
          popup.setLngLat(e.lngLat).setHTML(html).addTo(map.current);
        }
      });

      map.current.on('mouseleave', 'msa-base', () => {
        popup.remove();
      });

    } catch (error) {
      console.error('Error updating MSA visualization:', error);
    }
  };

  const fitStateAndShowMSAs = async (stateId: string) => {
    if (!map.current) return;
    
    console.log('Fitting state and showing MSAs for state:', stateId);

    // Fetch MSA data first
    await fetchMSAData(stateId);

    // Query for the selected state's features
    const stateFeatures = map.current.querySourceFeatures('states', {
      sourceLayer: 'tl_2020_us_state-52k5uw',
      filter: ['==', ['get', 'STATEFP'], stateId]
    });

    if (stateFeatures.length > 0) {
      // Calculate bounds for the state
      const bounds = new mapboxgl.LngLatBounds();
      stateFeatures.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0];
          coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
        }
      });

      // Fit the map to the state bounds
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1500,
        pitch: 60,
        bearing: 0
      });

      // Show MSA layers with proper visibility
      map.current.setLayoutProperty('msa-base', 'visibility', 'visible');
      map.current.setLayoutProperty('msa-borders', 'visibility', 'visible');

      setSelectedState(stateId);
      setViewMode('msa');
    }
  };

  const resetView = () => {
    if (!map.current) return;

    // Reset to default view with animation
    map.current.easeTo({
      pitch: 45,
      zoom: 3,
      center: [-98.5795, 39.8283],
      duration: 1500
    });

    // Fade out MSA layer and fade in state layer
    const fadeAnimation = (progress: number) => {
      if (!map.current) return;
      
      map.current.setPaintProperty('state-base', 'fill-extrusion-opacity', 
        0.6 * progress);
      map.current.setPaintProperty('msa-base', 'fill-extrusion-opacity', 
        0.8 * (1 - progress));
    };

    let start: number | null = null;
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      fadeAnimation(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Hide MSA layers after animation completes
        map.current?.setLayoutProperty('msa-base', 'visibility', 'none');
        map.current?.setLayoutProperty('msa-borders', 'visibility', 'none');
      }
    };

    requestAnimationFrame(animate);

    setSelectedState(null);
    setViewMode('state');
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

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
      if (!map.current) return;
      setMapLoaded(true);

      // Add state source
      map.current.addSource('states', {
        type: 'vector',
        url: 'mapbox://inevitablesale.9fnr921z'
      });

      // Add MSA source
      map.current.addSource('msas', {
        type: 'vector',
        url: 'mapbox://inevitablesale.29jcxgnm'
      });

      // Add state base layer
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': MAP_COLORS.inactive,
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add MSA base layer
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

      // Add border layers
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

      // Add click event for state selection
      map.current.on('click', 'state-base', (e) => {
        if (e.features && e.features[0]) {
          const stateId = e.features[0].properties?.STATEFP;
          if (stateId) {
            console.log('State clicked:', stateId);
            fitStateAndShowMSAs(stateId);
          }
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-10">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'state' | 'msa')}>
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
