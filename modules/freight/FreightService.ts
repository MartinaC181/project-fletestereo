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
   * Solicita una cotización con distancia real calculada
   */
  async requestQuoteWithDistance(
    quoteData: QuoteData, 
    clientInfo: Partial<ClientInfo>, 
    realDistance: number, 
    sessionId?: string
  ): Promise<QuoteResult> {
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

    // Calcular cotización (la nueva lógica maneja la distancia internamente)
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
   * (M2) Calcula el precio del flete basado en las reglas de negocio definidas.
   * REGLA CORREGIDA: Los extras (escaleras) SOLO aplican a viajes locales.
   */
  private async calculateQuote(quoteData: QuoteData): Promise<QuoteResult> {
    
    // (Simulación M1 - Martina)
    const { km, isLocal } = this.simularGeocodificacion(quoteData.origen, quoteData.destino);
    
    // (Simulación M15 - Esteban)
    const reglas = this.simularReglasDeNegocio();

    let tarifaBase = 0;
    let precioKm = 0;
    const extras: Record<string, number> = {};
    const distanciaKm = Math.floor(km); // "el km se redondea para abajo"
    let total = 0;

    if (isLocal) {
      // --- 1. LÓGICA DE COMBOS (Dentro de Corrientes) ---
      const esRecorridoCorto = distanciaKm <= reglas.LIMITE_KM_CORTA; // 1km = 10 cuadras

      switch (quoteData.tipoServicio) {
        case 'mudanza_completa':
          tarifaBase = reglas.COMBO_MUDANZA_COMPLETA; // 80.000
          break;
        case 'mini_mudanza':
          tarifaBase = esRecorridoCorto 
            ? reglas.COMBO_MINI_MUDANZA_CORTA // 30.000
            : reglas.COMBO_MINI_MUDANZA_LARGA; // 40.000
          break;
        case 'flete_liviano':
          tarifaBase = esRecorridoCorto
            ? reglas.COMBO_FLETE_LIVIANO_CORTO // 20.000
            : reglas.COMBO_FLETE_LIVIANO_LARGO; // 25.000
          break;
        case 'viaje_largo':
          // Es local pero seleccionó 'viaje_largo', usamos km
          precioKm = reglas.PRECIO_COMBUSTIBLE_KM_LOCAL; 
          break;
      }

      // --- 2. LÓGICA DE EXTRAS (SOLO PARA LOCALES) ---
      // "por cada piso de escalera... se suma una variable (10.000 pesos)"
      const pisos = quoteData.pisosEscalera || 0;
      if (pisos > 0) {
        extras.escaleras = pisos * reglas.EXTRA_PISO_ESCALERA;
      }

      const extrasTotal = Object.values(extras).reduce((sum, value) => sum + value, 0);
      total = tarifaBase + (distanciaKm * precioKm) + extrasTotal;

    } else {
      // --- 3. LÓGICA FUERA DE CORRIENTES (SIN EXTRAS) ---
      // "la cotización es combustible*km"
      precioKm = reglas.PRECIO_COMBUSTIBLE_KM_LARGA;
      total = distanciaKm * precioKm;
      // tarifaBase es 0 y extras es {}
    }

    // --- 4. CÁLCULO PRECIO MÍNIMO (Aplica a AMBOS) ---
    // "ningun flete puede ser menor a 20mil pesos"
    if (total < reglas.PRECIO_MINIMO_FLETE) {
      // Ajustamos la tarifa base para que el desglose siga sumando correctamente
      const diferencia = reglas.PRECIO_MINIMO_FLETE - total;
      tarifaBase += diferencia;
      total = reglas.PRECIO_MINIMO_FLETE;
    }

    // --- 5. LÓGICA DE SEÑA (RF-06) (Aplica a AMBOS) ---
    let requiereSenia = false;
    let montoSenia = 0;

    // "si es fuera de la ciudad, se debe una seña del 50%"
    if (!isLocal) {
      requiereSenia = true;
      montoSenia = total * (reglas.PORCENTAJE_SENIA_LARGA / 100); 
    }

    // --- 6. DEVOLVER DESGLOSE COMPLETO (RF-05) ---
    return {
      km: distanciaKm,
      tarifaBase: tarifaBase,
      precioKm: precioKm,
      extras: extras, // (estará vacío si !isLocal)
      total: total,
      requiereSenia: requiereSenia,
      montoSenia: Math.round(montoSenia)
    };
  }

  // --- MÉTODOS SIMULADOS (Prerrequisitos M1 y M15) ---

  private simularGeocodificacion(origen: string, destino: string): { km: number, isLocal: boolean } {
    if (destino.toLowerCase().includes('resistencia') || origen.toLowerCase().includes('resistencia')) {
      return { km: 25, isLocal: false }; // Viaje largo
    }
    if (destino.toLowerCase().includes('campus')) {
      return { km: 12, isLocal: true }; // > 10 cuadras (1km)
    }
    return { km: 0.8, isLocal: true }; // < 10 cuadras (1km)
  }

  private simularReglasDeNegocio() {
    // Esto vendría de M15 (Base de Datos)
    return {
      COMBO_MUDANZA_COMPLETA: 80000,
      COMBO_MINI_MUDANZA_LARGA: 40000,
      COMBO_MINI_MUDANZA_CORTA: 30000,
      COMBO_FLETE_LIVIANO_LARGO: 25000,
      COMBO_FLETE_LIVIANO_CORTO: 20000,
      PRECIO_COMBUSTIBLE_KM_LARGA: 300, // Precio por KM para viajes largos
      PRECIO_COMBUSTIBLE_KM_LOCAL: 150, // Precio por KM si es local pero no es combo
      EXTRA_PISO_ESCALERA: 10000,
      PRECIO_MINIMO_FLETE: 20000,
      LIMITE_KM_CORTA: 1, // 1km = 10 cuadras
      PORCENTAJE_SENIA_LARGA: 50 // 50%
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
