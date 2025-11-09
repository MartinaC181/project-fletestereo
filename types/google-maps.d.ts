// Declaraciones de tipos para Google Maps
declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
        fitBounds(bounds: LatLngBounds): void;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
      }

      class Polyline {
        constructor(opts?: PolylineOptions);
      }

      class LatLngBounds {
        constructor();
        extend(point: LatLng): void;
      }

      interface LatLng {
        lat(): number;
        lng(): number;
      }

      interface MapOptions {
        center: { lat: number; lng: number };
        zoom: number;
        styles?: MapTypeStyle[];
      }

      interface MarkerOptions {
        position: { lat: number; lng: number };
        map: Map;
        title?: string;
        icon?: string | { url: string };
      }

      interface PolylineOptions {
        path: LatLng[];
        geodesic?: boolean;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
        map: Map;
      }

      interface MapTypeStyle {
        featureType?: string;
        elementType?: string;
        stylers?: Array<{ [key: string]: string }>;
      }

      namespace geometry {
        namespace encoding {
          function decodePath(encodedPath: string): LatLng[];
        }
      }
    }
  }
}

export {};