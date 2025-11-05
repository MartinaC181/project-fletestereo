import { eventBus, createEvent } from '@/core/events/EventBus';
import { FreightRequestCreatedEvent, FreightConfirmedEvent, QuoteData, QuoteResult, FreightRequest, ClientInfo } from '@/core/events/domain-events';
import { configService } from '@/modules/config/ConfigService';

/**
 * Servicio principal de manejo de fletes con integración M15
 */
export class FreightService {
  constructor() {
    console.log('[FreightService] Servicio inicializado con configuración M15');
  }

  /**
   * Calcula cotización con integración M15 (configuración desde base de datos)
   */
  async calculateQuote(quoteData: QuoteData): Promise<QuoteResult> {
    try {
      // Obtener configuración desde M15
      const pricingRules = await configService.getPricingRules();
      
      console.log('[FreightService] Configuración M15 cargada:', pricingRules);
      console.log('[FreightService] Calculando cotización para:', quoteData);

      // Validar tipo de servicio
      if (!this.isValidServiceType(quoteData.tipoServicio)) {
        throw new Error(`Tipo de servicio no válido: ${quoteData.tipoServicio}`);
      }

      // Cálculo base según tipo de servicio usando las tarifas M15
      let precioBase = 0;
      
      switch (quoteData.tipoServicio) {
        case 'mudanza_completa':
          precioBase = pricingRules.COMBO_MUDANZA_COMPLETA;
          break;
        case 'mini_mudanza':
          // Usar distancia ficticia o límite para determinar si es corta/larga
          const isLongDistance = 20; // TODO: obtener distancia real
          precioBase = isLongDistance > pricingRules.LIMITE_KM_CORTA 
            ? pricingRules.COMBO_MINI_MUDANZA_LARGA 
            : pricingRules.COMBO_MINI_MUDANZA_CORTA;
          break;
        case 'flete_liviano':
          const isLongFreight = 20; // TODO: obtener distancia real
          precioBase = isLongFreight > pricingRules.LIMITE_KM_CORTA
            ? pricingRules.COMBO_FLETE_LIVIANO_LARGO
            : pricingRules.COMBO_FLETE_LIVIANO_CORTO;
          break;
        case 'viaje_largo':
          // Para viajes largos, usar precio mínimo + combustible por km
          const estimatedKm = 50; // TODO: obtener distancia real
          precioBase = pricingRules.PRECIO_MINIMO_FLETE + (estimatedKm * pricingRules.PRECIO_COMBUSTIBLE_KM);
          break;
      }

      // Aplicar modificadores adicionales
      let totalPrice = precioBase;

      // Modificador por pisos/escaleras
      if (quoteData.pisosEscalera && quoteData.pisosEscalera > 0) {
        totalPrice += (quoteData.pisosEscalera * pricingRules.EXTRA_PISO_ESCALERA);
      }

      // Determinar si requiere seña (viajes largos)
      const estimatedDistance = 20; // TODO: obtener distancia real
      const requiereSenia = estimatedDistance > pricingRules.LIMITE_KM_CORTA;
      const montoSenia = requiereSenia ? totalPrice * (pricingRules.PORCENTAJE_SENIA_LARGA / 100) : 0;

      // TODO: Aplicar descuentos por volumen/promociones (implementación futura)

      const quoteResult: QuoteResult = {
        km: 20, // TODO: obtener distancia real  
        tarifaBase: precioBase,
        extras: quoteData.pisosEscalera ? { 'pisos_escalera': quoteData.pisosEscalera * pricingRules.EXTRA_PISO_ESCALERA } : {},
        total: Math.round(totalPrice),
        requiereSenia,
        montoSenia: Math.round(montoSenia)
      };

      console.log('[FreightService] Cotización calculada:', quoteResult);
      return quoteResult;

    } catch (error) {
      console.error('[FreightService] Error al calcular cotización:', error);
      
      // Fallback con valores por defecto si falla M15
      console.warn('[FreightService] Usando valores fallback por error en M15');
      return this.calculateFallbackQuote(quoteData);
    }
  }

  /**
   * Calcula cotización con valores fallback (sin M15)
   */
  private calculateFallbackQuote(quoteData: QuoteData): QuoteResult {
    const estimatedKm = 20; // Distancia estimada por defecto
    const basePricePerKm = 1500;
    const precioBase = estimatedKm * basePricePerKm;
    
    let serviceMultiplier = 1;
    switch (quoteData.tipoServicio) {
      case 'mudanza_completa': serviceMultiplier = 1.5; break;
      case 'mini_mudanza': serviceMultiplier = 1.2; break;
      case 'flete_liviano': serviceMultiplier = 1.0; break;
      case 'viaje_largo': serviceMultiplier = 1.3; break;
    }

    const total = Math.round(precioBase * serviceMultiplier);
    
    return {
      km: estimatedKm,
      tarifaBase: precioBase,
      extras: quoteData.pisosEscalera ? { 'pisos_escalera': quoteData.pisosEscalera * 5000 } : {},
      total,
      requiereSenia: total > 50000,
      montoSenia: total > 50000 ? Math.round(total * 0.3) : 0
    };
  }

  /**
   * Calcula tiempo estimado según distancia y tipo de servicio
   */
  private calculateEstimatedTime(distance: number = 20, tipoServicio: string): string {
    const baseMinutes = Math.ceil(distance / 30) * 60; // 30 km/h promedio
    
    let serviceTimeMultiplier = 1;
    switch (tipoServicio) {
      case 'mudanza_completa': serviceTimeMultiplier = 2; break;
      case 'mini_mudanza': serviceTimeMultiplier = 1.5; break;
      case 'flete_liviano': serviceTimeMultiplier = 1; break;
      case 'viaje_largo': serviceTimeMultiplier = 1.2; break;
    }

    const totalMinutes = Math.ceil(baseMinutes * serviceTimeMultiplier);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  }

  /**
   * Valida si el tipo de servicio es válido
   */
  private isValidServiceType(tipoServicio: string): boolean {
    const validTypes = ['mudanza_completa', 'mini_mudanza', 'flete_liviano', 'viaje_largo'];
    return validTypes.includes(tipoServicio);
  }

  /**
   * Método principal para solicitar cotización (usado por QuoteForm)
   */
  async requestQuote(
    quoteData: QuoteData, 
    clientInfo?: Partial<ClientInfo>, 
    sessionId?: string
  ): Promise<QuoteResult> {
    console.log('[FreightService] Solicitando cotización:', quoteData);
    
    // Calcular la cotización
    const result = await this.calculateQuote(quoteData);
    
    // Emitir eventos para tracking
    const quoteRequestedEvent = createEvent<Omit<any, 'id' | 'timestamp'>>({
      type: 'freight.quote.requested',
      payload: {
        quoteData,
        clientInfo,
        sessionId
      }
    });
    
    const quoteCalculatedEvent = createEvent<Omit<any, 'id' | 'timestamp'>>({
      type: 'freight.quote.calculated',
      payload: {
        quoteData,
        calculatedQuote: result,
        sessionId
      }
    });

    await eventBus.emit(quoteRequestedEvent);
    await eventBus.emit(quoteCalculatedEvent);
    
    return result;
  }

  /**
   * Método para cotización con distancia específica (usado en solicitar-flete)
   */
  async requestQuoteWithDistance(
    quoteData: QuoteData & { distance: number }
  ): Promise<QuoteResult> {
    console.log('[FreightService] Cotización con distancia específica:', quoteData);
    
    // Para mantener compatibilidad, usar el método calculateQuote
    return await this.calculateQuote(quoteData);
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

    const freightCreatedEvent = createEvent<Omit<FreightRequestCreatedEvent, 'id' | 'timestamp'>>({
      type: 'freight.request.created',
      payload: {
        freightRequest
      }
    });

    await eventBus.emit(freightCreatedEvent);
    console.log('[FreightService] Solicitud de flete creada:', freightRequest);
    return freightRequest;
  }

  /**
   * Confirma una solicitud de flete
   */
  async confirmFreightRequest(freightId: string): Promise<void> {
    console.log('[FreightService] Confirmando flete:', freightId);
    
    const freightConfirmedEvent = createEvent<Omit<FreightConfirmedEvent, 'id' | 'timestamp'>>({
      type: 'freight.confirmed',
      payload: {
        freightRequestId: freightId,
        confirmedBy: 'system', // TODO: implementar usuario real
        confirmedAt: new Date()
      }
    });

    await eventBus.emit(freightConfirmedEvent);
    console.log('[FreightService] Flete confirmado:', freightId);
  }

  /**
   * Rechaza una solicitud de flete
   */
  async rejectFreightRequest(freightId: string, reason: string): Promise<void> {
    console.log('[FreightService] Rechazando flete:', freightId, 'Razón:', reason);
    // Implementar lógica de rechazo y eventos correspondientes
  }

  /**
   * Obtiene el historial de fletes de un cliente
   */
  async getClientFreightHistory(clientId: string): Promise<FreightRequest[]> {
    console.log('[FreightService] Obteniendo historial de fletes para cliente:', clientId);
    // Implementar lógica de consulta de historial
    return [];
  }

  /**
   * Actualiza el estado de un flete
   */
  async updateFreightStatus(freightId: string, status: string): Promise<void> {
    console.log('[FreightService] Actualizando estado del flete:', freightId, 'a:', status);
    // Implementar lógica de actualización de estado y eventos
  }
}

// Instancia global del servicio de fletes
export const freightService = new FreightService();
