'use client';

import { Home, Building, Leaf, Shield, MapPin, TrendingUp } from 'lucide-react';

interface LocationAnalysisProps {
  analysis: {
    location: {
      id: string;
      address: string;
      latitude: number;
      longitude: number;
      formatted_address: string;
    };
    real_estate_score: number;
    hospitality_score: number;
    environmental_score: number;
    security_score: number;
    infrastructure_score: number;
    overall_score: number;
  };
  className?: string;
}

const ScoreCard = ({ 
  title, 
  score, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  score: number; 
  icon: React.ElementType; 
  color: string; 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="ml-3 font-semibold text-gray-900">{title}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor(score)}`}
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};

export default function LocationAnalysis({ analysis, className = '' }: LocationAnalysisProps) {
  const scores = [
    {
      title: 'Imobiliário',
      score: analysis.real_estate_score,
      icon: Home,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Hotelaria',
      score: analysis.hospitality_score,
      icon: Building,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Ambiental',
      score: analysis.environmental_score,
      icon: Leaf,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Segurança',
      score: analysis.security_score,
      icon: Shield,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Infraestrutura',
      score: analysis.infrastructure_score,
      icon: MapPin,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const getOverallScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Location Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Análise de Localização
            </h2>
            <p className="text-gray-600">{analysis.location.formatted_address}</p>
            <p className="text-sm text-gray-500 mt-1">
              {analysis.location.latitude.toFixed(6)}, {analysis.location.longitude.toFixed(6)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${getOverallScoreColor(analysis.overall_score)}`}>
            <div className="text-center">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="text-2xl font-bold">{analysis.overall_score.toFixed(1)}</span>
              </div>
              <div className="text-sm font-medium">Score Geral</div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((scoreData, index) => (
          <ScoreCard
            key={index}
            title={scoreData.title}
            score={scoreData.score}
            icon={scoreData.icon}
            color={scoreData.color}
          />
        ))}
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🏠 Mercado Imobiliário</h4>
            <p className="text-sm text-blue-700">
              {analysis.real_estate_score >= 8 
                ? 'Excelente potencial de valorização imobiliária'
                : analysis.real_estate_score >= 6
                ? 'Bom mercado imobiliário com oportunidades'
                : 'Mercado imobiliário em desenvolvimento'
              }
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🌿 Qualidade Ambiental</h4>
            <p className="text-sm text-green-700">
              {analysis.environmental_score >= 8
                ? 'Excelente qualidade ambiental e sustentabilidade'
                : analysis.environmental_score >= 6
                ? 'Boa qualidade ambiental com algumas melhorias possíveis'
                : 'Área com desafios ambientais que requerem atenção'
              }
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">🏨 Turismo & Hotelaria</h4>
            <p className="text-sm text-purple-700">
              {analysis.hospitality_score >= 8
                ? 'Destino turístico de alta atratividade'
                : analysis.hospitality_score >= 6
                ? 'Bom potencial turístico e hoteleiro'
                : 'Oportunidades de desenvolvimento turístico'
              }
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">🚇 Infraestrutura</h4>
            <p className="text-sm text-orange-700">
              {analysis.infrastructure_score >= 8
                ? 'Infraestrutura excelente e bem conectada'
                : analysis.infrastructure_score >= 6
                ? 'Boa infraestrutura com acesso facilitado'
                : 'Infraestrutura em desenvolvimento'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
