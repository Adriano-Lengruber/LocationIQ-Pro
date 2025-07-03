'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import HybridDataService from '@/services/hybridDataService';

interface APIStatus {
  openweather: boolean;
  ibge: boolean;
  nominatim: boolean;
}

export default function APIStatusIndicatorNew() {
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    openweather: false,
    ibge: false,
    nominatim: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    setIsLoading(true);
    try {
      const status = await HybridDataService.getAPIStatus();
      setApiStatus({
        openweather: status.openweather || false,
        ibge: status.ibge || false,
        nominatim: status.nominatim || false,
      });
    } catch (error) {
      console.error('Erro ao verificar status das APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasOpenWeatherKey = !!(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY && 
                             process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY !== 'sua_chave_aqui');

  const getStatusIcon = (status: boolean, hasKey?: boolean) => {
    if (hasKey === false) {
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
    return status ? 
      <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
      <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = (status: boolean, hasKey?: boolean) => {
    if (hasKey === false) {
      return 'Configuração necessária';
    }
    return status ? 'Funcionando' : 'Indisponível';
  };

  const getStatusColor = (status: boolean, hasKey?: boolean) => {
    if (hasKey === false) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    return status ? 
      'text-green-600 bg-green-50 border-green-200' : 
      'text-red-600 bg-red-50 border-red-200';
  };

  const apiDetails = [
    {
      name: 'OpenWeather',
      key: 'openweather' as keyof APIStatus,
      description: 'Dados climáticos e qualidade do ar',
      status: apiStatus.openweather,
      hasKey: hasOpenWeatherKey,
      configUrl: 'https://openweathermap.org/api',
      fallback: 'Estimativas baseadas na região'
    },
    {
      name: 'IBGE',
      key: 'ibge' as keyof APIStatus,
      description: 'Dados socioeconômicos do Brasil',
      status: apiStatus.ibge,
      hasKey: true,
      configUrl: null,
      fallback: 'Dados históricos e estimativas'
    },
    {
      name: 'Nominatim',
      key: 'nominatim' as keyof APIStatus,
      description: 'Geolocalização (OpenStreetMap)',
      status: apiStatus.nominatim,
      hasKey: true,
      configUrl: null,
      fallback: 'Busca em dados cadastrados'
    }
  ];

  const overallStatus = apiStatus.ibge && apiStatus.nominatim && (apiStatus.openweather || !hasOpenWeatherKey);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Clock className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            getStatusIcon(overallStatus)
          )}
          <div>
            <h3 className="font-medium text-gray-900">Status das APIs</h3>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Verificando...' : 
               overallStatus ? 'Todas as APIs operacionais' : 'Algumas APIs indisponíveis'}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {expanded ? '−' : '+'}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {apiDetails.map((api) => (
            <div key={api.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(api.status, api.hasKey)}
                <div>
                  <div className="font-medium text-sm">{api.name}</div>
                  <div className="text-xs text-gray-500">{api.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(api.status, api.hasKey)}`}>
                  {getStatusText(api.status, api.hasKey)}
                </div>
                {!api.hasKey && api.configUrl && (
                  <a 
                    href={api.configUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                  >
                    Configurar <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {!api.status && (
                  <div className="text-xs text-gray-500 mt-1">
                    Fallback: {api.fallback}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-sm text-blue-900">💡 Sobre as APIs</h4>
            <p className="text-xs text-blue-700 mt-1">
              O LocationIQ Pro funciona com dados reais sempre que possível. 
              Quando uma API não está disponível, usamos estimativas inteligentes para manter a experiência.
            </p>
            {!hasOpenWeatherKey && (
              <p className="text-xs text-orange-700 mt-2">
                ⚠️ Configure sua chave do OpenWeather em .env.local para dados climáticos reais
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
