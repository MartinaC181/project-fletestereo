import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Package, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { freightService } from "@/modules/freight";
import GooglePlacesInput from "@/components/GooglePlacesInput";
import type { QuoteData, QuoteResult, ServiceType } from "@/core/events/domain-events";

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

  const handleInputChange = (field: keyof QuoteData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'pisosEscalera' ? parseInt(value) || 0 : value 
    }));
  };

  const calculateQuote = async () => {
    if (!formData.origen || !formData.destino || !formData.fecha || !formData.franja || !formData.tipoServicio) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Usar el servicio de fletes que emite eventos
      const calculatedQuote = await freightService.requestQuote(
        formData,
        undefined, // clientInfo opcional para cotización rápida
        `quote_session_${Date.now()}` // sessionId para tracking
      );

      setQuote(calculatedQuote);
      
      toast({
        title: "Cotización calculada",
        description: "Tu cotización está lista. Revisa los detalles a continuación."
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
                  onChange={(value) => handleInputChange("origen", value)}
                  required
                />
                <GooglePlacesInput
                  id="destino"
                  label="Destino" 
                  placeholder="Escriba la dirección de destino..."
                  value={formData.destino}
                  onChange={(value) => handleInputChange("destino", value)}
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
                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="franja">Franja Horaria *</Label>
                  <Select value={formData.franja} onValueChange={(value) => handleInputChange("franja", value)}>
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
                  onChange={(e) => handleInputChange("notas", e.target.value)}
                />
              </div>

              <Button 
                onClick={calculateQuote} 
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800"
                variant="cta"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {loading ? "Calculando..." : "Calcular Cotización"}
              </Button>
            </CardContent>
          </Card>

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

                  <Button variant="hero" size="lg" className="w-full">
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
    </section>
  );
};

export default QuoteForm;