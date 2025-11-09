'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/src/components/PageTransition";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useAuth } from '@/src/hooks/useAuth';
import Link from "next/link";
import { Mail, Lock, User, Phone, UserPlus, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error inesperado al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20">
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">Crear<span className="block text-accent-orange">Cuenta</span></h1>
                    <p className="text-lg text-muted-foreground">Únete a Fletestereo y gestiona tus servicios de forma fácil y rápida</p>
                  </div>
                  <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-4">
                      <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4"><UserPlus className="h-8 w-8 text-primary" /></div>
                      <CardTitle className="text-2xl text-primary">Registro</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {success && (
                        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            ¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta. Serás redirigido al login...
                          </AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="nombre" 
                                name="nombre" 
                                type="text" 
                                placeholder="Tu nombre" 
                                className="pl-10" 
                                value={formData.nombre}
                                onChange={handleChange}
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input 
                              id="apellido" 
                              name="apellido" 
                              type="text" 
                              placeholder="Tu apellido" 
                              value={formData.apellido}
                              onChange={handleChange}
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
                              value={formData.email}
                              onChange={handleChange}
                              required 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="telefono" 
                              name="telefono" 
                              type="tel" 
                              placeholder="+54 11 1234-5678" 
                              className="pl-10" 
                              value={formData.telefono}
                              onChange={handleChange}
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
                              placeholder="Mínimo 6 caracteres" 
                              className="pl-10" 
                              value={formData.password}
                              onChange={handleChange}
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
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required 
                            />
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" className="mt-1 rounded" required />
                          <label className="text-sm text-muted-foreground">Acepto los <Link href="/politicas" className="text-primary hover:text-primary/80 transition-colors">términos y condiciones</Link> y la <Link href="/politicas" className="text-primary hover:text-primary/80 transition-colors">política de privacidad</Link></label>
                        </div>
                        <Button 
                          type="submit" 
                          variant="hero"
                          className="w-full"
                          disabled={isLoading}
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                      </form>
                      <div className="mt-6 text-center">
                        <p className="text-muted-foreground">¿Ya tienes una cuenta? <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Inicia sesión aquí</Link></p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}