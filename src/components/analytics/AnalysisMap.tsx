import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { cn } from '@/lib/utils';

interface AnalysisMapProps {
  className?: string;
}

const AnalysisMap = ({ className }: AnalysisMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(-98.5795);
  const [lat] = useState(39.8283);
  const [zoom] = useState(3);

  const flyToState = (stateId: string) => {
    // Implementation of flying to a state
    console.log('Flying to state:', stateId);
    // Add actual implementation here if needed
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('load', () => {
      // Add map layers here if needed
    });

    return () => {
      map.current?.remove();
    };
  }, [lng, lat, zoom]);

  return (
    <div ref={mapContainer} className={cn("w-full h-full", className)} />
  );
};

export default AnalysisMap;