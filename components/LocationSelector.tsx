'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Coordinates, GeolocationResult } from '@/lib/services/geolocation.service';

interface LocationSelectorProps {
  label: string;
  value?: string;
  onChange: (location: GeolocationResult) => void;
  placeholder?: string;
}

export const LocationSelector = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Ingresa una dirección" 
}: LocationSelectorProps) => {
  const [address, setAddress] = useState(value || '');
  const [suggestions, setSuggestions] = useState<GeolocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { loading, error, geocodeAddress } = useGeolocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    setSuggestions([]);
    
    // Cancelar búsqueda anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Solo buscar si hay suficiente texto
    if (newAddress.length > 3) {
      setIsSearching(true);
      
      // Debounce de 500ms para evitar múltiples llamadas
      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await geocodeAddress(newAddress);
          if (result) {
            setSuggestions([result]);
          }
        } catch (err) {
          console.error('Error en geocodificación:', err);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setIsSearching(false);
    }
  };
  
  // Limpiar timeout al desmontar componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSelectSuggestion = (suggestion: GeolocationResult) => {
    setAddress(suggestion.formattedAddress);
    setSuggestions([]);
    onChange(suggestion);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`location-${label}`}>{label}</Label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            id={`location-${label}`}
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
            disabled={loading || isSearching}
          />
          {isSearching ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          ) : (
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
          
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b last:border-b-0"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="font-medium">{suggestion.formattedAddress}</div>
                  <div className="text-sm text-gray-500">
                    {suggestion.address.city}, {suggestion.address.state}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};