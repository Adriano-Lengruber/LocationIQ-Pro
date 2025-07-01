'use client';

import React, { useState, useEffect } from 'react';
import { infrastructureService, InfrastructureScore } from '@/services/infrastructureService';

interface InfrastructureAnalysisProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

export default function InfrastructureAnalysis({ 
  latitude, 
  longitude, 
  radius = 1000 
}: InfrastructureAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InfrastructureScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      loadInfrastructureData();
    }
  }, [latitude, longitude, radius]);

  const loadInfrastructureData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await infrastructureService.getInfrastructureScore(
        latitude,
        longitude,
        radius
      );
      setData(result);
    } catch (err) {
      setError('Erro ao carregar análise de infraestrutura');
      console.error('Error loading infrastructure data:', err);
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">📍 Análise de Infraestrutura</h3>
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
        <h3 className="text-lg font-semibold mb-4">📍 Análise de Infraestrutura</h3>
        <div className="text-red-600 text-center py-4">
          <p>{error}</p>
          <button 
            onClick={loadInfrastructureData}
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

  const categories = infrastructureService.getAvailableCategories();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">📍 Análise de Infraestrutura</h3>
      
      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Score Geral</span>
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
        <p className="text-sm text-gray-600 mt-1">
          {infrastructureService.getScoreDescription(data.overall_score)} infraestrutura urbana
        </p>
      </div>

      {/* Category Scores */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Análise por Categoria</h4>
        {categories.map(category => {
          const score = data.category_scores[category.key] || 0;
          const facilities = data.nearby_facilities[category.key] || [];
          
          return (
            <div key={category.key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getScoreColor(score)}`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {facilities.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">
                    {facilities.length} facilidade(s) próxima(s)
                  </p>
                  <div className="space-y-1">
                    {facilities.slice(0, 3).map((facility, index) => (
                      <div key={index} className="flex justify-between text-xs text-gray-500">
                        <span className="truncate">{facility.name}</span>
                        <span>{infrastructureService.formatDistance(facility.distance)}</span>
                      </div>
                    ))}
                    {facilities.length > 3 && (
                      <p className="text-xs text-gray-400">
                        e mais {facilities.length - 3} facilidade(s)...
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {facilities.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Nenhuma facilidade encontrada no raio de busca
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Analysis Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Análise baseada em um raio de {radius}m • 
          Dados atualizados em tempo real
        </p>
      </div>
    </div>
  );
}
