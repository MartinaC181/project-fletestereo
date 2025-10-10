import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Phone, UserPlus, Shield } from "lucide-react";

const Register = () => {
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de registro en el futuro
    console.log("Register form submitted");
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
                  Crear
                  <span className="block text-accent-orange">Cuenta</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Únete a Fletestereo y gestiona tus servicios de forma fácil y rápida
                </p>
              </div>

              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-4">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">Registro</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Tu nombre"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Tu apellido"
                          required
                        />
                      </div>
                    </div>

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
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+54 11 1234-5678"
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
                          placeholder="Mínimo 8 caracteres"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Repite tu contraseña"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" className="mt-1 rounded" required />
                      <label className="text-sm text-muted-foreground">
                        Acepto los{" "}
                        <Link to="/politicas" className="text-primary hover:text-primary/80 transition-colors">
                          términos y condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link to="/politicas" className="text-primary hover:text-primary/80 transition-colors">
                          política de privacidad
                        </Link>
                      </label>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Crear Cuenta
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                      ¿Ya tienes una cuenta?{" "}
                      <Link 
                        to="/login" 
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Inicia sesión aquí
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Register;