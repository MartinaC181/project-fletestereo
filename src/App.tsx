import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventBusProvider } from "@/components/EventBusProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import SolicitarFlete from "./pages/SolicitarFlete";
import Servicios from "./pages/Servicios";
import Zonas from "./pages/Zonas";
import Tarifas from "./pages/Tarifas";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="fletestereo-ui-theme">
      <EventBusProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/solicitar" element={<SolicitarFlete />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/zonas" element={<Zonas />} />
            <Route path="/tarifas" element={<Tarifas />} />
            <Route path="/contacto" element={<Contacto />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </EventBusProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
