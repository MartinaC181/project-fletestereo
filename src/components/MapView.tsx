'use client';

import { useEffect, useRef, memo, useMemo } from 'react';
import { Coordinates } from '@/src/lib/services/geolocation.service';

interface MapViewProps {
  center: Coordinates;
  markers?: Array<{
    position: Coordinates;
    title: string;
    color?: 'red' | 'blue' | 'green';
  }>;
  polyline?: string;
  zoom?: number;
  height?: string;
}

const MapViewComponent = ({
  center,
  markers = [],
  polyline,
  zoom = 12,
  height = '400px'
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Crear una clave estable basada en el contenido de los marcadores
  const markersKey = useMemo(() => {
    return markers.map(m => 
      `${m.position.lat},${m.position.lng},${m.title},${m.color || 'red'}`
    ).join('|');
  }, [markers]);

  // Mantener una referencia al array de marcadores actual
  const markersDataRef = useRef(markers);
  useEffect(() => {
    markersDataRef.current = markers;
  }, [markers]);

  // Inicializar el mapa solo una vez
  useEffect(() => {
    if (!mapRef.current || !window.google || !window.google.maps || mapInstanceRef.current) {
      return;
    }

    console.log('🗺️ Inicializando mapa por primera vez');

    // Inicializar el mapa
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
  }, [center.lat, center.lng, zoom]); // Solo reinicializar si el centro o zoom cambian

  // Actualizar marcadores cuando cambien
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    console.log('🔄 Actualizando marcadores...');

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Crear bounds para ajustar la vista
    const bounds = new google.maps.LatLngBounds();
    let shouldFitBounds = false;

    // Usar los marcadores de la referencia
    const currentMarkers = markersDataRef.current;

    // Agregar nuevos marcadores
    currentMarkers.forEach((marker) => {
      const newMarker = new google.maps.Marker({
        position: marker.position,
        map: mapInstanceRef.current,
        title: marker.title,
        icon: {
          url: `https://maps.google.com/mapfiles/ms/icons/${marker.color || 'red'}-dot.png`
        }
      });
      
      markersRef.current.push(newMarker);
      bounds.extend(marker.position);
      shouldFitBounds = true;
    });

    // Ajustar vista si hay múltiples marcadores y no hay polyline
    if (shouldFitBounds && currentMarkers.length > 1 && !polyline) {
      mapInstanceRef.current.fitBounds(bounds);
      
      google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
        const currentZoom = mapInstanceRef.current?.getZoom();
        if (currentZoom && currentZoom > 15) {
          mapInstanceRef.current?.setZoom(15);
        }
      });
    }
  }, [markersKey, polyline]); // Usar la clave estable en lugar del array de marcadores

  // Actualizar polyline cuando cambie
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps || !window.google.maps.geometry) {
      return;
    }

    // Limpiar polyline anterior
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // Agregar nueva polyline si existe
    if (polyline) {
      console.log('🛣️ Actualizando polyline...');
      
      try {
        const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
        console.log('✅ Polyline decodificada, puntos:', decodedPath.length);
        
        polylineRef.current = new google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: '#2563eb',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          map: mapInstanceRef.current
        });

        console.log('✅ Polyline agregada al mapa');

        // Ajustar vista a la ruta
        const polylineBounds = new google.maps.LatLngBounds();
        decodedPath.forEach(point => polylineBounds.extend(point));
        mapInstanceRef.current.fitBounds(polylineBounds);
        
        console.log('✅ Vista ajustada a la ruta');
      } catch (error) {
        console.error('❌ Error al procesar polyline:', error);
      }
    }
  }, [polyline]); // Solo actualizar polyline cuando cambie

  // Asegurar que Google Maps esté cargado antes de usar el mapa
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.log('⏳ Esperando a que Google Maps se cargue...');
      return;
    }
    
    if (!window.google.maps.geometry) {
      console.error('❌ Google Maps Geometry library no está disponible');
      return;
    }

    console.log('✅ Google Maps API disponible con geometry library');
  }, []);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-200"
    />
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export const MapView = memo(MapViewComponent);