'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import QuoteForm from '@/components/QuoteForm';
import Footer from '@/components/Footer';

function HomePageContent() {
  const searchParams = useSearchParams();
  const [showAccessAlert, setShowAccessAlert] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'access_denied') {
      setShowAccessAlert(true);
    }
  }, [searchParams]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          
          {/* Alert de acceso denegado */}
          {showAccessAlert && (
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
            <Hero />
            <ServicesSection />
            <QuoteForm />
          </main>
          <Footer />
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando Fletestereo...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}