import { eventBus, createEvent } from '@/src/core/events/EventBus';
import { FreightRequestCreatedEvent, FreightConfirmedEvent, QuoteData, QuoteResult, FreightRequest, ClientInfo } from '@/src/core/events/domain-events';
import { configService } from '@/src/modules/config/ConfigService';
import { supabase } from '@/src/integrations/supabase/client';

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
  async calculateQuote(quoteData: QuoteData & { distance?: number }): Promise<QuoteResult> {
    try {
      // Obtener configuración desde M15
      const pricingRules = await configService.getPricingRules();
      
      console.log('[FreightService] Configuración M15 cargada:', pricingRules);
      console.log('[FreightService] Calculando cotización para:', quoteData);

      // Obtener distancia real o usar valor por defecto
      const distanciaReal = quoteData.distance || 20;
      console.log('[FreightService] 📏 Distancia utilizada:', distanciaReal, 'km');

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
          // Usar distancia real para determinar si es corta/larga
          precioBase = distanciaReal > pricingRules.LIMITE_KM_CORTA 
            ? pricingRules.COMBO_MINI_MUDANZA_LARGA 
            : pricingRules.COMBO_MINI_MUDANZA_CORTA;
          break;
        case 'flete_liviano':
          precioBase = distanciaReal > pricingRules.LIMITE_KM_CORTA
            ? pricingRules.COMBO_FLETE_LIVIANO_LARGO
            : pricingRules.COMBO_FLETE_LIVIANO_CORTO;
          break;
        case 'viaje_largo':
          // Para viajes largos, usar precio mínimo + combustible por km
          precioBase = pricingRules.PRECIO_MINIMO_FLETE + (distanciaReal * pricingRules.PRECIO_COMBUSTIBLE_KM);
          break;
      }

      // Aplicar modificadores adicionales
      let totalPrice = precioBase;

      // Modificador por pisos/escaleras
      if (quoteData.pisosEscalera && quoteData.pisosEscalera > 0) {
        totalPrice += (quoteData.pisosEscalera * pricingRules.EXTRA_PISO_ESCALERA);
      }

      // Determinar si requiere seña (viajes interurbanos - fuera de Corrientes)
      const esViajeInterurbano = this.isInterurbanTrip(quoteData.origen, quoteData.destino);
      const requiereSenia = esViajeInterurbano;
      const montoSenia = requiereSenia ? totalPrice * (pricingRules.PORCENTAJE_SENIA_LARGA / 100) : 0;

      // TODO: Aplicar descuentos por volumen/promociones (implementación futura)

      const quoteResult: QuoteResult = {
        km: distanciaReal,  // Usar distancia real
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

    let total = Math.round(precioBase * serviceMultiplier);
    
    // Agregar costo por escaleras
    const extrasEscaleras = quoteData.pisosEscalera ? quoteData.pisosEscalera * 5000 : 0;
    total += extrasEscaleras;
    
    // Determinar si requiere seña basado en ubicación (no en monto)
    const esViajeInterurbano = this.isInterurbanTrip(quoteData.origen, quoteData.destino);
    const requiereSenia = esViajeInterurbano;
    const montoSenia = requiereSenia ? Math.round(total * 0.3) : 0;
    
    return {
      km: estimatedKm,
      tarifaBase: precioBase,
      extras: quoteData.pisosEscalera ? { 'pisos_escalera': extrasEscaleras } : {},
      total,
      requiereSenia,
      montoSenia
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
   * Determina si el viaje es interurbano (fuera de la ciudad de Corrientes)
   * La seña solo se requiere cuando origen o destino están fuera de Corrientes
   */
  private isInterurbanTrip(origen: string, destino: string): boolean {
    // Normalizamos las direcciones a lowercase para comparación
    const origenNorm = origen.toLowerCase();
    const destinoNorm = destino.toLowerCase();
    
    // Lista de términos que indican que es dentro de Corrientes Capital
    const corrientesTerms = [
      'corrientes',
      'corrientes capital',
      'ciudad de corrientes',
      'ctes',
      'w3w',  // Barrios de Corrientes
      'w3e',
      'w3c',
      'w3a'
    ];
    
    // Verificar si el origen está en Corrientes
    const origenEnCorrientes = corrientesTerms.some(term => origenNorm.includes(term));
    
    // Verificar si el destino está en Corrientes  
    const destinoEnCorrientes = corrientesTerms.some(term => destinoNorm.includes(term));
    
    // Es viaje interurbano si alguno de los dos NO está en Corrientes
    const esInterurbano = !origenEnCorrientes || !destinoEnCorrientes;
    
    console.log('[FreightService] Análisis viaje interurbano:', {
      origen,
      destino,
      origenEnCorrientes,
      destinoEnCorrientes,
      esInterurbano
    });
    
    return esInterurbano;
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
    
    // Calcular cotización usando la distancia real
    const result = await this.calculateQuote(quoteData);
    
    // Sobrescribir con la distancia real calculada
    return {
      ...result,
      km: quoteData.distance
    };
  }

  /**
   * Crea una solicitud formal de flete (ESTRUCTURA SIMPLIFICADA)
   */
  async createFreightRequest(
    clientInfo: ClientInfo,
    quoteData: QuoteData,
    calculatedQuote: QuoteResult
  ): Promise<FreightRequest> {
    try {
      console.log('[FreightService] 🚀 Iniciando createFreightRequest (SIMPLIFICADO)');
      console.log('[FreightService] 📋 ClientInfo:', clientInfo);
      console.log('[FreightService] 📋 QuoteData:', quoteData);
      console.log('[FreightService] 💰 CalculatedQuote:', calculatedQuote);
      
      // 1. Crear o encontrar cliente en la base de datos
      let clientId = clientInfo.id;
      
      if (!clientId) {
        console.log('[FreightService] 👤 Buscando cliente existente...');
        // Buscar cliente existente por teléfono/email
        const { data: existingClient, error: searchError } = await supabase
          .from('clients')
          .select('id')
          .or(`telefono.eq.${clientInfo.telefono}${clientInfo.email ? `,email.eq.${clientInfo.email}` : ''}`)
          .single();

        if (searchError && searchError.code !== 'PGRST116') {
          console.error('[FreightService] ❌ Error buscando cliente:', searchError);
        }

        if (existingClient) {
          console.log('[FreightService] ✅ Cliente encontrado:', existingClient.id);
          clientId = existingClient.id;
        } else {
          console.log('[FreightService] 👤 Creando nuevo cliente...');
          // Crear nuevo cliente
          const clientData = {
            nombre: clientInfo.nombre,
            apellido: clientInfo.apellido || '',
            telefono: clientInfo.telefono,
            email: clientInfo.email || null
          };
          
          console.log('[FreightService] 📋 Datos del cliente a insertar:', clientData);
          
          const { data: newClient, error: clientError } = await supabase
            .from('clients')
            .insert(clientData)
            .select('id')
            .single();

          if (clientError) {
            console.error('[FreightService] ❌ Error creando cliente:', clientError);
            throw new Error('Error al crear cliente: ' + clientError.message);
          }

          console.log('[FreightService] ✅ Cliente creado exitosamente:', newClient.id);
          clientId = newClient.id;
        }
      }

      // 2. Crear solicitud CON cotización integrada (ESTRUCTURA SIMPLIFICADA)
      console.log('[FreightService] 📝 Creando solicitud completa...');
      const insertData = {
        client_id: clientId,
        origen: quoteData.origen,
        destino: quoteData.destino,
        fecha: quoteData.fecha,
        franja: quoteData.franja,
        carga_tipo: quoteData.tipoServicio,
        notas: quoteData.notas || null,
        estado: 'Solicitada' as const,
        
        // Campos de cotización integrados directamente
        km: calculatedQuote.km,
        tarifa_base: calculatedQuote.tarifaBase,
        precio_km: Math.round((calculatedQuote.total - calculatedQuote.tarifaBase) / calculatedQuote.km) || 150,
        extras_json: calculatedQuote.extras || {},
        total: calculatedQuote.total
      };
      
      console.log('[FreightService] 📋 Datos completos a insertar:', insertData);
      
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert(insertData)
        .select(`
          *,
          client:clients(
            id,
            nombre,
            apellido,
            telefono,
            email
          )
        `)
        .single();

      if (requestError) {
        console.error('[FreightService] ❌ Error creando solicitud completa:', requestError);
        throw new Error('Error al crear solicitud: ' + requestError.message);
      }

      console.log('[FreightService] ✅ Solicitud completa creada exitosamente:', request.id);

      // 3. Crear objeto FreightRequest adaptado para compatibilidad con la interfaz existente
      const requestData = request as any; // Cast para acceder a los nuevos campos
      const freightRequest: FreightRequest = {
        id: requestData.id,
        clientId: requestData.client_id,
        client: requestData.client,
        quote: quoteData,
        calculatedQuote: {
          km: requestData.km || calculatedQuote.km,
          tarifaBase: requestData.tarifa_base || calculatedQuote.tarifaBase,
          extras: requestData.extras_json || calculatedQuote.extras || {},
          total: requestData.total || calculatedQuote.total,
          requiereSenia: (requestData.total || calculatedQuote.total) > 50000,
          montoSenia: (requestData.total || calculatedQuote.total) > 50000 ? Math.round((requestData.total || calculatedQuote.total) * 0.3) : 0
        },
        status: 'pending',
        createdAt: new Date(requestData.created_at),
        updatedAt: new Date(requestData.updated_at)
      };

      // 4. Emitir eventos
      const freightCreatedEvent = createEvent<Omit<FreightRequestCreatedEvent, 'id' | 'timestamp'>>({
        type: 'freight.request.created',
        payload: {
          freightRequest
        }
      });

      await eventBus.emit(freightCreatedEvent);
      console.log('[FreightService] 🎉 ¡Solicitud completa creada exitosamente!');
      console.log('[FreightService] 📊 Resumen:', {
        freightRequestId: freightRequest.id,
        clientId: freightRequest.clientId,
        total: freightRequest.calculatedQuote.total
      });
      return freightRequest;

    } catch (error) {
      console.error('[FreightService] Error en createFreightRequest:', error);
      throw error;
    }
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
   * Obtiene todas las solicitudes pendientes (ESTRUCTURA SIMPLIFICADA)
   */
  async getPendingRequests(): Promise<FreightRequest[]> {
    try {
      console.log('[FreightService] 📋 Obteniendo solicitudes pendientes (simplificado)...');
      
      const { data: requests, error } = await supabase
        .from('requests')
        .select(`
          *,
          clients(
            id,
            nombre,
            apellido,
            telefono,
            email
          )
        `)
        .eq('estado', 'Solicitada')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[FreightService] Error obteniendo solicitudes pendientes:', error);
        throw new Error('Error al obtener solicitudes: ' + error.message);
      }

      // Transformar datos simplificados al formato FreightRequest
      const freightRequests: FreightRequest[] = requests?.map((request: any) => {
        // Cast para acceder a los nuevos campos de cotización
        const req = request as any;
        return {
          id: req.id,
          clientId: req.client_id,
          client: req.clients, // Accediendo a la tabla clients
          quote: {
            origen: req.origen,
            destino: req.destino,
            fecha: req.fecha,
            franja: req.franja,
            tipoServicio: req.carga_tipo,
            pisosEscalera: req.pisosEscalera || 0,
            notas: req.notas || ''
          },
          // Usar datos directamente de la tabla requests (estructura simplificada)
          calculatedQuote: {
            km: req.km || 0,
            tarifaBase: req.tarifa_base || 0,
            extras: req.extras_json || {},
            total: req.total || 0,
            requiereSenia: (req.total || 0) > 50000,
            montoSenia: (req.total || 0) > 50000 ? Math.round((req.total || 0) * 0.3) : 0
          },
          status: 'pending',
          createdAt: new Date(req.created_at),
          updatedAt: new Date(req.updated_at)
        };
      }) || [];

      console.log('[FreightService] Solicitudes pendientes obtenidas:', freightRequests.length);
      return freightRequests;

    } catch (error) {
      console.error('[FreightService] Error en getPendingRequests:', error);
      return [];
    }
  }

  /**
   * Actualiza el estado de un flete
   */
  async updateFreightStatus(freightId: string, newStatus: 'Confirmada' | 'Rechazada', reason?: string): Promise<void> {
    try {
      console.log('[FreightService] Actualizando estado del flete:', freightId, 'a:', newStatus);
      
      const { error } = await supabase
        .from('requests')
        .update({ 
          estado: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', freightId);

      if (error) {
        console.error('[FreightService] Error actualizando estado:', error);
        throw new Error('Error al actualizar estado: ' + error.message);
      }

      // Emitir eventos según el estado
      if (newStatus === 'Confirmada') {
        const freightConfirmedEvent = createEvent<Omit<FreightConfirmedEvent, 'id' | 'timestamp'>>({
          type: 'freight.confirmed',
          payload: {
            freightRequestId: freightId,
            confirmedBy: 'admin',
            confirmedAt: new Date()
          }
        });
        await eventBus.emit(freightConfirmedEvent);
      } else if (newStatus === 'Rechazada') {
        const freightRejectedEvent = createEvent<any>({
          type: 'freight.rejected',
          payload: {
            freightRequestId: freightId,
            rejectedBy: 'admin',
            rejectedAt: new Date(),
            reason: reason || 'Sin especificar'
          }
        });
        await eventBus.emit(freightRejectedEvent);
      }

      console.log('[FreightService] Estado actualizado exitosamente');

    } catch (error) {
      console.error('[FreightService] Error en updateFreightStatus:', error);
      throw error;
    }
  }
}

// Instancia global del servicio de fletes
export const freightService = new FreightService();
