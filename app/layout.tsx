import type { Metadata } from 'next';
import { Providers } from "@/components/Providers";
import { Inter, Fredoka } from 'next/font/google';
import "./globals.css";

export const metadata: Metadata = {
  title: 'Fletestereo - Servicio de Fletes en Corrientes',
  description: 'Servicio profesional de fletes y mudanzas en Corrientes. Cotizaciones online, seguimiento en tiempo real.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${fredoka.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}