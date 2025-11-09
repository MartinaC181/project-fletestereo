'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/src/hooks/useAuth';
import { LoginRedirect } from '@/src/components/LoginRedirect';
import PageTransition from '@/src/components/PageTransition';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // El hook useAuth se encargará de la redirección apropiada
        // No necesitamos hacer router.push aquí
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setResetEmailSent(true);
        setShowForgotPassword(false);
      } else {
        setError(result.error || 'Error al enviar email de recuperación');
      }
    } catch (error) {
      setError('Error inesperado al enviar email de recuperación');
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
                    <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                      {showForgotPassword ? 'Recuperar' : 'Iniciar'} 
                      <span className="block text-accent-orange">
                        {showForgotPassword ? 'Contraseña' : 'Sesión'}
                      </span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {showForgotPassword 
                        ? 'Ingresa tu email para recuperar tu contraseña'
                        : 'Ingresa tus credenciales para acceder'
                      }
                    </p>
                  </div>
                  <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-4">
                      <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                        <LogIn className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl text-primary">
                        {showForgotPassword ? 'Recuperar Contraseña' : 'Bienvenido'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {resetEmailSent && (
                        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Se ha enviado un email de recuperación a tu dirección de correo.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <form onSubmit={showForgotPassword ? handleForgotPassword : handleLogin} className="space-y-6">
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
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required 
                            />
                          </div>
                        </div>
                        
                        {!showForgotPassword && (
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                              />
                            </div>
                          </div>
                        )}
                        {!showForgotPassword && (
                          <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-muted-foreground">Recordarme</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword(true)}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              ¿Olvidaste tu contraseña?
                            </button>
                          </div>
                        )}
                        <div className="space-y-3">
                          <Button 
                            type="submit" 
                            variant="hero"
                            className="w-full"
                            disabled={isLoading}
                          >
                            <LogIn className="mr-2 h-5 w-5" />
                            {isLoading ? 
                              (showForgotPassword ? 'Enviando...' : 'Iniciando sesión...') : 
                              (showForgotPassword ? 'Enviar Email' : 'Iniciar Sesión')
                            }
                          </Button>

                          {showForgotPassword && (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setShowForgotPassword(false);
                                setError('');
                                setResetEmailSent(false);
                              }}
                            >
                              Volver al Login
                            </Button>
                          )}
                        </div>
                      </form>

                      {!showForgotPassword && (
                        <div className="mt-6 text-center">
                          <p className="text-muted-foreground">¿No tienes una cuenta? <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Regístrate aquí</Link></p>
                        </div>
                      )}
                      
                      <div className="mt-6 pt-6 border-t">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-4">¿Necesitas ayuda?</p>
                          <div className="flex justify-center space-x-4">
                            <Link href="/contacto">
                              <Button variant="outline">Contactar Soporte</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <LoginRedirect />
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}