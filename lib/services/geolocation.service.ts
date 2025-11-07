export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface RouteInfo {
  distance: number; // en kilómetros
  duration: number; // en minutos
  polyline?: string;
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
}

export interface GeolocationResult {
  coordinates: Coordinates;
  address: Address;
  formattedAddress: string;
}

class GeolocationService {
  private googleMapsApiKey: string;

  constructor() {
    this.googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  // Geocodificar dirección a coordenadas
  async geocodeAddress(address: string): Promise<GeolocationResult | null> {
    try {
      console.log('🔍 Geocodificando dirección:', address);
      
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(address)}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Error en geocodificación:', data.error);
        return null;
      }
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        
        return {
          coordinates: {
            lat: location.lat,
            lng: location.lng
          },
          address: this.parseAddressComponents(result.address_components),
          formattedAddress: result.formatted_address
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Calcular ruta entre dos puntos
  async calculateRoute(
    origin: Coordinates, 
    destination: Coordinates, 
    travelMode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT' = 'DRIVING'
  ): Promise<RouteInfo | null> {
    try {
      console.log('🛣️ Calculando ruta entre coordenadas:', origin, '→', destination, `(modo: ${travelMode})`);
      
      const response = await fetch(
        `/api/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${travelMode.toLowerCase()}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Error en cálculo de ruta:', data.error);
        return null;
      }
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        console.log('✅ Ruta calculada exitosamente');
        console.log('📊 Distancia:', leg.distance.value / 1000, 'km');
        console.log('⏰ Duración:', leg.duration.value / 60, 'min');
        console.log('🛣️ Polyline:', route.overview_polyline?.points ? 'PRESENTE' : 'AUSENTE');
        
        if (route.overview_polyline?.points) {
          console.log('📏 Longitud del polyline:', route.overview_polyline.points.length, 'caracteres');
        }
        
        return {
          distance: leg.distance.value / 1000, // convertir a km
          duration: leg.duration.value / 60, // convertir a minutos
          polyline: route.overview_polyline?.points,
          travelMode
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    }
  }

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private parseAddressComponents(components: any[]): Address {
    const address: Address = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };

    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        address.street += component.long_name + ' ';
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      }
      if (types.includes('postal_code')) {
        address.zipCode = component.long_name;
      }
      if (types.includes('country')) {
        address.country = component.long_name;
      }
    });

    address.street = address.street.trim();
    return address;
  }
}

export const geolocationService = new GeolocationService();