import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { FreightHistory } from '@/components/FreightHistory';
import { FreightHistoryStats } from '@/components/FreightHistoryStats';
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
  const { user, signOut } = useAuth();

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
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Panel de control - FleteEstereo (Solo Administradores)</p>
              {user && (
                <p className="text-sm text-gray-500">
                  Bienvenido, {user.email} - <span className="font-semibold text-blue-600">Admin</span>
                </p>
              )}
            </div>
            <Button 
              onClick={signOut} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido del Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="solicitudes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solicitudes" className="space-y-6">
            {/* Resumen Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Solicitudes Pendientes</p>
                      <p className="text-2xl font-bold">{pendingRequests.length}</p>
                      <p className="text-xs text-blue-600">
                        ${pendingRequests.reduce((sum, req) => sum + req.calculatedQuote.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Pagos Recientes</p>
                      <p className="text-2xl font-bold">{recentPayments.length}</p>
                      <p className="text-xs text-green-600">
                        ${recentPayments.reduce((sum, payment) => sum + payment.payload.amount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                      <p className="text-2xl font-bold">
                        {new Set(pendingRequests.map(req => req.client.id)).size}
                      </p>
                      <p className="text-xs text-purple-600">Únicos hoy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ingresos Potenciales</p>
                      <p className="text-2xl font-bold">
                        ${(pendingRequests.reduce((sum, req) => sum + req.calculatedQuote.total, 0) + 
                           recentPayments.reduce((sum, payment) => sum + payment.payload.amount, 0)).toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600">Total del día</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">No hay solicitudes pendientes</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Todas las solicitudes han sido procesadas
                    </p>
                  </div>
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
          </TabsContent>

          <TabsContent value="pagos" className="space-y-6">
            {/* Estadísticas de Pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Pagos Completados</p>
                      <p className="text-2xl font-bold">
                        {recentPayments.filter(p => p.payload.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ingresos del Día</p>
                      <p className="text-2xl font-bold">
                        ${recentPayments.reduce((sum, payment) => sum + payment.payload.amount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Promedio por Pago</p>
                      <p className="text-2xl font-bold">
                        ${recentPayments.length > 0 ? 
                          Math.round(recentPayments.reduce((sum, payment) => sum + payment.payload.amount, 0) / recentPayments.length).toLocaleString() 
                          : '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pagos Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pagos Recientes
                  <Badge>{recentPayments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">No hay pagos recientes</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Los pagos aparecerán aquí cuando se procesen
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold">${payment.payload.amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {payment.payload.paymentMethod} • ID: {payment.payload.paymentId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payment.timestamp.toLocaleDateString('es-AR')} {payment.timestamp.toLocaleTimeString('es-AR')}
                              </p>
                            </div>
                          </div>
                          <Badge className={payment.payload.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {payment.payload.status === 'completed' ? 'Completado' : payment.payload.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial" className="space-y-6">
            <FreightHistory />
          </TabsContent>

          <TabsContent value="estadisticas" className="space-y-6">
            <FreightHistoryStats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
