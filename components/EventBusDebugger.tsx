'use client';

import { useState, useEffect } from 'react';
import { eventBus } from '@/core/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertTriangle, Info } from 'lucide-react';

interface EventBusStats {
  totalHandlers: number;
  totalOnceHandlers: number;
  queueSize: number;
  stackSize: number;
  isEmitting: boolean;
}

export const EventBusDebugger = () => {
  const [stats, setStats] = useState<EventBusStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'development') return;

    const updateStats = () => {
      setStats(eventBus.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);

    // Mostrar si hay problemas
    const checkForProblems = () => {
      const currentStats = eventBus.getStats();
      if (currentStats.queueSize > 10 || currentStats.stackSize > 5) {
        setIsVisible(true);
      }
    };

    const problemInterval = setInterval(checkForProblems, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(problemInterval);
    };
  }, []);

  const handleReset = () => {
    eventBus.reset();
    setStats(eventBus.getStats());
    console.log('🔄 EventBus reiniciado manualmente');
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (process.env.NODE_ENV !== 'development') return null;

  const hasProblems = stats && (stats.queueSize > 10 || stats.stackSize > 5 || stats.totalHandlers > 50);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante para mostrar/ocultar */}
      <button
        onClick={handleToggleVisibility}
        className={`mb-2 px-3 py-1 rounded text-sm font-medium ${
          hasProblems 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } ${hasProblems ? 'animate-pulse' : ''}`}
      >
        {hasProblems ? (
          <AlertTriangle className="h-4 w-4 inline mr-1" />
        ) : (
          <Info className="h-4 w-4 inline mr-1" />
        )}
        EventBus
      </button>

      {/* Panel de estadísticas */}
      {isVisible && stats && (
        <Card className="w-80 bg-background/95 backdrop-blur-sm border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              EventBus Debugger
              <button
                onClick={handleReset}
                className="h-8 w-8 p-0 rounded hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-medium">Handlers:</div>
                <div className={stats.totalHandlers > 30 ? 'text-orange-500' : 'text-green-500'}>
                  {stats.totalHandlers}
                </div>
              </div>
              <div>
                <div className="font-medium">Once Handlers:</div>
                <div className="text-blue-500">{stats.totalOnceHandlers}</div>
              </div>
              <div>
                <div className="font-medium">Queue Size:</div>
                <div className={stats.queueSize > 10 ? 'text-red-500' : 'text-green-500'}>
                  {stats.queueSize}
                </div>
              </div>
              <div>
                <div className="font-medium">Stack Size:</div>
                <div className={stats.stackSize > 5 ? 'text-red-500' : 'text-green-500'}>
                  {stats.stackSize}
                </div>
              </div>
            </div>
            
            <div className="mt-2 p-2 rounded bg-muted">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stats.isEmitting ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-xs">
                  {stats.isEmitting ? 'Emitiendo eventos...' : 'En espera'}
                </span>
              </div>
            </div>

            {hasProblems && (
              <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    Posible bucle detectado
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full mt-2 h-6 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reiniciar EventBus
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};