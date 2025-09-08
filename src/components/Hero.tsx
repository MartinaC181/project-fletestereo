import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-truck.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary leading-tight">
                Fletes y Mudanzas
                <span className="block text-accent-orange">Profesionales</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-lg">
                Servicio de flete confiable y rápido. Cotización inmediata, 
                seguimiento en tiempo real y profesionales experimentados.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-accent-orange/10 p-2 rounded-full">
                  <Star className="h-5 w-5 text-accent-orange" />
                </div>
                <span className="text-sm font-medium">4.9/5 estrellas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Totalmente asegurado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium">Respuesta inmediata</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/solicitar">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Solicitar Flete Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver Tarifas
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Empresas que confían en nosotros:
              </p>
              <div className="flex items-center gap-8 opacity-60">
                <div className="bg-muted rounded px-4 py-2 text-sm font-medium">EMPRESA A</div>
                <div className="bg-muted rounded px-4 py-2 text-sm font-medium">EMPRESA B</div>
                <div className="bg-muted rounded px-4 py-2 text-sm font-medium">EMPRESA C</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Camión de mudanza profesional"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 bg-accent-orange/20 rounded-full w-24 h-24 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 bg-primary/20 rounded-full w-32 h-32 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-orange/5 to-transparent"></div>
    </section>
  );
};

export default Hero;