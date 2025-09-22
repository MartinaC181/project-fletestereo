import { eventBus, createEvent } from '@/core/events';
import type { 
  QuoteRequestedEvent,
  QuoteCalculatedEvent,
  FreightRequestCreatedEvent,
  QuoteData,
  QuoteResult,
  ClientInfo,
  FreightRequest 
} from '@/core/events/domain-events';

/**
 * Servicio de gestión de fletes que utiliza el Event Bus
 * para comunicarse con otros módulos sin acoplamiento directo
 */
export class FreightService {
  
  /**
   * Solicita una cotización y emite el evento correspondiente
   */
  async requestQuote(quoteData: QuoteData, clientInfo?: Partial<ClientInfo>, sessionId?: string): Promise<QuoteResult> {
    // Emitir evento de solicitud de cotización
    const quoteRequestEvent = createEvent<Omit<QuoteRequestedEvent, 'id' | 'timestamp'>>({
      type: 'freight.quote.requested',
      payload: {
        quoteData,
        clientInfo,
        sessionId
      }
    });

    await eventBus.emit(quoteRequestEvent);

    // Calcular cotización (lógica de negocio)
    const calculatedQuote = await this.calculateQuote(quoteData);

    // Emitir evento de cotización calculada
    const quoteCalculatedEvent = createEvent<Omit<QuoteCalculatedEvent, 'id' | 'timestamp'>>({
      type: 'freight.quote.calculated',
      payload: {
        quoteData,
        calculatedQuote,
        sessionId
      }
    });

    await eventBus.emit(quoteCalculatedEvent);

    return calculatedQuote;
  }

  /**
   * Calcula el precio del flete basado en los datos proporcionados
   */
  private async calculateQuote(quoteData: QuoteData): Promise<QuoteResult> {
    // Simulación de cálculo (en la implementación real esto podría consultar APIs externas)
    const kmDistance = Math.floor(Math.random() * 100) + 10;
    const tarifaBase = 5000;
    const precioKm = 50;
    
    const extras: Record<string, number> = {};
    
    if (quoteData.cargaTipo === 'pesada') {
      extras.cargaPesada = 2000;
    }
    
    if (quoteData.cargaVolumen === 'grande') {
      extras.ayudanteExtra = 1500;
    }

    // Recargo por franja horaria nocturna
    if (quoteData.franja === 'noche') {
      extras.franjaHoraria = 1000;
    }

    const extrasTotal = Object.values(extras).reduce((sum, value) => sum + value, 0);
    const total = tarifaBase + (kmDistance * precioKm) + extrasTotal;

    return {
      km: kmDistance,
      tarifaBase,
      precioKm,
      extras,
      total
    };
  }

  /**
   * Crea una solicitud formal de flete
   */
  async createFreightRequest(
    clientInfo: ClientInfo,
    quoteData: QuoteData,
    calculatedQuote: QuoteResult
  ): Promise<FreightRequest> {
    const freightRequest: FreightRequest = {
      id: `freight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId: clientInfo.id || `client_${Date.now()}`,
      client: clientInfo,
      quote: quoteData,
      calculatedQuote,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Emitir evento de creación de solicitud
    const freightCreatedEvent = createEvent<Omit<FreightRequestCreatedEvent, 'id' | 'timestamp'>>({
      type: 'freight.request.created',
      payload: {
        freightRequest
      }
    });

    await eventBus.emit(freightCreatedEvent);

    // En un caso real, aquí se guardaría en la base de datos
    console.log('[FreightService] Solicitud de flete creada:', freightRequest);

    return freightRequest;
  }

  /**
   * Confirma una solicitud de flete (simulación de acción del dueño)
   */
  async confirmFreightRequest(
    freightRequestId: string,
    confirmedBy: string,
    scheduledDate?: Date,
    notes?: string
  ): Promise<void> {
    const confirmEvent = createEvent({
      type: 'freight.confirmed' as const,
      payload: {
        freightRequestId,
        confirmedBy,
        confirmedAt: new Date(),
        scheduledDate,
        notes
      }
    });

    await eventBus.emit(confirmEvent);
  }

  /**
   * Rechaza una solicitud de flete (simulación de acción del dueño)
   */
  async rejectFreightRequest(
    freightRequestId: string,
    rejectedBy: string,
    reason?: string
  ): Promise<void> {
    const rejectEvent = createEvent({
      type: 'freight.rejected' as const,
      payload: {
        freightRequestId,
        rejectedBy,
        rejectedAt: new Date(),
        reason
      }
    });

    await eventBus.emit(rejectEvent);
  }

  /**
   * Actualiza el estado de un flete
   */
  async updateFreightStatus(
    freightRequestId: string,
    newStatus: 'in_progress' | 'completed' | 'cancelled',
    updatedBy: string,
    notes?: string
  ): Promise<void> {
    const eventType = `freight.${newStatus}` as const;
    
    const statusEvent = createEvent({
      type: eventType,
      payload: {
        freightRequestId,
        previousStatus: 'confirmed', // En un caso real, esto vendría del estado actual
        newStatus,
        updatedBy,
        updatedAt: new Date(),
        notes
      }
    });

    await eventBus.emit(statusEvent);
  }
}

// Instancia global del servicio de fletes
export const freightService = new FreightService();
