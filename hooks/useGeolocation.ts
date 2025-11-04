import { useState, useCallback } from 'react';
import { geolocationService, Coordinates, GeolocationResult, RouteInfo } from '@/lib/services/geolocation.service';

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(async (address: string): Promise<GeolocationResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await geolocationService.geocodeAddress(address);
      return result;
    } catch (err) {
      setError('Error al geocodificar la dirección');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateRoute = useCallback(async (origin: Coordinates, destination: Coordinates): Promise<RouteInfo | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await geolocationService.calculateRoute(origin, destination);
      return result;
    } catch (err) {
      setError('Error al calcular la ruta');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    geocodeAddress,
    calculateRoute,
    calculateDistance: geolocationService.calculateDistance
  };
};