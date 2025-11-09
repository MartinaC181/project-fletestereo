import React from 'react';

/**
 * Componente simplificado - EventBus deshabilitado por simplicidad
 */
export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Hook para acceso al EventBus (deshabilitado)
 */
export const useEventBus = () => {
  return {
    emit: () => Promise.resolve(),
    subscribe: () => ({ unsubscribe: () => {} }),
    unsubscribeAll: () => {}
  };
};
