'use client';

import React from 'react';

export default function DashboardMinimal() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Dashboard - Teste Mínimo
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Se você consegue ver esta mensagem, o dashboard básico está funcionando.
        </p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900">Teste 1</h3>
            <p className="text-blue-700">Card funcionando</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-900">Teste 2</h3>
            <p className="text-green-700">Card funcionando</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-purple-900">Teste 3</h3>
            <p className="text-purple-700">Card funcionando</p>
          </div>
        </div>
      </div>
    </div>
  );
}
