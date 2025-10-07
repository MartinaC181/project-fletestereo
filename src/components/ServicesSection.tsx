import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Home, Package, MapPin, Clock, Shield } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Home className="h-8 w-8 text-accent-yellow" />,
      title: "Mudanza Completa",
      description: "Servicio completo hasta llenar la camioneta, espejos y pantallas aparte",
      features: ["Incluye todo", "Protección de frágiles", "$80.000 CTES CAP"]
    },
    {
      icon: <Truck className="h-8 w-8 text-accent-yellow" />,
      title: "Mini Mudanza",
      description: "Mudanza de elementos esenciales: heladera, lavarropa, cocina, comedor y cama",
      features: ["Mayor a 10 cuadras: $40.000", "Menor a 10 cuadras: $30.000", "Precio varía por escaleras"]
    },
    {
      icon: <Package className="h-8 w-8 text-accent-yellow" />,
      title: "Flete Liviano",
      description: "Transporte de 1 a 4 objetos con diferentes distancias",
      features: ["Recorrido largo: $25.000", "Recorrido corto: $20.000", "Puede incluir ayudante"]
    }
  ];

  const benefits = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Cobertura Total",
      description: "AMBA y alrededores, viajes al interior"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Disponibilidad",
      description: "Lunes a domingo, horarios flexibles"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Garantía",
      description: "Seguro completo en todos los envíos"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-muted-foreground">
            Ofrecemos soluciones integrales de transporte y logística 
            adaptadas a tus necesidades específicas.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-accent-yellow-light/20 p-4 rounded-full w-fit mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-accent-yellow rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">
            ¿Por qué elegir Fletestereo?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  {benefit.icon}
                </div>
                <h4 className="font-semibold text-primary mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;