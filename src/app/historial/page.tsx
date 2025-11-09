'use client';

import { FreightHistory } from '@/src/components/FreightHistory'
import { FreightHistoryStats } from '@/src/components/FreightHistoryStats'
import { AdminProtected } from '@/src/components/AdminProtected'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import Header from '@/src/components/Header'
import Footer from '@/src/components/Footer'

export default function HistorialPage() {
  return (
    <AdminProtected requireAdmin={true}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Fletes</h1>
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
        </main>
        <Footer />
      </div>
    </AdminProtected>
  )
}