import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { EventBusProvider } from "@/components/EventBusProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SolicitarFlete from "./pages/SolicitarFlete";
import Servicios from "./pages/Servicios";
import Zonas from "./pages/Zonas";
import Tarifas from "./pages/Tarifas";
import Contacto from "./pages/Contacto";
import Nosotros from "./pages/Nosotros";
import Politicas from "./pages/Politicas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/solicitar" element={<PageTransition><SolicitarFlete /></PageTransition>} />
        <Route path="/servicios" element={<PageTransition><Servicios /></PageTransition>} />
          <Route path="/nosotros" element={<PageTransition><Nosotros /></PageTransition>} />
        <Route path="/zonas" element={<PageTransition><Zonas /></PageTransition>} />
        <Route path="/tarifas" element={<PageTransition><Tarifas /></PageTransition>} />
        <Route path="/contacto" element={<PageTransition><Contacto /></PageTransition>} />
        <Route path="/politicas" element={<PageTransition><Politicas /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="fletestereo-ui-theme">
      <EventBusProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
        </TooltipProvider>
      </EventBusProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
