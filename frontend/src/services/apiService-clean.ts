// Serviços de APIs - LocationIQ Pro
// Integração com APIs reais e backend

// Interfaces para dados IBGE
export interface IBGEMunicipalityInfo {
  id: number;
  nome: string;
  microrregiao: string;
  mesorregiao: string | null;
  uf: {
    id: number | null;
    sigla: string | null;
    nome: string | null;
  };
  regiao: {
    id: number | null;
    sigla: string | null;
    nome: string | null;
  };
  regiao_imediata: {
    id: number;
    nome: string;
  };
  regiao_intermediaria: {
    id: number | null;
    nome: string | null;
  };
}

export interface IBGEPopulationData {
  municipality_id: number;
  municipality_name: string;
  population: number;
  year: number;
  unit: string;
  source: string;
  _cached_at?: string;
  _cache_ttl?: number;
}

export interface IBGEAreaData {
  municipality_id: number;
  municipality_name: string;
  area_km2: number;
  year: number;
  unit: string;
  source: string;
  _cached_at?: string;
  _cache_ttl?: number;
}

export interface IBGEDensityData {
  municipality_id: number;
  municipality_name: string;
  density: number;
  year: number;
  unit: string;
  source: string;
  _cached_at?: string;
  _cache_ttl?: number;
}

export interface IBGECompleteData {
  municipality_id: number;
  basic_info: IBGEMunicipalityInfo | null;
  population: IBGEPopulationData | null;
  area: IBGEAreaData | null;
  density: IBGEDensityData | null;
  economic_indicators: {
    municipality_id: number;
    indicators: Record<string, any>;
    available_indicators: string[];
    note: string;
  };
  last_updated: string;
  data_sources: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
    mapbox_center: {
      lat: number;
      lng: number;
      zoom: number;
    };
  };
}

export interface IBGESearchResult {
  id: number;
  nome: string;
  uf: string;
  microrregiao: string;
  mesorregiao: string;
}

/**
 * Serviço IBGE Backend - Conecta com nosso backend LocationIQ Pro
 */
export class IBGEBackendService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

  /**
   * Obtém dados completos do município padrão (Itaperuna)
   */
  static async getDefaultMunicipality(): Promise<IBGECompleteData | null> {
    try {
      console.log('🔍 Tentando acessar:', `${this.BASE_URL}/api/v1/ibge/municipality/default`);
      
      const response = await fetch(`${this.BASE_URL}/api/v1/ibge/municipality/default`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Dados do município padrão obtidos do backend');
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar município padrão:', error);
      return null;
    }
  }

  /**
   * Obtém dados de população de um município
   */
  static async getPopulation(municipalityId: number): Promise<IBGEPopulationData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/v1/ibge/population/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Dados de população obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar população:', error);
      return null;
    }
  }

  /**
   * Obtém dados de área territorial de um município
   */
  static async getArea(municipalityId: number): Promise<IBGEAreaData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/v1/ibge/area/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Dados de área obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar área:', error);
      return null;
    }
  }

  /**
   * Obtém dados de densidade demográfica de um município
   */
  static async getDensity(municipalityId: number): Promise<IBGEDensityData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/v1/ibge/density/${municipalityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Dados de densidade obtidos para município ${municipalityId}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar densidade:', error);
      return null;
    }
  }

  /**
   * Obtém dados completos de um município específico
   */
  static async getCompleteMunicipalityData(municipalityId: number): Promise<IBGECompleteData | null> {
    try {
      // Por enquanto, usa os dados padrão
      // TODO: Implementar endpoint específico para outros municípios
      return await this.getDefaultMunicipality();
    } catch (error) {
      console.error('Erro ao buscar dados completos:', error);
      return null;
    }
  }
}
