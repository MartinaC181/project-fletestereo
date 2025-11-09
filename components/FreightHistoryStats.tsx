'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Package, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useFreightHistoryStats } from '@/hooks/useFreightHistory'

interface FreightHistoryStatsProps {
  clientId?: string
}

export function FreightHistoryStats({ clientId }: FreightHistoryStatsProps) {
  const { stats, loading, error } = useFreightHistoryStats(clientId)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {error || 'No se pudieron cargar las estadísticas'}
          </p>
        </CardContent>
      </Card>
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
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fletes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFletes}</div>
            <p className="text-xs text-muted-foreground">
              Fletes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalIngresos)}</div>
            <p className="text-xs text-muted-foreground">
              Revenue acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Flete</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.promedioIngreso)}</div>
            <p className="text-xs text-muted-foreground">
              Valor promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalFletes > 0 ? Math.round((stats.fletesCompletados / stats.totalFletes) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Fletes completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de fletes */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Fletes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completados
              </Badge>
              <span className="text-sm font-medium">{stats.fletesCompletados}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500">
                <Clock className="h-3 w-3 mr-1" />
                Pendientes
              </Badge>
              <span className="text-sm font-medium">{stats.fletesPendientes}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500">
                <XCircle className="h-3 w-3 mr-1" />
                Cancelados
              </Badge>
              <span className="text-sm font-medium">{stats.fletesCancelados}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingresos por mes */}
      {Object.keys(stats.ingresosPorMes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Mes (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.ingresosPorMes)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([mes, ingresos]) => {
                  const [año, mesNum] = mes.split('-')
                  const fechaMes = new Date(parseInt(año), parseInt(mesNum) - 1)
                  const nombreMes = fechaMes.toLocaleDateString('es-AR', { 
                    month: 'long', 
                    year: 'numeric' 
                  })
                  
                  return (
                    <div key={mes} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{nombreMes}</span>
                      <span className="text-sm font-bold">{formatCurrency(ingresos)}</span>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}