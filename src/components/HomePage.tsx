'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import PageTransition from './PageTransition';
import Header from './Header';
import Hero from './Hero';
import ServicesSection from './ServicesSection';
import QuoteForm from './QuoteForm';
import Footer from './Footer';

export default function HomePage() {
  const [showAccessAlert, setShowAccessAlert] = useState(false);

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