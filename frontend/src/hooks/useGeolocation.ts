/**
 * Hook para geolocalização e detecção automática de cidade
 */
'use client';

import { useState, useEffect } from 'react';

export interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  loading: boolean;
  error: string | null;
}

export interface CurrentDateTime {
  date: string;
  time: string;
  timezone: string;
  formatted: string;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData>({
    city: 'Itaperuna', // Fallback padrão
    state: 'Rio de Janeiro',
    country: 'Brasil',
    latitude: -21.2061,
    longitude: -41.8881,
    timezone: 'America/Sao_Paulo',
    loading: true,
    error: null
  });

  const [currentDateTime, setCurrentDateTime] = useState<CurrentDateTime>({
    date: '',
    time: '',
    timezone: '',
    formatted: ''
  });

  // Função para buscar cidade baseada em coordenadas
  const getCityFromCoords = async (lat: number, lon: number): Promise<Partial<LocationData>> => {
    try {
      // Usando Nominatim (gratuito) para reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR`
      );
      
      if (!response.ok) throw new Error('Falha no geocoding');
      
      const data = await response.json();
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village || 'Cidade não identificada',
        state: data.address?.state || 'Estado não identificado',
        country: data.address?.country || 'Brasil',
        latitude: lat,
        longitude: lon,
        timezone: 'America/Sao_Paulo' // Padrão Brasil
      };
    } catch (error) {
      console.warn('Erro ao buscar cidade:', error);
      return {};
    }
  };

  // Função para atualizar data e hora
  const updateDateTime = () => {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    setCurrentDateTime({
      date: now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      timezone,
      formatted: now.toLocaleString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  };

  // Detectar localização do usuário
  useEffect(() => {
    const detectLocation = async () => {
      setLocation(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Verificar se geolocalização está disponível
        if (!navigator.geolocation) {
          throw new Error('Geolocalização não suportada');
        }

        // Timeout mais curto para fallback mais rápido
        const timeoutId = setTimeout(() => {
          console.warn('⏰ Timeout na geolocalização, usando localização padrão');
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: 'Timeout na detecção automática'
          }));
        }, 8000); // 8 segundos

        // Solicitar posição do usuário
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            clearTimeout(timeoutId);
            const { latitude, longitude } = position.coords;
            
            console.log('📍 Coordenadas obtidas:', { latitude, longitude });
            
            try {
              // Buscar informações da cidade
              const locationData = await getCityFromCoords(latitude, longitude);
              
              setLocation(prev => ({
                ...prev,
                ...locationData,
                latitude,
                longitude,
                loading: false,
                error: null // Limpar erro ao detectar com sucesso
              }));
              
              console.log('✅ Localização detectada com sucesso:', locationData);
            } catch (geocodingError) {
              console.warn('Erro no geocoding, usando coordenadas sem cidade');
              setLocation(prev => ({
                ...prev,
                latitude,
                longitude,
                loading: false,
                error: 'Erro ao identificar cidade' // Manter coordenadas mas sinalizar erro na cidade
              }));
            }
          },
          (error) => {
            clearTimeout(timeoutId);
            console.warn('❌ Geolocalização negada ou indisponível:', error.message);
            
            let errorMessage = 'Localização não autorizada';
            if (error.code === error.TIMEOUT) {
              errorMessage = 'Timeout na detecção automática';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              errorMessage = 'Posição indisponível';
            }
            
            setLocation(prev => ({
              ...prev,
              loading: false,
              error: errorMessage
            }));
          },
          {
            enableHighAccuracy: false, // Mais rápido
            timeout: 7000, // 7 segundos
            maximumAge: 300000 // 5 minutos
          }
        );
      } catch (error) {
        console.warn('❌ Erro na detecção de localização:', error);
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Geolocalização indisponível'
        }));
      }
    };

    detectLocation();
  }, []);

  // Atualizar data/hora a cada segundo
  useEffect(() => {
    updateDateTime(); // Primeira execução
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Função para redetectar localização
  const refetchLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    // Re-executar detecção sem recarregar a página
    const detectLocation = async () => {
      try {
        if (!navigator.geolocation) {
          throw new Error('Geolocalização não suportada');
        }

        const timeoutId = setTimeout(() => {
          console.warn('⏰ Timeout na re-detecção, mantendo localização atual');
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: 'Timeout na detecção'
          }));
        }, 8000);

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            clearTimeout(timeoutId);
            const { latitude, longitude } = position.coords;
            
            try {
              const locationData = await getCityFromCoords(latitude, longitude);
              
              setLocation(prev => ({
                ...prev,
                ...locationData,
                latitude,
                longitude,
                loading: false,
                error: null
              }));
              
              console.log('✅ Localização re-detectada:', locationData);
            } catch (geocodingError) {
              setLocation(prev => ({
                ...prev,
                latitude,
                longitude,
                loading: false,
                error: 'Erro ao identificar cidade'
              }));
            }
          },
          (error) => {
            clearTimeout(timeoutId);
            setLocation(prev => ({
              ...prev,
              loading: false,
              error: 'Localização não autorizada'
            }));
          },
          {
            enableHighAccuracy: true, // Mais preciso na re-detecção
            timeout: 7000,
            maximumAge: 0 // Força nova leitura
          }
        );
      } catch (error) {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Geolocalização indisponível'
        }));
      }
    };

    detectLocation();
  };

  return {
    location,
    currentDateTime,
    refetchLocation
  };
}
