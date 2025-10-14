'use client'

import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import QuoteForm from '@/components/QuoteForm';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
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