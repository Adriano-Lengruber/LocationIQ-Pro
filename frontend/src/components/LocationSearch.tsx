'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useLocationStore } from '@/stores/locationStore';

export default function LocationSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchQuery,
    isSearching,
    searchResults,
    setSearchQuery,
    setIsSearching,
    setSearchResults,
    setSelectedLocation,
    setMapCenter,
    clearSearch
  } = useLocationStore();

  // Função para buscar localizações usando Mapbox Geocoding API
  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        throw new Error('Token do Mapbox não encontrado');
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${token}&` +
        `country=BR&` +
        `limit=5&` +
        `language=pt`
      );

      if (!response.ok) {
        throw new Error('Erro na busca');
      }

      const data = await response.json();
      
      const results = data.features?.map((feature: any) => ({
        id: feature.id,
        lat: feature.center[1],
        lng: feature.center[0],
        place_name: feature.place_name,
        center: feature.center,
        address: feature.text,
        city: feature.context?.find((c: any) => c.id.includes('place'))?.text,
        state: feature.context?.find((c: any) => c.id.includes('region'))?.text,
        country: feature.context?.find((c: any) => c.id.includes('country'))?.text,
      })) || [];

      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (result: any) => {
    const location = {
      lat: result.lat,
      lng: result.lng,
      address: result.place_name,
      city: result.city,
      state: result.state,
      country: result.country,
    };

    setSelectedLocation(location);
    setMapCenter(result.center);
    setSearchQuery(result.place_name);
    setIsOpen(false);
    clearSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     placeholder-gray-500 text-sm bg-white shadow-sm"
          placeholder="Busque por endereço, bairro ou cidade..."
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isSearching && (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin mr-3" />
          )}
          
          {searchQuery && !isSearching && (
            <button
              onClick={handleClearSearch}
              className="p-1 mr-2 text-gray-400 hover:text-gray-600 rounded-full 
                         hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (searchResults.length > 0 || isSearching) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 
                        rounded-lg shadow-lg max-h-60 overflow-auto">
          {isSearching && searchQuery.length >= 3 && (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Buscando...
            </div>
          )}
          
          {!isSearching && searchResults.length === 0 && searchQuery.length >= 3 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Nenhum resultado encontrado
            </div>
          )}
          
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelectLocation(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 
                         border-b border-gray-100 last:border-b-0 
                         transition-colors focus:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.address}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.city && result.state 
                      ? `${result.city}, ${result.state}` 
                      : result.place_name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
