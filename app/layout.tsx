'use client'

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EventBusProvider } from "@/components/EventBusProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <EventBusProvider>
              <TooltipProvider>
                {children}
                <ScrollToTop />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </EventBusProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}