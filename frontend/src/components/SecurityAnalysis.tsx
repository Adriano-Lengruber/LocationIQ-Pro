'use client';

import React, { useState, useEffect } from 'react';
import { securityService, SecurityScore } from '@/services/securityService';

interface SecurityAnalysisProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

export default function SecurityAnalysis({ 
  latitude, 
  longitude, 
  radius = 1000 
}: SecurityAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SecurityScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      loadSecurityData();
    }
  }, [latitude, longitude, radius]);

  const loadSecurityData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await securityService.getSecurityScore(
        latitude,
        longitude,
        radius
      );
      setData(result);
    } catch (err) {
      setError('Erro ao carregar análise de segurança');
      console.error('Error loading security data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 8) return 'text-green-700';
    if (score >= 6) return 'text-yellow-700';
    if (score >= 4) return 'text-orange-700';
    return 'text-red-700';
  };

  const getCrimeTypeName = (crimeType: string) => {
    const names: Record<string, string> = {
      violent_crime: 'Crimes Violentos',
      property_crime: 'Crimes Patrimoniais',
      drug_related: 'Rel. a Drogas',
      traffic_violations: 'Trânsito',
      public_disorder: 'Desordem Pública'
    };
    return names[crimeType] || crimeType;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🛡️ Análise de Segurança</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🛡️ Análise de Segurança</h3>
        <div className="text-red-600 text-center py-4">
          <p>{error}</p>
          <button 
            onClick={loadSecurityData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">🛡️ Análise de Segurança</h3>
      
      {/* Overall Security Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Score de Segurança Geral</span>
          <span className={`font-bold text-lg ${getScoreTextColor(data.overall_score)}`}>
            {data.overall_score.toFixed(1)}/10
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${getScoreColor(data.overall_score)}`}
            style={{ width: `${(data.overall_score / 10) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${securityService.getRiskLevelColor(data.risk_assessment)}`}>
            {securityService.getRiskLevelText(data.risk_assessment)}
          </span>
          <span className="text-sm text-gray-600">
            Área: {data.area_type}
          </span>
        </div>
      </div>

      {/* Crime Analysis */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Análise Criminal</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Score de Segurança</span>
            <span className={`font-bold ${getScoreTextColor(data.crime_analysis.safety_score)}`}>
              {data.crime_analysis.safety_score.toFixed(1)}/10
            </span>
          </div>
          
          <div className="space-y-2">
            {Object.entries(data.crime_analysis.crime_rates).map(([crimeType, rate]) => (
              <div key={crimeType} className="flex justify-between text-sm">
                <span className="text-gray-600">{getCrimeTypeName(crimeType)}</span>
                <span className="font-medium">{rate.toFixed(1)}/1000</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time-based Safety */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Segurança por Período</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(data.time_analysis.weekday_scores).map(([period, score]) => (
            <div key={period} className="flex justify-between">
              <span className="capitalize text-gray-600">
                {period.replace('_', ' ')}:
              </span>
              <span className={`font-medium ${getScoreTextColor(score)}`}>
                {score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-700">🕒 Período mais seguro:</span>
            <span className="font-medium capitalize">
              {data.time_analysis.safest_time.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-700">⚠️ Período de maior risco:</span>
            <span className="font-medium capitalize">
              {data.time_analysis.riskiest_time.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Infrastructure */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Infraestrutura de Segurança</h4>
        <div className="space-y-2">
          {Object.entries(data.infrastructure_analysis.infrastructure_breakdown).map(([infra, score]) => (
            <div key={infra} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">
                {infra.replace('_', ' ')}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>
                  {score.toFixed(1)}
                </span>
                <div className="w-12 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getScoreColor(score)}`}
                    style={{ width: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {data.time_analysis.recommendations.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-2">Recomendações</h4>
          <ul className="space-y-1">
            {data.time_analysis.recommendations.slice(0, 3).map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Análise baseada em um raio de {radius}m • 
          Dados de criminalidade simulados para demonstração
        </p>
      </div>
    </div>
  );
}
