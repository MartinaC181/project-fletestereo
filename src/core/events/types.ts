/**
 * Tipos base para el sistema de eventos
 */

export interface BaseEvent {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly metadata?: Record<string, any>;
}

export interface EventHandler<T extends BaseEvent> {
  (event: T): void | Promise<void>;
}

export interface EventSubscription {
  unsubscribe(): void;
}

export type EventType = string;

/**
 * Interfaz para el Event Bus
 */
export interface IEventBus {
  emit<T extends BaseEvent>(event: T): Promise<void>;
  subscribe<T extends BaseEvent>(
    eventType: EventType,
    handler: EventHandler<T>
  ): EventSubscription;
  subscribeOnce<T extends BaseEvent>(
    eventType: EventType,
    handler: EventHandler<T>
  ): EventSubscription;
  unsubscribeAll(eventType?: EventType): void;
  getSubscriberCount(eventType: EventType): number;
}
