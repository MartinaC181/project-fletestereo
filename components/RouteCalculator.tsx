'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocationSelector } from './LocationSelector';
import { MapView } from './MapView';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationResult, RouteInfo } from '@/lib/services/geolocation.service';
import { MapPin, Clock, Route, Map } from 'lucide-react';

interface RouteCalculatorProps {
  onRouteCalculated?: (route: RouteInfo) => void;
}

export const RouteCalculator = ({ onRouteCalculated }: RouteCalculatorProps) => {
  const [origin, setOrigin] = useState<GeolocationResult | null>(null);
  const [destination, setDestination] = useState<GeolocationResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { loading, calculateRoute } = useGeolocation();

  const handleCalculateRoute = useCallback(async () => {
    if (!origin || !destination || isCalculating) return;
    
    setIsCalculating(true);
    try {
      const route = await calculateRoute(origin.coordinates, destination.coordinates);
      if (route) {
        setRouteInfo(route);
        onRouteCalculated?.(route);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [origin, destination, isCalculating, calculateRoute, onRouteCalculated]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Calculadora de Rutas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocationSelector
          label="Origen"
          onChange={setOrigin}
          placeholder="Dirección de origen"
        />
        
        <LocationSelector
          label="Destino"
          onChange={setDestination}
          placeholder="Dirección de destino"
        />
        
        <Button
          onClick={handleCalculateRoute}
          disabled={!origin || !destination || loading || isCalculating}
          className="w-full"
        >
          {(loading || isCalculating) ? 'Calculando...' : 'Calcular Ruta'}
        </Button>
        
        {routeInfo && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Información de la Ruta</h3>
                <Button
                  onClick={() => setShowMap(!showMap)}
                >
                  <Map className="h-4 w-4 mr-2" />
                  {showMap ? 'Ocultar' : 'Ver'} Mapa
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Distancia</p>
                    <p className="font-medium">{routeInfo.distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tiempo estimado</p>
                    <p className="font-medium">{Math.round(routeInfo.duration)} min</p>
                  </div>
                </div>
              </div>
            </div>
            
            {showMap && origin && destination && (
              <div className="border rounded-lg overflow-hidden">
                <MapView
                  center={origin.coordinates}
                  markers={[
                    {
                      position: origin.coordinates,
                      title: 'Origen',
                      color: 'green'
                    },
                    {
                      position: destination.coordinates,
                      title: 'Destino',
                      color: 'red'
                    }
                  ]}
                  polyline={routeInfo.polyline}
                  height="300px"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};