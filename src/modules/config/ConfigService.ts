// src/modules/config/ConfigService.ts
import type { PricingRules } from "./config.types";

class ConfigService {
  private readonly STORAGE_KEY = 'fletestereo_config';

  // Configuración por defecto
  private defaultRules: PricingRules = {
    // Combos locales
    COMBO_MUDANZA_COMPLETA: 80000,
    COMBO_MINI_MUDANZA_LARGA: 40000,
    COMBO_MINI_MUDANZA_CORTA: 30000,
    COMBO_FLETE_LIVIANO_LARGO: 25000,
    COMBO_FLETE_LIVIANO_CORTO: 20000,

    // Variables dinámicas
    PRECIO_MINIMO_FLETE: 20000,
    EXTRA_PISO_ESCALERA: 10000,
    PRECIO_COMBUSTIBLE_KM: 300,
    PORCENTAJE_SENIA_LARGA: 50,
    LIMITE_KM_CORTA: 1,
  };

  /**
   * (M15) Obtiene las reglas de precios.
   * Primero intenta cargar desde localStorage, si no existe usa los valores por defecto.
   */
  async getPricingRules(): Promise<PricingRules> {
    console.log("[ConfigService] Obteniendo reglas de precios desde localStorage");
    
    try {
      if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem(this.STORAGE_KEY);
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          console.log("[ConfigService] Configuración cargada desde localStorage");
          return { ...this.defaultRules, ...parsedConfig };
        }
      }
      
      console.log("[ConfigService] Usando configuración por defecto");
      return this.defaultRules;
    } catch (error) {
      console.error("[ConfigService] Error al cargar configuración:", error);
      return this.defaultRules;
    }
  }

  /**
   * (M15) Guarda las reglas de precios en localStorage.
   */
  async savePricingRules(rules: PricingRules): Promise<void> {
    console.log("[ConfigService] Guardando reglas de precios en localStorage...");

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rules));
        console.log("[ConfigService] Reglas guardadas exitosamente en localStorage");
      } else {
        throw new Error("localStorage no disponible en el servidor");
      }
    } catch (error) {
      console.error("[ConfigService] Error al guardar reglas:", error);
      throw new Error("No se pudieron guardar las reglas de configuración");
    }
  }
}

export const configService = new ConfigService();