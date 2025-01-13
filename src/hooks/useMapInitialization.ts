import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapInitialization = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  return {
    mapContainer,
    map,
    mapLoaded,
    setMapLoaded
  };
};