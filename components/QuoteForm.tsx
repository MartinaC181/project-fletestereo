import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Package, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { freightService } from "@/modules/freight";
import { geolocationService } from "@/lib/services/geolocation.service";
import GooglePlacesInput from "@/components/GooglePlacesInput";
import type { QuoteData, QuoteResult, ServiceType } from "@/core/events/domain-events";
import { MapView } from "@/components/MapView";
import type { Coordinates } from "@/lib/services/geolocation.service";

const QuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<QuoteData>({
    origen: "",
    destino: "",
    fecha: "",
    franja: "",
    tipoServicio: "" as ServiceType,
    pisosEscalera: 0,
    notas: ""
  });
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [routeData, setRouteData] = useState<{
    originCoords: Coordinates;
    destinationCoords: Coordinates;
    polyline?: string;
    distance: number;
  } | null>(null);

  const handleInputChange = useCallback((field: keyof QuoteData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'pisosEscalera' ? parseInt(value) || 0 : value 
    }));
    
    // Si cambió origen o destino, limpiar ruta anterior
    if (field === 'origen' || field === 'destino') {
      setRouteData(null);
      setQuote(null); // También limpiar cotización anterior
    }
  }, []);

  const handleCalculateRoute = useCallback(() => {
    if (formData.origen && formData.destino && formData.origen !== formData.destino) {
      calculateRoutePreview(formData.origen, formData.destino);
    } else {
      toast({ 
        title: "Campos requeridos", 
        description: "Completa las direcciones de origen y destino", 
        variant: "destructive" 
      });
    }
  }, [formData.origen, formData.destino]);

  const calculateRoutePreview = useCallback(async (origen: string, destino: string) => {
    if (!origen || !destino || origen === destino) return;
    
    setCalculatingRoute(true);
    try {
      // Geocodificar las direcciones
      const [originResult, destinationResult] = await Promise.all([
        geolocationService.geocodeAddress(origen),
        geolocationService.geocodeAddress(destino)
      ]);

      if (!originResult || !destinationResult) {
        toast({
          title: "Error de ubicación",
          description: "No pudimos encontrar las direcciones. Verifica que estén correctamente escritas.",
          variant: "destructive"
        });
        return;
      }

      // Calcular la ruta
      const routeInfo = await geolocationService.calculateRoute(
        originResult.coordinates, 
        destinationResult.coordinates
      );

      if (routeInfo) {
        setRouteData({
          originCoords: originResult.coordinates,
          destinationCoords: destinationResult.coordinates,
          polyline: routeInfo.polyline,
          distance: routeInfo.distance
        });

        toast({
          title: "¡Ruta calculada!",
          description: `Distancia: ${routeInfo.distance.toFixed(1)} km. Ahora puedes calcular la cotización.`
        });
      }
    } catch (error) {
      console.error('Error calculating route preview:', error);
      toast({
        title: "Error",
        description: "No pudimos calcular la ruta. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setCalculatingRoute(false);
    }
  }, [toast]);

  // Memoizar las props del mapa para evitar re-renders innecesarios
  const mapCenter = useMemo(() => {
    if (!routeData) return { lat: 0, lng: 0 };
    return {
      lat: (routeData.originCoords.lat + routeData.destinationCoords.lat) / 2,
      lng: (routeData.originCoords.lng + routeData.destinationCoords.lng) / 2
    };
  }, [routeData]);

  const mapMarkers = useMemo(() => {
    if (!routeData) return [];
    return [
      {
        position: routeData.originCoords,
        title: "Origen: " + formData.origen,
        color: 'green' as const
      },
      {
        position: routeData.destinationCoords,
        title: "Destino: " + formData.destino,
        color: 'red' as const
      }
    ];
  }, [routeData, formData.origen, formData.destino]);

  // Handlers memoizados para evitar re-renders
  const handleOrigenChange = useCallback((value: string) => handleInputChange("origen", value), [handleInputChange]);
  const handleDestinoChange = useCallback((value: string) => handleInputChange("destino", value), [handleInputChange]);
  const handleFechaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("fecha", e.target.value), [handleInputChange]);
  const handleFranjaChange = useCallback((value: string) => handleInputChange("franja", value), [handleInputChange]);
  const handleNotasChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notas", e.target.value), [handleInputChange]);

  const calculateQuote = async () => {
    if (!formData.origen || !formData.destino || !formData.fecha || !formData.franja || !formData.tipoServicio) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (!routeData) {
      toast({
        title: "Ruta requerida",
        description: "Primero debes calcular la ruta entre las direcciones.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Usar el servicio de fletes con la distancia real calculada
      const calculatedQuote = await freightService.requestQuoteWithDistance(
        formData,
        undefined, // clientInfo opcional para cotización rápida
        routeData.distance, // Distancia real calculada
        `quote_session_${Date.now()}` // sessionId para tracking
      );

      setQuote(calculatedQuote);
      
      toast({
        title: "Cotización calculada",
        description: `Distancia: ${routeData.distance.toFixed(1)} km - Total: $${calculatedQuote.total.toLocaleString()}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos calcular la cotización. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Solicita tu Cotización
          </h2>
          <p className="text-lg text-muted-foreground">
            Obtén una cotización instantánea y transparente para tu flete
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent-yellow" />
                Detalles del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <GooglePlacesInput
                  id="origen"
                  label="Origen"
                  placeholder="Escriba la dirección de origen..."
                  value={formData.origen}
                  onChange={handleOrigenChange}
                  required
                />
                <GooglePlacesInput
                  id="destino"
                  label="Destino" 
                  placeholder="Escriba la dirección de destino..."
                  value={formData.destino}
                  onChange={handleDestinoChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleFechaChange}
                  />
                </div>
                <div>
                  <Label htmlFor="franja">Franja Horaria *</Label>
                  <Select value={formData.franja} onValueChange={handleFranjaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mañana">Mañana (8:00 - 12:00)</SelectItem>
                      <SelectItem value="tarde">Tarde (12:00 - 18:00)</SelectItem>
                      <SelectItem value="completo">Día completo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoServicio">Tipo de Servicio *</Label>
                  <Select value={formData.tipoServicio} onValueChange={(value) => handleInputChange("tipoServicio", value as ServiceType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mudanza_completa">Mudanza Completa</SelectItem>
                      <SelectItem value="mini_mudanza">Mini Mudanza</SelectItem>
                      <SelectItem value="flete_liviano">Flete Liviano</SelectItem>
                      <SelectItem value="viaje_largo">Viaje Interurbano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pisosEscalera">Pisos por Escalera</Label>
                  <Input
                    id="pisosEscalera"
                    type="number"
                    min="0"
                    value={formData.pisosEscalera}
                    onChange={(e) => handleInputChange("pisosEscalera", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea
                  id="notas"
                  placeholder="Detalles específicos, instrucciones especiales, etc."
                  value={formData.notas}
                  onChange={handleNotasChange}
                />
              </div>

              <Button 
                onClick={calculateQuote} 
                disabled={loading || !routeData}
                className="w-full bg-black text-white hover:bg-gray-800"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {loading ? "Calculando..." : "Calcular Cotización"}
              </Button>
            </CardContent>
          </Card>

          {/* Quote Result and Route Map */}
          <div className="space-y-6">
            {/* Botón para calcular ruta - aparece cuando no hay ruta */}
            {formData.origen && formData.destino && !routeData && !calculatingRoute && (
              <Card className="shadow-lg">
                <CardContent className="py-6">
                  <div className="text-center">
                    <Button 
                      onClick={handleCalculateRoute}
                      className="bg-blue-600 hover:bg-blue-700 text-white mb-2"
                      disabled={calculatingRoute}
                      size="lg"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Calcular Ruta
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Calcula la ruta y distancia entre las direcciones para obtener una cotización precisa
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mapa de vista previa de la ruta */}
            {(calculatingRoute || routeData) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent-yellow" />
                    Ruta Calculada
                    {calculatingRoute && (
                      <span className="text-sm text-muted-foreground ml-2">Calculando...</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {calculatingRoute ? (
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Calculando ruta...</p>
                      </div>
                    </div>
                  ) : routeData ? (
                    <div>
                      <MapView
                        center={mapCenter}
                        markers={mapMarkers}
                        polyline={routeData.polyline}
                        zoom={10}
                        height="250px"
                      />
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              🟢 <strong>Origen:</strong> {formData.origen}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              🔴 <strong>Destino:</strong> {formData.destino}
                            </p>
                          </div>
                          <Button 
                            onClick={handleCalculateRoute}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            disabled={calculatingRoute}
                          >
                            Recalcular
                          </Button>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-semibold bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                            📏 Distancia: {routeData.distance.toFixed(1)} km
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Quote Result */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent-yellow" />
                  Tu Cotización
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quote ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Desglose de Precios</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tarifa base:</span>
                        <span>${quote.tarifaBase.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distancia ({quote.km} km):</span>
                        <span>${(quote.km * quote.precioKm).toLocaleString()}</span>
                      </div>
                      {quote.extras.escaleras > 0 && (
                        <div className="flex justify-between">
                          <span>Escaleras:</span>
                          <span>${quote.extras.escaleras.toLocaleString()}</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-accent-yellow">${quote.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {quote.requiereSenia && (
                    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                      <h5 className="font-semibold text-destructive mb-2">Seña Requerida</h5>
                      <p className="text-sm">
                        Este viaje requiere una seña de 
                        (${quote.montoSenia.toLocaleString()})
                      </p>
                    </div>
                  )}

                  <Button size="lg" className="w-full bg-accent-yellow text-black hover:bg-accent-yellow/90">
                    Confirmar Solicitud
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Completa el formulario para ver tu cotización</p>
                </div>
              )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;