'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Store,
  Bus,
  Wifi,
  ShoppingBag,
  Coffee,
  GraduationCap,
  Heart,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Star,
  CheckCircle2,
  Info,
  Navigation,
  Zap
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import { useLocationStore } from '@/stores/locationStore';

export default function InfrastructurePage() {
  const { analysisData, selectedLocation } = useLocationStore();
  
  const infrastructureData = analysisData?.modules.infrastructure;
  const score = infrastructureData?.score || 8.8;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const infrastructureMetrics = [
    {
      title: 'Transporte Público',
      score: 9.2,
      trend: 'up',
      description: 'Cobertura e qualidade do transporte',
      details: ['3 linhas de metrô', '15 linhas de ônibus', '2 ciclovias principais']
    },
    {
      title: 'Conectividade Digital',
      score: 8.9,
      trend: 'up',
      description: 'Internet e cobertura móvel',
      details: ['Fibra óptica 500Mb', '5G disponível', 'Wi-Fi público']
    },
    {
      title: 'Comércio Local',
      score: 8.5,
      trend: 'stable',
      description: 'Variedade e proximidade',
      details: ['2 shoppings', '150+ lojas', '8 supermercados']
    },
    {
      title: 'Serviços Essenciais',
      score: 8.7,
      trend: 'up',
      description: 'Saúde, educação e segurança',
      details: ['Hospital 24h', '12 escolas', '3 postos policiais']
    }
  ];

  const transportOptions = [
    { type: 'Metrô/Trem', availability: 'Excelente', time: '2 min', stations: 3 },
    { type: 'Ônibus', availability: 'Muito Boa', time: '5 min', stations: 8 },
    { type: 'Taxi/Uber', availability: 'Excelente', time: '3 min', stations: null },
    { type: 'Bicicleta', availability: 'Boa', time: '1 min', stations: 5 },
    { type: 'Caminhada', availability: 'Excelente', time: '0 min', stations: null }
  ];

  const nearbyServices = [
    {
      category: 'Alimentação',
      icon: Coffee,
      count: 120,
      types: ['Restaurantes', 'Cafeterias', 'Delivery', 'Mercados']
    },
    {
      category: 'Compras',
      icon: ShoppingBag,
      count: 85,
      types: ['Shopping Centers', 'Lojas de Rua', 'Farmácias', 'Bancos']
    },
    {
      category: 'Educação',
      icon: GraduationCap,
      count: 24,
      types: ['Escolas Públicas', 'Escolas Privadas', 'Universidades', 'Cursos']
    },
    {
      category: 'Saúde',
      icon: Heart,
      count: 18,
      types: ['Hospitais', 'Clínicas', 'Laboratórios', 'Emergência 24h']
    }
  ];

  const connectivityData = [
    { provider: 'Vivo Fibra', speed: '500 Mbps', price: 'R$ 99/mês', availability: '98%' },
    { provider: 'Claro Net', speed: '350 Mbps', price: 'R$ 89/mês', availability: '95%' },
    { provider: 'Tim Live', speed: '300 Mbps', price: 'R$ 79/mês', availability: '92%' },
    { provider: 'NET/Claro', speed: '250 Mbps', price: 'R$ 69/mês', availability: '88%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <ModuleNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Análise de Infraestrutura
                </h1>
                <p className="text-gray-600">
                  Transporte, conectividade e serviços urbanos
                  {selectedLocation && (
                    <span className="font-medium text-purple-600 ml-2">
                      • {selectedLocation.city}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Score Geral */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Score de Infraestrutura</h3>
                  <p className="text-sm text-gray-600">
                    Baseado em transporte, conectividade e serviços
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Em Desenvolvimento</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Novos projetos em andamento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Buscar Nova Localização
              </h2>
            </div>
            <LocationSearch />
          </div>
        </div>

        {/* Infrastructure Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {infrastructureMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.score.toFixed(1)}/10
              </div>
              <p className="text-xs text-gray-500 mb-3">{metric.description}</p>
              <div className="space-y-1">
                {metric.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Map and Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa de Infraestrutura
                </h2>
              </div>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <LeafletMap selectedLocation={selectedLocation} />
              </div>
            </div>
          </div>

          {/* Nearby Services */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Store className="h-5 w-5 text-purple-600" />
                Serviços Próximos
              </h3>
              <div className="space-y-4">
                {nearbyServices.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{service.category}</h4>
                          <p className="text-sm text-gray-600">{service.count} opções</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {service.types.map((type, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Transport Options */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bus className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Opções de Transporte
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {transportOptions.map((transport, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                <h4 className="font-medium text-gray-900 mb-2">{transport.type}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Disponibilidade:</span>
                    <span className="font-medium text-purple-600">{transport.availability}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tempo médio:</span>
                    <span className="font-medium">{transport.time}</span>
                  </div>
                  {transport.stations && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estações:</span>
                      <span className="font-medium">{transport.stations}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connectivity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Wifi className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Conectividade Digital
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Provedor</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Velocidade</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Preço</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Cobertura</th>
                </tr>
              </thead>
              <tbody>
                {connectivityData.map((provider, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {provider.provider}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-purple-600">
                        {provider.speed}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-medium text-gray-900">
                        {provider.price}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium text-green-600">
                        {provider.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Development Projects */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-purple-900">
              Projetos em Desenvolvimento
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Nova Linha de Metrô</h4>
              <p className="text-sm text-purple-700 mb-2">
                Expansão da Linha Verde com 3 novas estações na região.
              </p>
              <div className="text-xs text-purple-600">
                Previsão: 2026
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Ciclovia Integrada</h4>
              <p className="text-sm text-purple-700 mb-2">
                15km de ciclovia conectando ao centro da cidade.
              </p>
              <div className="text-xs text-purple-600">
                Previsão: 2025
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Hub Tecnológico</h4>
              <p className="text-sm text-purple-700 mb-2">
                Centro de inovação com coworking e startups.
              </p>
              <div className="text-xs text-purple-600">
                Previsão: 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
