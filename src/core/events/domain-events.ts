import type { BaseEvent } from '../events/types';

/**
 * Eventos específicos del dominio de Fletestereo
 */

// Tipos de eventos del dominio
export const FreightEventTypes = {
  // Eventos de solicitud de flete
  QUOTE_REQUESTED: 'freight.quote.requested',
  QUOTE_CALCULATED: 'freight.quote.calculated',
  FREIGHT_REQUEST_CREATED: 'freight.request.created',
  FREIGHT_REQUEST_UPDATED: 'freight.request.updated',
  
  // Eventos de confirmación por parte del dueño
  FREIGHT_CONFIRMED: 'freight.confirmed',
  FREIGHT_REJECTED: 'freight.rejected',
  FREIGHT_RESCHEDULED: 'freight.rescheduled',
  
  // Eventos de estado del flete
  FREIGHT_IN_PROGRESS: 'freight.in_progress',
  FREIGHT_COMPLETED: 'freight.completed',
  FREIGHT_CANCELLED: 'freight.cancelled',
  
  // Eventos de notificaciones
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_READ: 'notification.read',
  NOTIFICATION_DELETED: 'notification.deleted',
  
  // Eventos de pagos
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  
  // Eventos de agenda
  SCHEDULE_UPDATED: 'schedule.updated',
  AVAILABILITY_CHANGED: 'schedule.availability.changed',
} as const;

export type FreightEventType = typeof FreightEventTypes[keyof typeof FreightEventTypes];

// Interfaces para los datos de cada evento

export interface QuoteData {
  origen: string;
  destino: string;
  fecha: string;
  franja: string;
  cargaTipo: string;
  cargaVolumen: string;
  notas?: string;
}

export interface QuoteResult {
  km: number;
  tarifaBase: number;
  precioKm: number;
  extras: Record<string, number>;
  total: number;
}

export interface ClientInfo {
  id?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
}

export interface FreightRequest {
  id: string;
  clientId: string;
  client: ClientInfo;
  quote: QuoteData;
  calculatedQuote: QuoteResult;
  status: 'pending' | 'confirmed' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Eventos específicos

export interface QuoteRequestedEvent extends BaseEvent {
  type: typeof FreightEventTypes.QUOTE_REQUESTED;
  payload: {
    quoteData: QuoteData;
    clientInfo?: Partial<ClientInfo>;
    sessionId?: string;
  };
}

export interface QuoteCalculatedEvent extends BaseEvent {
  type: typeof FreightEventTypes.QUOTE_CALCULATED;
  payload: {
    quoteData: QuoteData;
    calculatedQuote: QuoteResult;
    sessionId?: string;
  };
}

export interface FreightRequestCreatedEvent extends BaseEvent {
  type: typeof FreightEventTypes.FREIGHT_REQUEST_CREATED;
  payload: {
    freightRequest: FreightRequest;
  };
}

export interface FreightConfirmedEvent extends BaseEvent {
  type: typeof FreightEventTypes.FREIGHT_CONFIRMED;
  payload: {
    freightRequestId: string;
    confirmedBy: string;
    confirmedAt: Date;
    scheduledDate?: Date;
    notes?: string;
  };
}

export interface FreightRejectedEvent extends BaseEvent {
  type: typeof FreightEventTypes.FREIGHT_REJECTED;
  payload: {
    freightRequestId: string;
    rejectedBy: string;
    rejectedAt: Date;
    reason?: string;
  };
}

export interface FreightStatusChangedEvent extends BaseEvent {
  type: typeof FreightEventTypes.FREIGHT_IN_PROGRESS | 
        typeof FreightEventTypes.FREIGHT_COMPLETED | 
        typeof FreightEventTypes.FREIGHT_CANCELLED;
  payload: {
    freightRequestId: string;
    previousStatus: string;
    newStatus: string;
    updatedBy: string;
    updatedAt: Date;
    notes?: string;
  };
}

export interface NotificationCreatedEvent extends BaseEvent {
  type: typeof FreightEventTypes.NOTIFICATION_CREATED;
  payload: {
    recipientId: string;
    recipientType: 'client' | 'owner' | 'admin';
    title: string;
    message: string;
    category: 'freight' | 'payment' | 'system';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    relatedEntityId?: string;
    relatedEntityType?: string;
    actionUrl?: string;
  };
}

export interface PaymentEvent extends BaseEvent {
  type: typeof FreightEventTypes.PAYMENT_INITIATED |
        typeof FreightEventTypes.PAYMENT_COMPLETED |
        typeof FreightEventTypes.PAYMENT_FAILED |
        typeof FreightEventTypes.PAYMENT_REFUNDED;
  payload: {
    paymentId: string;
    freightRequestId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    providerId?: string;
    error?: string;
    processedAt?: Date;
  };
}

export interface ScheduleUpdatedEvent extends BaseEvent {
  type: typeof FreightEventTypes.SCHEDULE_UPDATED;
  payload: {
    ownerId: string;
    date: Date;
    availableSlots: string[];
    bookedSlots: string[];
    updatedBy: string;
  };
}

// Union type de todos los eventos del dominio
export type FreightDomainEvent = 
  | QuoteRequestedEvent
  | QuoteCalculatedEvent
  | FreightRequestCreatedEvent
  | FreightConfirmedEvent
  | FreightRejectedEvent
  | FreightStatusChangedEvent
  | NotificationCreatedEvent
  | PaymentEvent
  | ScheduleUpdatedEvent;
