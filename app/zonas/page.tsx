'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Truck, CheckCircle, ArrowRight, Phone, Star, Navigation } from "lucide-react";

const mainZones = [
  { title: "Corrientes Capital", areas: ["Centro","San Benito","Aldana","Quintana","Pirayuí","Molina Punta","Laguna Brava","Villa Raquel","San Cayetano","Piedritas","Villa Libertad","Tres Esquinas"], deliveryTime: "1-2 horas", coverage: "100%", price: "Desde $20.000" },
  { title: "Gran Corrientes Norte", areas: ["Riachuelo","Santa Ana","San Cosme","Paso de la Patria","Itatí","Berón de Astrada","Palmar Grande","Carolina","Chavarría","General Paz","Lomas de Vallejos"], deliveryTime: "2-3 horas", coverage: "95%", price: "Desde $25.000" },
  { title: "Gran Corrientes Sur", areas: ["Empedrado","San Luis del Palmar","Bella Vista","Saladas","Mburucuyá","San Roque","Concepción","Tabay","Lomas de Vallejos","Riachuelo","Santa Lucía"], deliveryTime: "2-4 horas", coverage: "90%", price: "Desde $30.000" },
  { title: "Gran Corrientes Este", areas: ["Goya","Esquina","Sauce","Curuzú Cuatiá","Mercedes","Felipe Yofre","Perugorría","Lavalle","Santa Lucía","San Roque","Berón de Astrada"], deliveryTime: "3-5 horas", coverage: "85%", price: "Desde $35.000" }
];
const serviceFeatures = [
  { icon: <Clock className="h-6 w-6 text-accent-orange" />, title: "Horarios Flexibles", description: "Lunes a domingo, horarios adaptados a tus necesidades" },
  { icon: <Navigation className="h-6 w-6 text-accent-orange" />, title: "Confirmación de Entrega", description: "Te confirmamos la entrega y estado de tu pedido" },
  { icon: <Star className="h-6 w-6 text-accent-orange" />, title: "Servicio Premium", description: "Atención personalizada y profesional en todas las zonas" }
];

export default function ZonasPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20">
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">Zonas de<span className="block text-accent-orange">Cobertura</span></h1>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8">Llegamos a toda Corrientes y principales ciudades del interior. Consulta disponibilidad en tu zona y obtén una cotización inmediata.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/solicitar-flete"><Button variant="hero" size="lg" className="w-full sm:w-auto">Verificar mi Zona <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto"><Phone className="mr-2 h-5 w-5" />Consultar Disponibilidad</Button>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Provincia de Corrientes</h2>
                  <p className="text-lg text-muted-foreground">Cobertura completa en Corrientes con los mejores tiempos de entrega</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {mainZones.map((zone, index) => (
                    <Card key={index} className="group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl text-primary mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-accent-yellow" />{zone.title}</CardTitle>
                            <div className="flex gap-4 text-sm text-muted-foreground"><span>⏱️ {zone.deliveryTime}</span><span>📍 {zone.coverage} cobertura</span></div>
                          </div>
                          <div className="text-right"><p className="text-lg font-semibold text-primary">{zone.price}</p></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-primary mb-2">Áreas incluidas:</h4>
                            <div className="grid grid-cols-2 gap-1">
                              {zone.areas.map((area, aIndex) => (
                                <div key={aIndex} className="flex items-center gap-1 text-sm text-muted-foreground"><CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />{area}</div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-4 border-t"><Link href="/solicitar-flete"><Button variant="outline" size="sm" className="w-full">Solicitar en esta zona</Button></Link></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            <section className="py-16 lg:py-24 bg-muted/30">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  {serviceFeatures.map((feat, index) => (
                    <div key={index} className="space-y-4">
                      <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">{feat.icon}</div>
                      <h3 className="text-lg font-semibold text-primary">{feat.title}</h3>
                      <p className="text-sm text-muted-foreground">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}