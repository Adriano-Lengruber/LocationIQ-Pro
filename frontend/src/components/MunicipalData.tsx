/**
 * Componente para exibir dados municipais do IBGE
 */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  IBGECompleteData, 
  IBGEBackendService,
  IBGEPopulationData,
  IBGEAreaData,
  IBGEDensityData 
} from '@/services/apiService';
import { useGeolocation } from '@/hooks/useGeolocation';

interface MunicipalDataProps {
  municipalityId?: number;
  showDetails?: boolean;
  className?: string;
}

export default function MunicipalData({ 
  municipalityId, 
  showDetails = true, 
  className = '' 
}: MunicipalDataProps) {
  const [data, setData] = useState<IBGECompleteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useGeolocation();

  useEffect(() => {
    loadMunicipalData();
  }, [municipalityId, location]);

  const loadMunicipalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result: IBGECompleteData | null = null;
      
      if (municipalityId) {
        result = await IBGEBackendService.getCompleteMunicipalityData(municipalityId);
      } else {
        // Usar município padrão (Itaperuna) por enquanto
        // TODO: Implementar busca por nome da cidade detectada
        result = await IBGEBackendService.getDefaultMunicipality();
      }
      
      if (result) {
        setData(result);
      } else {
        setError('Não foi possível carregar os dados municipais');
      }
    } catch (err) {
      console.error('Erro ao carregar dados municipais:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatArea = (area: number | null | undefined): string => {
    if (area === null || area === undefined) return 'N/A';
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(area)} km²`;
  };

  const formatDensity = (density: number | null | undefined): string => {
    if (density === null || density === undefined) return 'N/A';
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(density)} hab/km²`;
  };

  const getCacheInfo = (item: IBGEPopulationData | IBGEAreaData | IBGEDensityData | null) => {
    if (!item?._cached_at) return null;
    const cachedDate = new Date(item._cached_at);
    return `Cache: ${cachedDate.toLocaleString('pt-BR')}`;
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Erro ao carregar dados</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={loadMunicipalData}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          Nenhum dado municipal disponível
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header com nome do município */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {data.basic_info?.nome || 'Município'}
        </h2>
        {data.basic_info && (
          <p className="text-gray-600 mt-1">
            {data.basic_info.microrregiao}
            {data.basic_info.uf?.sigla && ` - ${data.basic_info.uf.sigla}`}
          </p>
        )}
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* População */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">População</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(data.population?.population)}
              </p>
              {data.population && (
                <p className="text-blue-700 text-xs mt-1">
                  Estimativa {data.population.year}
                </p>
              )}
            </div>
            <div className="text-blue-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {showDetails && data.population?._cached_at && (
            <p className="text-blue-600 text-xs mt-2 opacity-75">
              {getCacheInfo(data.population)}
            </p>
          )}
        </div>

        {/* Área */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Área Territorial</p>
              <p className="text-2xl font-bold text-green-900">
                {formatArea(data.area?.area_km2)}
              </p>
              {data.area && (
                <p className="text-green-700 text-xs mt-1">
                  Censo {data.area.year}
                </p>
              )}
            </div>
            <div className="text-green-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {showDetails && data.area?._cached_at && (
            <p className="text-green-600 text-xs mt-2 opacity-75">
              {getCacheInfo(data.area)}
            </p>
          )}
        </div>

        {/* Densidade */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Densidade</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatDensity(data.density?.density)}
              </p>
              {data.density && (
                <p className="text-purple-700 text-xs mt-1">
                  Censo {data.density.year}
                </p>
              )}
            </div>
            <div className="text-purple-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
          {showDetails && data.density?._cached_at && (
            <p className="text-purple-600 text-xs mt-2 opacity-75">
              {getCacheInfo(data.density)}
            </p>
          )}
        </div>
      </div>

      {/* Detalhes adicionais */}
      {showDetails && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações Detalhadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Localização */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Localização</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {data.basic_info?.regiao_imediata && (
                  <p>Região Imediata: {data.basic_info.regiao_imediata.nome}</p>
                )}
                {data.basic_info?.regiao_intermediaria?.nome && (
                  <p>Região Intermediária: {data.basic_info.regiao_intermediaria.nome}</p>
                )}
                {data.basic_info?.uf?.nome && (
                  <p>Estado: {data.basic_info.uf.nome}</p>
                )}
                {data.coordinates && (
                  <p>
                    Coordenadas: {data.coordinates.latitude.toFixed(4)}, {data.coordinates.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            {/* Fontes de dados */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Fontes de Dados</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {data.data_sources.map((source, index) => (
                  <p key={index}>• {source}</p>
                ))}
                <p className="text-xs text-gray-500 mt-2">
                  Última atualização: {data.last_updated}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
