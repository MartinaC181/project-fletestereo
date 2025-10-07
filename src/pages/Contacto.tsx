import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  ArrowRight,
  Users,
  Star,
  Shield
} from "lucide-react";

const Contacto = () => {
  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8 text-accent-orange" />,
      title: "Teléfono",
      content: "+54 11 1234-5678",
      description: "Llamanos de lunes a domingo",
      hours: "7:00 - 22:00 hs",
      action: "Llamar Ahora"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-accent-orange" />,
      title: "WhatsApp",
      content: "+54 9 11 1234-5678",
      description: "Escribinos por WhatsApp",
      hours: "24/7 disponible",
      action: "Enviar Mensaje"
    },
    {
      icon: <Mail className="h-8 w-8 text-accent-orange" />,
      title: "Email",
      content: "info@fletestereo.com",
      description: "Consultás y cotizaciones",
      hours: "Respuesta en 2 hs",
      action: "Enviar Email"
    }
  ];

  const officeInfo = {
    address: "Av. Corrientes 1234, CABA",
    neighborhood: "Barracas, Buenos Aires",
    zipCode: "C1043AAZ",
    hours: [
      "Lunes a Viernes: 8:00 - 18:00",
      "Sábados: 9:00 - 14:00",
      "Domingos: Solo emergencias"
    ]
  };

  const reasons = [
    {
      icon: <Star className="h-6 w-6 text-accent-orange" />,
      title: "4.9/5 Estrellas",
      description: "Más de 1000 clientes satisfechos nos avalan"
    },
    {
      icon: <Users className="h-6 w-6 text-accent-orange" />,
      title: "Atención Personalizada",
      description: "Cada cliente recibe un trato único y profesional"
    },
    {
      icon: <Shield className="h-6 w-6 text-accent-orange" />,
      title: "Garantía Total",
      description: "Respaldamos todos nuestros servicios al 100%"
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
                Hablemos de tu
                <span className="block text-accent-orange">Proyecto</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Estamos aquí para ayudarte. Obtené respuestas inmediatas a tus consultas 
                y cotizaciones personalizadas sin compromiso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  WhatsApp Directo
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Múltiples formas de contactarnos
              </h2>
              <p className="text-lg text-muted-foreground">
                Elegí la opción que más te convenga. Estamos disponibles cuando nos necesites.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="bg-accent-orange/10 p-4 rounded-full w-fit mx-auto mb-4">
                      {method.icon}
                    </div>
                    <CardTitle className="text-xl text-primary">{method.title}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-accent-orange">
                      {method.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-sm text-primary font-medium">{method.hours}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Office Info */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    Envíanos tu consulta
                  </h2>
                  <p className="text-muted-foreground">
                    Completá el formulario y te responderemos en menos de 2 horas
                  </p>
                </div>
                
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input id="firstName" placeholder="Tu nombre" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input id="lastName" placeholder="Tu apellido" />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="tu@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" placeholder="+54 11 1234-5678" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service">Tipo de Servicio</Label>
                        <select className="w-full px-3 py-2 border border-input rounded-md text-sm">
                          <option value="">Seleccioná un servicio</option>
                          <option value="paquete">Envío de Paquetes</option>
                          <option value="flete">Flete Comercial</option>
                          <option value="mudanza">Mudanza</option>
                          <option value="interior">Viaje al Interior</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Contanos los detalles de tu proyecto..."
                          rows={5}
                        />
                      </div>
                      
                      <Button variant="hero" size="lg" className="w-full">
                        <Send className="mr-2 h-5 w-5" />
                        Enviar Consulta
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Office Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    Nuestra Oficina
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Visitanos en nuestras oficinas o coordiná una visita a domicilio
                  </p>
                </div>
                
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-1">Dirección</h3>
                        <p className="text-muted-foreground">{officeInfo.address}</p>
                        <p className="text-muted-foreground">{officeInfo.neighborhood}</p>
                        <p className="text-muted-foreground">{officeInfo.zipCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">Horarios de Atención</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          {officeInfo.hours.map((hour, index) => (
                            <li key={index}>{hour}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      Ver en Google Maps
                    </Button>
                  </CardContent>
                </Card>

                {/* Why Choose Us */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-primary mb-4">¿Por qué elegirnos?</h3>
                    <div className="space-y-4">
                      {reasons.map((reason, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-accent-orange/10 p-2 rounded-lg">
                            {reason.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-primary">{reason.title}</h4>
                            <p className="text-sm text-muted-foreground">{reason.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-deep">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                ¿Necesitas un servicio urgente?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Para servicios de emergencia y pedidos urgentes, contactanos directamente. 
                Estamos disponibles 24/7 para situaciones especiales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" />
                  Emergencias: +54 11 1234-5678
                </Button>
                <Link to="/solicitar">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    Solicitar Servicio
                    <ArrowRight className="ml-2 h-5 w-5" />
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

export default Contacto;