'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Credenciales del admin
    if (email === 'admin@fletestereo.com' && password === 'fletestereo2024') {
      // Guardar sesión del admin
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminEmail', email);
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } else {
      setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
    }
    
    setIsLoading(false);
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
                    <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">Acceso <span className="block text-accent-orange">Administrador</span></h1>
                    <p className="text-lg text-muted-foreground">Ingresa tus credenciales para acceder al dashboard administrativo</p>
                  </div>
                  <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-4">
                      <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4"><LogIn className="h-8 w-8 text-primary" /></div>
                      <CardTitle className="text-2xl text-primary">Bienvenido</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              placeholder="admin@fletestereo.com" 
                              className="pl-10" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
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
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required 
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-muted-foreground">Recordarme</span>
                          </label>
                          <Link href="#" className="text-primary hover:text-primary/80 transition-colors">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md"
                          disabled={isLoading}
                        >
                          <LogIn className="mr-2 h-5 w-5" />
                          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                      </form>
                      <div className="mt-6 pt-6 border-t">
                        <div className="bg-primary/5 rounded-lg p-4 mb-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Acceso Administrador:</strong>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Email: admin@fletestereo.com
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contraseña: fletestereo2024
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <p className="text-muted-foreground">¿No tienes una cuenta? <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Regístrate aquí</Link></p>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-4">¿Necesitas ayuda?</p>
                          <div className="flex justify-center space-x-4">
                            <Link href="/contacto">
                              <Button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md">Contactar Soporte</Button>
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
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}