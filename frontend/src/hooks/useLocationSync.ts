/**
 * Hook para sincronizar geolocalização com o store de mapas
 */
'use client';

import { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';
import { useLocationStore } from '@/stores/locationStore';

export function useLocationSync() {
  const { location } = useGeolocation();
  const { setMapCenter, setCurrentLocation } = useLocationStore();

  useEffect(() => {
    // Quando a localização é detectada com sucesso, atualizar o mapa
    if (!location.loading && !location.error && location.latitude && location.longitude) {
      console.log('🗺️ Sincronizando localização com mapa:', {
        city: location.city,
        coordinates: [location.latitude, location.longitude]
      });

      // Atualizar centro do mapa
      setMapCenter([location.latitude, location.longitude]);

      // Criar objeto de localização compatível com o store
      const locationData = {
        id: `current-${Date.now()}`,
        name: location.city,
        address: `${location.city}, ${location.state}, ${location.country}`,
        city: location.city,
        state: location.state,
        country: location.country,
        coordinates: {
          lat: location.latitude,
          lng: location.longitude
        },
        type: 'current' as const,
        population: 0, // Será preenchido pelos serviços específicos
        area: 0,
        density: 0
      };

      setCurrentLocation(locationData);
    }
  }, [location, setMapCenter, setCurrentLocation]);

  return location;
}
