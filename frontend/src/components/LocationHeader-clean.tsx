/**
 * Componente para exibir localização atual do usuário
 */
'use client';

import React from 'react';
import { MapPin, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationHeaderProps {
  className?: string;
  showDateTime?: boolean;
  showRefresh?: boolean;
}

export default function LocationHeader({ 
  className = '', 
  showDateTime = true, 
  showRefresh = true 
}: LocationHeaderProps) {
  const { location, currentDateTime, refetchLocation } = useGeolocation();

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-gray-800 rounded-xl p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        {/* Localização Principal */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-full">
            <MapPin className="w-5 h-5 text-blue-700" />
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
            
            <p className="text-gray-600 text-sm">
              {location.loading ? 'Aguarde...' : `${location.state}, ${location.country}`}
            </p>
            
            {location.error && (
              <div className="flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3 h-3 text-blue-500" />
                <p className="text-blue-600 text-xs">
                  Localização padrão: Itaperuna, RJ
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Data e Hora */}
        {showDateTime && (
          <div className="text-right">
            <div className="flex items-center space-x-2 justify-end mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">{currentDateTime.time}</span>
            </div>
            <p className="text-gray-600 text-xs">
              {currentDateTime.formatted}
            </p>
          </div>
        )}
      </div>

      {/* Coordenadas e Ações */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
        <div className="text-xs text-gray-500">
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
            className="flex items-center space-x-1 bg-blue-200 hover:bg-blue-300 text-gray-700 px-3 py-1 rounded-md text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${location.loading ? 'animate-spin' : ''}`} />
            <span>Atualizar localização</span>
          </button>
        )}
      </div>
    </div>
  );
}
