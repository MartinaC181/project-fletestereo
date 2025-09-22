// Re-export principales del sistema de eventos
export * from './types';
export * from './EventBus';
export * from './domain-events';

// Export conveniente del Event Bus global
export { eventBus } from './EventBus';
