'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Loader2,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';
import HybridDataService from '@/services/hybridDataService';

interface APIStatusIndicatorProps {
  showDetails?: boolean;
  compact?: boolean;
}

export default function APIStatusIndicator({ showDetails = false, compact = false }: APIStatusIndicatorProps) {
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkAPIStatus = async () => {
    setIsLoading(true);
    try {
      const status = await HybridDataService.getAPIStatus();
      setApiStatus(status);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Erro ao verificar status das APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAPIStatus();
    
    // Verificar status a cada 5 minutos
    const interval = setInterval(checkAPIStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isOnline: boolean) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    return isOnline ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getOverallStatus = () => {
    const onlineCount = Object.values(apiStatus).filter(Boolean).length;
    const totalCount = Object.keys(apiStatus).length;
    
    if (totalCount === 0) return { status: 'loading', message: 'Verificando...' };
    if (onlineCount === totalCount) return { status: 'online', message: 'Todas as APIs online' };
    if (onlineCount > 0) return { status: 'partial', message: `${onlineCount}/${totalCount} APIs online` };
    return { status: 'offline', message: 'APIs offline (usando dados mock)' };
  };

  const overall = getOverallStatus();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {overall.status === 'online' && <Wifi className="h-4 w-4 text-green-600" />}
        {overall.status === 'partial' && <Activity className="h-4 w-4 text-yellow-600" />}
        {overall.status === 'offline' && <WifiOff className="h-4 w-4 text-red-600" />}
        {overall.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        
        <Badge 
          variant="outline" 
          className={`text-xs ${
            overall.status === 'online' ? 'border-green-600 text-green-700' :
            overall.status === 'partial' ? 'border-yellow-600 text-yellow-700' :
            overall.status === 'offline' ? 'border-red-600 text-red-700' :
            'border-gray-400 text-gray-600'
          }`}
        >
          {overall.message}
        </Badge>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Status das APIs</h3>
        <button
          onClick={checkAPIStatus}
          disabled={isLoading}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Atualizar status"
        >
          <Activity className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">OpenWeather</span>
          <div className="flex items-center gap-1">
            {getStatusIcon(apiStatus.openweather)}
            <span className={`text-xs ${getStatusColor(apiStatus.openweather)}`}>
              {apiStatus.openweather ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">IBGE</span>
          <div className="flex items-center gap-1">
            {getStatusIcon(apiStatus.ibge)}
            <span className={`text-xs ${getStatusColor(apiStatus.ibge)}`}>
              {apiStatus.ibge ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Nominatim</span>
          <div className="flex items-center gap-1">
            {getStatusIcon(apiStatus.nominatim)}
            <span className={`text-xs ${getStatusColor(apiStatus.nominatim)}`}>
              {apiStatus.nominatim ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {lastCheck && (
              <span>Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}</span>
            )}
          </div>
          
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                overall.status === 'online' ? 'border-green-600 text-green-700 bg-green-50' :
                overall.status === 'partial' ? 'border-yellow-600 text-yellow-700 bg-yellow-50' :
                overall.status === 'offline' ? 'border-red-600 text-red-700 bg-red-50' :
                'border-gray-400 text-gray-600 bg-gray-50'
              }`}
            >
              {overall.message}
            </Badge>
          </div>

          {overall.status === 'offline' && (
            <p className="text-xs text-gray-500 mt-2">
              💡 Usando dados simulados realistas como fallback
            </p>
          )}

          {overall.status === 'partial' && (
            <p className="text-xs text-gray-500 mt-2">
              🔄 Combinando dados reais com simulados
            </p>
          )}

          {overall.status === 'online' && (
            <p className="text-xs text-gray-500 mt-2">
              ✅ Todos os dados são obtidos de APIs reais
            </p>
          )}
        </div>
      )}
    </div>
  );
}
