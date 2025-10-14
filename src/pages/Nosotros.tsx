import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
                Acerca de
                <span className="block text-accent-orange">Fletestereo</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Somos una empresa correntina dedicada al transporte y las mudanzas. Nuestro objetivo es brindarte
                un servicio seguro, eficiente y cercano, adaptado a las necesidades de tu mudanza o envío.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/solicitar">
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Nuestra Misión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Brindar soluciones de transporte seguras y profesionales para particulares y empresas en Corrientes.</p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Nuestra Visión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ser la opción preferida en la región por la calidad, transparencia y cercanía en el servicio.</p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Valores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2"><Badge>Seguridad</Badge><span className="text-sm text-muted-foreground">Cuidamos tus pertenencias como propias.</span></div>
                  <div className="flex items-center gap-2"><Badge>Transparencia</Badge><span className="text-sm text-muted-foreground">Precios claros y comunicación directa.</span></div>
                  <div className="flex items-center gap-2"><Badge>Puntualidad</Badge><span className="text-sm text-muted-foreground">Respetamos los tiempos acordados.</span></div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">Equipo</h3>
                <p className="text-muted-foreground">Contamos con un equipo capacitado y unidades equipadas para realizar mudanzas y fletes con los más altos estándares de seguridad.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">Compromiso</h3>
                <p className="text-muted-foreground">Nuestro compromiso es ofrecer un servicio cercano, con atención personalizada y soluciones prácticas para cada traslado.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Nosotros;
