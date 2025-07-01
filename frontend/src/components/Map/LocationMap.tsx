'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You'll need to get a Mapbox token from https://www.mapbox.com/
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'your-mapbox-token-here';

interface LocationMapProps {
  center?: [number, number];
  zoom?: number;
  onMapClick?: (coordinates: [number, number]) => void;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    title: string;
    description?: string;
  }>;
  className?: string;
}

export default function LocationMap({
  center = [-46.6333, -23.5505], // São Paulo default
  zoom = 12,
  onMapClick,
  markers = [],
  className = 'w-full h-96'
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Handle map click events
    if (onMapClick) {
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onMapClick([lng, lat]);
      });
    }

    map.current.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    markers.forEach(markerData => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${markerData.title}</h3>
          ${markerData.description ? `<p class="text-xs text-gray-600">${markerData.description}</p>` : ''}
        </div>
      `);

      new mapboxgl.Marker({ color: '#3B82F6' })
        .setLngLat(markerData.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [markers, isLoaded]);

  // Update center when center prop changes
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    
    map.current.easeTo({
      center: center,
      zoom: zoom
    });
  }, [center, zoom, isLoaded]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-token-here') {
    return (
      <div className={`${className} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center`}>
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Component</h3>
          <p className="text-sm text-gray-600">
            To enable the map, add your Mapbox token to NEXT_PUBLIC_MAPBOX_TOKEN
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Get a free token at mapbox.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
}
