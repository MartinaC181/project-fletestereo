'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calculator, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GooglePlacesInput from "@/components/GooglePlacesInput";
import { freightService } from "@/modules/freight";
import { geolocationService } from "@/lib/services/geolocation.service";
import type { ClientInfo, QuoteData, QuoteResult } from "@/core/events/domain-events";

export interface ExtraQuoteResult extends QuoteResult { precioKm: number; }

export default function SolicitarFletePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [calculatingQuote, setCalculatingQuote] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [clientData, setClientData] = useState<ClientInfo>({ nombre: "", apellido: "", telefono: "", email: "", dni: "" });
  const [requestData, setRequestData] = useState<QuoteData>({ origen: "", destino: "", fecha: "", franja: "", cargaTipo: "", cargaVolumen: "", notas: "" });
  const [quote, setQuote] = useState<ExtraQuoteResult | null>(null);

  const handleClientDataChange = (field: keyof ClientInfo, value: string) => setClientData(p => ({ ...p, [field]: value }));
  const handleRequestDataChange = (field: keyof QuoteData, value: string) => setRequestData(p => ({ ...p, [field]: value }));

  const calculateQuote = async () => {
    setCalculatingQuote(true);
    try {
      toast({ 
        title: "Calculando cotización...", 
        description: "Obteniendo ubicaciones y calculando distancia real." 
      });

      // Primero geocodificar las direcciones para obtener coordenadas
      const [originResult, destinationResult] = await Promise.all([
        geolocationService.geocodeAddress(requestData.origen),
        geolocationService.geocodeAddress(requestData.destino)
      ]);

      if (!originResult || !destinationResult) {
        toast({ 
          title: "Error de ubicación", 
          description: "No pudimos encontrar las direcciones. Verifica que estén correctamente escritas.", 
          variant: "destructive" 
        });
        return;
      }

      // Calcular la ruta real entre las dos ubicaciones
      const routeInfo = await geolocationService.calculateRoute(
        originResult.coordinates, 
        destinationResult.coordinates
      );

      if (!routeInfo) {
        toast({ 
          title: "Error de ruta", 
          description: "No pudimos calcular la ruta entre las ubicaciones.", 
          variant: "destructive" 
        });
        return;
      }

      // Calcular cotización con la distancia real
      const calculated = await freightService.requestQuoteWithDistance(
        requestData, 
        clientData, 
        routeInfo.distance, // Distancia real en km
        `formal_quote_${Date.now()}`
      ) as ExtraQuoteResult;
      
      setQuote(calculated);
      setStep(3);
      
      toast({ 
        title: "¡Cotización calculada!", 
        description: `Distancia: ${routeInfo.distance.toFixed(1)} km - Total: $${calculated.total.toLocaleString()}` 
      });
    } catch (e) {
      console.error('Error calculating quote:', e);
      toast({ title: "Error", description: "No pudimos calcular la cotización. Intenta nuevamente.", variant: "destructive" });
    } finally {
      setCalculatingQuote(false);
    }
  };

  const submitRequest = async () => {
    if (!acceptTerms) { toast({ title: "Términos y condiciones", description: "Debes aceptar los términos y condiciones", variant: "destructive" }); return; }
    if (!quote) { toast({ title: "Error", description: "No hay cotización disponible", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const freightRequest = await freightService.createFreightRequest(clientData, requestData, quote);
      toast({ title: "¡Solicitud enviada exitosamente!", description: `Tu solicitud #${freightRequest.id.slice(0,8)} ha sido registrada.` });
      setTimeout(()=> router.push('/'), 2000);
    } catch (e) {
      console.error(e);
      toast({ title: "Error al enviar", description: "Hubo un problema al procesar tu solicitud.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!clientData.nombre || !clientData.telefono) {
        toast({ title: "Campos requeridos", description: "Nombre y teléfono son obligatorios", variant: "destructive" }); return; }
      setStep(2);
    } else if (step === 2) {
      if (!requestData.origen || !requestData.destino || !requestData.fecha || !requestData.franja || !requestData.cargaTipo) {
        toast({ title: "Campos requeridos", description: "Completa todos los campos", variant: "destructive" }); return; }
      calculateQuote();
    }
  };
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}><User className="h-4 w-4" /></div>
                    <span className="ml-2 text-sm font-medium">Datos personales</span>
                  </div>
                  <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}><MapPin className="h-4 w-4" /></div>
                    <span className="ml-2 text-sm font-medium">Detalles del flete</span>
                  </div>
                  <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}><Calculator className="h-4 w-4" /></div>
                    <span className="ml-2 text-sm font-medium">Confirmación</span>
                  </div>
                </div>
                <div className="mt-4 bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} /></div>
              </div>
              {step === 1 && (
                <Card className="shadow-lg">
                  <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-accent-yellow" />Tus Datos de Contacto</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="nombre">Nombre *</Label><Input id="nombre" value={clientData.nombre} onChange={e=>handleClientDataChange('nombre', e.target.value)} placeholder="Tu nombre" /></div>
                      <div><Label htmlFor="apellido">Apellido</Label><Input id="apellido" value={clientData.apellido} onChange={e=>handleClientDataChange('apellido', e.target.value)} placeholder="Tu apellido" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="telefono">Teléfono *</Label><Input id="telefono" value={clientData.telefono} onChange={e=>handleClientDataChange('telefono', e.target.value)} placeholder="+54 11 1234-5678" /></div>
                      <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={clientData.email} onChange={e=>handleClientDataChange('email', e.target.value)} placeholder="tu@email.com" /></div>
                    </div>
                    <div><Label htmlFor="dni">DNI (opcional)</Label><Input id="dni" value={clientData.dni} onChange={e=>handleClientDataChange('dni', e.target.value)} placeholder="12.345.678" /></div>
                    <Button onClick={nextStep} className="w-full">Continuar</Button>
                  </CardContent>
                </Card>
              )}
              {step === 2 && (
                <Card className="shadow-lg">
                  <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-accent-yellow" />Detalles del Flete</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <GooglePlacesInput id="origen" label="Dirección de Origen" placeholder="Escriba la dirección de origen..." value={requestData.origen} onChange={v=>handleRequestDataChange('origen', v)} />
                        <GooglePlacesInput id="destino" label="Dirección de Destino" placeholder="Escriba la dirección de destino..." value={requestData.destino} onChange={v=>handleRequestDataChange('destino', v)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="fecha">Fecha del Servicio *</Label><Input id="fecha" type="date" value={requestData.fecha} onChange={e=>handleRequestDataChange('fecha', e.target.value)} /></div>
                      <div><Label htmlFor="franja">Franja Horaria *</Label><Select value={requestData.franja} onValueChange={v=>handleRequestDataChange('franja', v)}><SelectTrigger><SelectValue placeholder="Seleccionar horario" /></SelectTrigger><SelectContent><SelectItem value="mañana">Mañana (8:00 - 12:00)</SelectItem><SelectItem value="tarde">Tarde (12:00 - 18:00)</SelectItem><SelectItem value="completo">Día completo</SelectItem></SelectContent></Select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label htmlFor="cargaTipo">Tipo de Carga *</Label><Select value={requestData.cargaTipo} onValueChange={v=>handleRequestDataChange('cargaTipo', v)}><SelectTrigger><SelectValue placeholder="Tipo de carga" /></SelectTrigger><SelectContent><SelectItem value="mudanza-completa">Mudanza Completa ($80.000)</SelectItem><SelectItem value="mini-mudanza-larga">Mini Mudanza (+10 cuadras - $40.000)</SelectItem><SelectItem value="mini-mudanza-corta">Mini Mudanza (-10 cuadras - $30.000)</SelectItem><SelectItem value="flete-largo">Flete Liviano Largo ($25.000)</SelectItem><SelectItem value="flete-corto">Flete Liviano Corto ($20.000)</SelectItem></SelectContent></Select></div>
                      <div><Label htmlFor="cargaVolumen">Volumen Aproximado</Label><Select value={requestData.cargaVolumen} onValueChange={v=>handleRequestDataChange('cargaVolumen', v)}><SelectTrigger><SelectValue placeholder="Tamaño de carga" /></SelectTrigger><SelectContent><SelectItem value="1-objeto">1 objeto</SelectItem><SelectItem value="2-4-objetos">2 a 4 objetos</SelectItem><SelectItem value="electrodomesticos">Electrodomésticos básicos</SelectItem><SelectItem value="muebles-basicos">Muebles básicos (cama, comedor)</SelectItem><SelectItem value="camioneta-completa">Hasta llenar camioneta</SelectItem></SelectContent></Select></div>
                    </div>
                    <div><Label htmlFor="notas">Información Adicional</Label><Textarea id="notas" value={requestData.notas} onChange={e=>handleRequestDataChange('notas', e.target.value)} placeholder="Describe tu carga, instrucciones especiales, etc." /></div>
                    <div className="flex gap-4">
                      <Button onClick={()=>setStep(1)} className="flex-1 border border-gray-300" disabled={calculatingQuote}>
                        Volver
                      </Button>
                      <Button 
                        onClick={nextStep} 
                        className="flex-1 bg-black text-white hover:bg-gray-800" 
                        disabled={calculatingQuote}
                      >
                        {calculatingQuote ? 'Calculando...' : 'Calcular Cotización'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              {step === 3 && quote && (
                <Card className="shadow-lg">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-accent-yellow" />Confirmación de Solicitud</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4">Tu Cotización</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Tarifa base:</span><span>${quote.tarifaBase.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Distancia ({quote.km} km):</span><span>${(quote.km * (quote as any).precioKm).toLocaleString()}</span></div>
                        {Object.entries(quote.extras).map(([k,v]) => v>0 && (<div key={k} className="flex justify-between"><span className="capitalize">{k.replace(/([A-Z])/g,' $1').toLowerCase()}:</span><span>${(v as number).toLocaleString()}</span></div>))}
                        <hr />
                        <div className="flex justify-between font-bold text-lg"><span>Total estimado:</span><span className="text-accent-yellow">${quote.total.toLocaleString()}</span></div>
                      </div>
                      {quote.km > 100 && (
                        <div className="mt-4 bg-accent-yellow-light/20 p-4 rounded-lg border border-accent-yellow/20"><h5 className="font-semibold text-black mb-2">Seña Requerida</h5><p className="text-sm text-black">Para viajes mayores a 100km se requiere una seña del 30% (${Math.round(quote.total*0.3).toLocaleString()})</p></div>
                      )}
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" checked={acceptTerms} onCheckedChange={c=>setAcceptTerms(c as boolean)} />
                      <div className="grid gap-1.5 leading-none"><label htmlFor="terms" className="text-sm font-medium">Acepto los términos y condiciones</label><p className="text-xs text-muted-foreground">Al enviar esta solicitud acepto las políticas de servicio y privacidad.</p></div>
                    </div>
                    <div className="flex gap-4"><Button onClick={()=>setStep(2)} className="flex-1 border border-gray-300">Modificar</Button><Button onClick={submitRequest} disabled={loading || !acceptTerms} className="flex-1">{loading? 'Enviando...':'Confirmar Solicitud'}</Button></div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}