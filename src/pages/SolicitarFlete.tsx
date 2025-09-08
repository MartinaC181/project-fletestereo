import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calculator, User, Phone, Mail, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
}

interface RequestData {
  origen: string;
  destino: string;
  fecha: string;
  franja: string;
  cargaTipo: string;
  cargaVolumen: string;
  notas: string;
}

const SolicitarFlete = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [clientData, setClientData] = useState<ClientData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    dni: ""
  });

  const [requestData, setRequestData] = useState<RequestData>({
    origen: "",
    destino: "",
    fecha: "",
    franja: "",
    cargaTipo: "",
    cargaVolumen: "",
    notas: ""
  });

  const [quote, setQuote] = useState<any>(null);

  const handleClientDataChange = (field: keyof ClientData, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequestDataChange = (field: keyof RequestData, value: string) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const calculateQuote = () => {
    // Simulación de cálculo de cotización
    const mockQuote = {
      km: Math.floor(Math.random() * 150) + 10,
      tarifaBase: 5000,
      precioKm: 50,
      extras: {
        cargaPesada: requestData.cargaTipo === "pesada" ? 2000 : 0,
        ayudanteExtra: requestData.cargaVolumen === "grande" ? 1500 : 0,
        embalaje: requestData.notas.toLowerCase().includes("embalaje") ? 800 : 0
      },
      total: 0
    };

    const extrasTotal = Object.values(mockQuote.extras).reduce((sum, extra) => sum + extra, 0);
    mockQuote.total = mockQuote.tarifaBase + (mockQuote.km * mockQuote.precioKm) + extrasTotal;

    setQuote(mockQuote);
    setStep(3);
  };

  const submitRequest = async () => {
    if (!acceptTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para continuar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Crear cliente temporal
      const { data: clientResult, error: clientError } = await supabase
        .from("clients")
        .insert({
          nombre: clientData.nombre,
          apellido: clientData.apellido,
          telefono: clientData.telefono,
          email: clientData.email || null,
          dni: clientData.dni || null,
          es_temporal: true
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // 2. Crear solicitud
      const { data: requestResult, error: requestError } = await supabase
        .from("requests")
        .insert({
          client_id: clientResult.id,
          origen: requestData.origen,
          destino: requestData.destino,
          fecha: requestData.fecha,
          franja: requestData.franja,
          carga_tipo: requestData.cargaTipo,
          carga_volumen: requestData.cargaVolumen,
          notas: requestData.notas,
          estado: "Solicitada"
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // 3. Guardar cotización
      if (quote) {
        const { error: quoteError } = await supabase
          .from("quotes")
          .insert({
            request_id: requestResult.id,
            km: quote.km,
            tarifa_base: quote.tarifaBase,
            precio_km: quote.precioKm,
            extras_json: quote.extras,
            total: quote.total
          });

        if (quoteError) throw quoteError;
      }

      toast({
        title: "¡Solicitud enviada exitosamente!",
        description: `Tu solicitud #${requestResult.id.slice(0, 8)} ha sido registrada. Te contactaremos pronto.`
      });

      // Redirigir a página de confirmación
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error: any) {
      console.error("Error al enviar solicitud:", error);
      toast({
        title: "Error al enviar solicitud",
        description: "Hubo un problema al procesar tu solicitud. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!clientData.nombre || !clientData.telefono) {
        toast({
          title: "Campos requeridos",
          description: "Nombre y teléfono son obligatorios",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!requestData.origen || !requestData.destino || !requestData.fecha || !requestData.franja || !requestData.cargaTipo) {
        toast({
          title: "Campos requeridos",
          description: "Por favor completa todos los campos obligatorios",
          variant: "destructive"
        });
        return;
      }
      calculateQuote();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Datos personales</span>
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Detalles del flete</span>
              </div>
              <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <Calculator className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Confirmación</span>
              </div>
            </div>
            <div className="mt-4 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Datos del cliente */}
          {step === 1 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent-orange" />
                  Tus Datos de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      placeholder="Tu nombre"
                      value={clientData.nombre}
                      onChange={(e) => handleClientDataChange("nombre", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      placeholder="Tu apellido"
                      value={clientData.apellido}
                      onChange={(e) => handleClientDataChange("apellido", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      placeholder="+54 11 1234-5678"
                      value={clientData.telefono}
                      onChange={(e) => handleClientDataChange("telefono", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={clientData.email}
                      onChange={(e) => handleClientDataChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dni">DNI (opcional)</Label>
                  <Input
                    id="dni"
                    placeholder="12.345.678"
                    value={clientData.dni}
                    onChange={(e) => handleClientDataChange("dni", e.target.value)}
                  />
                </div>

                <Button onClick={nextStep} className="w-full" variant="cta" size="lg">
                  Continuar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Detalles del flete */}
          {step === 2 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent-orange" />
                  Detalles del Flete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="origen">Dirección de Origen *</Label>
                    <Input
                      id="origen"
                      placeholder="Dirección completa de donde retirar"
                      value={requestData.origen}
                      onChange={(e) => handleRequestDataChange("origen", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destino">Dirección de Destino *</Label>
                    <Input
                      id="destino"
                      placeholder="Dirección completa de entrega"
                      value={requestData.destino}
                      onChange={(e) => handleRequestDataChange("destino", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha">Fecha del Servicio *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={requestData.fecha}
                      onChange={(e) => handleRequestDataChange("fecha", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="franja">Franja Horaria *</Label>
                    <Select value={requestData.franja} onValueChange={(value) => handleRequestDataChange("franja", value)}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cargaTipo">Tipo de Carga *</Label>
                    <Select value={requestData.cargaTipo} onValueChange={(value) => handleRequestDataChange("cargaTipo", value)}>
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
                    <Label htmlFor="cargaVolumen">Volumen Aproximado</Label>
                    <Select value={requestData.cargaVolumen} onValueChange={(value) => handleRequestDataChange("cargaVolumen", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tamaño de carga" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeño">Pequeño (caja)</SelectItem>
                        <SelectItem value="mediano">Mediano (varios bultos)</SelectItem>
                        <SelectItem value="grande">Grande (requiere ayudante)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notas">Información Adicional</Label>
                  <Textarea
                    id="notas"
                    placeholder="Describe tu carga, instrucciones especiales, si necesitas embalaje, etc."
                    value={requestData.notas}
                    onChange={(e) => handleRequestDataChange("notas", e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Volver
                  </Button>
                  <Button onClick={nextStep} className="flex-1" variant="cta">
                    Calcular Cotización
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmación y cotización */}
          {step === 3 && quote && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-accent-orange" />
                  Confirmación de Solicitud
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resumen de cotización */}
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Tu Cotización</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tarifa base:</span>
                      <span>${quote.tarifaBase.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distancia ({quote.km} km):</span>
                      <span>${(quote.km * quote.precioKm).toLocaleString()}</span>
                    </div>
                    {Object.entries(quote.extras).map(([key, value]: [string, any]) => (
                      value > 0 && (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <span>${value.toLocaleString()}</span>
                        </div>
                      )
                    ))}
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total estimado:</span>
                      <span className="text-accent-orange">${quote.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {quote.km > 100 && (
                    <div className="mt-4 bg-accent-orange-light/20 p-4 rounded-lg border border-accent-orange/20">
                      <h5 className="font-semibold text-accent-orange mb-2">Seña Requerida</h5>
                      <p className="text-sm">
                        Para viajes mayores a 100km se requiere una seña del 30% 
                        (${Math.round(quote.total * 0.3).toLocaleString()})
                      </p>
                    </div>
                  )}
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms" className="text-sm font-medium">
                      Acepto los términos y condiciones
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Al enviar esta solicitud acepto las políticas de servicio y privacidad.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Modificar
                  </Button>
                  <Button 
                    onClick={submitRequest} 
                    disabled={loading || !acceptTerms}
                    className="flex-1" 
                    variant="hero"
                    size="lg"
                  >
                    {loading ? "Enviando..." : "Confirmar Solicitud"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SolicitarFlete;