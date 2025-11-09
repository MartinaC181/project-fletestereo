'use client';

import { useEffect, useRef } from 'react';
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

export const MapView = ({
  center,
  markers = [],
  polyline,
  zoom = 12,
  height = '400px'
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.log('⏳ Esperando a que Google Maps esté disponible...');
      return;
    }

    console.log('🗺️ Inicializando mapa con polyline:', polyline ? 'SÍ' : 'NO');
    console.log('🗺️ Marcadores:', markers.length);
    console.log('🗺️ Geometry library disponible:', !!window.google.maps.geometry);

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

    // Crear bounds para ajustar la vista
    const bounds = new google.maps.LatLngBounds();
    let shouldFitBounds = false;

    // Agregar marcadores
    markers.forEach((marker, index) => {
      new google.maps.Marker({
        position: marker.position,
        map: mapInstanceRef.current,
        title: marker.title,
        icon: {
          url: `https://maps.google.com/mapfiles/ms/icons/${marker.color || 'red'}-dot.png`
        }
      });
      
      // Extender bounds con cada marcador
      bounds.extend(marker.position);
      shouldFitBounds = true;
    });

    // Agregar polyline si existe
    if (polyline) {
      console.log('🛣️ Procesando polyline...');
      
      // Verificar si geometry está disponible
      if (!window.google.maps.geometry) {
        console.error('❌ Google Maps Geometry library no está cargada');
        return;
      }

      try {
        const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
        console.log('✅ Polyline decodificada, puntos:', decodedPath.length);
        
        const polylineObject = new google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: '#2563eb',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          map: mapInstanceRef.current
        });

        console.log('✅ Polyline agregada al mapa');

        // Limpiar bounds anteriores y usar los del polyline
        const polylineBounds = new google.maps.LatLngBounds();
        decodedPath.forEach(point => polylineBounds.extend(point));
        mapInstanceRef.current.fitBounds(polylineBounds);
        
        console.log('✅ Vista ajustada a la ruta');
      } catch (error) {
        console.error('❌ Error al procesar polyline:', error);
      }
    } else if (shouldFitBounds && markers.length > 1) {
      // Si hay múltiples marcadores pero no polyline, ajustar vista para mostrar todos
      mapInstanceRef.current.fitBounds(bounds);
      
      // Añadir un poco de padding para que los marcadores no queden en el borde
      google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
        const zoom = mapInstanceRef.current?.getZoom();
        if (zoom && zoom > 15) {
          mapInstanceRef.current?.setZoom(15); // Limitar zoom máximo para evitar que quede demasiado cerca
        }
      });
    }
  }, [center, markers, polyline, zoom]);

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