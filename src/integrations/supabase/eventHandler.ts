import { eventBus } from '@/core/events';
import { supabase } from '@/integrations/supabase/client';
import type { 
  FreightRequestCreatedEvent,
  FreightConfirmedEvent,
  FreightRejectedEvent,
  FreightStatusChangedEvent,
  PaymentEvent,
  NotificationCreatedEvent 
} from '@/core/events/domain-events';

/**
 * Servicio que integra el Event Bus con Supabase para persistir
 * automáticamente los cambios de estado en la base de datos
 */
export class SupabaseEventHandler {
  private isInitialized = false;

  /**
   * Inicializa el handler suscribiéndose a eventos relevantes
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Suscribirse a eventos de solicitudes de flete
    eventBus.subscribe('freight.request.created', this.handleFreightRequestCreated.bind(this));
    eventBus.subscribe('freight.confirmed', this.handleFreightConfirmed.bind(this));
    eventBus.subscribe('freight.rejected', this.handleFreightRejected.bind(this));
    
    // Suscribirse a eventos de cambio de estado
    eventBus.subscribe('freight.in_progress', this.handleFreightStatusChanged.bind(this));
    eventBus.subscribe('freight.completed', this.handleFreightStatusChanged.bind(this));
    eventBus.subscribe('freight.cancelled', this.handleFreightStatusChanged.bind(this));
    
    // Suscribirse a eventos de pago
    eventBus.subscribe('payment.initiated', this.handlePaymentEvent.bind(this));
    eventBus.subscribe('payment.completed', this.handlePaymentEvent.bind(this));
    eventBus.subscribe('payment.failed', this.handlePaymentEvent.bind(this));
    eventBus.subscribe('payment.refunded', this.handlePaymentEvent.bind(this));
    
    // Suscribirse a eventos de notificaciones
    eventBus.subscribe('notification.created', this.handleNotificationCreated.bind(this));

    this.isInitialized = true;
    console.log('[SupabaseEventHandler] Handler inicializado y suscrito a eventos');
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
      const { error: freightError } = await supabase
        .from('freight_requests')
        .insert({
          id: freightRequest.id,
          client_id: clientData.id,
          origen: freightRequest.quote.origen,
          destino: freightRequest.quote.destino,
          fecha_servicio: freightRequest.quote.fecha,
          franja_horaria: freightRequest.quote.franja,
          tipo_carga: freightRequest.quote.cargaTipo,
          volumen_carga: freightRequest.quote.cargaVolumen,
          notas: freightRequest.quote.notas,
          kilometros: freightRequest.calculatedQuote.km,
          tarifa_base: freightRequest.calculatedQuote.tarifaBase,
          precio_km: freightRequest.calculatedQuote.precioKm,
          extras: freightRequest.calculatedQuote.extras,
          precio_total: freightRequest.calculatedQuote.total,
          estado: freightRequest.status
        });

      if (freightError) {
        console.error('[SupabaseEventHandler] Error creando solicitud de flete:', freightError);
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
        .from('freight_requests')
        .update({
          estado: 'confirmed',
          fecha_confirmacion: event.payload.confirmedAt.toISOString(),
          confirmado_por: event.payload.confirmedBy,
          fecha_programada: event.payload.scheduledDate?.toISOString(),
          notas_confirmacion: event.payload.notes
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
        .from('freight_requests')
        .update({
          estado: 'rejected',
          fecha_rechazo: event.payload.rejectedAt.toISOString(),
          rechazado_por: event.payload.rejectedBy,
          motivo_rechazo: event.payload.reason
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
      const { error } = await supabase
        .from('freight_requests')
        .update({
          estado: event.payload.newStatus,
          updated_at: event.payload.updatedAt.toISOString(),
          notas_estado: event.payload.notes
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
          id: event.payload.paymentId,
          freight_request_id: event.payload.freightRequestId,
          amount: event.payload.amount,
          currency: event.payload.currency,
          payment_method: event.payload.paymentMethod,
          status: event.payload.status,
          provider_id: event.payload.providerId,
          error_message: event.payload.error,
          processed_at: event.payload.processedAt?.toISOString()
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
      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: event.payload.recipientId,
          recipient_type: event.payload.recipientType,
          title: event.payload.title,
          message: event.payload.message,
          category: event.payload.category,
          priority: event.payload.priority,
          related_entity_id: event.payload.relatedEntityId,
          related_entity_type: event.payload.relatedEntityType,
          action_url: event.payload.actionUrl,
          is_read: false
        });

      if (error) {
        console.error('[SupabaseEventHandler] Error creando notificación:', error);
        return;
      }

      console.log('[SupabaseEventHandler] Notificación guardada en Supabase');
    } catch (error) {
      console.error('[SupabaseEventHandler] Error procesando NotificationCreated:', error);
    }
  }

  /**
   * Configura real-time subscriptions para cambios desde la base de datos
   */
  setupRealtimeSubscriptions(): void {
    // Escuchar cambios en solicitudes de flete desde otros clientes/aplicaciones
    supabase
      .channel('freight_requests')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'freight_requests' }, 
          (payload) => {
            console.log('[SupabaseEventHandler] Cambio en freight_requests desde DB:', payload);
            // Aquí se podrían emitir eventos internos basados en cambios externos
          }
      )
      .subscribe();

    // Escuchar nuevas notificaciones desde la base de datos
    supabase
      .channel('notifications')
      .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications' }, 
          (payload) => {
            console.log('[SupabaseEventHandler] Nueva notificación desde DB:', payload);
            // Emitir evento interno para mostrar notificación en UI
          }
      )
      .subscribe();

    console.log('[SupabaseEventHandler] Suscripciones real-time configuradas');
  }

  /**
   * Limpia las suscripciones del handler
   */
  destroy(): void {
    eventBus.unsubscribeAll('freight.request.created');
    eventBus.unsubscribeAll('freight.confirmed');
    eventBus.unsubscribeAll('freight.rejected');
    eventBus.unsubscribeAll('freight.in_progress');
    eventBus.unsubscribeAll('freight.completed');
    eventBus.unsubscribeAll('freight.cancelled');
    eventBus.unsubscribeAll('payment.initiated');
    eventBus.unsubscribeAll('payment.completed');
    eventBus.unsubscribeAll('payment.failed');
    eventBus.unsubscribeAll('payment.refunded');
    eventBus.unsubscribeAll('notification.created');
    
    this.isInitialized = false;
    console.log('[SupabaseEventHandler] Handler destruido');
  }
}

// Instancia global del handler de Supabase
export const supabaseEventHandler = new SupabaseEventHandler();
