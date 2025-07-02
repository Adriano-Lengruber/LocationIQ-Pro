'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Hotel,
  Star,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  DollarSign,
  Coffee,
  Wifi,
  Car,
  Utensils,
  Plane,
  CheckCircle2,
  Info,
  Camera,
  Zap
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import { useLocationStore } from '@/stores/locationStore';

export default function HospitalityPage() {
  const { analysisData, selectedLocation } = useLocationStore();
  
  const hospitalityData = analysisData?.modules.hospitality;
  const score = hospitalityData?.score || 8.1;
  
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

  const marketMetrics = [
    {
      title: 'Taxa de Ocupação',
      value: '78%',
      change: '+5.2%',
      trend: 'up',
      description: 'Média dos últimos 12 meses'
    },
    {
      title: 'Preço Médio Diária',
      value: 'R$ 280',
      change: '+8.1%',
      trend: 'up',
      description: 'RevPAR médio da região'
    },
    {
      title: 'Avaliação Média',
      value: '4.2⭐',
      change: '+0.1',
      trend: 'up',
      description: 'Score médio dos hóspedes'
    },
    {
      title: 'Sazonalidade',
      value: 'Baixa',
      change: 'Estável',
      trend: 'stable',
      description: 'Variação anual da demanda'
    }
  ];

  const hotelCategories = [
    {
      category: 'Hotéis Econômicos',
      count: 28,
      priceRange: 'R$ 120-180',
      occupancy: '85%',
      rating: 3.8,
      features: ['Wi-Fi', 'Café da manhã', 'Ar condicionado']
    },
    {
      category: 'Hotéis Executivos',
      count: 15,
      priceRange: 'R$ 250-400',
      occupancy: '72%',
      rating: 4.3,
      features: ['Business Center', 'Academia', 'Estacionamento']
    },
    {
      category: 'Hotéis Luxury',
      count: 8,
      priceRange: 'R$ 500-800',
      occupancy: '68%',
      rating: 4.7,
      features: ['Spa', 'Concierge', 'Fine Dining']
    },
    {
      category: 'Pousadas/B&B',
      count: 22,
      priceRange: 'R$ 90-150',
      occupancy: '79%',
      rating: 4.1,
      features: ['Ambiente familiar', 'Localização central', 'Personalizado']
    }
  ];

  const monthlyData = [
    { month: 'Jan', occupancy: 72, price: 260 },
    { month: 'Fev', occupancy: 68, price: 240 },
    { month: 'Mar', occupancy: 75, price: 270 },
    { month: 'Abr', occupancy: 82, price: 290 },
    { month: 'Mai', occupancy: 79, price: 285 },
    { month: 'Jun', occupancy: 73, price: 275 },
    { month: 'Jul', occupancy: 88, price: 320 },
    { month: 'Ago', occupancy: 85, price: 310 },
    { month: 'Set', occupancy: 77, price: 280 },
    { month: 'Out', occupancy: 81, price: 295 },
    { month: 'Nov', occupancy: 84, price: 300 },
    { month: 'Dez', occupancy: 91, price: 350 }
  ];

  const attractions = [
    {
      name: 'Museu de Arte Moderna',
      type: 'Cultural',
      distance: '800m',
      rating: 4.6,
      visitors: '2M/ano'
    },
    {
      name: 'Parque Central',
      type: 'Lazer',
      distance: '1.2km',
      rating: 4.4,
      visitors: '5M/ano'
    },
    {
      name: 'Centro Histórico',
      type: 'Histórico',
      distance: '600m',
      rating: 4.5,
      visitors: '3M/ano'
    },
    {
      name: 'Shopping Center',
      type: 'Compras',
      distance: '1.5km',
      rating: 4.2,
      visitors: '8M/ano'
    },
    {
      name: 'Teatro Municipal',
      type: 'Cultural',
      distance: '900m',
      rating: 4.7,
      visitors: '500k/ano'
    },
    {
      name: 'Mercado Central',
      type: 'Gastronômico',
      distance: '700m',
      rating: 4.3,
      visitors: '1.5M/ano'
    }
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
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Hotel className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Análise do Mercado Hoteleiro
                </h1>
                <p className="text-gray-600">
                  Turismo, ocupação e oportunidades de hospedagem
                  {selectedLocation && (
                    <span className="font-medium text-orange-600 ml-2">
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
                  <h3 className="text-lg font-semibold text-gray-900">Score do Mercado Hoteleiro</h3>
                  <p className="text-sm text-gray-600">
                    Baseado em ocupação, preços e satisfação
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Crescimento Sustentável</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Tendência dos últimos 2 anos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Buscar Nova Localização
              </h2>
            </div>
            <LocationSearch />
          </div>
        </div>

        {/* Market Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {marketMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className={`text-sm mb-2 ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </div>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Map and Attractions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa Turístico da Região
                </h2>
              </div>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <LeafletMap selectedLocation={selectedLocation} />
              </div>
            </div>
          </div>

          {/* Attractions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-orange-600" />
                Atrações Próximas
              </h3>
              <div className="space-y-3">
                {attractions.slice(0, 4).map((attraction, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {attraction.name}
                      </h4>
                      <span className="text-xs text-orange-600 font-medium">
                        {attraction.distance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{attraction.type}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{attraction.rating}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {attraction.visitors} visitantes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Categories */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Categorias de Hospedagem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotelCategories.map((category, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.category}
                  </h3>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    {category.count} hotéis
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Faixa de Preço</p>
                    <p className="font-bold text-gray-900">{category.priceRange}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxa Ocupação</p>
                    <p className="font-bold text-green-600">{category.occupancy}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">Avaliação:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{category.rating}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Principais amenidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.features.map((feature, idx) => (
                      <span key={idx} className="bg-white px-2 py-1 rounded text-xs text-gray-700 border">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Análise Sazonal
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{month.month}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Ocupação</p>
                    <p className="font-bold text-orange-600">{month.occupancy}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Preço Médio</p>
                    <p className="font-bold text-gray-900">R$ {month.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tourism Insights */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-900">
              Insights do Turismo
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Perfil do Turista</h4>
              <p className="text-sm text-orange-700">
                65% turismo de negócios, 35% lazer. Permanência média de 2.3 dias. 
                Alto poder aquisitivo.
              </p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Melhor Época</h4>
              <p className="text-sm text-orange-700">
                Dezembro e julho apresentam picos de demanda. Eventos corporativos 
                impulsionam ocupação durante a semana.
              </p>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Oportunidades</h4>
              <p className="text-sm text-orange-700">
                Demanda crescente por hotéis boutique e experiências personalizadas. 
                Segmento corporativo em expansão.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
