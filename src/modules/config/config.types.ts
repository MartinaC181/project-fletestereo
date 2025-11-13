// src/modules/config/config.types.ts
/**
 * (M15) Define la estructura de las reglas de negocio
 * que el dueño puede configurar desde el dashboard.
 * Los combos se manejan desde la vista de tarifas, no aquí.
 */
export interface PricingRules {
  // --- Variables Dinámicas para Cálculo de Precios ---
  PRECIO_MINIMO_FLETE: number;
  EXTRA_PISO_ESCALERA: number;
  PRECIO_COMBUSTIBLE_KM: number;
  PORCENTAJE_SENIA_LARGA: number;
  LIMITE_KM_CORTA: number;
  
  // Combos (legacy - mantenidos para compatibilidad pero ya no se usan)
  COMBO_MUDANZA_COMPLETA?: number;
  COMBO_MINI_MUDANZA_LARGA?: number;
  COMBO_MINI_MUDANZA_CORTA?: number;
  COMBO_FLETE_LIVIANO_LARGO?: number;
  COMBO_FLETE_LIVIANO_CORTO?: number;
}

/**
 * Representa la fila ÚNICA en la tabla 'config' de Supabase
 */
export interface ConfigRow {
  id: string;
  umbral_km: number; // Para seña (lógica antigua, podemos reusar)
  porcentaje_senia: number; // (ej: 30)
  tarifa_base: number; // (ej: 5000)
  precio_km: number; // (ej: 50)
  extras_json: Record<string, number>; // (ej: {"carga_pesada": 2000})
  // ... otras columnas
}