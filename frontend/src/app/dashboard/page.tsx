'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LocationSearch from '@/components/LocationSearch';
import { useLocationStore } from '@/stores/locationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Hotel, 
  TrendingUp, 
  Leaf, 
  Shield, 
  Store,
  MapPin,
  Star,
  BarChart3,
  Activity,
  Users,
  ChartBar,
  ArrowLeft
} from 'lucide-react';

// Importações dinâmicas
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  )
});

const RealEstateAnalysis = dynamic(() => import('@/components/RealEstateAnalysis'), { ssr: false });
const SecurityAnalysis = dynamic(() => import('@/components/SecurityAnalysis'), { ssr: false });
const InfrastructureAnalysis = dynamic(() => import('@/components/InfrastructureAnalysis'), { ssr: false });
const { ScoreRadarChart, ScoreBarChart } = require('@/components/ScoreCharts');

// Componente para overview dos scores
function ScoreOverview({ selectedLocation }: { selectedLocation: any }) {
  const mockScores = {
    residential: 8.5,
    hospitality: 7.2,
    investment: 9.1,
    environmental: 6.8,
    security: 7.9,
    infrastructure: 8.7
  };

  const scoreData = [
    { label: 'Residencial', value: mockScores.residential, icon: Home, color: 'bg-blue-500' },
    { label: 'Hospedagem', value: mockScores.hospitality, icon: Hotel, color: 'bg-purple-500' },
    { label: 'Investimento', value: mockScores.investment, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Ambiental', value: mockScores.environmental, icon: Leaf, color: 'bg-emerald-500' },
    { label: 'Segurança', value: mockScores.security, icon: Shield, color: 'bg-indigo-500' },
    { label: 'Infraestrutura', value: mockScores.infrastructure, icon: Store, color: 'bg-orange-500' }
  ];

  const overallScore = scoreData.reduce((acc, score) => acc + score.value, 0) / scoreData.length;

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 7.0) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Score Geral */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Score Geral da Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {overallScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">de 10.0</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(overallScore / 10) * 100}%` }}
            ></div>
          </div>
          <Badge className={getScoreColor(overallScore)}>
            {overallScore >= 8.5 ? 'Excelente Localização' : 
             overallScore >= 7.0 ? 'Boa Localização' : 
             'Localização com Potencial'}
          </Badge>
        </CardContent>
      </Card>

      {/* Scores por Módulo */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {scoreData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <Badge className={getScoreColor(item.value)}>
                    {item.value.toFixed(1)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardEnhancedPage() {
  const { selectedLocation, isAnalyzing } = useLocationStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Dados dos scores para gráficos
  const scoreData = [
    { label: 'Residencial', value: 8.5, icon: Home, color: 'bg-blue-500' },
    { label: 'Hospedagem', value: 7.2, icon: Hotel, color: 'bg-purple-500' },
    { label: 'Investimento', value: 9.1, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Ambiental', value: 6.8, icon: Leaf, color: 'bg-emerald-500' },
    { label: 'Segurança', value: 7.9, icon: Shield, color: 'bg-indigo-500' },
    { label: 'Infraestrutura', value: 8.7, icon: Store, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">LocationIQ Pro</h1>
              </div>
              <Badge variant="outline" className="text-xs">Enhanced</Badge>
            </div>
            
            <div className="flex-1 max-w-2xl mx-8">
              <LocationSearch />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Análise Inteligente</p>
                <p className="text-xs text-gray-400">de Localização</p>
              </div>
              
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Dashboard Simples</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Mapa */}
          <div className="xl:col-span-2">
            <Card>
              <CardContent className="p-0">
                <MapComponent className="h-96 xl:h-[600px]" />
              </CardContent>
            </Card>
          </div>

          {/* Painel de Análise */}
          <div className="space-y-6">
            {selectedLocation ? (
              <>
                {/* Informações da Localização */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Localização Selecionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">{selectedLocation.address}</p>
                      {selectedLocation.city && selectedLocation.state && (
                        <p className="text-xs text-gray-500">
                          {selectedLocation.city}, {selectedLocation.state}
                        </p>
                      )}
                      <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Overview dos Scores */}
                <ScoreOverview selectedLocation={selectedLocation} />
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Selecione uma localização
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Use a busca acima para encontrar e analisar qualquer endereço
                  </p>
                  <Badge variant="outline" className="text-xs">
                    6 módulos de análise disponíveis
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Análises Detalhadas em Abas */}
        {selectedLocation && (
          <div className="mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="real-estate" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Imobiliário</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Segurança</span>
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="hidden sm:inline">Infraestrutura</span>
                </TabsTrigger>
                <TabsTrigger value="hospitality" className="flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  <span className="hidden sm:inline">Hospedagem</span>
                </TabsTrigger>
                <TabsTrigger value="environmental" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Ambiental</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Gráficos de Score */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Análise Radar - Scores por Módulo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScoreRadarChart scores={scoreData.map(item => ({
                          label: item.label,
                          value: item.value,
                          color: item.color
                        }))} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Comparativo de Scores</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScoreBarChart scores={scoreData.map(item => ({
                          label: item.label,
                          value: item.value,
                          color: item.color
                        }))} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Pontos Fortes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Alta infraestrutura urbana
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Excelente potencial de investimento
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Boa qualidade residencial
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Pontos de Atenção</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Qualidade ambiental moderada
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Potencial turístico em desenvolvimento
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Recomendações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Ideal para moradia
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Ótimo para investimento
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Monitorar desenvolvimento ambiental
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="real-estate" className="mt-6">
                <RealEstateAnalysis 
                  latitude={selectedLocation.coordinates.lat}
                  longitude={selectedLocation.coordinates.lng}
                />
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <SecurityAnalysis 
                  latitude={selectedLocation.coordinates.lat}
                  longitude={selectedLocation.coordinates.lng}
                />
              </TabsContent>

              <TabsContent value="infrastructure" className="mt-6">
                <InfrastructureAnalysis 
                  latitude={selectedLocation.coordinates.lat}
                  longitude={selectedLocation.coordinates.lng}
                />
              </TabsContent>

              <TabsContent value="hospitality" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="h-5 w-5" />
                      Análise de Hospedagem
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Hotel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Módulo em desenvolvimento</p>
                      <p className="text-sm text-gray-400">Análise de hotéis e turismo</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="environmental" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Análise Ambiental
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Módulo em desenvolvimento</p>
                      <p className="text-sm text-gray-400">Qualidade do ar e clima</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Informações do MVP se não há localização selecionada */}
        {!selectedLocation && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>🚀 LocationIQ Pro - Dashboard Enhanced</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <ChartBar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Análise Integrada</h4>
                    <p className="text-sm text-gray-500">Dashboard com abas organizadas para cada módulo</p>
                  </div>
                  
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Scores Dinâmicos</h4>
                    <p className="text-sm text-gray-500">Visualização aprimorada dos indicadores</p>
                  </div>
                  
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Insights Inteligentes</h4>
                    <p className="text-sm text-gray-500">Recomendações personalizadas por localização</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
