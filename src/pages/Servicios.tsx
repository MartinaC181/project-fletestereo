import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Truck, 
  Home, 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone
} from "lucide-react";

const Servicios = () => {
  const services = [
    {
      icon: <Truck className="h-12 w-12 text-accent-orange" />,
      title: "Flete Comercial",
      description: "Transporte seguro y eficiente de mercadería y productos comerciales para empresas y particulares.",
      features: [
        "Carga hasta 3000kg",
        "Seguimiento GPS en tiempo real",
        "Seguro de transporte incluido",
        "Carga y descarga profesional",
        "Documentación completa"
      ],
      price: "Desde $15.000",
      duration: "Mismo día o programado"
    },
    {
      icon: <Home className="h-12 w-12 text-accent-orange" />,
      title: "Mudanzas Residenciales",
      description: "Servicio integral de mudanza con embalaje profesional, traslado y armado de muebles.",
      features: [
        "Embalaje y desembalaje",
        "Desmontaje y armado de muebles",
        "Material de protección incluido",
        "Equipo especializado",
        "Limpieza post-mudanza"
      ],
      price: "Desde $25.000",
      duration: "4-8 horas"
    },
    {
      icon: <Package className="h-12 w-12 text-accent-orange" />,
      title: "Envío de Paquetes",
      description: "Entrega rápida y segura de paquetes, documentos y productos de e-commerce.",
      features: [
        "Entrega en el día",
        "Comprobante digital",
        "Rastreo en tiempo real",
        "Manejo de productos frágiles",
        "Confirmación de entrega"
      ],
      price: "Desde $3.500",
      duration: "2-6 horas"
    },
    {
      icon: <MapPin className="h-12 w-12 text-accent-orange" />,
      title: "Viajes al Interior",
      description: "Transporte de larga distancia hacia el interior del país con máxima seguridad.",
      features: [
        "Cobertura nacional",
        "Seguimiento satelital",
        "Conductor especializado",
        "Seguro extendido",
        "Coordinación de horarios"
      ],
      price: "Consultar",
      duration: "1-3 días"
    }
  ];

  const advantages = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Totalmente Asegurado",
      description: "Todos nuestros servicios incluyen seguro completo contra daños y pérdidas."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Puntualidad Garantizada",
      description: "Cumplimos con los horarios acordados. Tu tiempo es valioso para nosotros."
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Calidad Certificada",
      description: "Más de 1000 clientes satisfechos nos avalan con 4.9/5 estrellas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
                Nuestros
                <span className="block text-accent-orange">Servicios</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Ofrecemos soluciones completas de transporte y logística adaptadas a tus necesidades específicas. 
                Profesionalismo, seguridad y eficiencia en cada servicio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/solicitar">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Solicitar Cotización
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-accent-orange/10 p-3 rounded-xl group-hover:bg-accent-orange/20 transition-colors">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-primary mb-2">{service.title}</CardTitle>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-lg font-semibold text-primary">{service.price}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <Link to="/solicitar">
                        <Button variant="outline" size="sm">
                          Cotizar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-lg text-muted-foreground">
                Años de experiencia nos avalan como líderes en transporte y logística
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-deep">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Obtén tu cotización personalizada en menos de 5 minutos. Sin compromiso, totalmente gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/solicitar">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Solicitar Cotización Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contacto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  Contactar por WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Servicios;