'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports para evitar errores de SSR
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })), {
  ssr: false
});

const Alert = dynamic(() => import('@/components/ui/alert').then(mod => ({ default: mod.Alert })), {
  ssr: false
});

const AlertDescription = dynamic(() => import('@/components/ui/alert').then(mod => ({ default: mod.AlertDescription })), {
  ssr: false
});

const AlertCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertCircle })), {
  ssr: false
});

const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), {
  ssr: false
});

const Button = dynamic(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), {
  ssr: false
});

const PageTransition = dynamic(() => import('@/components/PageTransition'), {
  ssr: false,
  loading: () => <div>Cargando...</div>
});

const Header = dynamic(() => import('@/components/Header'), {
  ssr: false,
  loading: () => <div>Cargando header...</div>
});

const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div>Cargando...</div>
});

const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: false,
  loading: () => <div>Cargando servicios...</div>
});

const QuoteForm = dynamic(() => import('@/components/QuoteForm'), {
  ssr: false,
  loading: () => <div>Cargando formulario...</div>
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => <div>Cargando footer...</div>
});

export default function HomePage() {
  const [showAccessAlert, setShowAccessAlert] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verificar parámetros de URL después del renderizado
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      if (error === 'access_denied') {
        setShowAccessAlert(true);
      }
    }
  }, []);

  // Mostrar loading hasta que los componentes estén listos
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Cargando Fletestereo...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {AnimatePresence && PageTransition ? (
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition>
            <div className="min-h-screen bg-background">
              {Header && <Header />}
              
              {/* Alert de acceso denegado */}
              {showAccessAlert && Alert && AlertDescription && AlertCircle && Button && X && (
                <div className="fixed top-4 right-4 z-50 max-w-md">
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>Acceso restringido:</strong> No tienes permisos de administrador para acceder a esa sección.
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAccessAlert(false)}
                          className="h-auto p-0 text-yellow-600 hover:text-yellow-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <main className="pt-20">
                {Hero && <Hero />}
                {ServicesSection && <ServicesSection />}
                {QuoteForm && <QuoteForm />}
              </main>
              {Footer && <Footer />}
            </div>
          </PageTransition>
        </AnimatePresence>
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando componentes...</p>
          </div>
        </div>
      )}
    </>
  );
}