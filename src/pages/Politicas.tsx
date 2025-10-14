import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Clock, AlertTriangle } from "lucide-react";

const Politicas = () => {
  const policies = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Política de Seguridad",
      content: [
        "Todos nuestros servicios incluyen seguro básico contra daños.",
        "El personal cuenta con capacitación en manipulación segura de objetos.",
        "Los vehículos son inspeccionados regularmente para garantizar su funcionamiento.",
        "Se utilizan materiales de protección adecuados para objetos frágiles."
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Términos del Servicio",
      content: [
        "Los precios cotizados tienen validez de 7 días.",
        "Se requiere confirmación 24 horas antes del servicio.",
        "El cliente debe estar presente al inicio y fin del traslado.",
        "Los objetos de valor deben ser declarados previamente."
      ]
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Política de Cancelación",
      content: [
        "Cancelaciones con más de 24 horas de anticipación: sin costo.",
        "Cancelaciones con menos de 24 horas: 50% del valor del servicio.",
        "Cancelaciones el mismo día: 100% del valor del servicio.",
        "Reprogramaciones sin costo adicional con 24 horas de anticipación."
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-primary" />,
      title: "Limitaciones de Responsabilidad",
      content: [
        "No nos responsabilizamos por objetos no declarados o de valor excesivo.",
        "Los líquidos y materiales peligrosos requieren autorización previa.",
        "El seguro básico cubre hasta $500.000 por siniestro.",
        "Los daños por caso fortuito o fuerza mayor están excluidos."
      ]
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
                Políticas y
                <span className="block text-accent-orange">Términos</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Conoce nuestras políticas de servicio, términos y condiciones. 
                Transparencia y claridad en cada aspecto de nuestro trabajo.
              </p>
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {policies.map((policy, index) => (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        {policy.icon}
                      </div>
                      <CardTitle className="text-xl">{policy.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {policy.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent-orange rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                Información Adicional
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Privacidad de Datos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>Los datos personales proporcionados son utilizados exclusivamente para la prestación del servicio.</p>
                    <p>No compartimos información personal con terceros sin consentimiento.</p>
                    <p>Los datos se almacenan de forma segura y se eliminan después del período legal requerido.</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Resolución de Conflictos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>Cualquier reclamo debe presentarse dentro de las 48 horas posteriores al servicio.</p>
                    <p>Priorizamos la resolución amigable de cualquier inconveniente.</p>
                    <p>En caso de no llegar a un acuerdo, se aplicará la legislación vigente de la Provincia de Corrientes.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Última actualización:</strong> Octubre 2024
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Para consultas sobre nuestras políticas, contáctanos a través de nuestros canales oficiales.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Politicas;
