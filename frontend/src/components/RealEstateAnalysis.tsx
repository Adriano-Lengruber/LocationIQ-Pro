'use client';

import React, { useState, useEffect } from 'react';
import { realEstateService, MarketAnalysis } from '@/services/realEstateService';

interface RealEstateAnalysisProps {
  latitude: number;
  longitude: number;
  radius?: number;
  propertyType?: string;
}

export default function RealEstateAnalysis({ 
  latitude, 
  longitude, 
  radius = 1000,
  propertyType = 'apartment'
}: RealEstateAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      loadMarketData();
    }
  }, [latitude, longitude, radius, propertyType]);

  const loadMarketData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await realEstateService.getMarketAnalysis(
        latitude,
        longitude,
        radius,
        propertyType
      );
      setData(result);
    } catch (err) {
      setError('Erro ao carregar análise imobiliária');
      console.error('Error loading real estate data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getTrendColor = (value: number) => {
    if (value > 5) return 'text-green-600';
    if (value > 0) return 'text-green-500';
    if (value > -5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (value: number) => {
    if (value > 2) return '📈';
    if (value > 0) return '↗️';
    if (value > -2) return '➡️';
    return '📉';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🏠 Análise Imobiliária</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🏠 Análise Imobiliária</h3>
        <div className="text-red-600 text-center py-4">
          <p>{error}</p>
          <button 
            onClick={loadMarketData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">🏠 Análise Imobiliária</h3>
      
      {/* Property Type */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {propertyType === 'apartment' ? 'Apartamentos' : 
           propertyType === 'house' ? 'Casas' : 
           propertyType === 'commercial' ? 'Comercial' : propertyType}
        </span>
      </div>

      {/* Market Prices */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Preço Médio</h4>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(data.average_price)}
          </p>
          <p className="text-xs text-blue-600">
            ou {formatCurrency(data.average_price / 60)}/m²
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-1">Preço Mediano</h4>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(data.median_price)}
          </p>
          <p className="text-xs text-green-600">
            ou {formatCurrency(data.median_price / 60)}/m²
          </p>
        </div>
      </div>

      {/* Market Trends */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Tendências de Mercado</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span>{getTrendIcon(data.price_trend_6m)}</span>
              <span className="text-sm text-gray-600">Últimos 6 meses</span>
            </div>
            <span className={`font-bold ${getTrendColor(data.price_trend_6m)}`}>
              {formatPercentage(data.price_trend_6m)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span>{getTrendIcon(data.price_trend_12m)}</span>
              <span className="text-sm text-gray-600">Últimos 12 meses</span>
            </div>
            <span className={`font-bold ${getTrendColor(data.price_trend_12m)}`}>
              {formatPercentage(data.price_trend_12m)}
            </span>
          </div>
        </div>
      </div>

      {/* Market Dynamics */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Dinâmica do Mercado</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.market_velocity}
            </div>
            <div className="text-sm text-gray-600">dias no mercado</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.market_velocity < 30 ? 'Mercado rápido' :
               data.market_velocity < 60 ? 'Velocidade normal' : 'Mercado lento'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {data.supply_demand_ratio.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">oferta/demanda</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.supply_demand_ratio < 0.8 ? 'Alta demanda' :
               data.supply_demand_ratio > 1.3 ? 'Excesso oferta' : 'Equilibrado'}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Insight */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-purple-800 mb-2">💡 Insight de Investimento</h4>
        <p className="text-sm text-purple-700">
          {data.price_trend_12m > 8 && data.supply_demand_ratio < 1.0 ? 
            'Mercado em forte crescimento com alta demanda. Excelente momento para investir.' :
           data.price_trend_12m > 3 && data.market_velocity < 45 ?
            'Mercado estável com boa liquidez. Momento favorável para compra e venda.' :
           data.price_trend_12m < 0 ?
            'Mercado em correção. Pode ser uma oportunidade para compradores.' :
            'Mercado estável. Avalie outros fatores antes de investir.'
          }
        </p>
      </div>

      {/* Analysis Info */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">
          Análise baseada em um raio de {radius}m • 
          Dados simulados para demonstração • 
          Considere sempre análise profissional
        </p>
      </div>
    </div>
  );
}
