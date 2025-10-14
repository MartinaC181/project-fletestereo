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
      icon: <Home className="h-12 w-12 text-accent-orange" />,
      title: "Mudanza Completa",
      description: "Servicio completo de mudanza hasta que la camioneta se llene. Los espejos y pantallas viajan aparte.",
      features: [
        "Incluye todo hasta llenar la camioneta",
        "Espejos y pantallas protegidos aparte",
        "Precio puede variar por escaleras",
        "Servicio completo de carga y descarga",
        "Transporte profesional"
      ],
      price: "$80.000",
      duration: "Día completo"
    },
    {
      icon: <Truck className="h-12 w-12 text-accent-orange" />,
      title: "Mini Mudanza (Mayor a 10 cuadras)",
      description: "Mudanza de elementos esenciales con recorrido mayor a 10 cuadras en Corrientes.",
      features: [
        "Incluye heladera, lavarropa, cocina",
        "Juego de comedor y 1 cama",
        "Recorrido mayor a 10 cuadras",
        "Precio varía por escaleras",
        "Carga y descarga incluida"
      ],
      price: "$40.000",
      duration: "Medio día"
    },
    {
      icon: <Package className="h-12 w-12 text-accent-orange" />,
      title: "Mini Mudanza (Menor a 10 cuadras)",
      description: "Mudanza de elementos esenciales con recorrido menor a 10 cuadras. No incluye bolsas ni cajas.",
      features: [
        "Heladera, lavarropa, cocina",
        "Juego de comedor y 1 cama",
        "Distancia hasta 10 cuadras",
        "No incluye bolsas ni cajas",
        "Ideal para mudanzas locales"
      ],
      price: "$30.000",
      duration: "Pocas horas"
    },
    {
      icon: <MapPin className="h-12 w-12 text-accent-orange" />,
      title: "Flete Liviano Recorrido Largo",
      description: "Transporte de 1 a 4 objetos con recorrido mayor a 10 cuadras en Corrientes.",
      features: [
        "De 1 a 4 objetos",
        "Recorrido mayor a 10 cuadras",
        "Puede incluir ayudante",
        "Ideal para pocos objetos",
        "Servicio rápido y eficiente"
      ],
      price: "$25.000",
      duration: "2-4 horas"
    },
    {
      icon: <Truck className="h-12 w-12 text-accent-orange" />,
      title: "Flete Liviano Recorrido Corto",
      description: "Transporte de 1 a 4 objetos que puede levantar una persona promedio, hasta 10 cuadras.",
      features: [
        "De 1 a 4 objetos livianos",
        "Distancia hasta 10 cuadras",
        "Objetos que levanta 1 persona",
        "Servicio económico",
        "Ideal para objetos pequeños"
      ],
      price: "$20.000",
      duration: "1-2 horas"
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
      <main className="pt-20">
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
      </main>
      <Footer />
    </div>
  );
};

export default Servicios;