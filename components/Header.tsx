'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-black dark:bg-accent-yellow shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-1">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 relative z-10">
            <div className="relative w-20 h-20 flex items-center justify-center -my-2">
              <img
                src="/LogoLightMode.png"
                alt="Logo"
                className="h-20 w-auto dark:hidden object-contain absolute"
              />
              <img
                src="/LogoDarkMode.png"
                alt="Logo"
                className="h-20 w-auto hidden dark:block object-contain absolute"
              />
            </div>
            <span
              className="text-3xl font-bold text-accent-yellow dark:text-black font-fredoka antialiased"
              style={{
                textRendering: "optimizeLegibility",
                fontSmooth: "always",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
              }}
            >
              Fletestereo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/servicios"
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Servicios
            </Link>
            <Link
              href="/tarifas"
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Tarifas
            </Link>
            {/* Solo mostrar historial para administradores */}
            {isAdmin && (
              <Link
                href="/historial"
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
              >
                Historial
              </Link>
            )}
            <Link
              href="/contacto"
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Contacto
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const isDark =
                  document.documentElement.classList.contains("dark");
                if (isDark) {
                  document.documentElement.classList.remove("dark");
                } else {
                  document.documentElement.classList.add("dark");
                }
              }}
              className="h-9 w-9 px-0 bg-accent-yellow dark:bg-black border-transparent dark:border-transparent text-primary dark:text-accent-yellow hover:opacity-80 transition-all"
              aria-label="Toggle theme"
            >
              <Moon className="h-4 w-4 dark:hidden" />
              <Sun className="h-4 w-4 hidden dark:block" />
            </Button>
            
            {/* Mostrar diferentes botones según el estado del usuario */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 dark:bg-blue-600 border-transparent text-white hover:bg-blue-700 transition-all"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="bg-red-600 dark:bg-red-600 border-transparent text-white hover:bg-red-700 transition-all"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-accent-yellow dark:bg-black border-transparent dark:border-transparent text-primary dark:text-white hover:opacity-80 dark:hover:bg-black transition-all"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/solicitar-flete">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-accent-yellow dark:bg-background border-transparent dark:border-transparent text-primary dark:text-white hover:opacity-80 dark:hover:bg-background transition-all"
                  >
                    Solicitar Flete
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Theme toggle and Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const isDark =
                  document.documentElement.classList.contains("dark");
                if (isDark) {
                  document.documentElement.classList.remove("dark");
                } else {
                  document.documentElement.classList.add("dark");
                }
              }}
              className="h-9 w-9 px-0 bg-accent-yellow dark:bg-black border-transparent dark:border-transparent text-primary dark:text-accent-yellow hover:opacity-80 transition-all"
              aria-label="Toggle theme"
            >
              <Moon className="h-4 w-4 dark:hidden" />
              <Sun className="h-4 w-4 hidden dark:block" />
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 hover:bg-black dark:hover:bg-black/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/servicios"
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
              <Link
                href="/tarifas"
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Tarifas
              </Link>
              {/* Solo mostrar historial para administradores */}
              {isAdmin && (
                <Link
                  href="/historial"
                  className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Historial
                </Link>
              )}
              <Link
                href="/contacto"
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Contacto
              </Link>
              
              {/* Botones según el estado del usuario */}
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/dashboard" onClick={toggleMenu}>
                        <Button variant="outline" size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                          <Settings className="h-4 w-4 mr-2" />
                          Panel Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-red-600 text-white hover:bg-red-700"
                      onClick={() => {
                        signOut();
                        toggleMenu();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={toggleMenu}>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/solicitar-flete" onClick={toggleMenu}>
                      <Button variant="hero" size="sm" className="w-full">
                        Solicitar Flete
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
