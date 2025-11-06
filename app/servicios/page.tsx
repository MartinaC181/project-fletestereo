'use client'

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Truck, Home, Package, MapPin, Clock, Shield, CheckCircle, Star, ArrowRight, Phone, Plus, Edit, Trash2, X } from "lucide-react";
import { servicesService } from "@/modules/services/ServicesService";
import { Service } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const advantages = [
  { icon: <Shield className="h-8 w-8 text-primary" />, title: "Totalmente Asegurado", description: "Todos nuestros servicios incluyen seguro completo contra daños y pérdidas." },
  { icon: <Clock className="h-8 w-8 text-primary" />, title: "Puntualidad Garantizada", description: "Cumplimos con los horarios acordados. Tu tiempo es valioso para nosotros." },
  { icon: <Star className="h-8 w-8 text-primary" />, title: "Calidad Certificada", description: "Más de 1000 clientes satisfechos nos avalan con 4.9/5 estrellas." }
];

// Mapeo de iconos basado en el nombre del servicio
const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes('completa')) return <Home className="h-12 w-12 text-accent-orange" />;
  if (name.includes('flete') && name.includes('largo')) return <MapPin className="h-12 w-12 text-accent-orange" />;
  if (name.includes('flete') && name.includes('corto')) return <Truck className="h-12 w-12 text-accent-orange" />;
  if (name.includes('mini')) return <Package className="h-12 w-12 text-accent-orange" />;
  return <Truck className="h-12 w-12 text-accent-orange" />;
};

interface ServiceFormData {
  nombre: string;
  descripcion: string;
  caracteristicas: string;
  precio: string;
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<ServiceFormData>({
    nombre: '',
    descripcion: '',
    caracteristicas: '',
    precio: ''
  });

  useEffect(() => {
    // Solo cargar servicios cuando la autenticación haya terminado de cargar
    if (!authLoading) {
      loadServices();
    }
  }, [isAdmin, authLoading]);

  const loadServices = async () => {
    try {
      setLoading(true);
      // Si es admin, cargar TODOS los servicios (activos e inactivos)
      // Si no es admin, solo cargar servicios activos
      const data = isAdmin 
        ? await servicesService.getAllServices()
        : await servicesService.getActiveServices();
      setServices(data);
    } catch (error) {
      console.error('Error cargando servicios:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nombre: service.nombre,
        descripcion: service.descripcion,
        caracteristicas: service.caracteristicas.join('\n'),
        precio: service.precio
      });
    } else {
      setEditingService(null);
      setFormData({
        nombre: '',
        descripcion: '',
        caracteristicas: '',
        precio: ''
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingService(null);
    setFormData({
      nombre: '',
      descripcion: '',
      caracteristicas: '',
      precio: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.descripcion || !formData.caracteristicas || !formData.precio) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const caracteristicasArray = formData.caracteristicas
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (caracteristicasArray.length === 0) {
        toast({
          title: "Error",
          description: "Debes agregar al menos una característica",
          variant: "destructive"
        });
        return;
      }

      const serviceData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        caracteristicas: caracteristicasArray,
        precio: formData.precio,
        activo: true
      };

      if (editingService) {
        await servicesService.updateService(editingService.id, serviceData);
        toast({
          title: "Éxito",
          description: "Servicio actualizado correctamente"
        });
      } else {
        await servicesService.createService(serviceData);
        toast({
          title: "Éxito",
          description: "Servicio creado correctamente"
        });
      }

      handleCloseDialog();
      loadServices();
    } catch (error) {
      console.error('Error guardando servicio:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el servicio. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (service: Service) => {
    setDeletingService(service);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;

    try {
      await servicesService.deleteService(deletingService.id);
      toast({
        title: "Éxito",
        description: "Servicio desactivado correctamente"
      });
      setShowDeleteDialog(false);
      setDeletingService(null);
      loadServices();
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      toast({
        title: "Error",
        description: "No se pudo desactivar el servicio. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleActivateService = async (service: Service) => {
    try {
      await servicesService.restoreService(service.id);
      toast({
        title: "Éxito",
        description: "Servicio activado correctamente"
      });
      loadServices();
    } catch (error) {
      console.error('Error activando servicio:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el servicio. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20">
            {!isAdmin && (
              <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent-orange-light/10 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                  <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">Nuestros<span className="block text-accent-orange">Servicios</span></h1>
                    <p className="text-lg lg:text-xl text-muted-foreground mb-8">Ofrecemos soluciones completas de transporte y logística adaptadas a tus necesidades específicas. Profesionalismo, seguridad y eficiencia en cada servicio.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/solicitar-flete"><Button variant="hero" size="lg" className="w-full sm:w-auto">Solicitar Cotización <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
                      <Button variant="outline" size="lg" className="w-full sm:w-auto"><Phone className="mr-2 h-5 w-5" />Llamar Ahora</Button>
                    </div>
                  </div>
                </div>
              </section>
            )}
            
            <section className="py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {isAdmin && (
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Gestión de Servicios</h1>
                    <p className="text-muted-foreground mb-6">Administra los servicios ofrecidos en la plataforma</p>
                    <div className="flex justify-end">
                      <Button variant="hero" onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Servicio
                      </Button>
                    </div>
                  </div>
                )}

                {!isAdmin && (
                  <div className="mb-8 flex justify-end">
                    <Button variant="hero" onClick={() => handleOpenDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Servicio
                    </Button>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando servicios...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-xl text-muted-foreground">No hay servicios disponibles en este momento.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service) => (
                      <Card 
                        key={service.id} 
                        className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md relative ${
                          !service.activo ? 'opacity-60 bg-muted/30' : ''
                        }`}
                      >
                        {!service.activo && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-red-300 dark:border-red-700">
                              Inactivo
                            </Badge>
                          </div>
                        )}
                        
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-2 z-10">
                            {!service.activo ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivateService(service)}
                                className="h-8 px-3 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activar
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenDialog(service)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteClick(service)}
                                  className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                        
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl transition-colors ${
                              service.activo 
                                ? 'bg-accent-orange/10 group-hover:bg-accent-orange/20' 
                                : 'bg-gray-300 dark:bg-gray-700'
                            }`}>
                              {getServiceIcon(service.nombre)}
                            </div>
                            <div className="flex-1 pr-20">
                              <CardTitle className={`text-xl mb-2 ${
                                service.activo ? 'text-primary' : 'text-muted-foreground line-through'
                              }`}>
                                {service.nombre}
                              </CardTitle>
                              <CardDescription className="text-base">{service.descripcion}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {service.caracteristicas.map((feature, fIndex) => (
                              <li key={fIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className={`h-4 w-4 flex-shrink-0 ${
                                  service.activo ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div>
                              <p className={`text-lg font-semibold ${
                                service.activo ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                                {service.precio}
                              </p>
                            </div>
                            {service.activo && (
                              <Link href="/solicitar-flete">
                                <Button variant="outline" size="sm">Cotizar</Button>
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </section>
            
            {!isAdmin && (
              <section className="py-16 lg:py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">¿Por qué elegirnos?</h2>
                    <p className="text-lg text-muted-foreground">Años de experiencia nos avalan como líderes en transporte y logística</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {advantages.map((adv, index) => (
                      <div key={index} className="text-center space-y-4">
                        <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">{adv.icon}</div>
                        <h3 className="text-xl font-semibold text-primary">{adv.title}</h3>
                        <p className="text-muted-foreground">{adv.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>
          {!isAdmin && <Footer />}

          {/* Dialog para Crear/Editar Servicio */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Modifica los datos del servicio' : 'Completa los datos del nuevo servicio'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Servicio *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Mudanza Completa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Describe el servicio en detalle"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="caracteristicas">Características (una por línea) *</Label>
                  <Textarea
                    id="caracteristicas"
                    value={formData.caracteristicas}
                    onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                    placeholder="Personal capacitado&#10;Embalaje incluido&#10;Seguro de mercadería"
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Escribe cada característica en una línea nueva</p>
                </div>

                <div>
                  <Label htmlFor="precio">Precio *</Label>
                  <Input
                    id="precio"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="Ej: $80.000 o Desde $25.000"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={submitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="hero" disabled={submitting}>
                    {submitting ? 'Guardando...' : (editingService ? 'Actualizar' : 'Crear')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dialog de Confirmación para Eliminar */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Desactivar servicio?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción desactivará el servicio &quot;{deletingService?.nombre}&quot;. 
                  El servicio no será visible para los clientes, pero podrás reactivarlo cuando quieras.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                  Desactivar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}