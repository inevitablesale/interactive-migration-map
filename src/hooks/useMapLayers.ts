import { useState, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapLayers = (map: MutableRefObject<mapboxgl.Map | null>) => {
  const [layersAdded, setLayersAdded] = useState(false);

  const initializeLayers = useCallback(() => {
    if (!map.current) return;

    try {
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

      // Add state base layer with hover effect
      map.current.addLayer({
        'id': 'state-base',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': '#1e293b',
          'fill-extrusion-height': 20000,
          'fill-extrusion-opacity': 0.6,
          'fill-extrusion-base': 0
        }
      });

      // Add state borders layer
      map.current.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'line-color': '#037CFE',
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      // Add hover effect layer
      map.current.addLayer({
        'id': 'state-hover',
        'type': 'fill-extrusion',
        'source': 'states',
        'source-layer': 'tl_2020_us_state-52k5uw',
        'paint': {
          'fill-extrusion-color': '#94EC0E',
          'fill-extrusion-height': 30000,
          'fill-extrusion-opacity': 0,
          'fill-extrusion-base': 0
        }
      });

      // Add MSA base layer
      map.current.addLayer({
        'id': 'msa-base',
        'type': 'fill-extrusion',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'fill-extrusion-color': '#00FFE0',
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
        'id': 'msa-borders',
        'type': 'line',
        'source': 'msas',
        'source-layer': 'tl_2020_us_cbsa-aoky0u',
        'paint': {
          'line-color': '#00FFE0',
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
    }
  }, [map]);

  return {
    layersAdded,
    setLayersAdded,
    initializeLayers
  };
};
