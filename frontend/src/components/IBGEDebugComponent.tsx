/**
 * Componente de debug para conexão IBGE
 */
'use client';

import React, { useState, useEffect } from 'react';

export default function IBGEDebugComponent() {
  const [status, setStatus] = useState('Carregando...');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
        setApiUrl(baseUrl);
        
        console.log('🔍 Testando URL:', `${baseUrl}/api/v1/ibge/municipality/default`);
        
        const response = await fetch(`${baseUrl}/api/v1/ibge/municipality/default`);
        
        console.log('📡 Status da resposta:', response.status);
        console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        
        setStatus(`✅ Conectado! Município: ${data.basic_info?.nome || 'N/A'}`);
      } catch (error) {
        console.error('❌ Erro detalhado:', error);
        setStatus(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">🔧 Debug IBGE Connection</h3>
      <div className="space-y-2 text-sm">
        <p><strong>API URL:</strong> {apiUrl}</p>
        <p><strong>Status:</strong> {status}</p>
        <p className="text-xs text-gray-600">
          Verifique o console do navegador para logs detalhados
        </p>
      </div>
    </div>
  );
}
