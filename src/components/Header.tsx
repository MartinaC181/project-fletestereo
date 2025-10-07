import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-900 dark:bg-white shadow-sm border-b border-gray-700 dark:border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-6 py-1">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <img 
                src="/LogoLightMode.png" 
                alt="Logo" 
                className="h-28 w-auto dark:hidden object-contain absolute"
              />
              <img 
                src="/LogoDarkMode.png" 
                alt="Logo" 
                className="h-28 w-auto hidden dark:block object-contain absolute"
              />
            </div>
            <span className="text-3xl font-semibold text-accent-yellow font-fredoka">Fletestereo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/servicios" 
              className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
            >
              Servicios
            </Link>
            <Link 
              to="/zonas" 
              className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
            >
              Zonas
            </Link>
            <Link 
              to="/tarifas" 
              className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
            >
              Tarifas
            </Link>
            <Link 
              to="/contacto" 
              className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
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
              className="h-9 w-9 px-0 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              <Moon className="h-4 w-4 dark:hidden" />
              <Sun className="h-4 w-4 hidden dark:block" />
            </Button>
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
            <Button variant="hero" size="sm">
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
              className="h-9 w-9 px-0 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              <Moon className="h-4 w-4 dark:hidden" />
              <Sun className="h-4 w-4 hidden dark:block" />
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
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
                className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors py-2"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
              <Link 
                to="/zonas" 
                className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors py-2"
                onClick={toggleMenu}
              >
                Zonas
              </Link>
              <Link 
                to="/tarifas" 
                className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors py-2"
                onClick={toggleMenu}
              >
                Tarifas
              </Link>
              <Link 
                to="/contacto" 
                className="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors py-2"
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