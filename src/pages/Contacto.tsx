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
  MessageSquare,
  Send,
  ArrowRight,
  Users,
  Star,
  Shield
} from "lucide-react";

const Contacto = () => {
  // Funciones para manejar los contactos
  const handlePhoneCall = () => {
    window.open("tel:+543795170535", "_self");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hola! Me interesa solicitar información sobre sus servicios de fletes y mudanzas.");
    window.open(`https://wa.me/543795170535?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Consulta sobre servicios - Fletestereo");
    const body = encodeURIComponent("Hola,\n\nMe interesa solicitar información sobre sus servicios.\n\nGracias.");
    window.open(`mailto:masdeu398@gmail.com?subject=${subject}&body=${body}`, "_self");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get('firstName') || '';
    const lastName = formData.get('lastName') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const service = formData.get('service') || '';
    const message = formData.get('message') || '';
    
    // Crear el cuerpo del email
    const emailBody = `
Nombre: ${firstName} ${lastName}
Email: ${email}
Teléfono: ${phone}
Servicio solicitado: ${service}

Mensaje:
${message}
    `.trim();
    
    const subject = encodeURIComponent("Nueva consulta desde la web - Fletestereo");
    const body = encodeURIComponent(emailBody);
    
    window.open(`mailto:masdeu398@gmail.com?subject=${subject}&body=${body}`, "_self");
  };

  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8 text-accent-yellow" />,
      title: "Teléfono",
      content: "+54 9 3795170535",
      description: "Llamanos de lunes a domingo",
      hours: "7:00 - 22:00 hs",
      action: "Llamar Ahora",
      handler: handlePhoneCall
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-accent-yellow" />,
      title: "WhatsApp",
      content: "+54 9 3795170535",
      description: "Escribinos por WhatsApp",
      hours: "24/7 disponible",
      action: "Enviar Mensaje",
      handler: handleWhatsApp
    },
    {
      icon: <Mail className="h-8 w-8 text-accent-yellow" />,
      title: "Email",
      content: "masdeu398@gmail.com",
      description: "Consultás y cotizaciones",
      hours: "Respuesta en 2 hs",
      action: "Enviar Email",
      handler: handleEmail
    }
  ];



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
      <main className="pt-20">
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
                <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={handleWhatsApp}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  WhatsApp Directo
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handlePhoneCall}>
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
                <Card key={index} className="text-center">
                  <CardHeader className="pb-4">
                    <div className="bg-accent-yellow/20 p-4 rounded-full w-fit mx-auto mb-4">
                      {method.icon}
                    </div>
                    <CardTitle className="text-xl text-primary">{method.title}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-accent-yellow dark:text-black">
                      {method.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-sm text-primary font-medium">{method.hours}</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={method.handler}>
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
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input id="firstName" name="firstName" placeholder="Tu nombre" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input id="lastName" name="lastName" placeholder="Tu apellido" />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" placeholder="tu@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" name="phone" placeholder="+54 11 1234-5678" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service">Tipo de Servicio</Label>
                        <select name="service" className="w-full px-3 py-2 border border-input rounded-md text-sm">
                          <option value="">Seleccioná un servicio</option>
                          <option value="Mudanza Completa ($80.000)">Mudanza Completa ($80.000)</option>
                          <option value="Mini Mudanza Mayor a 10 cuadras ($40.000)">Mini Mudanza Mayor a 10 cuadras ($40.000)</option>
                          <option value="Mini Mudanza Menor a 10 cuadras ($30.000)">Mini Mudanza Menor a 10 cuadras ($30.000)</option>
                          <option value="Flete Liviano Recorrido Largo ($25.000)">Flete Liviano Recorrido Largo ($25.000)</option>
                          <option value="Flete Liviano Recorrido Corto ($20.000)">Flete Liviano Recorrido Corto ($20.000)</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea 
                          id="message" 
                          name="message"
                          placeholder="Contanos los detalles de tu proyecto..."
                          rows={5}
                        />
                      </div>
                      
                      <Button type="submit" variant="hero" size="lg" className="w-full">
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
                    Servicio a Domicilio
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Vamos donde nos necesites. Servicio completo de fletes y mudanzas a domicilio en toda Corrientes.
                  </p>
                </div>

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
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;