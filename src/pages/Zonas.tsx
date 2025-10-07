import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Star,
  Navigation
} from "lucide-react";

const Zonas = () => {
  const mainZones = [
    {
      title: "Capital Federal",
      areas: [
        "Palermo", "Belgrano", "Recoleta", "San Telmo", 
        "La Boca", "Puerto Madero", "Barracas", "Villa Crespo",
        "Caballito", "Flores", "Villa Urquiza", "Núñez"
      ],
      deliveryTime: "1-3 horas",
      coverage: "100%",
      price: "Desde $3.500"
    },
    {
      title: "Gran Buenos Aires Norte",
      areas: [
        "Vicente López", "Olivos", "Martínez", "San Isidro",
        "Tigre", "San Fernando", "Escobar", "Pilar",
        "Pacheco", "Boulogne", "Acassuso", "Villa Adelina"
      ],
      deliveryTime: "2-4 horas",
      coverage: "95%",
      price: "Desde $4.500"
    },
    {
      title: "Gran Buenos Aires Sur",
      areas: [
        "Avellaneda", "Lanús", "Quilmes", "Berazategui",
        "Florencio Varela", "Almirante Brown", "Lomas de Zamora",
        "Banfield", "Temperley", "Adrogué", "Burzaco"
      ],
      deliveryTime: "2-4 horas",
      coverage: "90%",
      price: "Desde $4.200"
    },
    {
      title: "Gran Buenos Aires Oeste",
      areas: [
        "Morón", "Castelar", "Ituzaingó", "Hurlingham",
        "San Justo", "Ramos Mejía", "Haedo", "Villa Luro",
        "Ciudadela", "Santos Lugares", "Caseros", "Tres de Febrero"
      ],
      deliveryTime: "2-5 horas",
      coverage: "85%",
      price: "Desde $4.800"
    }
  ];

  const interiorProvinces = [
    {
      province: "Buenos Aires Interior",
      cities: ["La Plata", "Mar del Plata", "Bahía Blanca", "Tandil", "Olavarría", "Pergamino"],
      deliveryTime: "1-2 días",
      price: "Consultar"
    },
    {
      province: "Córdoba",
      cities: ["Córdoba Capital", "Villa Carlos Paz", "Río Cuarto", "Villa María"],
      deliveryTime: "2-3 días",
      price: "Consultar"
    },
    {
      province: "Santa Fe",
      cities: ["Rosario", "Santa Fe Capital", "Rafaela", "Venado Tuerto"],
      deliveryTime: "1-2 días",
      price: "Consultar"
    },
    {
      province: "Entre Ríos",
      cities: ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay"],
      deliveryTime: "1-2 días",
      price: "Consultar"
    }
  ];

  const serviceFeatures = [
    {
      icon: <Clock className="h-6 w-6 text-accent-orange" />,
      title: "Horarios Flexibles",
      description: "Lunes a domingo, horarios adaptados a tus necesidades"
    },
    {
      icon: <Navigation className="h-6 w-6 text-accent-orange" />,
      title: "Seguimiento GPS",
      description: "Rastrea tu envío en tiempo real desde tu celular"
    },
    {
      icon: <Star className="h-6 w-6 text-accent-orange" />,
      title: "Servicio Premium",
      description: "Atención personalizada y profesional en todas las zonas"
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
                Zonas de
                <span className="block text-accent-orange">Cobertura</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Llegamos a todo AMBA y principales ciudades del interior. 
                Consulta disponibilidad en tu zona y obtén una cotización inmediata.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/solicitar">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Verificar mi Zona
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Consultar Disponibilidad
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AMBA Coverage */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Área Metropolitana de Buenos Aires
              </h2>
              <p className="text-lg text-muted-foreground">
                Cobertura completa en AMBA con los mejores tiempos de entrega
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {mainZones.map((zone, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-primary mb-2 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-accent-orange" />
                          {zone.title}
                        </CardTitle>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>⏱️ {zone.deliveryTime}</span>
                          <span>📍 {zone.coverage} cobertura</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary">{zone.price}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-primary mb-2">Áreas incluidas:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {zone.areas.map((area, areaIndex) => (
                            <div key={areaIndex} className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <Link to="/solicitar">
                          <Button variant="outline" size="sm" className="w-full">
                            Solicitar en esta zona
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interior Coverage */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Viajes al Interior
              </h2>
              <p className="text-lg text-muted-foreground">
                Extendemos nuestros servicios a las principales ciudades del país
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {interiorProvinces.map((province, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">{province.province}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {province.deliveryTime} • {province.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {province.cities.map((city, cityIndex) => (
                        <li key={cityIndex} className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          {city}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Consultar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Service Features */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Servicio en todas las zonas
              </h2>
              <p className="text-lg text-muted-foreground">
                Misma calidad y profesionalismo, sin importar el destino
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {serviceFeatures.map((feature, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="bg-accent-orange/10 p-4 rounded-full w-fit mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Map CTA */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-deep">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <Truck className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                ¿No encuentras tu zona?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Estamos expandiendo constantemente nuestras zonas de cobertura. 
                Consulta disponibilidad para tu ubicación específica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contacto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Consultar mi Zona
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Zonas;