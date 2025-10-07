import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-900 dark:bg-accent-yellow shadow-sm border-b border-gray-700 dark:border-accent-yellow sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-0.5">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <img 
                src="/LogoLightMode.png" 
                alt="Logo" 
                className="h-32 w-auto dark:hidden object-contain absolute"
              />
              <img 
                src="/LogoDarkMode.png" 
                alt="Logo" 
                className="h-32 w-auto hidden dark:block object-contain absolute"
              />
            </div>
            <span className="text-3xl font-bold text-accent-yellow dark:text-black font-fredoka antialiased" style={{ textRendering: 'optimizeLegibility', fontSmooth: 'always', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>Fletestereo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/servicios" 
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Servicios
            </Link>
            <Link 
              to="/zonas" 
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Zonas
            </Link>
            <Link 
              to="/tarifas" 
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Tarifas
            </Link>
            <Link 
              to="/contacto" 
              className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors"
            >
              Contacto
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                if (isDark) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              }}
              className="h-9 w-9 px-0 bg-accent-yellow dark:bg-black border-accent-yellow dark:border-black text-primary dark:text-accent-yellow hover:opacity-80 transition-all"
              aria-label="Toggle theme"
            >
              <Moon className="h-4 w-4 dark:hidden" />
              <Sun className="h-4 w-4 hidden dark:block" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-accent-yellow dark:bg-black border-accent-yellow dark:border-black text-primary dark:text-white hover:opacity-80 dark:hover:bg-black transition-all"
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-accent-yellow dark:bg-background border-accent-yellow dark:border-white/20 text-primary dark:text-white hover:opacity-80 dark:hover:bg-background transition-all"
            >
              Solicitar Flete
            </Button>
          </nav>

          {/* Theme toggle and Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                if (isDark) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              }}
              className="h-9 w-9 px-0 bg-accent-yellow dark:bg-black border-accent-yellow dark:border-black text-primary dark:text-accent-yellow hover:opacity-80 transition-all"
              aria-label="Toggle theme"
            >
              <Moon className="h-4 w-4 dark:hidden" />
              <Sun className="h-4 w-4 hidden dark:block" />
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 hover:bg-gray-800 dark:hover:bg-black/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/servicios" 
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
              <Link 
                to="/zonas" 
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Zonas
              </Link>
              <Link 
                to="/tarifas" 
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Tarifas
              </Link>
              <Link 
                to="/contacto" 
                className="text-gray-300 dark:text-black hover:text-white dark:hover:text-gray-800 transition-colors py-2"
                onClick={toggleMenu}
              >
                Contacto
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
                <Button variant="hero" size="sm">
                  Solicitar Flete
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;