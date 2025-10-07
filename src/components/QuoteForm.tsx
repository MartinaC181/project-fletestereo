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
import type { QuoteData, QuoteResult } from "@/core/events/domain-events";

const QuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<QuoteData>({
    origen: "",
    destino: "",
    fecha: "",
    franja: "",
    cargaTipo: "",
    cargaVolumen: "",
    notas: ""
  });
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof QuoteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateQuote = async () => {
    if (!formData.origen || !formData.destino || !formData.fecha || !formData.franja || !formData.cargaTipo) {
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
                <div>
                  <Label htmlFor="origen">Origen *</Label>
                  <Input
                    id="origen"
                    placeholder="Dirección de origen"
                    value={formData.origen}
                    onChange={(e) => handleInputChange("origen", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="destino">Destino *</Label>
                  <Input
                    id="destino"
                    placeholder="Dirección de destino"
                    value={formData.destino}
                    onChange={(e) => handleInputChange("destino", e.target.value)}
                  />
                </div>
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
                  <Label htmlFor="cargaTipo">Tipo de Carga *</Label>
                  <Select value={formData.cargaTipo} onValueChange={(value) => handleInputChange("cargaTipo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de carga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liviana">Liviana (hasta 500kg)</SelectItem>
                      <SelectItem value="media">Media (500kg - 1000kg)</SelectItem>
                      <SelectItem value="pesada">Pesada (más de 1000kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cargaVolumen">Volumen</Label>
                  <Select value={formData.cargaVolumen} onValueChange={(value) => handleInputChange("cargaVolumen", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tamaño de carga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeño">Pequeño</SelectItem>
                      <SelectItem value="mediano">Mediano</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
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
                className="w-full"
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
                      {quote.extras.cargaPesada > 0 && (
                        <div className="flex justify-between">
                          <span>Carga pesada:</span>
                          <span>${quote.extras.cargaPesada.toLocaleString()}</span>
                        </div>
                      )}
                      {quote.extras.ayudanteExtra > 0 && (
                        <div className="flex justify-between">
                          <span>Ayudante extra:</span>
                          <span>${quote.extras.ayudanteExtra.toLocaleString()}</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-accent-yellow">${quote.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {quote.km > 100 && (
                    <div className="bg-accent-yellow-light/20 p-4 rounded-lg border border-accent-yellow/20">
                      <h5 className="font-semibold text-black mb-2">Seña Requerida</h5>
                      <p className="text-sm text-black">
                        Para viajes mayores a 100km se requiere una seña del 30% 
                        (${Math.round(quote.total * 0.3).toLocaleString()})
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