/**
 * Teste de conexão básica com o backend
 */
'use client';

import React, { useState } from 'react';

export default function BackendTestComponent() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
      console.log('🔄 Testando health check:', API_URL);
      
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      
      setResult(`✅ Health Check OK: ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(`❌ Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testIBGE = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
      console.log('🔄 Testando IBGE:', API_URL);
      
      const response = await fetch(`${API_URL}/api/v1/ibge/municipality/default`);
      const data = await response.json();
      
      setResult(`✅ IBGE OK: ${data.basic_info?.nome || 'sem nome'} - Pop: ${data.population?.population || 'N/A'}`);
    } catch (error) {
      setResult(`❌ Erro IBGE: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold mb-3">🧪 Teste de Conexão Backend</h3>
      
      <div className="space-x-2 mb-3">
        <button 
          onClick={testHealth}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Testar Health
        </button>
        
        <button 
          onClick={testIBGE}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
        >
          Testar IBGE
        </button>
      </div>
      
      {loading && <p className="text-blue-600">🔄 Carregando...</p>}
      
      {result && (
        <div className="mt-3 p-2 bg-white rounded text-sm">
          <strong>Resultado:</strong> {result}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'}
      </div>
    </div>
  );
}
