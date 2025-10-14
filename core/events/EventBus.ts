import type { 
  IEventBus, 
  BaseEvent, 
  EventHandler, 
  EventSubscription, 
  EventType 
} from './types';

/**
 * Implementación del Event Bus para Fletestereo
 * 
 * Este Event Bus permite el desacoplamiento de componentes mediante
 * un sistema de eventos asíncronos. Los módulos pueden emitir eventos
 * sin conocer qué otros módulos los consumirán.
 */
export class EventBus implements IEventBus {
  private handlers: Map<EventType, Set<EventHandler<any>>> = new Map();
  private onceHandlers: Map<EventType, Set<EventHandler<any>>> = new Map();
  private isEmitting = false;
  private eventQueue: BaseEvent[] = [];

  constructor(private logger?: (message: string, data?: any) => void) {}

  /**
   * Emite un evento a todos los suscriptores
   */
  async emit<T extends BaseEvent>(event: T): Promise<void> {
    this.log(`Emitiendo evento: ${event.type}`, event);

    // Si ya estamos emitiendo, agregamos a la cola para evitar recursión
    if (this.isEmitting) {
      this.eventQueue.push(event);
      return;
    }

    this.isEmitting = true;

    try {
      await this.processEvent(event);
      
      // Procesar eventos en cola
      while (this.eventQueue.length > 0) {
        const queuedEvent = this.eventQueue.shift()!;
        await this.processEvent(queuedEvent);
      }
    } finally {
      this.isEmitting = false;
    }
  }

  private async processEvent<T extends BaseEvent>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.type) || new Set();
    const onceHandlers = this.onceHandlers.get(event.type) || new Set();
    
    // Ejecutar handlers regulares
    const promises: Promise<void>[] = [];
    handlers.forEach(handler => {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        this.log(`Error en handler para evento ${event.type}:`, error);
      }
    });

    // Ejecutar handlers de una sola vez y limpiarlos
    onceHandlers.forEach(handler => {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        this.log(`Error en handler único para evento ${event.type}:`, error);
      }
    });
    
    // Limpiar handlers de una sola vez
    if (onceHandlers.size > 0) {
      this.onceHandlers.delete(event.type);
    }

    // Esperar a que todos los handlers asíncronos terminen
    await Promise.allSettled(promises);
  }

  /**
   * Suscribe un handler a un tipo de evento
   */
  subscribe<T extends BaseEvent>(
    eventType: EventType,
    handler: EventHandler<T>
  ): EventSubscription {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);
    
    this.log(`Nuevo suscriptor para evento: ${eventType}`);
    
    return {
      unsubscribe: () => {
        const handlers = this.handlers.get(eventType);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            this.handlers.delete(eventType);
          }
        }
        this.log(`Suscriptor removido para evento: ${eventType}`);
      }
    };
  }

  /**
   * Suscribe un handler que se ejecutará solo una vez
   */
  subscribeOnce<T extends BaseEvent>(
    eventType: EventType,
    handler: EventHandler<T>
  ): EventSubscription {
    if (!this.onceHandlers.has(eventType)) {
      this.onceHandlers.set(eventType, new Set());
    }
    
    this.onceHandlers.get(eventType)!.add(handler);
    
    this.log(`Nuevo suscriptor único para evento: ${eventType}`);
    
    return {
      unsubscribe: () => {
        const handlers = this.onceHandlers.get(eventType);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            this.onceHandlers.delete(eventType);
          }
        }
        this.log(`Suscriptor único removido para evento: ${eventType}`);
      }
    };
  }

  /**
   * Desuscribe todos los handlers de un tipo de evento o todos
   */
  unsubscribeAll(eventType?: EventType): void {
    if (eventType) {
      this.handlers.delete(eventType);
      this.onceHandlers.delete(eventType);
      this.log(`Todos los suscriptores removidos para evento: ${eventType}`);
    } else {
      this.handlers.clear();
      this.onceHandlers.clear();
      this.log('Todos los suscriptores removidos');
    }
  }

  /**
   * Obtiene el número de suscriptores para un tipo de evento
   */
  getSubscriberCount(eventType: EventType): number {
    const regular = this.handlers.get(eventType)?.size || 0;
    const once = this.onceHandlers.get(eventType)?.size || 0;
    return regular + once;
  }

  private log(message: string, data?: any): void {
    if (this.logger) {
      this.logger(message, data);
    }
  }
}

/**
 * Factory function para crear eventos con ID y timestamp automáticos
 */
export function createEvent<T extends Omit<BaseEvent, 'id' | 'timestamp'>>(
  eventData: T
): T & BaseEvent {
  return {
    ...eventData,
    id: `${eventData.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  } as T & BaseEvent;
}

/**
 * Instancia global del Event Bus para Fletestereo
 */
export const eventBus = new EventBus(
  process.env.NODE_ENV === 'development' 
    ? (message, data) => console.log(`[EventBus] ${message}`, data)
    : undefined
);
