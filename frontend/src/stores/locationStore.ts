import { create } from 'zustand'

interface Location {
  id?: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  place_name?: string;
  center?: [number, number];
}

interface LocationState {
  // Estado do mapa
  currentLocation: Location | null;
  mapCenter: [number, number];
  mapZoom: number;
  
  // Estado de busca
  searchQuery: string;
  isSearching: boolean;
  searchResults: Location[];
  
  // Estado de análise
  selectedLocation: Location | null;
  isAnalyzing: boolean;
  analysisData: any;
  
  // Ações
  setCurrentLocation: (location: Location) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchResults: (results: Location[]) => void;
  setSelectedLocation: (location: Location | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisData: (data: any) => void;
  clearSearch: () => void;
  clearAnalysis: () => void;
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
  
  // Ações
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
}));
