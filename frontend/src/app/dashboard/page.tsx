'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import LocationSearch from '@/components/LocationSearch';
import { useLocationStore } from '@/stores/locationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Hotel, 
  TrendingUp, 
  Leaf, 
  Shield, 
  Store,
  MapPin,
  Star
} from 'lucide-react';

// Importação dinâmica do mapa para evitar problemas de SSR
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

interface ModuleScore {
  id: string;
  name: string;
  icon: React.ElementType;
  score: number;
  description: string;
  color: string;
}

// Dados mock baseados nos módulos do planejamento estratégico
const mockModuleScores: ModuleScore[] = [
  {
    id: 'residential',
    name: 'Residencial',
    icon: Home,
    score: 8.5,
    description: 'Ótimo para moradia',
    color: 'bg-blue-500'
  },
  {
    id: 'hospitality',
    name: 'Hospedagem',
    icon: Hotel,
    score: 7.2,
    description: 'Boa opção turística',
    color: 'bg-purple-500'
  },
  {
    id: 'investment',
    name: 'Investimento',
    icon: TrendingUp,
    score: 9.1,
    description: 'Alto potencial ROI',
    color: 'bg-green-500'
  },
  {
    id: 'environmental',
    name: 'Ambiental',
    icon: Leaf,
    score: 6.8,
    description: 'Qualidade moderada',
    color: 'bg-emerald-500'
  },
  {
    id: 'security',
    name: 'Segurança',
    icon: Shield,
    score: 7.9,
    description: 'Área segura',
    color: 'bg-indigo-500'
  },
  {
    id: 'infrastructure',
    name: 'Infraestrutura',
    icon: Store,
    score: 8.7,
    description: 'Excelente conveniência',
    color: 'bg-orange-500'
  }
];

function ScoreCard({ module }: { module: ModuleScore }) {
  const Icon = module.icon;
  
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-50';
    if (score >= 7.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <div className={`p-2 rounded-lg ${module.color} text-white`}>
            <Icon className="h-4 w-4" />
          </div>
          {module.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Badge className={`text-lg font-bold px-3 py-1 ${getScoreColor(module.score)}`}>
              {module.score}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{module.description}</p>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(module.score / 2) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { selectedLocation, isAnalyzing } = useLocationStore();
  const [activeTab, setActiveTab] = useState('overview');

  const overallScore = selectedLocation 
    ? mockModuleScores.reduce((acc, module) => acc + module.score, 0) / mockModuleScores.length
    : null;

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
              <Badge variant="outline" className="text-xs">MVP</Badge>
            </div>
            
            <div className="flex-1 max-w-2xl mx-8">
              <LocationSearch />
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Análise Inteligente</p>
              <p className="text-xs text-gray-400">de Localização</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <MapComponent className="h-96 lg:h-[600px]" />
              </CardContent>
            </Card>
          </div>

          {/* Painel de Análise */}
          <div className="space-y-6">
            
            {/* Score Geral */}
            {selectedLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização Selecionada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm truncate">
                        {selectedLocation.address}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedLocation.city && selectedLocation.state && 
                          `${selectedLocation.city}, ${selectedLocation.state}`}
                      </p>
                    </div>
                    
                    {overallScore && (
                      <div className="text-center py-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                        <p className="text-sm font-medium text-gray-700 mb-1">Score Geral</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {overallScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">de 10.0</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Módulos de Análise */}
            {selectedLocation ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Análise por Módulo</h3>
                <div className="grid grid-cols-1 gap-3">
                  {mockModuleScores.map((module) => (
                    <ScoreCard key={module.id} module={module} />
                  ))}
                </div>
              </div>
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

        {/* Informações do MVP */}
        {!selectedLocation && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>🚀 LocationIQ Pro - MVP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Análise Residencial</h4>
                    <p className="text-sm text-gray-500">Score de habitabilidade e previsão de preços</p>
                  </div>
                  
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Potencial de Investimento</h4>
                    <p className="text-sm text-gray-500">ROI projetado e análise de mercado</p>
                  </div>
                  
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Índice de Segurança</h4>
                    <p className="text-sm text-gray-500">Dados de criminalidade e segurança urbana</p>
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
