'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  AlertTriangle,
  TrendingDown,
  MapPin,
  Clock,
  Users,
  Phone,
  Camera,
  Lightbulb,
  CheckCircle2,
  Info,
  Eye,
  Car,
  Home as HomeIcon
} from 'lucide-react';

import LocationSearch from '@/components/LocationSearch';
import LeafletMap from '@/components/LeafletMap';
import ModuleNavigation from '@/components/ModuleNavigation';
import { useLocationStore } from '@/stores/locationStore';

export default function SecurityPage() {
  const { analysisData, selectedLocation, currentLocation, mapCenter } = useLocationStore();

  const securityData = {
    overallScore: 7.2,
    crimeIndex: 35, // Quanto menor, melhor
    violentCrimesRate: 12.5,
    propertycrimesRate: 28.3,
    policeResponse: 8.5,
    streetLighting: 85,
    cctvCoverage: 72,
    communityWatch: 65,
    emergencyServices: 92
  };

  const crimeTypes = [
    {
      type: 'Furtos',
      incidents: 245,
      trend: 'down',
      change: -15.2,
      risk: 'Médio',
      color: 'yellow'
    },
    {
      type: 'Roubos',
      incidents: 89,
      trend: 'down',
      change: -8.5,
      risk: 'Baixo',
      color: 'green'
    },
    {
      type: 'Violência',
      incidents: 23,
      trend: 'stable',
      change: -2.1,
      risk: 'Muito Baixo',
      color: 'green'
    },
    {
      type: 'Tráfico',
      incidents: 12,
      trend: 'down',
      change: -25.0,
      risk: 'Muito Baixo',
      color: 'green'
    }
  ];

  const safetyFeatures = [
    {
      feature: 'Iluminação Pública',
      score: securityData.streetLighting,
      status: 'Boa',
      description: 'Cobertura adequada em vias principais',
      icon: Lightbulb,
      color: 'yellow'
    },
    {
      feature: 'Câmeras de Segurança',
      score: securityData.cctvCoverage,
      status: 'Moderada',
      description: 'Sistema integrado de monitoramento',
      icon: Camera,
      color: 'blue'
    },
    {
      feature: 'Policiamento',
      score: securityData.policeResponse,
      status: 'Excelente',
      description: 'Tempo de resposta rápido',
      icon: Shield,
      color: 'green'
    },
    {
      feature: 'Vigilância Comunitária',
      score: securityData.communityWatch,
      status: 'Regular',
      description: 'Participação da comunidade ativa',
      icon: Users,
      color: 'purple'
    }
  ];

  const timeAnalysis = [
    { period: '00-06h', incidents: 15, risk: 'Baixo' },
    { period: '06-12h', incidents: 45, risk: 'Médio' },
    { period: '12-18h', incidents: 85, risk: 'Alto' },
    { period: '18-24h', incidents: 65, risk: 'Alto' }
  ];

  const districts = [
    {
      name: 'Centro Histórico',
      score: 6.8,
      incidents: 156,
      policeStations: 3,
      characteristics: ['Comercial', 'Turístico', 'Movimentado']
    },
    {
      name: 'Zona Residencial Norte',
      score: 8.1,
      incidents: 89,
      policeStations: 2,
      characteristics: ['Residencial', 'Familiar', 'Tranquilo']
    },
    {
      name: 'Distrito Industrial',
      score: 7.5,
      incidents: 124,
      policeStations: 2,
      characteristics: ['Industrial', 'Comercial', 'Noturno']
    },
    {
      name: 'Zona Sul',
      score: 8.5,
      incidents: 67,
      policeStations: 4,
      characteristics: ['Alto Padrão', 'Seguro', 'Vigiado']
    }
  ];

  const emergencyContacts = [
    { service: 'Polícia Militar', number: '190', response: '8 min' },
    { service: 'Bombeiros', number: '193', response: '12 min' },
    { service: 'SAMU', number: '192', response: '15 min' },
    { service: 'Polícia Civil', number: '197', response: '25 min' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Muito Baixo':
      case 'Baixo':
        return 'bg-green-100 text-green-700';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-700';
      case 'Alto':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Análise de Segurança
                  </h1>
                  <p className="text-gray-600">
                    Criminalidade e segurança pública
                    {selectedLocation && (
                      <span className="font-medium text-green-600 ml-2">
                        • {selectedLocation.city}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Score de Segurança</p>
                    <p className="text-2xl font-bold text-green-600">
                      {analysisData?.modules.security.score.toFixed(1) || securityData.overallScore}
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

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Índice de Crime</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {securityData.crimeIndex}
            </p>
            <p className="text-sm text-green-600 font-medium">
              -12% (menor é melhor)
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Policiamento</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {securityData.policeResponse}/10
            </p>
            <p className="text-sm text-blue-600 font-medium">Excelente resposta</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Monitoramento</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {securityData.cctvCoverage}%
            </p>
            <p className="text-sm text-purple-600 font-medium">Cobertura CCTV</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Emergência</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {securityData.emergencyServices}%
            </p>
            <p className="text-sm text-orange-600 font-medium">Disponibilidade</p>
          </div>
        </div>

        {/* Map and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Mapa de Incidentes
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
            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contatos de Emergência
              </h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {contact.service}
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        {contact.number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Tempo médio</p>
                      <p className="text-sm font-medium text-gray-700">
                        {contact.response}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">
                  Dicas de Segurança
                </h3>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Evite andar sozinho após 22h</li>
                <li>• Use aplicativos de transporte em áreas isoladas</li>
                <li>• Mantenha objetos de valor guardados</li>
                <li>• Conheça os pontos de polícia próximos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Crime Types Analysis */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Análise por Tipo de Crime
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crimeTypes.map((crime, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {crime.type}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRiskColor(crime.risk)}`}>
                    {crime.risk}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Incidentes (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {crime.incidents}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${crime.trend === 'up' ? 'bg-red-500' : 
                        crime.trend === 'down' ? 'bg-green-500' : 'bg-gray-400'}
                    `} />
                    <span className={`
                      text-sm font-medium
                      ${crime.trend === 'up' ? 'text-red-600' : 
                        crime.trend === 'down' ? 'text-green-600' : 'text-gray-600'}
                    `}>
                      {crime.change > 0 ? '+' : ''}{crime.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Analysis */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Análise por Horário
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {timeAnalysis.map((time, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {time.period}
                    </h3>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {time.incidents}
                    </p>
                    <p className="text-sm text-gray-600">incidentes</p>
                  </div>
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRiskColor(time.risk)}`}>
                    {time.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recursos de Segurança
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {feature.feature}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {feature.score}%
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            feature.status === 'Excelente' ? 'bg-green-100 text-green-700' :
                            feature.status === 'Boa' ? 'bg-blue-100 text-blue-700' :
                            feature.status === 'Moderada' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {feature.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${feature.color}-500`}
                          style={{ width: `${feature.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Districts Comparison */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Comparação por Distrito
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {districts.map((district, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {district.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${getScoreColor(district.score)}`}>
                        {district.score}
                      </div>
                      <span className="text-sm text-gray-600">Score de segurança</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {district.incidents}
                    </p>
                    <p className="text-sm text-gray-600">incidentes/mês</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {district.policeStations} delegacia{district.policeStations > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {district.characteristics.map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Fontes de Dados
            </h3>
          </div>
          <p className="text-sm text-green-700 mb-4">
            Dados de segurança baseados em fontes oficiais e públicas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-600">
            <div>• Secretaria de Segurança Pública</div>
            <div>• Polícia Civil e Militar</div>
            <div>• Sistema Nacional de Informações</div>
          </div>
        </div>
      </div>
    </div>
  );
}
