'use client';

import Link from 'next/link';
import { MapPin, ArrowRight, BarChart3, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">LocationIQ Pro</h1>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Data Science Portfolio
              </span>
            </div>
            
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Acessar Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Análise Inteligente de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Localização
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Plataforma completa que combina dados imobiliários, ambientais, de segurança e 
            infraestrutura para fornecer insights abrangentes sobre qualquer localização urbana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Dashboard Simples</span>
            </Link>
            
            <Link 
              href="/dashboard-enhanced"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Star className="h-5 w-5" />
              <span className="font-semibold">Dashboard Enhanced</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Módulos de Análise</div>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Gratuito</div>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">20+</div>
              <div className="text-sm text-gray-600">Indicadores</div>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-gray-600">Localizações</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold">Dashboard Simples</h3>
              </div>
              <p className="text-gray-600 mb-4">Interface limpa e direta para análise rápida</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Visualização em cards organizados</li>
                <li>• Scores visuais com estrelas</li>
                <li>• Ideal para overview rápido</li>
                <li>• Otimizado para mobile</li>
              </ul>
              <Link 
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Acessar Dashboard Simples</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold">Dashboard Enhanced</h3>
              </div>
              <p className="text-gray-600 mb-4">Interface avançada com gráficos interativos</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Sistema de abas organizadas</li>
                <li>• Gráficos radar e barras</li>
                <li>• Análises detalhadas por módulo</li>
                <li>• Insights e recomendações</li>
              </ul>
              <Link 
                href="/dashboard-enhanced"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <span>Acessar Dashboard Enhanced</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">LocationIQ Pro</span>
          </div>
          <p className="text-gray-300 mb-2">
            Projeto de portfólio em Data Science & Engineering
          </p>
          <p className="text-gray-400 text-sm">
            Desenvolvido para demonstrar habilidades em análise de dados geoespaciais
          </p>
        </div>
      </footer>
    </div>
  );
}
