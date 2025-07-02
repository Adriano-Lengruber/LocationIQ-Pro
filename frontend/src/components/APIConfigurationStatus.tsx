'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

interface APIConfig {
  name: string;
  key: string;
  status: 'configured' | 'missing' | 'invalid';
  required: boolean;
  description: string;
  testUrl?: string;
}

interface APIStatusData {
  apis: APIConfig[];
  summary: {
    total: number;
    configured: number;
    missing: number;
    invalid: number;
  };
  health: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
    errors: string[];
    warnings: string[];
  };
}

export default function APIConfigurationStatus() {
  const [apiStatus, setApiStatus] = useState<APIStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAPIs, setShowAllAPIs] = useState(false);

  const fetchAPIStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/api/config/apis/status');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setApiStatus(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar status das APIs:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Dados mock para desenvolvimento
      setApiStatus({
        apis: [
          {
            name: 'Mapbox',
            key: 'MAPBOX_TOKEN',
            status: 'missing',
            required: true,
            description: 'Mapas interativos e geocodificação'
          },
          {
            name: 'Google Places',
            key: 'GOOGLE_PLACES_API_KEY',
            status: 'missing',
            required: true,
            description: 'Busca de locais e informações de estabelecimentos'
          },
          {
            name: 'OpenWeather',
            key: 'OPENWEATHER_API_KEY',
            status: 'missing',
            required: false,
            description: 'Dados meteorológicos e qualidade do ar'
          }
        ],
        summary: {
          total: 3,
          configured: 0,
          missing: 3,
          invalid: 0
        },
        health: {
          status: 'warning',
          message: 'APIs não configuradas - usando dados mock',
          errors: [],
          warnings: ['APIs externas não configuradas']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'missing':
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string, required: boolean) => {
    const baseClasses = "text-xs font-medium";
    
    switch (status) {
      case 'configured':
        return <Badge className={`${baseClasses} bg-green-50 text-green-700 border-green-200`}>Configurado</Badge>;
      case 'invalid':
        return <Badge className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>Inválido</Badge>;
      case 'missing':
      default:
        if (required) {
          return <Badge className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>Obrigatório</Badge>;
        }
        return <Badge className={`${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`}>Opcional</Badge>;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Verificando status das APIs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !apiStatus) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700">Erro ao verificar APIs</span>
            </div>
            <button
              onClick={fetchAPIStatus}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Tentar novamente
            </button>
          </div>
          <p className="text-xs text-red-600 mt-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!apiStatus) return null;

  const visibleAPIs = showAllAPIs ? apiStatus.apis : apiStatus.apis.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Status das APIs</span>
          <button
            onClick={fetchAPIStatus}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Geral */}
        <div className={`p-3 rounded-lg border ${getHealthColor(apiStatus.health.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {apiStatus.health.status === 'healthy' && <CheckCircle className="h-4 w-4 mr-2" />}
              {apiStatus.health.status === 'warning' && <AlertTriangle className="h-4 w-4 mr-2" />}
              {apiStatus.health.status === 'error' && <XCircle className="h-4 w-4 mr-2" />}
              <span className="text-sm font-medium">{apiStatus.health.message}</span>
            </div>
            <div className="text-xs">
              {apiStatus.summary.configured}/{apiStatus.summary.total} configuradas
            </div>
          </div>
        </div>

        {/* Lista de APIs */}
        <div className="space-y-2">
          {visibleAPIs.map((api) => (
            <div key={api.key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                {getStatusIcon(api.status)}
                <div>
                  <p className="text-sm font-medium">{api.name}</p>
                  <p className="text-xs text-gray-500">{api.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(api.status, api.required)}
              </div>
            </div>
          ))}
        </div>

        {/* Botão Ver Mais/Menos */}
        {apiStatus.apis.length > 3 && (
          <button
            onClick={() => setShowAllAPIs(!showAllAPIs)}
            className="w-full text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center py-2"
          >
            {showAllAPIs ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Ver menos
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Ver todas ({apiStatus.apis.length})
              </>
            )}
          </button>
        )}

        {/* Avisos e Erros */}
        {(apiStatus.health.warnings.length > 0 || apiStatus.health.errors.length > 0) && (
          <div className="space-y-1">
            {apiStatus.health.warnings.map((warning, index) => (
              <div key={index} className="flex items-center text-xs text-yellow-700">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {warning}
              </div>
            ))}
            {apiStatus.health.errors.map((error, index) => (
              <div key={index} className="flex items-center text-xs text-red-700">
                <XCircle className="h-3 w-3 mr-1" />
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Link para Configuração */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 mb-2">
            Para configurar as APIs, consulte o guia de configuração:
          </p>
          <div className="flex space-x-2 text-xs">
            <a 
              href="/api_keys_setup_guide.md" 
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              📖 Guia Completo
            </a>
            <a 
              href="/QUICK_START_APIS.md" 
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⚡ Quick Start
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
