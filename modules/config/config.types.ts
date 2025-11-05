// src/modules/config/config.types.ts
/**
 * (M15) Define la estructura de las reglas de negocio
 * que el dueño puede configurar.
 */
export interface PricingRules {
  // --- Tarifas Fijas (Combos Locales) ---
  COMBO_MUDANZA_COMPLETA: number;
  COMBO_MINI_MUDANZA_LARGA: number;
  COMBO_MINI_MUDANZA_CORTA: number;
  COMBO_FLETE_LIVIANO_LARGO: number;
  COMBO_FLETE_LIVIANO_CORTO: number;

  // --- Variables Dinámicas (Globales) ---

  /** (Monto mínimo) El precio piso para cualquier flete. */
  PRECIO_MINIMO_FLETE: number;

  /** (Extra por piso) Costo adicional por piso de escalera (solo local). */
  EXTRA_PISO_ESCALERA: number;

  /**
   * (Litro combustible)
   * Precio por KM solo para viajes interurbanos (!isLocal).
   */
  PRECIO_COMBUSTIBLE_KM: number;

  /** (Porcentaje de seña) Porcentaje (ej: 50) para viajes interurbanos. */
  PORCENTAJE_SENIA_LARGA: number;

  /**
   * Límite en KM para diferenciar fletes "cortos" vs "largos"
   * dentro de Corrientes Capital (ej: 1km = 10 cuadras).
   */
  LIMITE_KM_CORTA: number;
}