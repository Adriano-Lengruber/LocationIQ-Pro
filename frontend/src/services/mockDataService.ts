// Sistema de Mock Data Inteligente - LocationIQ Pro
// Gera dados realistas baseados na localização geográfica

export interface LocationData {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface ModuleScore {
  score: number;
  factors: string[];
  trend: 'up' | 'down' | 'stable';
  details: Record<string, number | string | boolean>;
}

export interface LocationAnalysis {
  location: LocationData;
  overallScore: number;
  lastUpdated: Date;
  modules: {
    residential: ModuleScore;
    hospitality: ModuleScore;
    investment: ModuleScore;
    environmental: ModuleScore;
    security: ModuleScore;
    infrastructure: ModuleScore;
  };
  insights: string[];
  recommendations: string[];
}

// Dados base de cidades brasileiras para referência
const cityProfiles = {
  'São Paulo': {
    baseScores: { residential: 7.5, hospitality: 8.5, investment: 9.0, environmental: 5.5, security: 6.5, infrastructure: 8.5 },
    characteristics: ['metropolitana', 'financeira', 'diversa', 'densa'],
    averagePropertyPrice: 8500,
    crimeIndex: 65,
    airQuality: 45
  },
  'Rio de Janeiro': {
    baseScores: { residential: 7.8, hospitality: 9.2, investment: 8.5, environmental: 6.0, security: 5.8, infrastructure: 7.5 },
    characteristics: ['turística', 'praia', 'cultural', 'montanhas'],
    averagePropertyPrice: 7500,
    crimeIndex: 72,
    airQuality: 55
  },
  'Brasília': {
    baseScores: { residential: 8.2, hospitality: 7.0, investment: 7.5, environmental: 7.5, security: 7.8, infrastructure: 8.8 },
    characteristics: ['planejada', 'governo', 'moderna', 'organizada'],
    averagePropertyPrice: 6500,
    crimeIndex: 45,
    airQuality: 70
  },
  'Salvador': {
    baseScores: { residential: 7.0, hospitality: 8.8, investment: 7.8, environmental: 6.8, security: 6.2, infrastructure: 7.2 },
    characteristics: ['histórica', 'praia', 'cultural', 'tropical'],
    averagePropertyPrice: 4500,
    crimeIndex: 68,
    airQuality: 65
  },
  'Belo Horizonte': {
    baseScores: { residential: 8.0, hospitality: 7.5, investment: 8.0, environmental: 6.5, security: 7.2, infrastructure: 8.0 },
    characteristics: ['montanhas', 'mineira', 'gastronômica', 'tecnológica'],
    averagePropertyPrice: 5500,
    crimeIndex: 55,
    airQuality: 60
  },
  'Fortaleza': {
    baseScores: { residential: 7.3, hospitality: 8.7, investment: 8.2, environmental: 7.2, security: 6.8, infrastructure: 7.8 },
    characteristics: ['praia', 'tropical', 'turística', 'nordestina'],
    averagePropertyPrice: 4800,
    crimeIndex: 62,
    airQuality: 75
  },
  'Recife': {
    baseScores: { residential: 7.1, hospitality: 8.4, investment: 7.9, environmental: 6.9, security: 6.5, infrastructure: 7.6 },
    characteristics: ['histórica', 'praia', 'cultural', 'tecnológica'],
    averagePropertyPrice: 4200,
    crimeIndex: 68,
    airQuality: 70
  },
  'Porto Alegre': {
    baseScores: { residential: 8.1, hospitality: 7.8, investment: 8.1, environmental: 7.8, security: 7.5, infrastructure: 8.3 },
    characteristics: ['gaúcha', 'cultural', 'universitária', 'européia'],
    averagePropertyPrice: 5800,
    crimeIndex: 58,
    airQuality: 65
  },
  'Curitiba': {
    baseScores: { residential: 8.5, hospitality: 7.9, investment: 8.3, environmental: 8.2, security: 8.0, infrastructure: 9.0 },
    characteristics: ['planejada', 'ecológica', 'inovadora', 'fria'],
    averagePropertyPrice: 6200,
    crimeIndex: 48,
    airQuality: 78
  },
  'Goiânia': {
    baseScores: { residential: 7.8, hospitality: 7.2, investment: 7.6, environmental: 7.0, security: 7.3, infrastructure: 8.1 },
    characteristics: ['planejada', 'agronegócio', 'central', 'moderna'],
    averagePropertyPrice: 4900,
    crimeIndex: 52,
    airQuality: 68
  },
  'Manaus': {
    baseScores: { residential: 6.8, hospitality: 8.1, investment: 7.4, environmental: 8.5, security: 6.1, infrastructure: 6.9 },
    characteristics: ['amazônica', 'industrial', 'exótica', 'úmida'],
    averagePropertyPrice: 3800,
    crimeIndex: 71,
    airQuality: 85
  },
  'Natal': {
    baseScores: { residential: 7.5, hospitality: 9.0, investment: 8.0, environmental: 7.8, security: 6.9, infrastructure: 7.4 },
    characteristics: ['praia', 'turística', 'dunas', 'tropical'],
    averagePropertyPrice: 4100,
    crimeIndex: 64,
    airQuality: 80
  },
  'Florianópolis': {
    baseScores: { residential: 8.7, hospitality: 9.1, investment: 8.8, environmental: 8.8, security: 8.2, infrastructure: 8.4 },
    characteristics: ['ilha', 'tecnológica', 'praia', 'qualidade de vida'],
    averagePropertyPrice: 7200,
    crimeIndex: 42,
    airQuality: 82
  },
  'Campo Grande': {
    baseScores: { residential: 7.6, hospitality: 7.3, investment: 7.5, environmental: 7.5, security: 7.1, infrastructure: 7.9 },
    characteristics: ['pantanal', 'agronegócio', 'central', 'planejada'],
    averagePropertyPrice: 4600,
    crimeIndex: 54,
    airQuality: 72
  },
  'João Pessoa': {
    baseScores: { residential: 7.4, hospitality: 8.6, investment: 7.7, environmental: 7.9, security: 7.0, infrastructure: 7.5 },
    characteristics: ['praia', 'histórica', 'tranquila', 'tropical'],
    averagePropertyPrice: 3900,
    crimeIndex: 59,
    airQuality: 78
  }
};

// Função para calcular scores baseados na localização
function calculateLocationScores(location: LocationData): LocationAnalysis['modules'] {
  const { coordinates, city } = location;
  const { lat, lng } = coordinates;
  
  // Score base da cidade (se conhecida)
  const cityProfile = city ? cityProfiles[city as keyof typeof cityProfiles] : null;
  const baseScores = cityProfile?.baseScores || {
    residential: 7.0, hospitality: 7.0, investment: 7.0, 
    environmental: 7.0, security: 7.0, infrastructure: 7.0
  };

  // Fatores geográficos que influenciam scores
  const geoFactors = {
    // Proximidade ao centro (assumindo centros urbanos em coordenadas específicas)
    centerDistance: Math.abs(lat + lng) % 0.1, // Simplificado
    // Altitude simulada baseada em latitude
    altitude: Math.abs(lat) * 100,
    // Proximidade ao litoral (longitude próxima a -40 = costa brasileira)
    coastalProximity: Math.max(0, 1 - Math.abs(lng + 40) / 10)
  };

  // Algoritmo de scoring inteligente
  const residential: ModuleScore = {
    score: Math.min(10, Math.max(1, 
      baseScores.residential + 
      (geoFactors.coastalProximity * 0.5) - 
      (geoFactors.centerDistance * 2) +
      (Math.random() - 0.5) * 1.5
    )),
    factors: [
      'Qualidade dos imóveis',
      'Infraestrutura do bairro', 
      'Valorização histórica',
      'Densidade populacional'
    ],
    trend: Math.random() > 0.5 ? 'up' : 'stable',
    details: {
      averagePrice: (cityProfile?.averagePropertyPrice || 6000) * (1 + geoFactors.coastalProximity * 0.3),
      pricePerM2: Math.round((cityProfile?.averagePropertyPrice || 6000) * 1.2),
      appreciation: Math.round((Math.random() * 10 + 2) * 100) / 100
    }
  };

  const hospitality: ModuleScore = {
    score: Math.min(10, Math.max(1,
      baseScores.hospitality +
      (geoFactors.coastalProximity * 1.5) +
      (cityProfile?.characteristics.includes('turística') ? 1.0 : 0) +
      (Math.random() - 0.5) * 1.0
    )),
    factors: [
      'Atrações turísticas',
      'Qualidade dos hotéis',
      'Restaurantes e lazer',
      'Acessibilidade'
    ],
    trend: Math.random() > 0.6 ? 'up' : 'stable',
    details: {
      averageHotelPrice: Math.round(80 + geoFactors.coastalProximity * 120 + Math.random() * 50),
      occupancyRate: Math.round((60 + geoFactors.coastalProximity * 30) * 100) / 100,
      seasonalVariation: Math.round((20 + geoFactors.coastalProximity * 40) * 100) / 100
    }
  };

  const investment: ModuleScore = {
    score: Math.min(10, Math.max(1,
      baseScores.investment +
      (residential.score - 7) * 0.3 +
      (hospitality.score - 7) * 0.2 +
      (Math.random() - 0.5) * 1.2
    )),
    factors: [
      'Potencial de ROI',
      'Crescimento da região',
      'Demanda por aluguel',
      'Liquidez do mercado'
    ],
    trend: Math.random() > 0.4 ? 'up' : 'stable',
    details: {
      expectedROI: Math.round((8 + Math.random() * 6) * 100) / 100,
      paybackYears: Math.round((12 + Math.random() * 8) * 10) / 10,
      marketLiquidity: Math.round((0.6 + Math.random() * 0.3) * 100) / 100
    }
  };

  const environmental: ModuleScore = {
    score: Math.min(10, Math.max(1,
      baseScores.environmental +
      (geoFactors.coastalProximity * 0.8) -
      (geoFactors.centerDistance * 1.5) +
      (Math.random() - 0.5) * 1.0
    )),
    factors: [
      'Qualidade do ar',
      'Níveis de ruído',
      'Áreas verdes',
      'Poluição urbana'
    ],
    trend: Math.random() > 0.7 ? 'down' : 'stable',
    details: {
      airQuality: cityProfile?.airQuality || Math.round(50 + Math.random() * 40),
      noiseLevel: Math.round(45 + geoFactors.centerDistance * 20 + Math.random() * 15),
      greenSpaces: Math.round((30 + geoFactors.coastalProximity * 20) * 100) / 100
    }
  };

  const security: ModuleScore = {
    score: Math.min(10, Math.max(1,
      baseScores.security -
      (geoFactors.centerDistance * 1.0) +
      (cityProfile?.characteristics.includes('planejada') ? 1.0 : 0) +
      (Math.random() - 0.5) * 1.3
    )),
    factors: [
      'Índice de criminalidade',
      'Policiamento',
      'Iluminação pública',
      'Vigilância'
    ],
    trend: Math.random() > 0.8 ? 'up' : 'stable',
    details: {
      crimeIndex: cityProfile?.crimeIndex || Math.round(40 + Math.random() * 40),
      policeStations: Math.round(1 + Math.random() * 3),
      emergencyResponse: Math.round((5 + Math.random() * 10) * 10) / 10
    }
  };

  const infrastructure: ModuleScore = {
    score: Math.min(10, Math.max(1,
      baseScores.infrastructure -
      (geoFactors.centerDistance * 0.8) +
      (cityProfile?.characteristics.includes('planejada') ? 1.2 : 0) +
      (Math.random() - 0.5) * 1.0
    )),
    factors: [
      'Transporte público',
      'Internet e telefonia',
      'Serviços essenciais',
      'Comércio local'
    ],
    trend: Math.random() > 0.6 ? 'up' : 'stable',
    details: {
      publicTransport: Math.round((6 + Math.random() * 4) * 10) / 10,
      internetSpeed: Math.round(50 + Math.random() * 100),
      nearbyServices: Math.round(5 + Math.random() * 10)
    }
  };

  return {
    residential,
    hospitality,
    investment,
    environmental,
    security,
    infrastructure
  };
}

// Função principal para gerar análise completa
export function generateLocationAnalysis(location: LocationData): LocationAnalysis {
  const modules = calculateLocationScores(location);
  
  // Calcular score geral
  const scores = Object.values(modules).map(m => m.score);
  const overallScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  
  // Gerar insights inteligentes
  const insights: string[] = [];
  const recommendations: string[] = [];
  
  // Insights baseados nos scores
  if (modules.investment.score > 8.5) {
    insights.push('🚀 Excelente potencial de investimento detectado');
  }
  if (modules.security.score < 6.0) {
    insights.push('⚠️ Índices de segurança abaixo da média regional');
    recommendations.push('Considere áreas com melhor policiamento');
  }
  if (modules.environmental.score > 8.0) {
    insights.push('🌿 Qualidade ambiental acima da média');
  }
  if (modules.hospitality.score > 8.0) {
    insights.push('🏨 Forte vocação turística identificada');
    recommendations.push('Considere investimentos em hospedagem');
  }
  if (modules.infrastructure.score > 8.5) {
    insights.push('🏗️ Infraestrutura urbana de excelência');
  }

  // Insights gerais
  if (overallScore > 8.5) {
    insights.push('⭐ Localização premium com múltiplas vantagens');
  } else if (overallScore < 6.5) {
    recommendations.push('Avalie outras opções na região');
  }

  return {
    location,
    overallScore,
    lastUpdated: new Date(),
    modules,
    insights,
    recommendations
  };
}

// Mock de API para simular chamadas
export class MockLocationAPI {
  static async searchLocations(query: string): Promise<LocationData[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    // Mock de resultados baseados nas cidades disponíveis
    const mockResults: LocationData[] = [
      { coordinates: { lat: -23.5505, lng: -46.6333 }, address: `São Paulo, SP`, city: 'São Paulo', state: 'São Paulo', country: 'Brasil' },
      { coordinates: { lat: -22.9068, lng: -43.1729 }, address: `Rio de Janeiro, RJ`, city: 'Rio de Janeiro', state: 'Rio de Janeiro', country: 'Brasil' },
      { coordinates: { lat: -15.8267, lng: -47.9218 }, address: `Brasília, DF`, city: 'Brasília', state: 'Distrito Federal', country: 'Brasil' },
      { coordinates: { lat: -12.9714, lng: -38.5014 }, address: `Salvador, BA`, city: 'Salvador', state: 'Bahia', country: 'Brasil' },
      { coordinates: { lat: -19.9191, lng: -43.9386 }, address: `Belo Horizonte, MG`, city: 'Belo Horizonte', state: 'Minas Gerais', country: 'Brasil' },
      { coordinates: { lat: -3.7319, lng: -38.5267 }, address: `Fortaleza, CE`, city: 'Fortaleza', state: 'Ceará', country: 'Brasil' },
      { coordinates: { lat: -8.0476, lng: -34.8770 }, address: `Recife, PE`, city: 'Recife', state: 'Pernambuco', country: 'Brasil' },
      { coordinates: { lat: -30.0346, lng: -51.2177 }, address: `Porto Alegre, RS`, city: 'Porto Alegre', state: 'Rio Grande do Sul', country: 'Brasil' },
      { coordinates: { lat: -25.4284, lng: -49.2733 }, address: `Curitiba, PR`, city: 'Curitiba', state: 'Paraná', country: 'Brasil' },
      { coordinates: { lat: -16.6869, lng: -49.2648 }, address: `Goiânia, GO`, city: 'Goiânia', state: 'Goiás', country: 'Brasil' },
      { coordinates: { lat: -3.1190, lng: -60.0217 }, address: `Manaus, AM`, city: 'Manaus', state: 'Amazonas', country: 'Brasil' },
      { coordinates: { lat: -5.7945, lng: -35.2110 }, address: `Natal, RN`, city: 'Natal', state: 'Rio Grande do Norte', country: 'Brasil' },
      { coordinates: { lat: -27.5954, lng: -48.5480 }, address: `Florianópolis, SC`, city: 'Florianópolis', state: 'Santa Catarina', country: 'Brasil' },
      { coordinates: { lat: -20.4697, lng: -54.6201 }, address: `Campo Grande, MS`, city: 'Campo Grande', state: 'Mato Grosso do Sul', country: 'Brasil' },
      { coordinates: { lat: -7.1195, lng: -34.8450 }, address: `João Pessoa, PB`, city: 'João Pessoa', state: 'Paraíba', country: 'Brasil' }
    ];

    // Se a query estiver vazia ou muito curta, retorna cidades principais
    if (query.length < 2) {
      return mockResults.slice(0, 10);
    }

    // Filtrar resultados baseado na query (busca por cidade ou endereço)
    const filtered = mockResults.filter(result => 
      result.city?.toLowerCase().includes(query.toLowerCase()) ||
      result.address.toLowerCase().includes(query.toLowerCase()) ||
      result.state?.toLowerCase().includes(query.toLowerCase())
    );

    // Se não encontrou resultados específicos, retorna algumas cidades principais
    return filtered.length > 0 ? filtered : mockResults.slice(0, 5);
  }

  static async analyzeLocation(location: LocationData): Promise<LocationAnalysis> {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    return generateLocationAnalysis(location);
  }
}
