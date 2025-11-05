import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { 
  FreightRequest,
  PaymentEvent 
} from '@/core/events/domain-events';

interface PendingRequest extends FreightRequest {
  receivedAt: Date;
}

/**
 * Ejemplo de Bandeja del Dueño - Nueva funcionalidad agregada
 * sin modificar código existente, solo suscribiéndose a eventos
 */
export const OwnerDashboard: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentEvent[]>([]);

  useEffect(() => {
    // Cargar datos mockeados para demostración (estructura real de la BD)
    const mockPendingRequests: PendingRequest[] = [
      {
        id: '1',
        clientId: 'client1',
        client: {
          id: 'client1',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '379-123-4567',
          email: 'juan@email.com',
          dni: '12345678'
        },
        quote: {
          origen: 'Corrientes Capital',
          destino: 'Mburucuyá',
          fecha: '2025-11-04',
          tipoServicio: 'mudanza_completa' as const,
          pisosEscalera: 1,
          franja: 'dia',
          notas: 'Carga frágil, manejar con cuidado'
        },
        calculatedQuote: {
          km: 45,
          tarifaBase: 5000,
          extras: { pisos_escalera: 5000 },
          total: 15000,
          requiereSenia: true,
          montoSenia: 4500
        },
        status: 'pending',
        createdAt: new Date('2025-11-02T10:30:00'),
        updatedAt: new Date('2025-11-02T10:30:00'),
        receivedAt: new Date('2025-11-02T10:30:00')
      },
      {
        id: '2', 
        clientId: 'client2',
        client: {
          id: 'client2',
          nombre: 'María',
          apellido: 'García',
          telefono: '379-765-4321', 
          email: 'maria@email.com',
          dni: '87654321'
        },
        quote: {
          origen: 'Goya',
          destino: 'Resistencia',
          fecha: '2025-11-05',
          tipoServicio: 'viaje_largo' as const,
          pisosEscalera: 2,
          franja: 'dia',
          notas: 'Mudanza completa - muebles y electrodomésticos'
        },
        calculatedQuote: {
          km: 120,
          tarifaBase: 5000,
          extras: { cargaPesada: 2000, ayudanteExtra: 1500 },
          total: 22000,
          requiereSenia: true,
          montoSenia: 6600
        },
        status: 'pending',
        createdAt: new Date('2025-11-02T14:15:00'),
        updatedAt: new Date('2025-11-02T14:15:00'), 
        receivedAt: new Date('2025-11-02T14:15:00')
      },
      {
        id: '3',
        clientId: 'client3', 
        client: {
          id: 'client3',
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          telefono: '379-555-9876',
          email: 'carlos@email.com',
          dni: '11223344'
        },
        quote: {
          origen: 'Paso de los Libres',
          destino: 'Corrientes Capital',
          fecha: '2025-11-06',
          tipoServicio: 'flete_liviano' as const,
          pisosEscalera: 0,
          franja: 'noche'
        },
        calculatedQuote: {
          km: 85,
          tarifaBase: 5000,
          extras: { franjaHoraria: 1000 },
          total: 10250,
          requiereSenia: false,
          montoSenia: 0
        },
        status: 'pending',
        createdAt: new Date('2025-11-03T08:45:00'),
        updatedAt: new Date('2025-11-03T08:45:00'),
        receivedAt: new Date('2025-11-03T08:45:00')
      }
    ];

    const mockPayments: PaymentEvent[] = [
      {
        id: '1',
        type: 'payment.completed',
        payload: {
          paymentId: 'pay1',
          freightRequestId: 'req1',
          amount: 18000,
          currency: 'ARS',
          paymentMethod: 'transfer',
          status: 'completed'
        },
        timestamp: new Date()
      }
    ];

    setPendingRequests(mockPendingRequests);
    setRecentPayments(mockPayments);
  }, []);

  const handleConfirmRequest = async (requestId: string) => {
    try {
      // Simular confirmación - en una aplicación real actualizarías la base de datos
      setPendingRequests(prev => 
        prev.filter(req => req.id !== requestId)
      );
      console.log(`✅ Solicitud ${requestId} confirmada`);
    } catch (error) {
      console.error('Error confirmando solicitud:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // Simular rechazo - en una aplicación real actualizarías la base de datos
      setPendingRequests(prev => 
        prev.filter(req => req.id !== requestId)
      );
      console.log(`❌ Solicitud ${requestId} rechazada`);
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
    }
  };

  const handleInitiatePayment = async (request: PendingRequest) => {
    try {
      // Simular inicio de pago
      console.log(`💰 Iniciando pago para solicitud ${request.id} por $${request.calculatedQuote.total}`);
    } catch (error) {
      console.error('Error iniciando pago:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Bandeja del Dueño</h1>
      
      {/* Solicitudes Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Solicitudes Pendientes
            <Badge>{pendingRequests.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground">No hay solicitudes pendientes</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {request.client.nombre} {request.client.apellido}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {request.client.telefono} • {request.client.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        DNI: {request.client.dni}
                      </p>
                    </div>
                    <Badge>
                      ${request.calculatedQuote.total.toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Origen:</span> {request.quote.origen}
                    </div>
                    <div>
                      <span className="font-medium">Destino:</span> {request.quote.destino}
                    </div>
                    <div>
                      <span className="font-medium">Fecha:</span> {
                        new Date(request.quote.fecha).toLocaleDateString('es-AR')
                      }
                    </div>
                    <div>
                      <span className="font-medium">Franja:</span> {request.quote.franja}
                    </div>
                  </div>

                  {request.quote.notas && (
                    <div className="text-sm">
                      <span className="font-medium">Notas:</span> {request.quote.notas}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleConfirmRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmar
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Rechazar
                    </Button>
                    <Button 
                      onClick={() => handleInitiatePayment(request)}
                    >
                      Solicitar Pago
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagos Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Pagos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="text-muted-foreground">No hay pagos recientes</p>
          ) : (
            <div className="space-y-2">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">${payment.payload.amount.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {payment.payload.paymentMethod}
                    </span>
                  </div>
                  <Badge>
                    {payment.payload.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
