'use client'

import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/src/components/PageTransition';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Shield, FileText, Clock, AlertTriangle } from 'lucide-react';

export default function PoliticasPage() {
  const policies = [
    { icon: <Shield className="h-8 w-8 text-primary" />, title: 'Política de Seguridad', content: [ 'Todos nuestros servicios incluyen seguro básico contra daños.', 'El personal cuenta con capacitación en manipulación segura de objetos.', 'Los vehículos son inspeccionados regularmente para garantizar su funcionamiento.', 'Se utilizan materiales de protección adecuados para objetos frágiles.' ] },
    { icon: <FileText className="h-8 w-8 text-primary" />, title: 'Términos del Servicio', content: [ 'Los precios cotizados tienen validez de 7 días.', 'Se requiere confirmación 24 horas antes del servicio.', 'El cliente debe estar presente al inicio y fin del traslado.', 'Los objetos de valor deben ser declarados previamente.' ] },
    { icon: <Clock className="h-8 w-8 text-primary" />, title: 'Política de Cancelación', content: [ 'Cancelaciones con más de 24 horas de anticipación: sin costo.', 'Cancelaciones con menos de 24 horas: 50% del valor del servicio.', 'Cancelaciones el mismo día: 100% del valor del servicio.', 'Reprogramaciones sin costo adicional con 24 horas de anticipación.' ] },
    { icon: <AlertTriangle className="h-8 w-8 text-primary" />, title: 'Limitaciones de Responsabilidad', content: [ 'No nos responsabilizamos por objetos no declarados o de valor excesivo.', 'Los líquidos y materiales peligrosos requieren autorización previa.', 'El seguro básico cubre hasta $500.000 por siniestro.', 'Los daños por caso fortuito o fuerza mayor están excluidos.' ] }
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
                  <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">Políticas y <span className="block text-accent-orange">Términos</span></h1>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8">Conoce nuestras políticas de servicio, términos y condiciones. Transparencia y claridad en cada aspecto de nuestro trabajo.</p>
                </div>
              </div>
            </section>
            <section className="py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {policies.map((p,i)=>(
                    <Card key={i} className="shadow-md">
                      <CardHeader><div className="flex items-center gap-3"><div className="bg-primary/10 p-2 rounded-lg">{p.icon}</div><CardTitle className="text-xl">{p.title}</CardTitle></div></CardHeader>
                      <CardContent><ul className="space-y-3">{p.content.map((item,j)=>(<li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 bg-accent-orange rounded-full mt-2 flex-shrink-0"></div>{item}</li>))}</ul></CardContent>
                    </Card>
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