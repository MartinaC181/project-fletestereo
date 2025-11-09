import { useState, useEffect } from 'react'
import { FreightHistoryService } from '@/src/lib/services/freight-history.service'
import { Database } from '@/src/integrations/supabase/types'

type FreightHistory = Database['public']['Tables']['freight_history']['Row']
type FreightHistoryInsert = Database['public']['Tables']['freight_history']['Insert']

interface FreightHistoryWithClient extends FreightHistory {
  clients: {
    id: string
    nombre: string
    apellido: string | null
    telefono: string
    email: string | null
  } | null
}

export function useFreightHistory(clientId?: string) {
  const [history, setHistory] = useState<FreightHistoryWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: serviceError } = await FreightHistoryService.getHistory(clientId)
      
      if (serviceError) {
        throw new Error('Error al cargar el historial')
      }
      
      setHistory(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const addFreightHistory = async (data: FreightHistoryInsert) => {
    try {
      const { data: newHistory, error: serviceError } = await FreightHistoryService.addFreightHistory(data)
      
      if (serviceError) {
        throw new Error('Error al agregar flete al historial')
      }
      
      // Recargar historial después de agregar
      await loadHistory()
      return { success: true, data: newHistory }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const deleteFreightHistory = async (id: string) => {
    try {
      const { error: serviceError } = await FreightHistoryService.deleteFreightHistory(id)
      
      if (serviceError) {
        throw new Error('Error al eliminar flete del historial')
      }
      
      // Recargar historial después de eliminar
      await loadHistory()
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    loadHistory()
  }, [clientId])

  return {
    history,
    loading,
    error,
    loadHistory,
    addFreightHistory,
    deleteFreightHistory
  }
}

export function useFreightHistoryStats(clientId?: string) {
  const [stats, setStats] = useState<{
    totalFletes: number
    totalIngresos: number
    promedioIngreso: number
    fletesCompletados: number
    fletesPendientes: number
    fletesCancelados: number
    ingresosPorMes: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: serviceError } = await FreightHistoryService.getHistoryStats(clientId)
      
      if (serviceError) {
        throw new Error('Error al cargar estadísticas')
      }
      
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [clientId])

  return {
    stats,
    loading,
    error,
    loadStats
  }
}