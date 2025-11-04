'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OwnerDashboard } from '@/components/OwnerDashboard';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya está autenticado
    const isLoggedIn = sessionStorage.getItem('adminAuth') === 'true';
    
    if (!isLoggedIn) {
      // Si no está autenticado, redirigir al login
      router.push('/login');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Se redirigirá al login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Panel de control - FleteEstereo</p>
            </div>
            <Button onClick={handleLogout} className="border border-gray-300 hover:bg-gray-50">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido del Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <OwnerDashboard />
      </main>
    </div>
  );
}