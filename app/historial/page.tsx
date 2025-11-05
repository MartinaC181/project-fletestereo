'use client';

import { FreightHistory } from '@/components/FreightHistory'
import { FreightHistoryStats } from '@/components/FreightHistoryStats'
import { AdminProtected } from '@/components/AdminProtected'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HistorialPage() {
  return (
    <AdminProtected requireAdmin={true}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Fletes</h1>
          <p className="text-muted-foreground">
            Administra y consulta el historial completo de fletes realizados - Solo Administradores
          </p>
        </div>

        <Tabs defaultValue="historial" className="space-y-6">
          <TabsList>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="historial">
            <FreightHistory />
          </TabsContent>
          
          <TabsContent value="estadisticas">
            <FreightHistoryStats />
          </TabsContent>
        </Tabs>
      </div>
    </AdminProtected>
  )
}