import { create } from 'zustand'
import { LocationData, LocationAnalysis, MockLocationAPI } from '@/services/mockDataService'

interface LocationState {
  // Estado do mapa
  currentLocation: LocationData | null;
  mapCenter: [number, number];
  mapZoom: number;
  
  // Estado de busca
  searchQuery: string;
  isSearching: boolean;
  searchResults: LocationData[];
  
  // Estado de análise
  selectedLocation: LocationData | null;
  isAnalyzing: boolean;
  analysisData: LocationAnalysis | null;
  
  // Ações
  setCurrentLocation: (location: LocationData) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchResults: (results: LocationData[]) => void;
  setSelectedLocation: (location: LocationData | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisData: (data: LocationAnalysis | null) => void;
  clearSearch: () => void;
  clearAnalysis: () => void;
  
  // Ações avançadas
  searchLocations: (query: string) => Promise<void>;
  analyzeLocation: (location: LocationData) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  // Estado inicial
  currentLocation: null,
  mapCenter: [-46.6333, -23.5505], // São Paulo como padrão
  mapZoom: 10,
  searchQuery: '',
  isSearching: false,
  searchResults: [],
  selectedLocation: null,
  isAnalyzing: false,
  analysisData: null,
  
  // Ações básicas
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisData: (data) => set({ analysisData: data }),
  
  clearSearch: () => set({ 
    searchQuery: '', 
    searchResults: [], 
    isSearching: false 
  }),
  
  clearAnalysis: () => set({ 
    analysisData: null, 
    isAnalyzing: false 
  }),
  
  // Ações avançadas
  searchLocations: async (query: string) => {
    set({ isSearching: true });
    try {
      const results = await MockLocationAPI.searchLocations(query);
      set({ searchResults: results });
    } catch (error) {
      console.error('Erro na busca:', error);
      set({ searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },
  
  analyzeLocation: async (location: LocationData) => {
    set({ 
      isAnalyzing: true, 
      selectedLocation: location,
      mapCenter: [location.coordinates.lng, location.coordinates.lat]
    });
    
    try {
      const analysis = await MockLocationAPI.analyzeLocation(location);
      set({ analysisData: analysis });
    } catch (error) {
      console.error('Erro na análise:', error);
      set({ analysisData: null });
    } finally {
      set({ isAnalyzing: false });
    }
  }
}));
