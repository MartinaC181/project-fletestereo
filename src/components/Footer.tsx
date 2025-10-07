import { Link } from "react-router-dom";
import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black dark:bg-accent-yellow text-white dark:text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-accent-yellow p-2 rounded-lg">
                <Truck className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold">Fletestereo</span>
            </div>
            <p className="text-primary-foreground/80 dark:text-black/80 text-sm">
              Tu servicio de confianza para fletes y mudanzas en AMBA y alrededores.
              Profesionalismo, seguridad y puntualidad garantizada.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 dark:text-black/60 hover:text-accent-yellow dark:hover:text-black transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 dark:text-black/60 hover:text-accent-yellow dark:hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 dark:text-black/60 hover:text-accent-yellow dark:hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 dark:text-black">Servicios</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80 dark:text-black/80">
              <li><Link to="/servicios" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Mudanza Completa</Link></li>
              <li><Link to="/servicios" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Mini Mudanza</Link></li>
              <li><Link to="/servicios" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Flete Liviano</Link></li>
              <li><Link to="/tarifas" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Ver Tarifas</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 dark:text-black">Empresa</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80 dark:text-black/80">
              <li><Link to="/nosotros" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Acerca de Nosotros</Link></li>
              <li><Link to="/zonas" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Zonas de Cobertura</Link></li>
              <li><Link to="/tarifas" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Tarifas</Link></li>
              <li><Link to="/politicas" className="hover:text-accent-yellow dark:hover:text-black transition-colors">Políticas</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 dark:text-black">Contacto</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80 dark:text-black/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@fletestereo.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2 dark:text-black">Horarios de Atención</h4>
              <p className="text-xs text-primary-foreground/60 dark:text-black/60">
                Lunes a Viernes: 8:00 - 20:00<br />
                Sábados: 8:00 - 16:00<br />
                Domingos: 10:00 - 16:00
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 dark:border-black/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60 dark:text-black/60">
            © 2024 Fletestereo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;