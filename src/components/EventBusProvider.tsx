import { useEffect } from 'react';
import { notificationService } from '@/modules/notifications';
import { supabaseEventHandler } from '@/integrations/supabase/eventHandler';
import { eventBus } from '@/core/events';

/**
 * Componente que inicializa el sistema de Event Bus y todos sus servicios
 * Debe ser usado en el componente raíz de la aplicación
 */
export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log('[EventBusProvider] Inicializando sistema de Event Bus...');

    // Inicializar servicios que escuchan eventos
    notificationService.initialize();
    supabaseEventHandler.initialize();
    supabaseEventHandler.setupRealtimeSubscriptions();

    // Suscribirse a eventos para logging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      // Log de todos los eventos de notificaciones
      eventBus.subscribe('notification.created', (event) => {
        console.log('🔔 Nueva notificación:', event.payload);
      });

      // Log de eventos de flete
      eventBus.subscribe('freight.request.created', (event) => {
        console.log('📦 Nueva solicitud de flete:', event.payload.freightRequest.id);
      });

      eventBus.subscribe('freight.confirmed', (event) => {
        console.log('✅ Flete confirmado:', event.payload.freightRequestId);
      });

      eventBus.subscribe('freight.rejected', (event) => {
        console.log('❌ Flete rechazado:', event.payload.freightRequestId);
      });

      // Log de eventos de pago
      eventBus.subscribe('payment.completed', (event) => {
        console.log('💰 Pago completado:', event.payload.paymentId);
      });

      eventBus.subscribe('payment.failed', (event) => {
        console.log('💸 Pago fallido:', event.payload.paymentId, event.payload.error);
      });
    }

    // Cleanup al desmontar
    return () => {
      console.log('[EventBusProvider] Limpiando sistema de Event Bus...');
      notificationService.destroy();
      supabaseEventHandler.destroy();
    };
  }, []);

  return <>{children}</>;
};

/**
 * Hook para acceder al Event Bus desde componentes
 */
export const useEventBus = () => {
  return eventBus;
};
