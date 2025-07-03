/**
 * Componente para exibir localização atual do usuário (versão compacta)
 */
'use client';

import React from 'react';
import { MapPin, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useLocationSync } from '@/hooks/useLocationSync';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationHeaderProps {
  className?: string;
  showDateTime?: boolean;
  showRefresh?: boolean;
  compact?: boolean;
}

export default function LocationHeader({ 
  className = '', 
  showDateTime = true, 
  showRefresh = true,
  compact = false 
}: LocationHeaderProps) {
  const { currentDateTime, refetchLocation } = useGeolocation();
  const location = useLocationSync(); // Usar o hook sincronizado

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="flex items-center justify-between">
          {/* Localização Compacta */}
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-semibold">
                {location.loading ? 'Detectando...' : location.city}
              </h2>
              <p className="text-blue-100 text-xs">
                {location.loading ? 'Aguarde...' : `${location.state}, ${location.country}`}
              </p>
            </div>
            {location.loading && <RefreshCw className="w-4 h-4 animate-spin" />}
          </div>

          {/* Data/Hora Compacta */}
          {showDateTime && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentDateTime.time}</span>
              </div>
              {showRefresh && (
                <button
                  onClick={refetchLocation}
                  disabled={location.loading}
                  className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${location.loading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Erro compacto */}
        {location.error && (
          <div className="flex items-center space-x-1 mt-2">
            <AlertCircle className="w-3 h-3 text-yellow-300" />
            <p className="text-yellow-200 text-xs truncate">
              Usando localização padrão
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-white border border-gray-200 text-gray-900 rounded-xl p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        {/* Localização Principal */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-gray-900">
                {location.loading ? 'Detectando localização...' : location.city}
              </h2>
              {location.loading && (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              )}
            </div>
            
            <p className="text-gray-700 text-sm">
              {location.loading ? 'Aguarde...' : `${location.state}, ${location.country}`}
            </p>
            
            {location.error && (
              <div className="flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <p className="text-amber-700 text-xs">
                  {location.error === 'Localização não autorizada' 
                    ? 'Geolocalização não autorizada - usando Itaperuna, RJ'
                    : 'Usando localização padrão - Itaperuna, RJ'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Data e Hora */}
        {showDateTime && (
          <div className="text-right">
            <div className="flex items-center space-x-2 justify-end mb-1">
              <Clock className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">{currentDateTime.time}</span>
            </div>
            <p className="text-gray-600 text-xs">
              {currentDateTime.formatted}
            </p>
          </div>
        )}
      </div>

      {/* Coordenadas e Ações */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          {!location.loading && (
            <>
              📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </>
          )}
        </div>
        
        {showRefresh && (
          <button
            onClick={refetchLocation}
            disabled={location.loading}
            className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${location.loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        )}
      </div>
    </div>
  );
}
