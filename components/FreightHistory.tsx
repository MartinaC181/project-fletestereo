'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Package, DollarSign, Clock, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

type FreightHistory = Database['public']['Tables']['freight_history']['Row']
type Client = Database['public']['Tables']['clients']['Row']

interface FreightHistoryWithClient extends FreightHistory {
  clients: Client | null
}

interface FreightHistoryProps {
  clientId?: string
}

export function FreightHistory({ clientId }: FreightHistoryProps) {
  const [history, setHistory] = useState<FreightHistoryWithClient[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>(clientId || '')
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    client_id: clientId || '',
    fecha_flete: new Date().toISOString().split('T')[0],
    origen: '',
    destino: '',
    peso: '',
    volumen: '',
    precio: '',
    observaciones: ''
  })

  useEffect(() => {
    loadHistory()
    if (!clientId) {
      loadClients()
    }
  }, [clientId, selectedClientId])

  const loadHistory = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('freight_history')
        .select(`
          *,
          clients (*)
        `)
        .order('fecha_flete', { ascending: false })

      if (clientId || selectedClientId) {
        query = query.eq('client_id', clientId || selectedClientId)
      }

      const { data, error } = await query

      if (error) throw error
      setHistory(data || [])
    } catch (error) {
      console.error('Error loading freight history:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de fletes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('nombre')

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('freight_history')
        .insert([{
          ...formData,
          precio: parseFloat(formData.precio),
          peso: formData.peso ? parseFloat(formData.peso) : null,
          volumen: formData.volumen ? parseFloat(formData.volumen) : null,
        }])

      if (error) throw error

      toast({
        title: "Éxito",
        description: "Flete agregado al historial"
      })

      setShowAddForm(false)
      setFormData({
        client_id: clientId || '',
        fecha_flete: new Date().toISOString().split('T')[0],
        origen: '',
        destino: '',
        peso: '',
        volumen: '',
        precio: '',
        observaciones: ''
      })
      loadHistory()
    } catch (error) {
      console.error('Error adding freight history:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar el flete al historial",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (estado: string) => {
    const statusColors = {
      completado: 'bg-green-500',
      pendiente: 'bg-yellow-500',
      cancelado: 'bg-red-500',
    }

    return (
      <Badge className={statusColors[estado as keyof typeof statusColors] || 'bg-gray-500'}>
        {estado}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Historial de Fletes</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Flete
        </Button>
      </div>

      {!clientId && (
        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClientId || "all"} onValueChange={(value) => setSelectedClientId(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nombre} {client.apellido} - {client.telefono}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Flete</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!clientId && (
                <div>
                  <Label htmlFor="client_id">Cliente *</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nombre} {client.apellido} - {client.telefono}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_flete">Fecha del Flete *</Label>
                  <Input
                    id="fecha_flete"
                    type="date"
                    value={formData.fecha_flete}
                    onChange={(e) => setFormData({ ...formData, fecha_flete: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="precio">Precio *</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origen">Origen *</Label>
                  <Input
                    id="origen"
                    placeholder="Dirección de origen"
                    value={formData.origen}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="destino">Destino *</Label>
                  <Input
                    id="destino"
                    placeholder="Dirección de destino"
                    value={formData.destino}
                    onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="volumen">Volumen (m³)</Label>
                  <Input
                    id="volumen"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.volumen}
                    onChange={(e) => setFormData({ ...formData, volumen: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Notas adicionales sobre el flete..."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Guardar Flete</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando historial...</p>
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay fletes en el historial</p>
            </CardContent>
          </Card>
        ) : (
          history.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(new Date(item.fecha_flete), 'dd/MM/yyyy', { locale: es })}
                    </span>
                    {getStatusBadge(item.estado)}
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold text-primary">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(item.precio)}
                  </div>
                </div>

                <div className="space-y-3">
                  {!clientId && item.clients && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Cliente:</span>
                      <span>{item.clients.nombre} {item.clients.apellido}</span>
                      <span>•</span>
                      <span>{item.clients.telefono}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Origen:</span> {item.origen}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Destino:</span> {item.destino}
                      </p>
                    </div>
                  </div>

                  {(item.peso || item.volumen) && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {item.peso && (
                        <span>
                          <Package className="h-4 w-4 inline mr-1" />
                          {item.peso} kg
                        </span>
                      )}
                      {item.volumen && (
                        <span>
                          📦 {item.volumen} m³
                        </span>
                      )}
                    </div>
                  )}

                  {item.observaciones && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{item.observaciones}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Registrado el {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}