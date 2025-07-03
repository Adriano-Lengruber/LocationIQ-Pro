'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Leaf,
  Wind,
  Thermometer,
  Droplets,
  Sun,
  Cloud,
  Trees,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  Zap,
  Recycle
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import { useLocationStore } from '@/stores/locationStore';
import { useLocationSync } from '@/hooks/useLocationSync';

export default function EnvironmentalPage() {
  // Ativar sincronização de localização
  useLocationSync();
  
  const { analysisData, selectedLocation, currentLocation, mapCenter } = useLocationStore();
  
  const environmentalData = analysisData?.modules.environmental;
  const score = environmentalData?.score || 6.8;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAirQualityColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-50';
    if (aqi <= 150) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAirQualityLabel = (aqi: number) => {
    if (aqi <= 50) return 'Boa';
    if (aqi <= 100) return 'Moderada';
    if (aqi <= 150) return 'Não Saudável para Sensíveis';
    return 'Não Saudável';
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

  const environmentalMetrics = [
    {
      title: 'Qualidade do Ar',
      value: '68 AQI',
      status: 'Moderada',
      trend: 'down',
      description: 'Índice de qualidade do ar',
      color: 'yellow'
    },
    {
      title: 'Áreas Verdes',
      value: '15.2 m²',
      status: 'Adequado',
      trend: 'stable',
      description: 'Por habitante na região',
      color: 'green'
    },
    {
      title: 'Poluição Sonora',
      value: '58 dB',
      status: 'Aceitável',
      trend: 'up',
      description: 'Média diurna',
      color: 'yellow'
    },
    {
      title: 'Gestão de Resíduos',
      value: '78%',
      status: 'Boa',
      trend: 'up',
      description: 'Taxa de reciclagem',
      color: 'green'
    }
  ];

  const airQualityData = [
    { pollutant: 'PM2.5', value: 28, unit: 'μg/m³', status: 'Moderada', limit: 25 },
    { pollutant: 'PM10', value: 45, unit: 'μg/m³', status: 'Boa', limit: 50 },
    { pollutant: 'NO2', value: 35, unit: 'μg/m³', status: 'Boa', limit: 40 },
    { pollutant: 'SO2', value: 12, unit: 'μg/m³', status: 'Boa', limit: 20 },
    { pollutant: 'CO', value: 1.8, unit: 'mg/m³', status: 'Boa', limit: 10 },
    { pollutant: 'O3', value: 95, unit: 'μg/m³', status: 'Moderada', limit: 100 }
  ];

  const climateData = {
    temperature: {
      current: 24,
      min: 18,
      max: 29,
      trend: 'stable'
    },
    humidity: {
      current: 65,
      trend: 'stable'
    },
    precipitation: {
      monthly: 120,
      annual: 1400,
      trend: 'up'
    },
    uvIndex: {
      current: 7,
      status: 'Alto'
    }
  };

  const greenSpaces = [
    {
      name: 'Parque Central',
      area: '125 hectares',
      type: 'Parque Urbano',
      distance: '800m',
      features: ['Trilhas', 'Quadras', 'Playground', 'Lago']
    },
    {
      name: 'Reserva Ecológica',
      area: '89 hectares',
      type: 'Conservação',
      distance: '2.1km',
      features: ['Fauna nativa', 'Trilhas ecológicas', 'Centro de visitantes']
    },
    {
      name: 'Jardim Botânico',
      area: '32 hectares',
      type: 'Educacional',
      distance: '1.5km',
      features: ['Coleções de plantas', 'Estufas', 'Pesquisa', 'Museu']
    },
    {
      name: 'Parque Linear',
      area: '45 hectares',
      type: 'Corredor Verde',
      distance: '600m',
      features: ['Ciclovia', 'Caminhada', 'Paisagismo', 'Córrego']
    }
  ];

  const sustainabilityInitiatives = [
    {
      title: 'Energia Renovável',
      description: 'Programa municipal de energia solar em prédios públicos',
      progress: 68,
      impact: '15% redução nas emissões'
    },
    {
      title: 'Transporte Limpo',
      description: 'Frota de ônibus elétricos e incentivo a bicicletas',
      progress: 45,
      impact: '200 toneladas CO2/ano'
    },
    {
      title: 'Coleta Seletiva',
      description: 'Ampliação da rede de coleta seletiva e compostagem',
      progress: 78,
      impact: '60% de material reciclado'
    },
    {
      title: 'Construção Verde',
      description: 'Incentivos para certificações ambientais em edifícios',
      progress: 35,
      impact: '25% economia de energia'
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
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Análise da Qualidade Ambiental
                </h1>
                <p className="text-gray-600">
                  Ar, áreas verdes, clima e sustentabilidade urbana
                  {selectedLocation && (
                    <span className="font-medium text-emerald-600 ml-2">
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
                  <h3 className="text-lg font-semibold text-gray-900">Score Ambiental</h3>
                  <p className="text-sm text-gray-600">
                    Baseado em ar, ruído, áreas verdes e sustentabilidade
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Necessita Atenção</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Qualidade do ar em foco</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Buscar Nova Localização
              </h2>
            </div>
            <LocationSearch />
          </div>
        </div>

        {/* Environmental Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {environmentalMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className={`text-sm mb-2 ${
                metric.color === 'green' ? 'text-green-600' : 
                metric.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metric.status}
              </div>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Map and Climate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa Ambiental
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

          {/* Climate Data */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-emerald-600" />
                Dados Climáticos
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Temperatura</span>
                    <span className="text-lg font-bold text-blue-600">{climateData.temperature.current}°C</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Min: {climateData.temperature.min}°C | Max: {climateData.temperature.max}°C
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Umidade</span>
                    <span className="text-lg font-bold text-indigo-600">{climateData.humidity.current}%</span>
                  </div>
                  <div className="text-xs text-gray-600">Relativa do ar</div>
                </div>

                <div className="p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Precipitação</span>
                    <span className="text-lg font-bold text-cyan-600">{climateData.precipitation.monthly}mm</span>
                  </div>
                  <div className="text-xs text-gray-600">Este mês</div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Índice UV</span>
                    <span className="text-lg font-bold text-orange-600">{climateData.uvIndex.current}</span>
                  </div>
                  <div className="text-xs text-gray-600">{climateData.uvIndex.status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Air Quality Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Wind className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Detalhes da Qualidade do Ar
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airQualityData.map((pollutant, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{pollutant.pollutant}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pollutant.status === 'Boa' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {pollutant.status}
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {pollutant.value} <span className="text-sm font-normal text-gray-600">{pollutant.unit}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Limite: {pollutant.limit} {pollutant.unit}
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      pollutant.value <= pollutant.limit ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((pollutant.value / pollutant.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Green Spaces */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Trees className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Espaços Verdes Próximos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {greenSpaces.map((space, index) => (
              <div key={index} className="p-6 bg-green-50 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
                    <p className="text-sm text-green-600">{space.type}</p>
                  </div>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {space.distance}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="font-bold text-gray-900">{space.area}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Características:</p>
                  <div className="flex flex-wrap gap-2">
                    {space.features.map((feature, idx) => (
                      <span key={idx} className="bg-white px-2 py-1 rounded text-xs text-gray-700 border border-green-200">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Initiatives */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-emerald-900">
              Iniciativas de Sustentabilidade
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sustainabilityInitiatives.map((initiative, index) => (
              <div key={index} className="bg-white/60 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-emerald-900">{initiative.title}</h4>
                  <span className="text-sm font-bold text-emerald-600">{initiative.progress}%</span>
                </div>
                
                <p className="text-sm text-emerald-700 mb-4">
                  {initiative.description}
                </p>
                
                <div className="mb-3">
                  <div className="bg-emerald-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-xs text-emerald-600 font-medium">
                  Impacto: {initiative.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
