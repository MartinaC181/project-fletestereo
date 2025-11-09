'use client';

import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { EventBusProvider } from "@/src/components/EventBusProvider";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { AuthProvider } from "@/src/hooks/useAuth";
import ScrollToTop from "@/src/components/ScrollToTop";

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