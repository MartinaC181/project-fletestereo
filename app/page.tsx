export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header básico */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🚚 Fletestereo</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#servicios" className="hover:text-blue-200">Servicios</a>
              <a href="#nosotros" className="hover:text-blue-200">Nosotros</a>
              <a href="#contacto" className="hover:text-blue-200">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Sistema de Gestión de Fletes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gestión integral de servicios de flete y mudanzas en Corrientes Capital. 
            Solución profesional con 10 años de trayectoria.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
            Solicitar Cotización
          </button>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestros Servicios
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📦</div>
              <h4 className="text-xl font-semibold mb-3">Fletes Locales</h4>
              <p className="text-gray-600">Servicio de flete dentro de Corrientes Capital y alrededores</p>
            </div>
            <div className="text-center p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🏠</div>
              <h4 className="text-xl font-semibold mb-3">Mudanzas</h4>
              <p className="text-gray-600">Mudanzas completas con personal especializado</p>
            </div>
            <div className="text-center p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-xl font-semibold mb-3">Seguimiento Online</h4>
              <p className="text-gray-600">Cotizaciones y seguimiento en tiempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* Empresa */}
      <section id="nosotros" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">Sobre Fletestereo</h3>
            <p className="text-lg text-gray-600 mb-6">
              Emprendimiento con <strong>10 años de trayectoria</strong> en Corrientes y localidades cercanas, 
              especializado en servicios de flete y mudanzas. Dirigido por Daniel Acevedo, 
              nos caracterizamos por brindar un servicio responsable, económico y de calidad.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10+</div>
                <div className="text-gray-600">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600">Responsabilidad</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Disponibilidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">🚚 Fletestereo</h4>
              <p className="text-gray-300">
                Sistema de gestión de fletes y mudanzas en Corrientes Capital.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="text-gray-300 space-y-2">
                <div>📍 Corrientes Capital</div>
                <div>📞 Consultas disponibles</div>
                <div>✉️ Cotizaciones online</div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <div className="text-gray-300 space-y-2">
                <div>• Fletes locales</div>
                <div>• Mudanzas completas</div>
                <div>• Seguimiento en tiempo real</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fletestereo - Sistema de Gestión de Fletes. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}