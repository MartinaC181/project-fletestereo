import { NextRequest, NextResponse } from 'next/server';
import { freightService } from '@/src/modules/freight';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Obteniendo solicitudes pendientes...');
    
    const pendingRequests = await freightService.getPendingRequests();
    
    return NextResponse.json({
      success: true,
      data: pendingRequests
    });
    
  } catch (error) {
    console.error('[API] Error obteniendo solicitudes:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { requestId, status, reason } = await request.json();
    
    if (!requestId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan parámetros requeridos'
        },
        { status: 400 }
      );
    }

    if (!['Confirmada', 'Rechazada'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Estado no válido'
        },
        { status: 400 }
      );
    }

    console.log(`[API] Actualizando solicitud ${requestId} a ${status}`);
    
    await freightService.updateFreightStatus(requestId, status, reason);
    
    return NextResponse.json({
      success: true,
      message: `Solicitud ${status.toLowerCase()} exitosamente`
    });
    
  } catch (error) {
    console.error('[API] Error actualizando solicitud:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}