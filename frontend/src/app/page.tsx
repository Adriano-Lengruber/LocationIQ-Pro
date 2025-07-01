'use client';

import { useState } from 'react';
import LocationSearch from '@/components/Search/LocationSearch';
import LocationMap from '@/components/Map/LocationMap';
import LocationAnalysis from '@/components/Analysis/LocationAnalysis';
import InfrastructureAnalysis from '@/components/InfrastructureAnalysis';
import SecurityAnalysis from '@/components/SecurityAnalysis';
import RealEstateAnalysis from '@/components/RealEstateAnalysis';
import { MapPin, Zap, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface LocationResult {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  formatted_address: string;
}

interface AnalysisResult {
  location: LocationResult;
  real_estate_score: number;
  hospitality_score: number;
  environmental_score: number;
  security_score: number;
  infrastructure_score: number;
  overall_score: number;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLocationSelect = async (location: LocationResult) => {
    setSelectedLocation(location);
    setIsAnalyzing(true);
    
    try {
      // Get analysis for the selected location
      const response = await axios.get(`http://localhost:8000/api/v1/locations/analyze/${location.id}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing location:', error);
      // Set mock analysis for demo purposes
      setAnalysis({
        location: location,
        real_estate_score: 7.5 + Math.random() * 2,
        hospitality_score: 6.8 + Math.random() * 2,
        environmental_score: 6.2 + Math.random() * 2,
        security_score: 7.1 + Math.random() * 2,
        infrastructure_score: 8.3 + Math.random() * 1.5,
        overall_score: 7.2 + Math.random() * 1.5
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mapMarkers = selectedLocation ? [{
    id: selectedLocation.id,
    coordinates: [selectedLocation.longitude, selectedLocation.latitude] as [number, number],
    title: selectedLocation.address,
    description: selectedLocation.formatted_address
  }] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">LocationIQ Pro</h1>
                  <p className="text-sm text-gray-600">Análise Inteligente de Localização</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Beta v1.0
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Descubra o Potencial de Qualquer Localização
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Análise completa combinando dados imobiliários, hoteleiros, ambientais, 
            de segurança e infraestrutura para decisões inteligentes.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <LocationSearch 
            onLocationSelect={handleLocationSelect}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Features Cards */}
        {!selectedLocation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise Preditiva</h3>
              <p className="text-gray-600">
                Modelos de machine learning para prever tendências de mercado e valorização.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados Integrados</h3>
              <p className="text-gray-600">
                Combinamos múltiplas fontes de dados para uma visão 360° de cada localização.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insights Instantâneos</h3>
              <p className="text-gray-600">
                Relatórios detalhados e scores personalizados em segundos.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedLocation ? 'Localização Selecionada' : 'Mapa Interativo'}
            </h3>
            <LocationMap
              center={selectedLocation ? [selectedLocation.longitude, selectedLocation.latitude] : [-46.6333, -23.5505]}
              zoom={selectedLocation ? 15 : 12}
              markers={mapMarkers}
              className="w-full h-96"
            />
          </div>

          {/* Analysis Sections */}
          <div className="lg:col-span-2 space-y-6">
            {isAnalyzing ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analisando Localização</h3>
                  <p className="text-gray-600">
                    Processando dados de múltiplas fontes...
                  </p>
                </div>
              </div>
            ) : selectedLocation ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* General Analysis */}
                {analysis && (
                  <div className="xl:col-span-2">
                    <LocationAnalysis analysis={analysis} />
                  </div>
                )}
                
                {/* Real Estate Analysis */}
                <RealEstateAnalysis 
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                  radius={1000}
                  propertyType="apartment"
                />
                
                {/* Security Analysis */}
                <SecurityAnalysis 
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                  radius={1000}
                />
                
                {/* Infrastructure Analysis */}
                <div className="xl:col-span-2">
                  <InfrastructureAnalysis 
                    latitude={selectedLocation.latitude}
                    longitude={selectedLocation.longitude}
                    radius={1000}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Selecione uma Localização
                  </h3>
                  <p className="text-gray-600">
                    Use a busca acima para encontrar e analisar qualquer localização.
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏠</div>
                      <div className="font-medium">Mercado Imobiliário</div>
                      <div className="text-gray-500">Preços e tendências</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🛡️</div>
                      <div className="font-medium">Análise de Segurança</div>
                      <div className="text-gray-500">Dados de criminalidade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">📍</div>
                      <div className="font-medium">Infraestrutura</div>
                      <div className="text-gray-500">Serviços e amenidades</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
