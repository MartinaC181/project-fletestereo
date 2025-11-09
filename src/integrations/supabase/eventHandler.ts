import { eventBus } from '@/src/core/events';
import { supabase } from '@/src/integrations/supabase/client';
import type { 
  FreightRequestCreatedEvent,
  FreightConfirmedEvent,
  FreightRejectedEvent,
  FreightStatusChangedEvent,
  PaymentEvent,
  NotificationCreatedEvent 
} from '@/src/core/events/domain-events';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { EventSubscription } from '@/src/core/events/types';

/**
 * Servicio que integra el Event Bus con Supabase para persistir
 * automáticamente los cambios de estado en la base de datos
 */
export class SupabaseEventHandler {
  private isInitialized = false;
  private realtimeChannels: RealtimeChannel[] = [];
  private eventSubscriptions: EventSubscription[] = [];

  /**
   * Inicializa el handler suscribiéndose a eventos relevantes
   */
  initialize(): void {
    if (this.isInitialized) return;

    try {
      // Almacenar las suscripciones para poder desuscribirse después
      this.eventSubscriptions.push(
        eventBus.subscribe('freight.request.created', this.handleFreightRequestCreated.bind(this)),
        eventBus.subscribe('freight.confirmed', this.handleFreightConfirmed.bind(this)),
        eventBus.subscribe('freight.rejected', this.handleFreightRejected.bind(this)),
        eventBus.subscribe('freight.in_progress', this.handleFreightStatusChanged.bind(this)),
        eventBus.subscribe('freight.completed', this.handleFreightStatusChanged.bind(this)),
        eventBus.subscribe('freight.cancelled', this.handleFreightStatusChanged.bind(this)),
        eventBus.subscribe('payment.initiated', this.handlePaymentEvent.bind(this)),
        eventBus.subscribe('payment.completed', this.handlePaymentEvent.bind(this)),
        eventBus.subscribe('payment.failed', this.handlePaymentEvent.bind(this)),
        eventBus.subscribe('payment.refunded', this.handlePaymentEvent.bind(this)),
        eventBus.subscribe('notification.created', this.handleNotificationCreated.bind(this))
      );

      this.isInitialized = true;
      console.log('[SupabaseEventHandler] Handler inicializado y suscrito a eventos');
    } catch (error) {
      console.error('[SupabaseEventHandler] Error al inicializar:', error);
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.warn(`[SupabaseEventHandler] Intento ${attempt} falló, reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Backoff exponencial
      }
    }
    throw new Error('Max retries exceeded');
  }

  private async handleFreightRequestCreated(event: FreightRequestCreatedEvent): Promise<void> {
    try {
      const { freightRequest } = event.payload;
      
      // Crear o actualizar cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert({
          id: freightRequest.clientId,
          nombre: freightRequest.client.nombre,
          apellido: freightRequest.client.apellido,
          telefono: freightRequest.client.telefono,
          email: freightRequest.client.email,
          dni: freightRequest.client.dni,
          es_temporal: false
        })
        .select()
        .single();

      if (clientError) {
        console.error('[SupabaseEventHandler] Error creando cliente:', clientError);
        return;
      }

      // Crear solicitud de flete
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .insert({
          id: freightRequest.id,
          client_id: clientData.id,
          origen: freightRequest.quote.origen,
          destino: freightRequest.quote.destino,
          fecha: freightRequest.quote.fecha,
          franja: freightRequest.quote.franja || '',
          carga_tipo: freightRequest.quote.tipoServicio || '',
          carga_volumen: freightRequest.quote.pisosEscalera?.toString() || '0',
          notas: freightRequest.quote.notas || '',
          estado: 'Solicitada' // Mapear al enum correcto
        })
        .select()
        .single();

      if (requestError) {
        console.error('[SupabaseEventHandler] Error creando solicitud:', requestError);
        return;
      }

      // Crear cotización asociada
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert({
          request_id: requestData.id,
          km: freightRequest.calculatedQuote.km || 0,
          tarifa_base: freightRequest.calculatedQuote.tarifaBase || 0,
          precio_km: 0, // Campo legacy, no se usa en la nueva implementación
          extras_json: freightRequest.calculatedQuote.extras || {},
          total: freightRequest.calculatedQuote.total
        });

      if (quoteError) {
        console.error('[SupabaseEventHandler] Error creando cotización:', quoteError);
        return;
      }

      console.log('[SupabaseEventHandler] Solicitud de flete guardada en Supabase');
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando FreightRequestCreated:', error);
    }
  }

  private async handleFreightConfirmed(event: FreightConfirmedEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('requests')
        .update({
          estado: 'Confirmada' // Usar el enum correcto
        })
        .eq('id', event.payload.freightRequestId);

      if (error) {
        console.error('[SupabaseEventHandler] Error confirmando flete:', error);
        return;
      }

      console.log('[SupabaseEventHandler] Flete confirmado en Supabase');
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando FreightConfirmed:', error);
    }
  }

  private async handleFreightRejected(event: FreightRejectedEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('requests')
        .update({
          estado: 'Rechazada' // Usar el enum correcto
        })
        .eq('id', event.payload.freightRequestId);

      if (error) {
        console.error('[SupabaseEventHandler] Error rechazando flete:', error);
        return;
      }

      console.log('[SupabaseEventHandler] Flete rechazado en Supabase');
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando FreightRejected:', error);
    }
  }

  private async handleFreightStatusChanged(event: FreightStatusChangedEvent): Promise<void> {
    try {
      // Mapear el estado a los valores del enum
      let estadoDb: string;
      switch (event.payload.newStatus) {
        case 'in_progress':
          estadoDb = 'Confirmada';
          break;
        case 'completed':
          estadoDb = 'Completada';
          break;
        case 'cancelled':
          estadoDb = 'Cancelada';
          break;
        default:
          estadoDb = 'Solicitada';
      }

      const { error } = await supabase
        .from('requests')
        .update({
          estado: estadoDb as any // Cast para evitar error de tipos
        })
        .eq('id', event.payload.freightRequestId);

      if (error) {
        console.error('[SupabaseEventHandler] Error actualizando estado de flete:', error);
        return;
      }

      console.log(`[SupabaseEventHandler] Estado de flete actualizado a ${event.payload.newStatus} en Supabase`);
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando FreightStatusChanged:', error);
    }
  }

  private async handlePaymentEvent(event: PaymentEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('payments')
        .upsert({
          payment_id: event.payload.paymentId,
          request_id: event.payload.freightRequestId, // Usar request_id según el esquema
          monto: event.payload.amount,
          moneda: event.payload.currency || 'ARS',
          provider: event.payload.paymentMethod || '',
          status: event.payload.status
        });

      if (error) {
        console.error('[SupabaseEventHandler] Error guardando pago:', error);
        return;
      }

      console.log(`[SupabaseEventHandler] Pago ${event.payload.status} guardado en Supabase`);
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando PaymentEvent:', error);
    }
  }

  private async handleNotificationCreated(event: NotificationCreatedEvent): Promise<void> {
    try {
      // La tabla notifications tiene un esquema específico para plantillas
      // Por ahora, solo logueamos el evento hasta que se defina mejor el esquema
      console.log('[SupabaseEventHandler] Notificación creada (no persistida por ahora):', {
        recipientId: event.payload.recipientId,
        title: event.payload.title,
        message: event.payload.message
      });
      
      /* Esquema actual de notifications requiere:
      const { error } = await supabase
        .from('notifications')
        .insert({
          canal: 'email', // o 'whatsapp'
          plantilla: event.payload.title,
          request_id: event.payload.relatedEntityId, // si está relacionado a una request
          payload_json: {
            title: event.payload.title,
            message: event.payload.message,
            recipient: event.payload.recipientId
          }
        });
      */
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando NotificationCreated:', error);
    }
  }

  /**
   * Configura real-time subscriptions para cambios desde la base de datos
   */
  setupRealtimeSubscriptions(): void {
    // Escuchar cambios en solicitudes desde otros clientes/aplicaciones
    const requestsChannel = supabase
      .channel('requests_channel')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'requests' }, 
          (payload) => {
            console.log('[SupabaseEventHandler] Cambio en requests desde DB:', payload);
            // Aquí se podrían emitir eventos internos basados en cambios externos
          }
      )
      .subscribe();

    // Escuchar cambios en pagos
    const paymentsChannel = supabase
      .channel('payments_channel')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'payments' }, 
          (payload) => {
            console.log('[SupabaseEventHandler] Cambio en payments desde DB:', payload);
          }
      )
      .subscribe();

    this.realtimeChannels.push(requestsChannel, paymentsChannel);
    console.log('[SupabaseEventHandler] Suscripciones real-time configuradas');
  }

  /**
   * Limpia las suscripciones del handler
   */
  destroy(): void {
    // Limpiar suscripciones de eventos usando las referencias almacenadas
    this.eventSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.eventSubscriptions = [];

    // Limpiar canales real-time
    this.realtimeChannels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.realtimeChannels = [];
    
    this.isInitialized = false;
    console.log('[SupabaseEventHandler] Handler destruido correctamente');
  }
}

// Instancia global del handler de Supabase
export const supabaseEventHandler = new SupabaseEventHandler();
