import { eventBus, createEvent } from '@/core/events';
import type { 
  FreightDomainEvent,
  NotificationCreatedEvent,
  FreightEventTypes,
  FreightConfirmedEvent,
  FreightRejectedEvent,
  PaymentEvent,
  FreightStatusChangedEvent 
} from '@/core/events/domain-events';

export interface NotificationTemplate {
  title: string;
  message: string;
  category: 'freight' | 'payment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Servicio de notificaciones que escucha eventos del sistema
 * y genera notificaciones automáticamente para los usuarios relevantes
 */
export class NotificationService {
  private isInitialized = false;

  /**
   * Inicializa el servicio de notificaciones suscribiéndose a eventos relevantes
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Suscribirse a eventos de confirmación/rechazo de flete
    eventBus.subscribe('freight.confirmed', this.handleFreightConfirmed.bind(this));
    eventBus.subscribe('freight.rejected', this.handleFreightRejected.bind(this));
    
    // Suscribirse a eventos de cambio de estado
    eventBus.subscribe('freight.in_progress', this.handleFreightStatusChanged.bind(this));
    eventBus.subscribe('freight.completed', this.handleFreightStatusChanged.bind(this));
    eventBus.subscribe('freight.cancelled', this.handleFreightStatusChanged.bind(this));
    
    // Suscribirse a eventos de pago
    eventBus.subscribe('payment.completed', this.handlePaymentEvent.bind(this));
    eventBus.subscribe('payment.failed', this.handlePaymentEvent.bind(this));
    
    this.isInitialized = true;
    console.log('[NotificationService] Servicio inicializado y suscrito a eventos');
  }

  private async handleFreightConfirmed(event: FreightConfirmedEvent): Promise<void> {
    // Notificar al cliente que su solicitud fue confirmada
    await this.createNotification({
      recipientId: event.payload.freightRequestId, // En un caso real, obtendríamos el clientId
      recipientType: 'client',
      title: '¡Flete Confirmado!',
      message: `Tu solicitud de flete ha sido confirmada. ${event.payload.scheduledDate ? `Fecha programada: ${event.payload.scheduledDate.toLocaleDateString()}` : ''}`,
      category: 'freight',
      priority: 'high',
      relatedEntityId: event.payload.freightRequestId,
      relatedEntityType: 'freight_request'
    });
  }

  private async handleFreightRejected(event: FreightRejectedEvent): Promise<void> {
    // Notificar al cliente que su solicitud fue rechazada
    await this.createNotification({
      recipientId: event.payload.freightRequestId, // En un caso real, obtendríamos el clientId
      recipientType: 'client',
      title: 'Solicitud de Flete Rechazada',
      message: `Lamentamos informarte que tu solicitud de flete no pudo ser atendida. ${event.payload.reason ? `Motivo: ${event.payload.reason}` : ''}`,
      category: 'freight',
      priority: 'medium',
      relatedEntityId: event.payload.freightRequestId,
      relatedEntityType: 'freight_request'
    });
  }

  private async handleFreightStatusChanged(event: FreightStatusChangedEvent): Promise<void> {
    const statusMessages = {
      'freight.in_progress': {
        title: 'Flete En Camino',
        message: 'Tu flete está en progreso. Te mantendremos informado.',
        priority: 'medium' as const
      },
      'freight.completed': {
        title: 'Flete Completado',
        message: '¡Tu flete ha sido completado exitosamente!',
        priority: 'high' as const
      },
      'freight.cancelled': {
        title: 'Flete Cancelado',
        message: 'Tu flete ha sido cancelado. Te contactaremos pronto.',
        priority: 'high' as const
      }
    };

    const config = statusMessages[event.type as keyof typeof statusMessages];
    if (config) {
      await this.createNotification({
        recipientId: event.payload.freightRequestId, // En un caso real, obtendríamos el clientId
        recipientType: 'client',
        title: config.title,
        message: config.message,
        category: 'freight',
        priority: config.priority,
        relatedEntityId: event.payload.freightRequestId,
        relatedEntityType: 'freight_request'
      });
    }
  }

  private async handlePaymentEvent(event: PaymentEvent): Promise<void> {
    const paymentMessages = {
      'payment.completed': {
        title: 'Pago Completado',
        message: 'Tu pago ha sido procesado exitosamente.',
        priority: 'high' as const
      },
      'payment.failed': {
        title: 'Error en el Pago',
        message: 'Hubo un problema procesando tu pago. Por favor, intenta nuevamente.',
        priority: 'urgent' as const
      }
    };

    const config = paymentMessages[event.type as keyof typeof paymentMessages];
    if (config) {
      await this.createNotification({
        recipientId: event.payload.freightRequestId, // En un caso real, obtendríamos el clientId
        recipientType: 'client',
        title: config.title,
        message: config.message,
        category: 'payment',
        priority: config.priority,
        relatedEntityId: event.payload.paymentId,
        relatedEntityType: 'payment'
      });
    }
  }

  /**
   * Crea una nueva notificación y emite el evento correspondiente
   */
  private async createNotification(data: {
    recipientId: string;
    recipientType: 'client' | 'owner' | 'admin';
    title: string;
    message: string;
    category: 'freight' | 'payment' | 'system';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    relatedEntityId?: string;
    relatedEntityType?: string;
    actionUrl?: string;
  }): Promise<void> {
    // Crear evento de notificación
    const notificationEvent = createEvent<Omit<NotificationCreatedEvent, 'id' | 'timestamp'>>({
      type: 'notification.created',
      payload: data
    });

    // Emitir el evento (otros servicios pueden escuchar esto para enviar emails, push notifications, etc.)
    await eventBus.emit(notificationEvent);
  }

  /**
   * Limpia las suscripciones del servicio
   */
  destroy(): void {
    eventBus.unsubscribeAll('freight.confirmed');
    eventBus.unsubscribeAll('freight.rejected');
    eventBus.unsubscribeAll('freight.in_progress');
    eventBus.unsubscribeAll('freight.completed');
    eventBus.unsubscribeAll('freight.cancelled');
    eventBus.unsubscribeAll('payment.completed');
    eventBus.unsubscribeAll('payment.failed');
    
    this.isInitialized = false;
    console.log('[NotificationService] Servicio destruido');
  }
}

// Instancia global del servicio de notificaciones
export const notificationService = new NotificationService();
