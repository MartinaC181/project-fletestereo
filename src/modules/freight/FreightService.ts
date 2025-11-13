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

      // Determinar si es viaje interurbano (fuera de Corrientes)
      const esViajeInterurbano = this.isInterurbanTrip(quoteData.origen, quoteData.destino);
      console.log('[FreightService] 🗺️ Tipo de viaje:', esViajeInterurbano ? 'INTERURBANO' : 'URBANO');

      let precioBase = 0;
      let totalPrice = 0;
      const extras: Record<string, number> = {};

      if (esViajeInterurbano) {
        // ===== LÓGICA INTERURBANA =====
        // Para viajes fuera de Corrientes: solo combustible por KM
        // NO importa el tipo de servicio ni las escaleras
        precioBase = pricingRules.PRECIO_MINIMO_FLETE + (distanciaReal * pricingRules.PRECIO_COMBUSTIBLE_KM);
        totalPrice = precioBase;
        
        console.log('[FreightService] 🚛 Cálculo interurbano:');
        console.log(`  - Precio mínimo: $${pricingRules.PRECIO_MINIMO_FLETE}`);
        console.log(`  - Combustible: ${distanciaReal}km × $${pricingRules.PRECIO_COMBUSTIBLE_KM} = $${distanciaReal * pricingRules.PRECIO_COMBUSTIBLE_KM}`);
        
      } else {
        // ===== LÓGICA URBANA =====
        // Para viajes dentro de Corrientes: usar tipo de servicio + escaleras
        
        // Validar tipo de servicio para urbanos
        if (!this.isValidServiceType(quoteData.tipoServicio)) {
          throw new Error(`Tipo de servicio no válido: ${quoteData.tipoServicio}`);
        }

        // Calcular precio base según tipo de servicio
        switch (quoteData.tipoServicio) {
          case 'mudanza_completa':
            precioBase = pricingRules.COMBO_MUDANZA_COMPLETA;
            break;
          case 'mini_mudanza':
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
            // Viaje largo dentro de la ciudad (caso especial)
            precioBase = pricingRules.PRECIO_MINIMO_FLETE + (distanciaReal * pricingRules.PRECIO_COMBUSTIBLE_KM);
            break;
        }

        totalPrice = precioBase;

        // Aplicar modificador por escaleras (solo en urbanos)
        if (quoteData.pisosEscalera && quoteData.pisosEscalera > 0) {
          const extraEscaleras = quoteData.pisosEscalera * pricingRules.EXTRA_PISO_ESCALERA;
          totalPrice += extraEscaleras;
          extras['pisos_escalera'] = extraEscaleras;
        }

        console.log('[FreightService] 🏙️ Cálculo urbano:');
        console.log(`  - Tipo servicio: ${quoteData.tipoServicio}`);
        console.log(`  - Precio base: $${precioBase}`);
        if (extras.pisos_escalera) {
          console.log(`  - Escaleras: ${quoteData.pisosEscalera} × $${pricingRules.EXTRA_PISO_ESCALERA} = $${extras.pisos_escalera}`);
        }
      }

      // Seña: solo para viajes interurbanos (50%)
      const requiereSenia = esViajeInterurbano;
      const montoSenia = requiereSenia ? totalPrice * (pricingRules.PORCENTAJE_SENIA_LARGA / 100) : 0;

      // TODO: Aplicar descuentos por volumen/promociones (implementación futura)

      const quoteResult: QuoteResult = {
        km: distanciaReal,
        tarifaBase: precioBase,
        extras: extras, // Usar los extras calculados según el tipo de viaje
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
   * Calcula cotización con valores fallback (sin M15) - Aplica misma lógica de negocio
   */
  private calculateFallbackQuote(quoteData: QuoteData): QuoteResult {
    const estimatedKm = 20;
    const esViajeInterurbano = this.isInterurbanTrip(quoteData.origen, quoteData.destino);
    
    let precioBase = 0;
    let total = 0;
    const extras: Record<string, number> = {};
    
    if (esViajeInterurbano) {
      // INTERURBANO: solo combustible por KM (valores fallback)
      const precioMinimo = 15000;
      const combustibleKm = 800;
      precioBase = precioMinimo + (estimatedKm * combustibleKm);
      total = precioBase;
    } else {
      // URBANO: usar tipo de servicio + escaleras (valores fallback)
      const basePricePerKm = 1500;
      precioBase = estimatedKm * basePricePerKm;
      
      let serviceMultiplier = 1;
      switch (quoteData.tipoServicio) {
        case 'mudanza_completa': serviceMultiplier = 1.5; break;
        case 'mini_mudanza': serviceMultiplier = 1.2; break;
        case 'flete_liviano': serviceMultiplier = 1.0; break;
        case 'viaje_largo': serviceMultiplier = 1.3; break;
      }

      total = Math.round(precioBase * serviceMultiplier);
      
      // Agregar costo por escaleras solo en urbanos
      if (quoteData.pisosEscalera && quoteData.pisosEscalera > 0) {
        const extrasEscaleras = quoteData.pisosEscalera * 5000;
        total += extrasEscaleras;
        extras['pisos_escalera'] = extrasEscaleras;
      }
    }
    
    // Seña: solo para viajes interurbanos
    const requiereSenia = esViajeInterurbano;
    const montoSenia = requiereSenia ? Math.round(total * 0.5) : 0; // 50% para interurbanos
    
    return {
      km: estimatedKm,
      tarifaBase: precioBase,
      extras: extras,
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

      // 2. Crear solicitud en tabla requests (TEMPORAL - sin cotización integrada)
      console.log('[FreightService] 📝 Creando solicitud...');
      const requestData = {
        client_id: clientId,
        origen: quoteData.origen,
        destino: quoteData.destino,
        fecha: quoteData.fecha,
        franja: quoteData.franja,
        carga_tipo: quoteData.tipoServicio,
        notas: `${quoteData.notas || ''}\n\n--- COTIZACIÓN ---\nKM: ${calculatedQuote.km}\nTarifa Base: $${calculatedQuote.tarifaBase}\nExtras: ${JSON.stringify(calculatedQuote.extras)}\nTOTAL: $${calculatedQuote.total}\nRequiere Seña: ${calculatedQuote.requiereSenia}\nMonto Seña: $${calculatedQuote.montoSenia}`,
        estado: 'Solicitada' as const
      };
      
      console.log('[FreightService] 📋 Datos completos a insertar:', requestData);
      
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert(requestData)
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
      const freightRequest: FreightRequest = {
        id: request.id,
        clientId: request.client_id,
        client: {
          ...request.client,
          dni: '' // El DNI no es obligatorio en la tabla clients
        },
        quote: quoteData,
        calculatedQuote: {
          km: calculatedQuote.km,
          tarifaBase: calculatedQuote.tarifaBase,
          extras: calculatedQuote.extras || {},
          total: calculatedQuote.total,
          requiereSenia: calculatedQuote.requiereSenia,
          montoSenia: calculatedQuote.montoSenia
        },
        status: 'pending',
        createdAt: new Date(request.created_at),
        updatedAt: new Date(request.updated_at)
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

      // Transformar datos (TEMPORAL - extraer cotización de notas)
      const freightRequests: FreightRequest[] = requests?.map((request: any) => {
        // Extraer datos de cotización del campo notas (solución temporal)
        const extractQuoteFromNotes = (notas: string) => {
          const defaultQuote = { km: 0, tarifaBase: 0, extras: {}, total: 0, requiereSenia: false, montoSenia: 0 };
          if (!notas) return defaultQuote;
          
          try {
            const kmMatch = notas.match(/KM: (\d+(?:\.\d+)?)/);
            const tarifaMatch = notas.match(/Tarifa Base: \$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
            const totalMatch = notas.match(/TOTAL: \$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
            const extrasMatch = notas.match(/Extras: (\{.*?\})/);
            const seniaRequiereMatch = notas.match(/Requiere Seña: (true|false)/);
            const seniaMontoMatch = notas.match(/Monto Seña: \$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
            
            return {
              km: kmMatch ? parseFloat(kmMatch[1]) : 0,
              tarifaBase: tarifaMatch ? parseFloat(tarifaMatch[1].replace(/,/g, '')) : 0,
              extras: extrasMatch ? JSON.parse(extrasMatch[1]) : {},
              total: totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0,
              requiereSenia: seniaRequiereMatch ? seniaRequiereMatch[1] === 'true' : false,
              montoSenia: seniaMontoMatch ? parseFloat(seniaMontoMatch[1].replace(/,/g, '')) : 0
            };
          } catch (error) {
            console.warn('Error extrayendo cotización de notas:', error);
            return defaultQuote;
          }
        };

        const extractedQuote = extractQuoteFromNotes(request.notas);
        const cleanNotes = request.notas ? request.notas.split('\n\n--- COTIZACIÓN ---')[0] : '';

        return {
          id: request.id,
          clientId: request.client_id,
          client: {
            ...request.clients,
            dni: '' // El DNI no es obligatorio en la tabla clients
          },
          quote: {
            origen: request.origen,
            destino: request.destino,
            fecha: request.fecha,
            franja: request.franja,
            tipoServicio: request.carga_tipo,
            pisosEscalera: 0, // Este campo no está en la tabla
            notas: cleanNotes
          },
          // Usar datos extraídos temporalmente de notas
          calculatedQuote: {
            km: extractedQuote.km,
            tarifaBase: extractedQuote.tarifaBase,
            extras: extractedQuote.extras,
            total: extractedQuote.total,
            requiereSenia: extractedQuote.requiereSenia,
            montoSenia: extractedQuote.montoSenia
          },
          status: 'pending',
          createdAt: new Date(request.created_at),
          updatedAt: new Date(request.updated_at)
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
