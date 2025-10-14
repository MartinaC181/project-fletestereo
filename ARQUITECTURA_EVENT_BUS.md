# Arquitectura de Bus de Eventos - Fletestereo

## Descripción General

El proyecto Fletestereo ha sido reestructurado para implementar una **arquitectura de Bus de Eventos** que permite el desacoplamiento completo entre módulos y facilita el manejo eficiente de eventos asíncronos en tiempo real.

## ¿Por qué Bus de Eventos?

### Ventajas para Fletestereo

1. **Desacoplamiento de Componentes**: Los módulos no necesitan conocer detalles unos de otros
2. **Notificaciones en Tiempo Real**: Ideal para confirmaciones, rechazos y cambios de estado
3. **Escalabilidad**: Fácil adición de nuevos módulos sin modificar el núcleo
4. **Mantenimiento Simplificado**: Cambios aislados en cada módulo
5. **Extensibilidad**: Nuevas funcionalidades se integran suscribiéndose a eventos

## Estructura de la Arquitectura

```
project-fletestereo/
├── app/                          # Next.js App Router (Sistema de rutas)
│   ├── contacto/page.tsx        # Página de contacto
│   ├── tarifas/page.tsx         # Página de tarifas
│   ├── zonas/page.tsx           # Página de zonas
│   ├── solicitar-flete/page.tsx # Formulario de solicitud
│   ├── layout.tsx               # Layout principal con proveedores
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales unificados
├── core/
│   └── events/
│       ├── types.ts             # Interfaces base del Event Bus
│       ├── EventBus.ts          # Implementación del Event Bus
│       ├── domain-events.ts     # Eventos específicos de Fletestereo
│       └── index.ts             # Exportaciones del núcleo
├── modules/
│   ├── freight/                 # Módulo de gestión de fletes
│   ├── notifications/           # Sistema de notificaciones
│   └── payments/                # Procesamiento de pagos
├── integrations/
│   └── supabase/
│       ├── client.ts            # Cliente de Supabase configurado
│       ├── eventHandler.ts      # Persistencia automática de eventos
│       └── types.ts             # Tipos generados de la DB
├── components/
│   ├── pages/                   # Componentes de páginas (unificados)
│   │   ├── Index.tsx           # Página principal
│   │   ├── Contacto.tsx        # Página de contacto
│   │   ├── Tarifas.tsx         # Página de tarifas
│   │   ├── SolicitarFlete.tsx  # Formulario de solicitud
│   │   └── ...                 # Otras páginas
│   ├── ui/                     # Componentes UI reutilizables (shadcn/ui)
│   │   ├── button.tsx          # Componente de botón
│   │   ├── input.tsx           # Campos de entrada
│   │   ├── card.tsx            # Tarjetas
│   │   └── ...                 # Otros componentes UI
│   ├── EventBusProvider.tsx    # Inicialización del sistema de eventos
│   ├── ThemeProvider.tsx       # Proveedor de temas (light/dark)
│   ├── Hero.tsx                # Sección hero principal
│   ├── ServicesSection.tsx     # Sección de servicios
│   ├── QuoteForm.tsx           # Formulario de cotización
│   └── ...                     # Otros componentes
├── lib/
│   ├── utils.ts                # Utilidades generales
│   └── theme-context.ts        # Contexto de temas
├── hooks/                      # Hooks personalizados de React
├── types/                      # Tipos TypeScript globales
└── supabase/                   # Configuración y migraciones de Supabase
    ├── config.toml             # Configuración local
    └── migrations/             # Migraciones de base de datos
```

## Flujo de Eventos en Fletestereo

### 1. Solicitud de Flete
```
Cliente solicita flete → FreightService.createFreightRequest()
                     ↓
              freight.request.created
                     ↓
         ┌─────────────────────────────────────┐
         ↓                                     ↓
SupabaseEventHandler.save()         NotificationService.notify()
```

### 2. Confirmación/Rechazo del Dueño
```
Dueño confirma/rechaza → FreightService.confirmFreightRequest()
                      ↓
              freight.confirmed/rejected
                      ↓
         ┌─────────────────────────────────────┐
         ↓                                     ↓
SupabaseEventHandler.update()       NotificationService.notifyClient()
```

### 3. Procesamiento de Pagos
```
Cliente paga → PaymentService.initiatePayment()
            ↓
    payment.initiated
            ↓
    ┌─────────────────────────┐
    ↓                         ↓
Gateway.process()    SupabaseEventHandler.save()
    ↓
payment.completed/failed
    ↓
NotificationService.notifyPaymentResult()
```

## Eventos Definidos

### Eventos de Flete
- `freight.quote.requested` - Solicitud de cotización
- `freight.quote.calculated` - Cotización calculada
- `freight.request.created` - Nueva solicitud de flete
- `freight.confirmed` - Flete confirmado por el dueño
- `freight.rejected` - Flete rechazado
- `freight.in_progress` - Flete en progreso
- `freight.completed` - Flete completado
- `freight.cancelled` - Flete cancelado

### Eventos de Pagos
- `payment.initiated` - Pago iniciado
- `payment.completed` - Pago completado
- `payment.failed` - Pago fallido
- `payment.refunded` - Pago reembolsado

### Eventos de Notificaciones
- `notification.created` - Nueva notificación
- `notification.read` - Notificación leída
- `notification.deleted` - Notificación eliminada

## Servicios y Responsabilidades

### EventBus (Core)
- **Responsabilidad**: Enrutamiento de eventos entre módulos
- **Características**: 
  - Manejo asíncrono
  - Prevención de recursión
  - Logging en desarrollo
  - Suscripciones únicas y múltiples

### FreightService
- **Responsabilidad**: Lógica de negocio de fletes
- **Emite eventos**: `freight.*`
- **Escucha eventos**: Ninguno (solo emite)

### NotificationService
- **Responsabilidad**: Generar notificaciones automáticas
- **Emite eventos**: `notification.created`
- **Escucha eventos**: `freight.*`, `payment.*`

### PaymentService
- **Responsabilidad**: Procesamiento de pagos
- **Emite eventos**: `payment.*`
- **Escucha eventos**: Ninguno

### SupabaseEventHandler
- **Responsabilidad**: Persistencia automática en base de datos
- **Emite eventos**: Ninguno
- **Escucha eventos**: Todos los eventos relevantes

## Extensibilidad - Ejemplo de Nueva Pasarela de Pago

```typescript
// Integrar MercadoPago sin modificar código existente
class MercadoPagoGateway {
  initialize() {
    eventBus.subscribe('payment.initiated', this.handlePayment);
  }
  
  async handlePayment(event) {
    if (event.payload.paymentMethod === 'mercadopago') {
      // Procesar con MercadoPago
      // El resultado se propaga automáticamente
    }
  }
}
```

## Beneficios Implementados

### 1. **Mantenimiento Mejorado**
- Cada módulo es independiente
- Cambios aislados sin efectos colaterales
- Fácil testing unitario

### 2. **Escalabilidad**
- Agregar nuevos módulos es trivial
- No requiere modificar código existente
- Soporte para múltiples pasarelas de pago

### 3. **Tiempo Real**
- Notificaciones instantáneas
- Actualizaciones automáticas de estado
- Sincronización con Supabase real-time

### 4. **Observabilidad**
- Logging centralizado de eventos
- Trazabilidad completa del flujo
- Debug simplificado

## Uso en Componentes React

### Integración con Next.js App Router

```tsx
// app/layout.tsx - Configuración de proveedores
'use client'

import { EventBusProvider } from "@/components/EventBusProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <EventBusProvider>
              {children}
            </EventBusProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Uso en Páginas de Next.js

```tsx
// app/solicitar-flete/page.tsx
'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import SolicitarFlete from "@/components/pages/SolicitarFlete";

export default function SolicitarFletePage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <SolicitarFlete />
      </PageTransition>
    </AnimatePresence>
  );
}
```

### Uso del Event Bus en Componentes

```tsx
// components/pages/SolicitarFlete.tsx
import { freightService } from '@/modules/freight';
import { useEventBus } from '@/components/EventBusProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

function SolicitarFlete() {
  const eventBus = useEventBus();
  
  // Escuchar eventos específicos
  useEffect(() => {
    const subscription = eventBus.subscribe('freight.confirmed', (event) => {
      toast.success('¡Flete confirmado!');
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Crear solicitud (emite eventos automáticamente)
  const handleSubmit = async () => {
    await freightService.createFreightRequest(clientData, quoteData, quote);
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Input placeholder="Dirección de origen" />
        <Input placeholder="Dirección de destino" />
        <Button variant="hero" type="submit">
          Solicitar Flete Ahora
        </Button>
      </form>
    </Card>
  );
}
```

## Migración Realizada

### Antes (Acoplado)
```tsx
// Componente hace todo directamente
const submitRequest = async () => {
  const client = await supabase.from('clients').insert(clientData);
  const request = await supabase.from('requests').insert(requestData);
  // Lógica de notificación mezclada aquí
  sendNotification(client.email, 'Solicitud recibida');
};
```

### Después (Desacoplado)
```tsx
// Componente solo usa servicios
const submitRequest = async () => {
  await freightService.createFreightRequest(clientData, requestData, quote);
  // Las notificaciones y persistencia ocurren automáticamente via eventos
};
```
