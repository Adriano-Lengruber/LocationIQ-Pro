'use client';

import { useEffect, useRef } from 'react';
import { LocationData } from '@/services/mockDataService';

interface LeafletMapProps {
  selectedLocation: LocationData | null;
}

export default function LeafletMap({ selectedLocation }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Só carrega o mapa no cliente
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      try {
        // Importar Leaflet dinamicamente
        const L = (await import('leaflet')).default;

        // Fix para ícones do Leaflet no Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (mapRef.current && !mapInstanceRef.current) {
          // Coordenadas padrão (São Paulo)
          const defaultCenter: [number, number] = [-23.5505, -46.6333];
          const defaultZoom = 11;

          // Se há uma localização selecionada, usar suas coordenadas
          const center: [number, number] = selectedLocation 
            ? [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]
            : defaultCenter;

          const zoom = selectedLocation ? 13 : defaultZoom;

          // Criar o mapa
          mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

          // Adicionar tiles do OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current);

          // Adicionar marcador se há localização selecionada
          if (selectedLocation) {
            const marker = L.marker([selectedLocation.coordinates.lat, selectedLocation.coordinates.lng])
              .addTo(mapInstanceRef.current);
            
            if (selectedLocation.address) {
              marker.bindPopup(`<b>${selectedLocation.address}</b>`);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar o mapa:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar mapa quando localização mudar
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      mapInstanceRef.current.setView(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        13
      );

      // Limpar marcadores existentes
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Adicionar novo marcador
      const L = require('leaflet');
      const marker = L.marker([selectedLocation.coordinates.lat, selectedLocation.coordinates.lng])
        .addTo(mapInstanceRef.current);
      
      if (selectedLocation.address) {
        marker.bindPopup(`<b>${selectedLocation.address}</b>`);
      }
    }
  }, [selectedLocation]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '300px' }}
    />
  );
}
