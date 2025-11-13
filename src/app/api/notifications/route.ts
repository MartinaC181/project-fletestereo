import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/src/lib/services/notification.service';
import { supabase } from '@/src/integrations/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { freightId, type, reason, linkPago, referenciaPago } = body;

    if (!freightId || !type) {
      return NextResponse.json(
        { error: 'freightId y type son requeridos' },
        { status: 400 }
      );
    }

    // Obtener datos completos del flete desde la base de datos
    const { data: freightData, error } = await supabase
      .from('requests')
      .select(`
        *,
        client:clients(
          id,
          nombre,
          apellido,
          telefono,
          email,
          dni
        )
      `)
      .eq('id', freightId)
      .single();

    if (error || !freightData) {
      console.error('[API] Error obteniendo datos del flete:', error);
      return NextResponse.json(
        { error: 'Flete no encontrado' },
        { status: 404 }
      );
    }

    // Mapeo de estados de español a inglés
    const statusMap: Record<string, string> = {
      'Solicitada': 'pending',
      'Señada': 'senia_requested', 
      'Confirmada': 'confirmed',
      'Rechazada': 'rejected',
      'Completada': 'completed',
      'Cancelada': 'cancelled',
      'Pendiente_Seña': 'senia_requested',
      'Seña_Solicitada': 'senia_requested',
      'Seña_Pagada': 'senia_paid',
      'Confirmada_Final': 'confirmed_final'
    };

    // Convertir datos de Supabase al formato FreightRequest
    const freightRequest = {
      id: freightData.id,
      clientId: freightData.client_id || freightData.client?.id,
      origen: freightData.origen,
      destino: freightData.destino,
      fecha: freightData.fecha,
      franja: freightData.franja,
      tipoServicio: freightData.carga_tipo as any,
      pisosEscalera: (freightData as any).pisos_escalera || 0,
      notas: freightData.notas,
      estado: freightData.estado,
      status: (statusMap[freightData.estado] || 'pending') as 'pending' | 'confirmed' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'senia_requested' | 'senia_paid' | 'confirmed_final',
      client: {
        ...freightData.client,
        dni: freightData.client?.dni || ''
      },
      quote: {
        origen: freightData.origen,
        destino: freightData.destino,
        fecha: freightData.fecha,
        franja: freightData.franja,
        tipoServicio: freightData.carga_tipo as any,
        pisosEscalera: (freightData as any).pisos_escalera || 0,
        notas: freightData.notas
      },
      calculatedQuote: {
        total: freightData.total || 0,
        km: 0,
        tarifaBase: 0,
        extras: {},
        requiereSenia: false,
        montoSenia: 0
      },
      createdAt: new Date(freightData.created_at || new Date().toISOString()),
      updatedAt: new Date(freightData.updated_at || new Date().toISOString())
    };

    // Enviar la notificación correspondiente
    switch (type) {
      case 'admin_new_freight':
        await notificationService.notifyAdminNewFreight(freightRequest);
        break;
      case 'client_confirmed':
        await notificationService.notifyClientFreightConfirmed(freightRequest);
        break;
      case 'client_rejected':
        if (!reason) {
          return NextResponse.json(
            { error: 'reason es requerido para rechazos' },
            { status: 400 }
          );
        }
        await notificationService.notifyClientFreightRejected(freightRequest, reason);
        break;
      case 'client_senia_required':
        if (!linkPago) {
          return NextResponse.json(
            { error: 'linkPago es requerido para solicitar seña' },
            { status: 400 }
          );
        }
        // Por ahora usamos un objeto simple adaptado
        const simpleFreightRequest = {
          id: freightData.id,
          client: freightData.client,
          quote: {
            origen: freightData.origen,
            destino: freightData.destino,
            fecha: freightData.fecha,
            franja: freightData.franja
          },
          calculatedQuote: {
            total: 0 // Agregar valor por defecto
          },
          montoSenia: 0 // Por determinar
        };
        await notificationService.notifyClientSeniaRequired(simpleFreightRequest as any, linkPago);
        break;
      case 'admin_senia_paid':
        // TODO: Implementar cuando se arreglen los tipos
        console.log('[API] admin_senia_paid - Pendiente de implementar');
        break;
      case 'client_service_confirmed':
        // Crear objeto simplificado para la confirmación final
        const finalFreightRequest = {
          id: freightData.id,
          client: freightData.client,
          quote: {
            origen: freightData.origen,
            destino: freightData.destino,
            fecha: freightData.fecha,
            franja: freightData.franja
          },
          calculatedQuote: {
            total: 0 // Por determinar
          },
          montoSenia: 0 // Por determinar
        };
        await notificationService.notifyClientServiceConfirmedAfterSenia(finalFreightRequest as any);
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de notificación no válido' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error en endpoint de notificaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}