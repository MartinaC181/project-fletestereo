export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#1e40af', 
        color: 'white', 
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>🚚 Fletestereo</h1>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="#servicios" style={{ color: 'white', textDecoration: 'none' }}>Servicios</a>
            <a href="#nosotros" style={{ color: 'white', textDecoration: 'none' }}>Nosotros</a>
            <a href="#contacto" style={{ color: 'white', textDecoration: 'none' }}>Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        padding: '5rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.1'
          }}>
            Sistema de Gestión de Fletes
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#4b5563', 
            margin: '0 0 2rem 0',
            lineHeight: '1.6'
          }}>
            Gestión integral de servicios de flete y mudanzas en Corrientes Capital. 
            Solución profesional con 10 años de trayectoria.
          </p>
          <button style={{ 
            backgroundColor: '#1e40af',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            Solicitar Cotización
          </button>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            color: '#1f2937',
            margin: '0 0 3rem 0'
          }}>
            Nuestros Servicios
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Fletes Locales</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Servicio de flete dentro de Corrientes Capital y alrededores</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Mudanzas</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Mudanzas completas con personal especializado</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Seguimiento Online</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Cotizaciones y seguimiento en tiempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section id="nosotros" style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: '0 0 2rem 0'
          }}>
            Sobre Fletestereo
          </h3>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#4b5563', 
            lineHeight: '1.7',
            margin: '0 0 2rem 0'
          }}>
            Emprendimiento con <strong>10 años de trayectoria</strong> en Corrientes y localidades cercanas, 
            especializado en servicios de flete y mudanzas. Dirigido por Daniel Acevedo, 
            nos caracterizamos por brindar un servicio responsable, económico y de calidad.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>10+</div>
              <div style={{ color: '#6b7280' }}>Años de experiencia</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>100%</div>
              <div style={{ color: '#6b7280' }}>Responsabilidad</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>24/7</div>
              <div style={{ color: '#6b7280' }}>Disponibilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" style={{ backgroundColor: '#1f2937', color: 'white', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem'
          }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>🚚 Fletestereo</h4>
              <p style={{ color: '#d1d5db', margin: 0 }}>
                Sistema de gestión de fletes y mudanzas en Corrientes Capital.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Contacto</h4>
              <div style={{ color: '#d1d5db' }}>
                <div style={{ marginBottom: '0.5rem' }}>📍 Corrientes Capital</div>
                <div style={{ marginBottom: '0.5rem' }}>📞 Consultas disponibles</div>
                <div>✉️ Cotizaciones online</div>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Servicios</h4>
              <div style={{ color: '#d1d5db' }}>
                <div style={{ marginBottom: '0.5rem' }}>• Fletes locales</div>
                <div style={{ marginBottom: '0.5rem' }}>• Mudanzas completas</div>
                <div>• Seguimiento en tiempo real</div>
              </div>
            </div>
          </div>
          <div style={{ 
            borderTop: '1px solid #374151', 
            marginTop: '2rem', 
            paddingTop: '2rem', 
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p style={{ margin: 0 }}>© 2024 Fletestereo - Sistema de Gestión de Fletes. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}