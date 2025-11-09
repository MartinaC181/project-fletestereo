import { supabase } from '@/src/integrations/supabase/client'
import { Database } from '@/src/integrations/supabase/types'

type FreightHistory = Database['public']['Tables']['freight_history']['Row']
type FreightHistoryInsert = Database['public']['Tables']['freight_history']['Insert']
type FreightHistoryUpdate = Database['public']['Tables']['freight_history']['Update']

export class FreightHistoryService {
  /**
   * Obtiene el historial de fletes, opcionalmente filtrado por cliente
   */
  static async getHistory(clientId?: string) {
    try {
      let query = supabase
        .from('freight_history')
        .select(`
          *,
          clients (
            id,
            nombre,
            apellido,
            telefono,
            email
          )
        `)
        .order('fecha_flete', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching freight history:', error)
      return { data: null, error }
    }
  }

  /**
   * Obtiene el historial de un cliente específico
   */
  static async getClientHistory(clientId: string) {
    return this.getHistory(clientId)
  }

  /**
   * Agrega un nuevo flete al historial
   */
  static async addFreightHistory(data: FreightHistoryInsert) {
    try {
      const { data: result, error } = await supabase
        .from('freight_history')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return { data: result, error: null }
    } catch (error) {
      console.error('Error adding freight history:', error)
      return { data: null, error }
    }
  }

  /**
   * Actualiza un registro del historial
   */
  static async updateFreightHistory(id: string, updates: FreightHistoryUpdate) {
    try {
      const { data, error } = await supabase
        .from('freight_history')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating freight history:', error)
      return { data: null, error }
    }
  }

  /**
   * Elimina un registro del historial
   */
  static async deleteFreightHistory(id: string) {
    try {
      const { error } = await supabase
        .from('freight_history')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting freight history:', error)
      return { error }
    }
  }

  /**
   * Obtiene estadísticas del historial de fletes
   */
  static async getHistoryStats(clientId?: string) {
    try {
      let query = supabase
        .from('freight_history')
        .select('precio, estado, fecha_flete')

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error

      if (!data) return { data: null, error: 'No data found' }

      // Calcular estadísticas
      const totalFletes = data.length
      const totalIngresos = data.reduce((sum, item) => sum + item.precio, 0)
      const promedioIngreso = totalFletes > 0 ? totalIngresos / totalFletes : 0
      
      const fletesCompletados = data.filter(item => item.estado === 'completado').length
      const fletesPendientes = data.filter(item => item.estado === 'pendiente').length
      const fletesCancelados = data.filter(item => item.estado === 'cancelado').length

      // Ingresos por mes (últimos 6 meses)
      const now = new Date()
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      
      const ingresosPorMes = data
        .filter(item => new Date(item.fecha_flete) >= sixMonthsAgo)
        .reduce((acc, item) => {
          const fecha = new Date(item.fecha_flete)
          const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
          acc[mesAno] = (acc[mesAno] || 0) + item.precio
          return acc
        }, {} as Record<string, number>)

      return {
        data: {
          totalFletes,
          totalIngresos,
          promedioIngreso,
          fletesCompletados,
          fletesPendientes,
          fletesCancelados,
          ingresosPorMes
        },
        error: null
      }
    } catch (error) {
      console.error('Error calculating history stats:', error)
      return { data: null, error }
    }
  }

  /**
   * Crea automáticamente un registro de historial cuando una solicitud se completa
   */
  static async createFromCompletedRequest(requestId: string) {
    try {
      // Obtener los datos de la solicitud y cotización
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select(`
          *,
          quotes (*)
        `)
        .eq('id', requestId)
        .single()

      if (requestError || !requestData) {
        throw new Error('Request not found')
      }

      // Obtener la cotización más reciente
      const latestQuote = requestData.quotes?.[requestData.quotes.length - 1]

      if (!latestQuote) {
        throw new Error('No quote found for request')
      }

      // Crear el registro de historial
      const historyData: FreightHistoryInsert = {
        client_id: requestData.client_id!,
        request_id: requestData.id,
        fecha_flete: requestData.fecha,
        origen: requestData.origen,
        destino: requestData.destino,
        precio: latestQuote.total,
        estado: 'completado',
        observaciones: requestData.notas
      }

      return this.addFreightHistory(historyData)
    } catch (error) {
      console.error('Error creating history from completed request:', error)
      return { data: null, error }
    }
  }
}