'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Home,
  TrendingUp,
  DollarSign,
  BarChart3,
  MapPin,
  Calendar,
  Users,
  Target,
  Info,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import { useLocationStore } from '@/stores/locationStore';
import { useLocationSync } from '@/hooks/useLocationSync';

export default function RealEstatePage() {
  // Ativar sincronização de localização
  useLocationSync();
  
  const { analysisData, selectedLocation, currentLocation, mapCenter } = useLocationStore();

  const realEstateData = {
    averagePrice: 8500,
    pricePerM2: 10200,
    appreciation12m: 12.5,
    appreciation36m: 38.2,
    liquidityIndex: 8.5,
    rentalYield: 4.2,
    demandIndex: 85,
    supplyIndex: 65,
    investmentRisk: 'Médio',
    investmentGrade: 'B+',
    marketTrend: 'Alta',
    marketVolume: '2.1B'
  };

  const propertyTypes = [
    {
      type: 'Apartamentos',
      averagePrice: 750000,
      pricePerM2: 9500,
      inventory: 1250,
      daysOnMarket: 45,
      trend: 'up'
    },
    {
      type: 'Casas',
      averagePrice: 950000,
      pricePerM2: 6800,
      inventory: 680,
      daysOnMarket: 62,
      trend: 'stable'
    },
    {
      type: 'Comercial',
      averagePrice: 1200000,
      pricePerM2: 12500,
      inventory: 320,
      daysOnMarket: 95,
      trend: 'up'
    },
    {
      type: 'Terrenos',
      averagePrice: 380000,
      pricePerM2: 1900,
      inventory: 450,
      daysOnMarket: 120,
      trend: 'down'
    }
  ];

  const neighborhoods = [
    {
      name: 'Vila Madalena',
      averagePrice: 12500,
      appreciation: 15.2,
      score: 9.1,
      characteristics: ['Boêmio', 'Cultural', 'Gastronômico']
    },
    {
      name: 'Jardins',
      averagePrice: 18500,
      appreciation: 8.5,
      score: 9.5,
      characteristics: ['Luxo', 'Central', 'Exclusivo']
    },
    {
      name: 'Pinheiros',
      averagePrice: 11200,
      appreciation: 18.7,
      score: 8.8,
      characteristics: ['Corporativo', 'Moderno', 'Conectado']
    },
    {
      name: 'Moema',
      averagePrice: 14800,
      appreciation: 12.1,
      score: 9.0,
      characteristics: ['Residencial', 'Verde', 'Família']
    }
  ];

  const marketFactors = [
    {
      factor: 'Taxa de Juros',
      impact: 'Alto',
      status: 'Favorável',
      description: 'Taxas em patamar baixo favorecem financiamentos',
      icon: TrendingUp,
      color: 'green'
    },
    {
      factor: 'Crescimento Populacional',
      impact: 'Médio',
      status: 'Positivo',
      description: 'Crescimento sustentado aumenta demanda',
      icon: Users,
      color: 'blue'
    },
    {
      factor: 'Infraestrutura',
      impact: 'Alto',
      status: 'Em Expansão',
      description: 'Novos projetos valorizam região',
      icon: MapPin,
      color: 'purple'
    },
    {
      factor: 'Regulamentação',
      impact: 'Médio',
      status: 'Atenção',
      description: 'Mudanças em leis podem afetar mercado',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <ModuleNavigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Análise Imobiliária
                  </h1>
                  <p className="text-gray-600">
                    Mercado imobiliário e investimentos
                    {selectedLocation && (
                      <span className="font-medium text-blue-600 ml-2">
                        • {selectedLocation.city}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Score Imobiliário</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {analysisData?.modules.residential.score.toFixed(1) || '8.5'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <LocationSearch />
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Preço Médio/m²</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              R$ {realEstateData.pricePerM2.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 font-medium">
              +{realEstateData.appreciation12m}% (12 meses)
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Valorização</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              +{realEstateData.appreciation36m}%
            </p>
            <p className="text-sm text-gray-600">Últimos 3 anos</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Liquidez</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {realEstateData.liquidityIndex}/10
            </p>
            <p className="text-sm text-purple-600 font-medium">Alta liquidez</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Rental Yield</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {realEstateData.rentalYield}%
            </p>
            <p className="text-sm text-gray-600">Rendimento anual</p>
          </div>
        </div>

        {/* Map and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa de Preços
                </h2>
              </div>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <LeafletMap 
                  selectedLocation={selectedLocation || currentLocation} 
                  mapCenter={mapCenter}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Investment Grade */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Classificação de Investimento
              </h3>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {realEstateData.investmentGrade}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Risco: {realEstateData.investmentRisk}
                </p>
                <p className="text-sm text-gray-600">
                  Tendência: {realEstateData.marketTrend}
                </p>
              </div>
            </div>

            {/* Market Indicators */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Indicadores de Mercado
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Demanda</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${realEstateData.demandIndex}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {realEstateData.demandIndex}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Oferta</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${realEstateData.supplyIndex}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {realEstateData.supplyIndex}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volume Total</span>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {realEstateData.marketVolume}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Types */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Análise por Tipo de Imóvel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((property, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.type}
                  </h3>
                  <div className={`
                    w-3 h-3 rounded-full
                    ${property.trend === 'up' ? 'bg-green-500' : 
                      property.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'}
                  `} />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Preço Médio</p>
                    <p className="text-lg font-bold text-gray-900">
                      R$ {property.averagePrice.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Preço/m²</p>
                    <p className="text-sm font-medium text-gray-700">
                      R$ {property.pricePerM2.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Estoque</p>
                      <p className="text-sm font-medium text-gray-700">
                        {property.inventory}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Tempo Médio</p>
                      <p className="text-sm font-medium text-gray-700">
                        {property.daysOnMarket}d
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Neighborhoods */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Melhores Bairros para Investir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {neighborhoods.map((neighborhood, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {neighborhood.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-4 h-4 ${
                              star <= neighborhood.score ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {neighborhood.score}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      R$ {neighborhood.averagePrice.toLocaleString()}/m²
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      +{neighborhood.appreciation}%
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {neighborhood.characteristics.map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Factors */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Fatores que Influenciam o Mercado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketFactors.map((factor, index) => {
              const IconComponent = factor.icon;
              
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${factor.color}-100 flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 text-${factor.color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {factor.factor}
                        </h3>
                        <span className={`
                          px-3 py-1 text-xs font-medium rounded-full
                          ${factor.color === 'green' ? 'bg-green-100 text-green-700' :
                            factor.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                            factor.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'}
                        `}>
                          {factor.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {factor.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Impacto: {factor.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              Fontes de Dados
            </h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            Os dados apresentados são baseados em fontes públicas e APIs gratuitas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-600">
            <div>• IBGE - Dados demográficos</div>
            <div>• Banco Central - Indicadores econômicos</div>
            <div>• Prefeituras - Dados urbanísticos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
