import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Calculator,
  Truck, 
  Home, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone,
  DollarSign,
  Shield
} from "lucide-react";

const Tarifas = () => {
  const serviceTypes = [
    {
      icon: <Package className="h-8 w-8 text-accent-orange" />,
      title: "Envío de Paquetes",
      subtitle: "Ideal para e-commerce y documentos",
      basePrice: 3500,
      priceUnit: "por envío",
      zones: [
        { name: "Capital Federal", price: 3500, time: "2-4 hs" },
        { name: "GBA Norte", price: 4200, time: "3-5 hs" },
        { name: "GBA Sur", price: 4000, time: "3-5 hs" },
        { name: "GBA Oeste", price: 4500, time: "4-6 hs" }
      ],
      features: [
        "Hasta 30kg",
        "Seguimiento GPS",
        "Comprobante digital",
        "Seguro incluido"
      ],
      popular: false
    },
    {
      icon: <Truck className="h-8 w-8 text-accent-orange" />,
      title: "Flete Comercial",
      subtitle: "Para empresas y comercios",
      basePrice: 15000,
      priceUnit: "por viaje",
      zones: [
        { name: "Capital Federal", price: 15000, time: "2-4 hs" },
        { name: "GBA Norte", price: 18000, time: "3-5 hs" },
        { name: "GBA Sur", price: 17000, time: "3-5 hs" },
        { name: "GBA Oeste", price: 19000, time: "4-6 hs" }
      ],
      features: [
        "Hasta 3000kg",
        "Carga y descarga",
        "Seguro de transporte",
        "Documentación"
      ],
      popular: true
    },
    {
      icon: <Home className="h-8 w-8 text-accent-orange" />,
      title: "Mudanza Completa",
      subtitle: "Servicio integral de mudanza",
      basePrice: 25000,
      priceUnit: "por mudanza",
      zones: [
        { name: "Capital Federal", price: 25000, time: "4-8 hs" },
        { name: "GBA Norte", price: 30000, time: "5-9 hs" },
        { name: "GBA Sur", price: 28000, time: "5-9 hs" },
        { name: "GBA Oeste", price: 32000, time: "6-10 hs" }
      ],
      features: [
        "Embalaje incluido",
        "Armado de muebles",
        "Equipo especializado",
        "Limpieza post-mudanza"
      ],
      popular: false
    }
  ];

  const additionalServices = [
    {
      service: "Embalaje Premium",
      price: "Desde $5.000",
      description: "Materiales especiales para objetos frágiles"
    },
    {
      service: "Servicio Express",
      price: "+50%",
      description: "Entrega en menos de 2 horas"
    },
    {
      service: "Carga/Descarga Extra",
      price: "$2.000/hora",
      description: "Personal adicional para carga pesada"
    },
    {
      service: "Viaje Nocturno",
      price: "+30%",
      description: "Servicios entre 20:00 y 6:00 hs"
    },
    {
      service: "Fin de Semana",
      price: "+25%",
      description: "Sábados, domingos y feriados"
    },
    {
      service: "Seguro Extendido",
      price: "2% del valor",
      description: "Cobertura hasta $500.000"
    }
  ];

  const factors = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Distancia",
      description: "Calculamos la ruta más eficiente para optimizar costos"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Urgencia",
      description: "Servicios express tienen recargo por prioridad"
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Tipo de Vehículo",
      description: "Seleccionamos el vehículo ideal según tu carga"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Valor Asegurado",
      description: "El seguro se calcula según el valor declarado"
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
                Tarifas
                <span className="block text-accent-orange">Transparentes</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Precios claros y sin sorpresas. Sin costos ocultos, sin letra chica. 
                Calculá tu tarifa exacta en segundos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/solicitar">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calcular mi Tarifa
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Consulta Personalizada
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Nuestras Tarifas
              </h2>
              <p className="text-lg text-muted-foreground">
                Precios competitivos para todos los tipos de servicio
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {serviceTypes.map((service, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${service.popular ? 'border-accent-orange shadow-lg scale-105' : 'border-border'}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="default" className="bg-accent-orange text-white px-4 py-1">
                        Más Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="bg-accent-orange/10 p-4 rounded-full w-fit mx-auto mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-primary">{service.title}</CardTitle>
                    <CardDescription>{service.subtitle}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-primary">
                        ${service.basePrice.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground ml-2">{service.priceUnit}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-medium text-primary mb-3">Incluye:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Zone Pricing */}
                    <div>
                      <h4 className="font-medium text-primary mb-3">Tarifas por zona:</h4>
                      <div className="space-y-2">
                        {service.zones.map((zone, zoneIndex) => (
                          <div key={zoneIndex} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{zone.name}</span>
                            <div className="text-right">
                              <span className="font-medium text-primary">${zone.price.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground block">{zone.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Link to="/solicitar" className="block">
                      <Button 
                        variant={service.popular ? "default" : "outline"} 
                        className="w-full"
                      >
                        Solicitar Servicio
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Servicios Adicionales
              </h2>
              <p className="text-lg text-muted-foreground">
                Personalizá tu servicio con nuestros complementos
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((addon, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-primary">{addon.service}</h3>
                      <span className="font-bold text-accent-orange">{addon.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Factors */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                ¿Cómo calculamos el precio?
              </h2>
              <p className="text-lg text-muted-foreground">
                Factores que influyen en el costo final de tu servicio
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {factors.map((factor, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    {factor.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{factor.title}</h3>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-deep">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <DollarSign className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Garantía de Precio
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Si encuentras un precio mejor, lo igualamos. Nuestro compromiso es ofrecerte 
                la mejor relación calidad-precio del mercado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/solicitar">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Obtener Cotización
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    Comparar Precios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tarifas;