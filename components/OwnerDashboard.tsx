import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, TrendingUp, Users, CheckCircle, Clock, X, Phone, Mail } from 'lucide-react';
import { FreightHistory } from '@/components/FreightHistory';
import { FreightHistoryStats } from '@/components/FreightHistoryStats';
import { freightService } from '@/modules/freight';
import { useToast } from '@/hooks/use-toast';
import type { 
  FreightRequest,
  PaymentEvent 
} from '@/core/events/domain-events';



/**
 * Dashboard del Administrador - Gestión de solicitudes de flete
 */
export const OwnerDashboard: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<FreightRequest[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Cargar solicitudes pendientes de la base de datos
  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      // Usar el servicio directamente para mejor rendimiento
      const requests = await freightService.getPendingRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes pendientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingRequests();
    
    // Recargar cada 30 segundos
    const interval = setInterval(loadPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  // Función para confirmar solicitud
  const handleConfirmRequest = async (requestId: string) => {
    try {
      setProcessingRequest(requestId);
      await freightService.updateFreightStatus(requestId, 'Confirmada');
      
      toast({
        title: "Solicitud Confirmada",
        description: "La solicitud ha sido confirmada exitosamente",
      });
      
      // Recargar lista
      await loadPendingRequests();
    } catch (error) {
      console.error('Error confirmando solicitud:', error);
      toast({
        title: "Error",
        description: "No se pudo confirmar la solicitud",
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  // Función para rechazar solicitud
  const handleRejectRequest = async (requestId: string) => {
    try {
      setProcessingRequest(requestId);
      await freightService.updateFreightStatus(requestId, 'Rechazada', 'Rechazada por administrador');
      
      toast({
        title: "Solicitud Rechazada",
        description: "La solicitud ha sido rechazada",
        variant: "destructive"
      });
      
      // Recargar lista
      await loadPendingRequests();
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud",
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  useEffect(() => {
    // Cargar datos mockeados de pagos para demostración
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

    setRecentPayments(mockPayments);
  }, []);



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
                  <span>Solicitudes Pendientes</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          console.log('🧪 Probando conexión directa...');
                          const { supabase } = await import('@/integrations/supabase/client');
                          const { count, error } = await supabase
                            .from('clients')
                            .select('*', { count: 'exact', head: true });
                          
                          if (error) {
                            console.error('❌ Error de conexión:', error);
                            toast({
                              title: "Error de Conexión",
                              description: error.message,
                              variant: "destructive"
                            });
                          } else {
                            console.log('✅ Conexión OK, clientes:', count);
                            toast({
                              title: "Conexión OK",
                              description: `Base de datos conectada. ${count} clientes registrados.`
                            });
                          }
                        } catch (e) {
                          console.error('❌ Error:', e);
                          toast({
                            title: "Error",
                            description: "Error de conexión: " + (e as Error).message,
                            variant: "destructive"
                          });
                        }
                      }}
                      className="text-xs"
                    >
                      Test BD
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadPendingRequests}
                      disabled={loading}
                    >
                      {loading ? 'Cargando...' : 'Actualizar'}
                    </Button>
                    <Badge>{pendingRequests.length}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-medium">Cargando solicitudes...</p>
                  </div>
                ) : pendingRequests.length === 0 ? (
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
                          <div>
                            <span className="font-medium">Tipo:</span> {request.quote.tipoServicio.replace('_', ' ')}
                          </div>
                          <div>
                            <span className="font-medium">Distancia:</span> {request.calculatedQuote.km} km
                          </div>
                        </div>

                        {/* Detalles de Cotización (Estructura Simplificada) */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <h4 className="font-semibold text-sm text-gray-700">Detalles de Cotización</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span>Tarifa base:</span>
                              <span>${request.calculatedQuote.tarifaBase?.toLocaleString()}</span>
                            </div>
                            {Object.entries(request.calculatedQuote.extras || {}).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                                <span>${(value as number).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-semibold border-t pt-1 col-span-2">
                              <span>Total:</span>
                              <span className="text-green-600">${request.calculatedQuote.total.toLocaleString()}</span>
                            </div>
                            {request.calculatedQuote.requiereSenia && (
                              <div className="flex justify-between text-orange-600 col-span-2">
                                <span>Seña requerida:</span>
                                <span>${request.calculatedQuote.montoSenia?.toLocaleString()}</span>
                              </div>
                            )}
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
                            disabled={processingRequest === request.id}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {processingRequest === request.id ? 'Confirmando...' : 'Confirmar'}
                          </Button>
                          <Button 
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={processingRequest === request.id}
                            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            {processingRequest === request.id ? 'Rechazando...' : 'Rechazar'}
                          </Button>
                          <Button 
                            variant="outline"
                            disabled
                            className="flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4" />
                            Contactar
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
