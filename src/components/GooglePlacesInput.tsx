import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GooglePlacesInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  required?: boolean;
}

export const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  value,
  onChange,
  placeholder = "Escriba una dirección...",
  label,
  id,
  required = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initGooglePlaces = async () => {
      try {
        // Obtener la API key
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        console.log('[GooglePlaces] API Key disponible:', !!apiKey);
        console.log('[GooglePlaces] Valor de API Key:', apiKey);
        
        if (!apiKey) {
          setError('API Key no configurada');
          console.error('[GooglePlaces] VITE_GOOGLE_MAPS_API_KEY no encontrada en variables de entorno');
          return;
        }

        // Verificar si Google Maps ya está cargado
        if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
          console.log('[GooglePlaces] Google Maps ya estaba cargado');
          initAutocomplete();
          return;
        }

        // Cargar el script de Google Maps
        console.log('[GooglePlaces] Cargando script de Google Maps...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es&region=AR`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('[GooglePlaces] Script cargado exitosamente');
          setTimeout(() => {
            initAutocomplete();
          }, 100); // Pequeño delay para asegurar que todo esté listo
        };

        script.onerror = (error) => {
          console.error('[GooglePlaces] Error cargando script:', error);
          setError('Error cargando Google Maps');
        };

        document.head.appendChild(script);

      } catch (err) {
        console.error('[GooglePlaces] Error general:', err);
        setError('Error inicializando');
      }
    };

    const initAutocomplete = () => {
      try {
        if (!inputRef.current) {
          console.error('[GooglePlaces] Input ref no disponible');
          return;
        }

        if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) {
          console.error('[GooglePlaces] Google Maps o Places API no disponible');
          setError('Google Maps no disponible');
          return;
        }

        console.log('[GooglePlaces] Creando Autocomplete...');
        
        const autocomplete = new (window as any).google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'ar' },
            fields: ['formatted_address', 'geometry', 'place_id']
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('[GooglePlaces] Lugar seleccionado:', place);
          if (place && place.formatted_address) {
            onChange(place.formatted_address);
          }
        });

        console.log('[GooglePlaces] Autocomplete inicializado correctamente');
        setIsLoaded(true);
        setError(null);

      } catch (err) {
        console.error('[GooglePlaces] Error creando autocomplete:', err);
        setError('Error inicializando autocompletado');
      }
    };

    initGooglePlaces();
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
          {error && <span className="text-red-500 text-xs ml-2">({error})</span>}
          {!error && !isLoaded && <span className="text-yellow-600 text-xs ml-2">(Cargando...)</span>}
          {isLoaded && <span className="text-green-600 text-xs ml-2">(✓ Listo)</span>}
        </Label>
      )}
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default GooglePlacesInput;