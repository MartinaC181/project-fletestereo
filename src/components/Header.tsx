import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/LogoGemini.jpg" 
              className="h-16 w-auto"
            />
            <span className="text-2xl font-semibold text-primary font-fredoka">Fletestereo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/servicios" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Servicios
            </Link>
            <Link 
              to="/zonas" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Zonas
            </Link>
            <Link 
              to="/tarifas" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Tarifas
            </Link>
            <Link 
              to="/contacto" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contacto
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
            <Button variant="hero" size="sm">
              Solicitar Flete
            </Button>
          </nav>

          {/* Theme toggle and Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary"
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
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
              <Link 
                to="/zonas" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={toggleMenu}
              >
                Zonas
              </Link>
              <Link 
                to="/tarifas" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={toggleMenu}
              >
                Tarifas
              </Link>
              <Link 
                to="/contacto" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
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