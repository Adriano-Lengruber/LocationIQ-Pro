'use client';

import Link from 'next/link';
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
  Info
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import IBGETestComponent from '@/components/IBGETestComponent';
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
      score: analysisData?.modules.residential.score || 8.5,
      trend: analysisData?.modules.residential.trend || 'up',
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
      score: analysisData?.modules.security.score || 7.2,
      trend: analysisData?.modules.security.trend || 'up',
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
      score: analysisData?.modules.infrastructure.score || 8.8,
      trend: analysisData?.modules.infrastructure.trend || 'up',
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
      score: analysisData?.modules.hospitality.score || 8.1,
      trend: analysisData?.modules.hospitality.trend || 'stable',
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
      score: analysisData?.modules.environmental.score || 6.8,
      trend: analysisData?.modules.environmental.trend || 'down',
      description: 'Qualidade do ar, áreas verdes e sustentabilidade',
      metrics: [
        { label: 'Qualidade do Ar', value: 'Moderada', trend: 'down' },
        { label: 'Áreas Verdes', value: '15m²/hab', trend: 'stable' },
        { label: 'Sustentabilidade', value: 'Boa', trend: 'up' }
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const overallScore = analysisData ? 
    (analysisData.modules.residential.score + 
     analysisData.modules.security.score + 
     analysisData.modules.infrastructure.score + 
     analysisData.modules.hospitality.score + 
     analysisData.modules.environmental.score) / 5 
    : 7.8;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <ModuleNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <IBGETestComponent />
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
                  <span className="text-sm font-bold text-blue-600">12.3M</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">PIB per capita</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">R$ 65k</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">IDH</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">0.825</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">
                  100% Gratuito
                </h3>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Todos os dados são obtidos através de APIs públicas e fontes abertas. 
                Nenhuma cobrança por uso.
              </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${module.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-6 w-6 text-${module.color}-600`} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(module.score)}`}>
                        {module.score.toFixed(1)}
                      </div>
                      {getTrendIcon(module.trend)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="space-y-2">
                    {module.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{metric.label}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-900">{metric.value}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 font-medium">
                      <span>Ver análise completa</span>
                      <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Plataforma de Análise Gratuita
            </h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              LocationIQ Pro utiliza exclusivamente dados públicos e APIs gratuitas para fornecer 
              análises completas sobre localização urbana. Projeto open source para demonstração 
              de capacidades em Data Science.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
