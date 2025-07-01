'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocationStore } from '@/stores/locationStore';

interface MapComponentProps {
  className?: string;
}

export default function MapComponent({ className = '' }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { 
    mapCenter, 
    mapZoom, 
    selectedLocation,
    setMapCenter,
    setMapZoom 
  } = useLocationStore();

  // Configurar token do Mapbox
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN não encontrado');
      return;
    }
    mapboxgl.accessToken = token;
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: mapCenter,
      zoom: mapZoom,
      pitch: 0,
      bearing: 0,
    });

    // Adicionar controles de navegação
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Adicionar controle de geolocalização
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Event listeners
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('moveend', () => {
      if (map.current) {
        const center = map.current.getCenter();
        setMapCenter([center.lng, center.lat]);
        setMapZoom(map.current.getZoom());
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Atualizar centro do mapa quando mudado externamente
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({
        center: mapCenter,
        zoom: mapZoom,
        essential: true
      });
    }
  }, [mapCenter, mapZoom, mapLoaded]);

  // Adicionar marcador para localização selecionada
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remover marcadores existentes
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    if (selectedLocation) {
      // Criar marcador customizado
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #3B82F6;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
      `;

      new mapboxgl.Marker(markerElement)
        .setLngLat([selectedLocation.coordinates.lng, selectedLocation.coordinates.lat])
        .addTo(map.current);

      // Centralizar no marcador
      map.current.flyTo({
        center: [selectedLocation.coordinates.lng, selectedLocation.coordinates.lat],
        zoom: 15,
        essential: true
      });
    }
  }, [selectedLocation, mapLoaded]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN === 'your-mapbox-token-here') {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
            <svg className="w-12 h-12 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Mapa em Modo Demo
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Para ver o mapa real, configure sua chave do Mapbox
          </p>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Localização selecionada:</p>
            {selectedLocation ? (
              <div className="text-sm">
                <p className="font-medium">{selectedLocation.address}</p>
                <p className="text-gray-500">{selectedLocation.city}, {selectedLocation.state}</p>
                <p className="text-xs text-blue-600 mt-1">
                  📍 {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Use a busca para selecionar um local</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
