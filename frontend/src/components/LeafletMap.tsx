'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationData } from '@/services/mockDataService';

// Fix para ícones do Leaflet no Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  selectedLocation: LocationData | null;
}

// Componente para atualizar o centro do mapa
function MapUpdater({ selectedLocation }: { selectedLocation: LocationData | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        13
      );
    }
  }, [map, selectedLocation]);

  return null;
}

export default function LeafletMap({ selectedLocation }: LeafletMapProps) {
  // Coordenadas padrão (São Paulo)
  const defaultCenter: [number, number] = [-23.5505, -46.6333];
  const defaultZoom = 11;

  // Se há uma localização selecionada, usar suas coordenadas
  const center: [number, number] = selectedLocation 
    ? [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]
    : defaultCenter;

  const zoom = selectedLocation ? 13 : defaultZoom;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      style={{ height: '100%', width: '100%' }}
    >
      {/* Tile Layer do OpenStreetMap - 100% Gratuito */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Marcador da localização selecionada */}
      {selectedLocation && (
        <Marker 
          position={[selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-1">
                📍 {selectedLocation.address}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedLocation.city}, {selectedLocation.state}
              </p>
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Componente para atualizar o mapa quando a localização muda */}
      <MapUpdater selectedLocation={selectedLocation} />
    </MapContainer>
  );
}
