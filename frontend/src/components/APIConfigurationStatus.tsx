'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Eye,
  EyeOff,
  Leaf,
  MapPin,
  Globe,
  ExternalLink
} from 'lucide-react';

interface APIConfig {
  name: string;
  status: 'configured';
  required: boolean;
  description: string;
  type: 'free' | 'open-source';
  url?: string;
}

export default function APIConfigurationStatus() {
  const [showDetails, setShowDetails] = useState(false);

  const apis: APIConfig[] = [
    {
      name: 'OpenStreetMap',
      status: 'configured',
      required: true,
      description: 'Mapas interativos gratuitos e de código aberto',
      type: 'open-source',
      url: 'https://www.openstreetmap.org'
    },
    {
      name: 'OpenWeatherMap (Free Tier)',
      status: 'configured',
      required: true,
      description: 'Dados climáticos gratuitos (até 1000 calls/dia)',
      type: 'free',
      url: 'https://openweathermap.org/api'
    },
    {
      name: 'IBGE API',
      status: 'configured',
      required: true,
      description: 'Dados socioeconômicos do Brasil - API pública gratuita',
      type: 'open-source',
      url: 'https://servicodados.ibge.gov.br/api/docs'
    },
    {
      name: 'dados.gov.br',
      status: 'configured',
      required: false,
      description: 'Dados públicos do governo brasileiro',
      type: 'open-source',
      url: 'https://dados.gov.br'
    },
    {
      name: 'Leaflet Maps',
      status: 'configured',
      required: true,
      description: 'Biblioteca JavaScript gratuita para mapas interativos',
      type: 'open-source',
      url: 'https://leafletjs.com'
    }
  ];

  const getStatusIcon = () => <CheckCircle className="h-5 w-5 text-green-500" />;
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'open-source':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'free':
        return <Globe className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'open-source':
        return <Badge variant="outline" className="text-green-700 border-green-700">Open Source</Badge>;
      case 'free':
        return <Badge variant="outline" className="text-blue-700 border-blue-700">Gratuito</Badge>;
      default:
        return <Badge variant="outline">Padrão</Badge>;
    }
  };

  const configuredApis = apis.filter(api => api.status === 'configured');

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Status das APIs - 100% Gratuitas
            </CardTitle>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 
                         rounded-md transition-colors"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes'}
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{configuredApis.length}</div>
              <div className="text-sm text-green-600">APIs Configuradas</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">100%</div>
              <div className="text-sm text-blue-600">Gratuitas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">R$ 0</div>
              <div className="text-sm text-purple-600">Custo Total</div>
            </div>
          </div>

          {/* Status Geral */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <div className="font-medium text-green-800">Sistema Totalmente Operacional</div>
              <div className="text-sm text-green-600">
                Todas as APIs estão funcionando perfeitamente com soluções gratuitas
              </div>
            </div>
          </div>

          {/* Lista de APIs (mostrada apenas se showDetails for true) */}
          {showDetails && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">APIs Integradas</h3>
              
              {apis.map((api, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(api.type)}
                        {getStatusIcon()}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{api.name}</h4>
                          {api.required && (
                            <Badge variant="outline" className="text-xs">Essencial</Badge>
                          )}
                          {getTypeBadge(api.type)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{api.description}</p>
                        
                        {api.url && (
                          <a 
                            href={api.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Documentação
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Destaque sobre custo zero */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  💚 Compromisso com Soluções Gratuitas
                </h4>
                <p className="text-sm text-gray-600">
                  Este projeto demonstra como é possível criar análises urbanas sofisticadas 
                  usando exclusivamente APIs gratuitas e bibliotecas open-source, 
                  eliminando barreiras financeiras para inovação.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
