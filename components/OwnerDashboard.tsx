import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEventBus } from '@/components/EventBusProvider';
import { freightService } from '@/modules/freight';
import { paymentService } from '@/modules/payments';
import type { 
  FreightRequestCreatedEvent, 
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
  const eventBus = useEventBus();

  useEffect(() => {
    // Escuchar nuevas solicitudes de flete
    const freightSubscription = eventBus.subscribe('freight.request.created', 
      (event: FreightRequestCreatedEvent) => {
        const newRequest: PendingRequest = {
          ...event.payload.freightRequest,
          receivedAt: event.timestamp
        };
        
        setPendingRequests(prev => [newRequest, ...prev]);
        
        // Opcional: Mostrar notificación al dueño
        console.log('🔔 Nueva solicitud de flete recibida:', newRequest.id);
      }
    );

    // Escuchar pagos completados
    const paymentSubscription = eventBus.subscribe('payment.completed',
      (event: PaymentEvent) => {
        setRecentPayments(prev => [event, ...prev.slice(0, 4)]); // Mantener solo 5 más recientes
      }
    );

    // Escuchar confirmaciones para remover de pendientes
    const confirmSubscription = eventBus.subscribe('freight.confirmed',
      (event) => {
        setPendingRequests(prev => 
          prev.filter(req => req.id !== event.payload.freightRequestId)
        );
      }
    );

    const rejectSubscription = eventBus.subscribe('freight.rejected',
      (event) => {
        setPendingRequests(prev => 
          prev.filter(req => req.id !== event.payload.freightRequestId)
        );
      }
    );

    // Cleanup
    return () => {
      freightSubscription.unsubscribe();
      paymentSubscription.unsubscribe();
      confirmSubscription.unsubscribe();
      rejectSubscription.unsubscribe();
    };
  }, [eventBus]);

  const handleConfirmRequest = async (requestId: string) => {
    try {
      await freightService.confirmFreightRequest(
        requestId,
        'owner_manual',
        new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
        'Confirmado manualmente por el dueño'
      );
    } catch (error) {
      console.error('Error confirmando solicitud:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await freightService.rejectFreightRequest(
        requestId,
        'owner_manual',
        'No disponible en esa fecha'
      );
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
    }
  };

  const handleInitiatePayment = async (request: PendingRequest) => {
    try {
      await paymentService.initiatePayment({
        freightRequestId: request.id,
        amount: request.calculatedQuote.total,
        currency: 'CLP',
        paymentMethod: 'credit_card',
        clientId: request.clientId
      });
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
            <Badge variant="secondary">{pendingRequests.length}</Badge>
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
                    </div>
                    <Badge variant="outline">
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
                      <span className="font-medium">Fecha:</span> {request.quote.fecha}
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
                      variant="destructive"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Rechazar
                    </Button>
                    <Button 
                      variant="outline"
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
                  <Badge variant={payment.payload.status === 'completed' ? 'default' : 'destructive'}>
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
