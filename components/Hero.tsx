import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import FadeInSection from "./FadeInSection";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="text-4xl lg:text-6xl font-bold text-primary leading-tight"
              >
                Fletes y Mudanzas
                <motion.span 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="block text-accent-orange"
                >
                  Profesionales
                </motion.span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="text-lg lg:text-xl text-muted-foreground max-w-lg"
              >
                Servicio de flete confiable y rápido. Cotización inmediata 
                y profesionales experimentados en Corrientes.
              </motion.p>
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/solicitar-flete">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Solicitar Flete Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tarifas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-accent-yellow">
                  Ver Tarifas
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.img
                src="/videocamioneta.gif"
                alt="Camión de mudanza profesional en movimiento"
                className="w-full h-auto rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  imageRendering: 'auto',
                  animation: 'none' // El GIF ya tiene su propia animación
                }}
              />
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 bg-accent-orange/20 rounded-full w-24 h-24 blur-xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-8 -left-8 bg-primary/20 rounded-full w-32 h-32 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
