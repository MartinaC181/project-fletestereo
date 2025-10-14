import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Truck } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Fletestereo</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/servicios" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Servicios
            </Link>
            <Link 
              href="/zonas" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Zonas
            </Link>
            <Link 
              href="/tarifas" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Tarifas
            </Link>
            <Link 
              href="/contacto" 
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

        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/servicios" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
              <Link 
                href="/zonas" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={toggleMenu}
              >
                Zonas
              </Link>
              <Link 
                href="/tarifas" 
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={toggleMenu}
              >
                Tarifas
              </Link>
              <Link 
                href="/contacto" 
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
