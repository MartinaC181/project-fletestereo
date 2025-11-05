'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EventBusProvider } from "@/components/EventBusProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventBusProvider>
          <TooltipProvider>
            {children}
            <ScrollToTop />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </EventBusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}