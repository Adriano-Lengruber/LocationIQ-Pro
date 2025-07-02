'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocationStore } from '@/stores/locationStore';

// Importação dinâmica do mapa para evitar problemas de SSR
const Map = dynamic(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p>Carregando mapa...</p>
      </div>
    </div>
  )
});

interface MapComponentProps {
  className?: string;
}

export default function MapComponent({ className }: MapComponentProps) {
  const { selectedLocation } = useLocationStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="map-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Inicializando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-[600px] min-h-[400px] ${className || ''}`}>
      <Map 
        selectedLocation={selectedLocation}
      />
    </div>
  );
}
