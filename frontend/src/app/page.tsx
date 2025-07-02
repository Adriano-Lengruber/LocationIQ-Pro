'use client';

import Link from 'next/link';
import { 
  MapPin, 
  ArrowRight, 
  BarChart3, 
  Star, 
  Home,
  Hotel,
  Shield,
  Leaf,
  TrendingUp,
  Store,
  Key,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Github
} from 'lucide-react';

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
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Análise Inteligente de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Localização
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa que combina dados imobiliários, ambientais, de segurança e 
            infraestrutura para fornecer insights abrangentes sobre qualquer localização urbana.
          </p>

          {/* Destaque 100% Gratuito */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-xl p-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">100% Gratuito & Open Source</h2>
            </div>
            <p className="text-lg text-gray-700 mb-4 text-center">
              Priorizamos tecnologias gratuitas e open source para democratizar o acesso à análise de dados geoespaciais
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/80 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Mapas</span>
                </div>
                <p className="text-gray-600">OpenStreetMap + Leaflet (sempre gratuito)</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Dados</span>
                </div>
                <p className="text-gray-600">APIs gratuitas + dados mock inclusos</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Código</span>
                </div>
                <p className="text-gray-600">100% open source no GitHub</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/api-status"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Ver Status das APIs
              </Link>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            <Link 
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              <BarChart3 className="h-5 w-5" />
              Acessar Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Módulos de Análise</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">$0</div>
              <div className="text-sm text-gray-600">Custo Total</div>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-gray-600">Cidades Brasileiras</div>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-gray-600">Localizações</div>
            </div>
          </div>
        </div>
      </main>

      {/* Modules Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Módulos de Análise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada módulo oferece análises especializadas com dados reais e algoritmos de machine learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real Estate Module */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Home className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Imobiliário</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Análise de preços, valorização e potencial imobiliário usando XGBoost
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Predição de preços com ML</li>
                <li>• Análise de valorização histórica</li>
                <li>• Score de investimento</li>
                <li>• Comparação de bairros</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span>Dados mock disponíveis</span>
              </div>
            </div>

            {/* Security Module */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Segurança</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Análise de criminalidade e score de segurança por região
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Índice de criminalidade</li>
                <li>• Análise temporal de crimes</li>
                <li>• Score de segurança</li>
                <li>• Mapa de calor de riscos</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-red-700">
                <CheckCircle className="h-4 w-4" />
                <span>Algoritmo Random Forest</span>
              </div>
            </div>

            {/* Infrastructure Module */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Store className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Infraestrutura</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Avaliação de amenidades urbanas e conectividade
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Proximidade a serviços</li>
                <li>• Transporte público</li>
                <li>• Comércio e lazer</li>
                <li>• Score de conectividade</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Google Places API</span>
              </div>
            </div>

            {/* Hospitality Module */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Hotel className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Hospitalidade</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Análise de preços hoteleiros e score de localização turística
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Predição de preços hoteleiros</li>
                <li>• Score de atratividade turística</li>
                <li>• Análise de sazonalidade</li>
                <li>• Recomendações de hospedagem</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-purple-700">
                <AlertCircle className="h-4 w-4" />
                <span>Booking.com API (opcional)</span>
              </div>
            </div>

            {/* Environmental Module */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Ambiental</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Qualidade do ar, clima e riscos ambientais
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Qualidade do ar em tempo real</li>
                <li>• Condições climáticas</li>
                <li>• Riscos ambientais</li>
                <li>• Score de sustentabilidade</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <AlertCircle className="h-4 w-4" />
                <span>OpenWeather + AirVisual APIs</span>
              </div>
            </div>

            {/* Business Intelligence Module */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Business Intelligence</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Relatórios executivos e insights estratégicos
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Relatórios personalizados</li>
                <li>• Insights com IA</li>
                <li>• Exportação de dados</li>
                <li>• Dashboard executivo</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-orange-700">
                <AlertCircle className="h-4 w-4" />
                <span>OpenAI API (opcional)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stack Tecnológico
            </h2>
            <p className="text-xl text-gray-600">
              Desenvolvido com tecnologias modernas para performance e escalabilidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 14 + TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Leaflet Maps (gratuito)</li>
                <li>• Recharts + Radix UI</li>
                <li>• Zustand (estado)</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• FastAPI + Python 3.11+</li>
                <li>• PostgreSQL + SQLAlchemy</li>
                <li>• Redis (cache)</li>
                <li>• Uvicorn (ASGI)</li>
                <li>• Alembic (migrations)</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Machine Learning</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• XGBoost (preços)</li>
                <li>• Random Forest (segurança)</li>
                <li>• Pandas + NumPy</li>
                <li>• Scikit-learn</li>
                <li>• Joblib (modelos)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API Configuration */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              APIs 100% Gratuitas
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Alternativas gratuitas selecionadas para substituir APIs pagas sem perder qualidade
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-4xl mx-auto">
              <p className="text-green-800 text-sm">
                💡 <strong>Compromisso:</strong> Todas as APIs integradas são 100% gratuitas, sem limites restritivos. 
                Nenhuma configuração paga é necessária para usar o projeto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Essential APIs */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">APIs Gratuitas Integradas</h3>
              </div>
              <p className="text-gray-700 mb-6">Funcionam imediatamente, sem configuração</p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">OpenStreetMap + Leaflet</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Ativo</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Mapas interativos sem limitações</p>
                  <div className="text-xs text-gray-500">✓ Sem API key ✓ Sem limites ✓ Open source</div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">WeatherAPI.com</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Grátis</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Dados climáticos e qualidade do ar</p>
                  <a 
                    href="https://www.weatherapi.com" 
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    1M requisições grátis/mês
                  </a>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">OpenAQ</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Open Source</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Qualidade do ar global e gratuita</p>
                  <a 
                    href="https://openaq.org" 
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    API totalmente gratuita
                  </a>
                </div>
              </div>
            </div>

            {/* Enhanced Free APIs */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">APIs Opcionais (Gratuitas)</h3>
              </div>
              <p className="text-gray-700 mb-6">Para funcionalidades avançadas</p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Overpass API</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Open Source</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Dados de infraestrutura do OpenStreetMap</p>
                  <a 
                    href="https://overpass-turbo.eu" 
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Substitui Google Places gratuitamente
                  </a>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Hugging Face API</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Grátis</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">IA para insights (Llama 2, FLAN-T5)</p>
                  <a 
                    href="https://huggingface.co/inference-api" 
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Substitui OpenAI gratuitamente
                  </a>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">IBGE APIs</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Oficial</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Dados demográficos e geográficos do Brasil</p>
                  <a 
                    href="https://servicodados.ibge.gov.br/api/docs" 
                    target="_blank"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Dados oficiais gratuitos
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Instructions */}
          <div className="mt-12 bg-gray-900 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-bold">Como Usar (100% Gratuito)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">1. Clone e Execute</h4>
                <div className="bg-gray-800 rounded-lg p-3 text-xs font-mono text-gray-300 mb-4">
                  <div>git clone [repositorio]</div>
                  <div>cd LocationIQ-Pro</div>
                  <div>npm install && npm run dev</div>
                </div>
                
                <h4 className="font-semibold text-green-400 mb-2">2. Funciona Imediatamente</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Sem configuração necessária! Mapas, dados mock e análises funcionam imediatamente.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-400 mb-2">3. APIs Gratuitas (Opcional)</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Para dados reais, adicione APIs 100% gratuitas no arquivo .env:
                </p>
                
                <div className="bg-gray-800 rounded-lg p-3 text-xs font-mono text-gray-300">
                  <div># APIs 100% Gratuitas</div>
                  <div>WEATHER_API_KEY=sua_chave_gratis</div>
                  <div>OPENAQ_API_KEY=opcional</div>
                  <div>HUGGING_FACE_API_KEY=opcional</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="font-semibold text-green-400">Garantia Gratuita</span>
              </div>
              <p className="text-gray-300 text-sm">
                Este projeto foi projetado para ser 100% utilizável sem custos. Todas as APIs pagas foram substituídas 
                por alternativas gratuitas de qualidade equivalente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">LocationIQ Pro</span>
              </div>
              <p className="text-gray-300 mb-4">
                Projeto de portfólio em Data Science & Engineering para análise inteligente de localizações urbanas
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="text-sm">Código Fonte</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Tecnologias</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Next.js 14 + TypeScript</li>
                <li>• FastAPI + Python</li>
                <li>• PostgreSQL + Redis</li>
                <li>• XGBoost + Scikit-learn</li>
                <li>• Leaflet Maps (Gratuito)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• 6 Módulos de Análise</li>
                <li>• Machine Learning</li>
                <li>• APIs Externas Opcionais</li>
                <li>• Dados Mock Inclusos</li>
                <li>• 100% Gratuito</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 LocationIQ Pro - Projeto de Portfólio em Data Science
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
