import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/src/lib/services/notification.service';
import { supabase } from '@/src/integrations/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { freightId, type, reason } = await request.json();

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
          email
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

    // Convertir datos de Supabase al formato FreightRequest
    const freightRequest = {
      id: freightData.id,
      origen: freightData.origen,
      destino: freightData.destino,
      fecha: freightData.fecha,
      franja: freightData.franja,
      tipoServicio: freightData.tipo_servicio,
      pisosEscalera: freightData.pisos_escalera || 0,
      notas: freightData.notas,
      estado: freightData.estado,
      client: freightData.client,
      calculatedQuote: {
        total: freightData.precio_total
      }
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