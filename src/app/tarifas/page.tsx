'use client'

import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/src/components/PageTransition';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import Link from 'next/link';
import { Calculator, Truck, Home, Package, MapPin, Clock, CheckCircle, Phone, Building, Route, Weight } from 'lucide-react';

export default function TarifasPage() {
  const serviceTypes = [
    { icon: <Home className="h-8 w-8 text-accent-orange" />, title: 'Mudanza Completa', subtitle: 'Hasta llenar la camioneta - Corrientes Capital', basePrice: 80000, features: ['Incluye todo hasta llenar camioneta','Espejos y pantallas aparte','Servicio completo'], popular: true, hasStairsVariation: true, serviceKey: 'mudanza_completa' },
    { icon: <Truck className="h-8 w-8 text-accent-orange" />, title: 'Mini Mudanza (Mayor a 1 km)', subtitle: 'Elementos esenciales - Corrientes', basePrice: 40000, features: ['Heladera, lavarropa, cocina','Juego de comedor y 1 cama','Recorrido mayor a 1 km'], popular: false, hasStairsVariation: true, serviceKey: 'mini_mudanza' },
    { icon: <Package className="h-8 w-8 text-accent-orange" />, title: 'Mini Mudanza (Menor a 1 km)', subtitle: 'Elementos esenciales - Distancia corta', basePrice: 30000, features: ['Heladera, lavarropa, cocina','Juego de comedor y 1 cama','No incluye bolsas ni cajas','Distancia hasta 1 km'], popular: false, hasStairsVariation: true, serviceKey: 'mini_mudanza' },
    { icon: <MapPin className="h-8 w-8 text-accent-orange" />, title: 'Flete Liviano Recorrido Largo', subtitle: '1 a 4 objetos - Mayor a 1 km', basePrice: 25000, features: ['De 1 a 4 objetos','Mayor a 1 km en Corrientes','Puede incluir ayudante','Ideal para pocos objetos'], popular: false, hasStairsVariation: true, serviceKey: 'flete_liviano' },
    { icon: <Truck className="h-8 w-8 text-accent-orange" />, title: 'Flete Liviano Recorrido Corto', subtitle: '1 a 4 objetos livianos - Hasta 1 km', basePrice: 20000, features: ['De 1 a 4 objetos livianos','Objetos que levanta 1 persona','Distancia hasta 1 km','Servicio económico'], popular: false, hasStairsVariation: true, serviceKey: 'flete_liviano' },
    { icon: <Route className="h-8 w-8 text-accent-orange" />, title: 'Fuera de Capital', subtitle: 'Servicios interurbanos', basePrice: null, features: ['Desde y hacia Corrientes','Tarifa según distancia','Consultar disponibilidad','Presupuesto personalizado','Requiere seña'], popular: false, hasStairsVariation: false, serviceKey: 'viaje_largo' }
  ];
  const factors = [
    { icon: <Route className="h-6 w-6 text-primary" />, title: 'Distancia', description: 'Calculamos la ruta más eficiente para optimizar costos' },
    { icon: <Building className="h-6 w-6 text-primary" />, title: 'Escaleras', description: 'El precio puede variar según cantidad de pisos y dificultad' },
    { icon: <MapPin className="h-6 w-6 text-primary" />, title: 'Flete Interurbano', description: 'Servicios hacia otras ciudades con tarifas especiales' },
    { icon: <Weight className="h-6 w-6 text-primary" />, title: 'Volumen de Carga', description: 'Evaluamos la cantidad y tipo de objetos a transportar' }
  ];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20">
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">Tarifas <span className="block text-accent-orange">Transparentes</span></h1>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8">Precios claros y sin sorpresas. Sin costos ocultos, sin letra chica. Calculá tu tarifa exacta en segundos.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/solicitar-flete"><Button variant="hero" size="lg" className="w-full sm:w-auto"><Calculator className="mr-2 h-5 w-5" />Calcular mi Tarifa</Button></Link>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto"><Phone className="mr-2 h-5 w-5" />Consulta Personalizada</Button>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Nuestras Tarifas</h2>
                  <p className="text-lg text-muted-foreground">Precios competitivos para todos los tipos de servicio</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serviceTypes.map((service,i)=>(
                    <Card key={i} className={`relative hover:shadow-xl transition-all duration-300 flex flex-col ${service.popular? 'border-accent-orange shadow-lg scale-105':'border-border'}`}>
                      {service.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><Badge className="bg-accent-orange text-white px-4 py-1">Más Popular</Badge></div>}
                      <CardHeader className="text-center pb-4">
                        <div className="bg-accent-orange/10 p-4 rounded-full w-fit mx-auto mb-4">{service.icon}</div>
                        <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                        <CardDescription>{service.subtitle}</CardDescription>
                        <div className="mt-4">
                          {service.basePrice ? (
                            <span className="text-3xl font-bold text-primary">${service.basePrice.toLocaleString()}</span>
                          ) : (
                            <span className="text-2xl font-bold text-primary">Presupuesto<br/>Personalizado</span>
                          )}
                        </div>
                        {service.hasStairsVariation && (
                          <p className="text-xs text-amber-600 mt-2">* El precio puede variar por escaleras</p>
                        )}
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow space-y-6">
                        <div className="flex-grow"><h4 className="font-medium text-primary mb-3">Incluye:</h4><ul className="space-y-2">{service.features.map((f,fi)=>(<li key={fi} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /><span className="text-muted-foreground">{f}</span></li>))}</ul></div>
                        <div className="mt-auto"><Link href={`/solicitar-flete?servicio=${service.serviceKey}`} className="block"><Button variant="hero" className="w-full">Solicitar Servicio</Button></Link></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            <section className="py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">¿Cómo calculamos el precio?</h2>
                  <p className="text-lg text-muted-foreground">Factores que influyen en el costo final de tu servicio</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {factors.map((factor,i)=>(
                    <div key={i} className="text-center space-y-4">
                      <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">{factor.icon}</div>
                      <h3 className="text-lg font-semibold text-primary">{factor.title}</h3>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
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