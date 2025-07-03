/**
 * Componente de teste simples para dados IBGE
 */
'use client';

import React, { useState, useEffect } from 'react';

interface IBGETestData {
  basic_info?: {
    nome?: string;
  };
  population?: {
    population?: number;
  };
  area?: {
    area_km2?: number;
  };
  density?: {
    density?: number;
  };
}

export default function IBGETestComponent() {
  const [data, setData] = useState<IBGETestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔄 Testando conexão com backend IBGE...');
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
        const response = await fetch(`${API_URL}/api/v1/ibge/municipality/default`);
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Dados IBGE recebidos:', result);
        
        setData(result);
      } catch (err) {
        console.error('❌ Erro ao carregar dados IBGE:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-600">🔄 Carregando dados IBGE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">❌ Erro: {error}</p>
        <p className="text-red-500 text-sm mt-1">
          Verifique se o backend está rodando em {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">📭 Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-bold mb-2">✅ Conexão IBGE Funcionando!</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>Município:</strong> {data.basic_info?.nome || 'N/A'}</p>
        <p><strong>População:</strong> {data.population?.population?.toLocaleString('pt-BR') || 'N/A'}</p>
        <p><strong>Área:</strong> {data.area?.area_km2?.toLocaleString('pt-BR')} km²</p>
        <p><strong>Densidade:</strong> {data.density?.density?.toLocaleString('pt-BR')} hab/km²</p>
      </div>
      
      <details className="mt-3">
        <summary className="text-green-700 cursor-pointer text-xs">Ver dados completos</summary>
        <pre className="text-xs bg-white p-2 mt-2 rounded border overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
