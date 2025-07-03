'use client';

import { useEffect, useRef } from 'react';
import { LocationData } from '@/services/mockDataService';

interface LeafletMapProps {
  selectedLocation: LocationData | null;
  mapCenter?: [number, number];
}

export default function LeafletMap({ selectedLocation, mapCenter }: LeafletMapProps) {
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
          // Usar mapCenter se fornecido, senão coordenadas da localização, senão São Paulo
          const defaultCenter: [number, number] = [-23.5505, -46.6333];
          
          let center: [number, number];
          if (mapCenter) {
            center = mapCenter;
          } else if (selectedLocation) {
            center = [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng];
          } else {
            center = defaultCenter;
          }

          const zoom = (mapCenter || selectedLocation) ? 13 : 11;

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

  // Atualizar mapa quando localização ou centro mudar
  useEffect(() => {
    console.log('🗺️ useEffect triggered - mapCenter:', mapCenter, 'selectedLocation:', selectedLocation);
    
    if (mapInstanceRef.current) {
      let newCenter: [number, number] | null = null;
      
      // Prioridade: mapCenter > selectedLocation
      if (mapCenter) {
        newCenter = mapCenter;
        console.log('🗺️ Usando mapCenter:', mapCenter);
      } else if (selectedLocation) {
        newCenter = [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng];
        console.log('🗺️ Usando selectedLocation:', newCenter);
      }
      
      if (newCenter) {
        console.log('🗺️ Atualizando centro do mapa para:', newCenter);
        mapInstanceRef.current.setView(newCenter, 13);

        // Importar Leaflet dinamicamente para evitar problemas SSR
        import('leaflet').then((L) => {
          const Leaflet = L.default;
          
          // Limpar marcadores existentes
          mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer instanceof Leaflet.Marker) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });

          // Adicionar novo marcador se há localização
          if (selectedLocation) {
            const marker = Leaflet.marker([selectedLocation.coordinates.lat, selectedLocation.coordinates.lng])
              .addTo(mapInstanceRef.current);
            
            if (selectedLocation.address) {
              marker.bindPopup(`<b>${selectedLocation.address}</b>`);
            }
          } else if (mapCenter) {
            // Adicionar marcador genérico para centro do mapa
            const marker = Leaflet.marker(mapCenter)
              .addTo(mapInstanceRef.current);
            marker.bindPopup(`<b>Localização Atual</b>`);
          }
        }).catch(error => {
          console.error('Erro ao importar Leaflet:', error);
        });
      } else {
        console.log('🗺️ Nenhum centro definido');
      }
    } else {
      console.log('🗺️ Mapa ainda não inicializado');
    }
  }, [selectedLocation, mapCenter]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '300px' }}
    />
  );
}
