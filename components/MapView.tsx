'use client';

import { useEffect, useRef } from 'react';
import { Coordinates } from '@/lib/services/geolocation.service';

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
    if (!mapRef.current || !window.google) return;

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
    });

    // Agregar polyline si existe
    if (polyline && window.google.maps.geometry) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      
      new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#2563eb',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current
      });

      // Ajustar la vista para mostrar toda la ruta
      const bounds = new google.maps.LatLngBounds();
      decodedPath.forEach(point => bounds.extend(point));
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [center, markers, polyline, zoom]);

  // Cargar la API de Google Maps si no está disponible
  useEffect(() => {
    if (window.google) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // El mapa se inicializará cuando el script se cargue
      if (mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Limpiar el script si el componente se desmonta
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-200"
    />
  );
};