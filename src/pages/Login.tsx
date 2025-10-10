import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, Lock, LogIn, User, FileText } from "lucide-react";

const Login = () => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de login en el futuro
    console.log("Login form submitted");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                  Iniciar
                  <span className="block text-accent-orange">Sesión</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Accede a tu cuenta para gestionar tus fletes y mudanzas
                </p>
              </div>

              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-4">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <LogIn className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">Bienvenido</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Tu contraseña"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-muted-foreground">Recordarme</span>
                      </label>
                      <Link to="#" className="text-primary hover:text-primary/80 transition-colors">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      <LogIn className="mr-2 h-5 w-5" />
                      Iniciar Sesión
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                      ¿No tienes una cuenta?{" "}
                      <Link 
                        to="/registro" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">¿Necesitas ayuda?</p>
                      <div className="flex justify-center space-x-4">
                        <Link to="/contacto">
                          <Button variant="outline" size="sm">
                            Contactar Soporte
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-8">
                Ventajas de tener una cuenta
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">Perfil Personalizado</h3>
                  <p className="text-sm text-muted-foreground">
                    Guarda tus datos y direcciones para cotizaciones más rápidas
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">Historial de Servicios</h3>
                  <p className="text-sm text-muted-foreground">
                    Accede al historial de todos tus fletes y mudanzas
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">Notificaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones sobre el estado de tus servicios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;