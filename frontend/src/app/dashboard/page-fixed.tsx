'use client';

import React from 'react';
import { 
  Search, 
  BarChart3, 
  MapPin, 
  Home, 
  Shield, 
  Hotel, 
  Leaf, 
  Store,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import LocationHeader from '@/components/LocationHeader';
import MunicipalData from '@/components/MunicipalData';
import { useLocationStore } from '@/stores/locationStore';

export default function DashboardPage() {
  const { analysisData, selectedLocation } = useLocationStore();

  const modules = [
    {
      id: 'real-estate',
      name: 'Mercado Imobiliário',
      href: '/modules/real-estate',
      icon: Home,
      color: 'blue',
      score: 8.5,
      trend: 'up',
      description: 'Análise de preços, valorização e potencial imobiliário',
      metrics: [
        { label: 'Preço Médio/m²', value: 'R$ 8.500', trend: 'up' },
        { label: 'Valorização 12m', value: '+12.5%', trend: 'up' },
        { label: 'Liquidez', value: 'Alta', trend: 'stable' }
      ]
    },
    {
      id: 'security',
      name: 'Segurança Pública',
      href: '/modules/security',
      icon: Shield,
      color: 'green',
      score: 7.2,
      trend: 'up',
      description: 'Índices de criminalidade e segurança urbana',
      metrics: [
        { label: 'Índice Segurança', value: '72/100', trend: 'up' },
        { label: 'Crimes Violentos', value: 'Baixo', trend: 'down' },
        { label: 'Policiamento', value: 'Bom', trend: 'stable' }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infraestrutura',
      href: '/modules/infrastructure',
      icon: Store,
      color: 'purple',
      score: 8.8,
      trend: 'up',
      description: 'Transporte, comércio e serviços urbanos',
      metrics: [
        { label: 'Transporte Público', value: 'Excelente', trend: 'up' },
        { label: 'Conectividade', value: '95%', trend: 'stable' },
        { label: 'Serviços', value: 'Completo', trend: 'up' }
      ]
    },
    {
      id: 'hospitality',
      name: 'Mercado Hoteleiro',
      href: '/modules/hospitality',
      icon: Hotel,
      color: 'orange',
      score: 8.1,
      trend: 'stable',
      description: 'Turismo, ocupação e preços de hospedagem',
      metrics: [
        { label: 'Taxa Ocupação', value: '78%', trend: 'up' },
        { label: 'Preço Médio', value: 'R$ 280', trend: 'stable' },
        { label: 'Qualidade', value: '4.2⭐', trend: 'up' }
      ]
    },
    {
      id: 'environmental',
      name: 'Qualidade Ambiental',
      href: '/modules/environmental',
      icon: Leaf,
      color: 'emerald',
      score: 6.8,
      trend: 'down',
      description: 'Qualidade do ar, áreas verdes e sustentabilidade',
      metrics: [
        { label: 'Qualidade do Ar', value: 'Moderada', trend: 'down' },
        { label: 'Áreas Verdes', value: '15% da área', trend: 'stable' },
        { label: 'Sustentabilidade', value: 'Em desenvolvimento', trend: 'up' }
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'border-green-500 text-green-600 bg-green-50';
    if (score >= 7.0) return 'border-blue-500 text-blue-600 bg-blue-50';
    if (score >= 5.5) return 'border-yellow-500 text-yellow-600 bg-yellow-50';
    return 'border-red-500 text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const overallScore = modules.reduce((sum, module) => sum + module.score, 0) / modules.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <ModuleNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Location Header */}
        <div className="mb-8">
          <LocationHeader showDateTime={true} showRefresh={true} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1">
                Visão geral dos indicadores de localização
                {selectedLocation && (
                  <span className="font-medium text-blue-600 ml-2">
                    • {selectedLocation.city}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Score Geral */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg ${getScoreColor(overallScore)}`}>
                    {overallScore.toFixed(1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Score Geral</p>
                    <p className="text-xs text-gray-500">Baseado em 5 módulos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8 relative z-[101]">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Buscar Localização
              </h2>
            </div>
            <LocationSearch />
            <p className="text-sm text-gray-500 mt-3">
              Pesquise por qualquer endereço, bairro ou cidade brasileira para começar a análise
            </p>
          </div>
        </div>

        {/* Municipal Data Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Dados Municipais IBGE
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Informações oficiais sobre população, área territorial e densidade demográfica
              </p>
            </div>
            <MunicipalData showDetails={true} />
          </div>
        </div>

        {/* Map and Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 relative z-10">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa Interativo
                </h2>
              </div>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <LeafletMap selectedLocation={selectedLocation} />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estatísticas Rápidas
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">População</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">107.246</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Área</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">1.105 km²</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Densidade</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">86,7 hab/km²</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">
              Módulos de Análise
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <div key={module.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-${module.color}-100 flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 text-${module.color}-600`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getScoreColor(module.score).split(' ')[1]}`}>
                          {module.score}
                        </span>
                        {getTrendIcon(module.trend)}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {module.description}
                    </p>

                    {/* Metrics */}
                    <div className="space-y-2">
                      {module.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{metric.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{metric.value}</span>
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a
                        href={module.href}
                        className={`inline-flex items-center gap-2 text-sm font-medium text-${module.color}-600 hover:text-${module.color}-700`}
                      >
                        Ver detalhes
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
