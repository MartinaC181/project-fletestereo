import { Link } from "react-router-dom";
import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-accent-orange p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Fletestereo</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Tu servicio de confianza para fletes y mudanzas en AMBA y alrededores.
              Profesionalismo, seguridad y puntualidad garantizada.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/servicios/flete" className="hover:text-accent-orange transition-colors">Flete Comercial</Link></li>
              <li><Link to="/servicios/mudanza" className="hover:text-accent-orange transition-colors">Mudanzas</Link></li>
              <li><Link to="/servicios/paquetes" className="hover:text-accent-orange transition-colors">Envío de Paquetes</Link></li>
              <li><Link to="/servicios/interior" className="hover:text-accent-orange transition-colors">Viajes al Interior</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/nosotros" className="hover:text-accent-orange transition-colors">Acerca de Nosotros</Link></li>
              <li><Link to="/zonas" className="hover:text-accent-orange transition-colors">Zonas de Cobertura</Link></li>
              <li><Link to="/tarifas" className="hover:text-accent-orange transition-colors">Tarifas</Link></li>
              <li><Link to="/politicas" className="hover:text-accent-orange transition-colors">Políticas</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
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
              <h4 className="font-medium mb-2">Horarios de Atención</h4>
              <p className="text-xs text-primary-foreground/60">
                Lunes a Viernes: 8:00 - 20:00<br />
                Sábados: 8:00 - 16:00<br />
                Domingos: 10:00 - 16:00
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 Fletestereo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;