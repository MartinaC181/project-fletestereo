// src/modules/config/ConfigService.ts
import { supabase } from "@/integrations/supabase/client";
import type { PricingRules, ConfigRow } from "./config.types";

class ConfigService {

  // Mapea los nombres de tu BD a los nombres de la lógica de M15
  private mapRowToRules(dbConfig: ConfigRow): PricingRules {
    return {
      // Asumimos que los combos están en 'extras_json'
      COMBO_MUDANZA_COMPLETA: dbConfig.extras_json?.COMBO_MUDANZA_COMPLETA || 80000,
      COMBO_MINI_MUDANZA_LARGA: dbConfig.extras_json?.COMBO_MINI_MUDANZA_LARGA || 40000,
      COMBO_MINI_MUDANZA_CORTA: dbConfig.extras_json?.COMBO_MINI_MUDANZA_CORTA || 30000,
      COMBO_FLETE_LIVIANO_LARGO: dbConfig.extras_json?.COMBO_FLETE_LIVIANO_LARGO || 25000,
      COMBO_FLETE_LIVIANO_CORTO: dbConfig.extras_json?.COMBO_FLETE_LIVIANO_CORTO || 20000,

      // Mapeo de columnas directas
      PRECIO_MINIMO_FLETE: dbConfig.tarifa_base || 20000, // Reutilizamos tarifa_base como precio mínimo
      EXTRA_PISO_ESCALERA: dbConfig.extras_json?.EXTRA_PISO_ESCALERA || 10000,
      PRECIO_COMBUSTIBLE_KM: dbConfig.precio_km || 300, // Reutilizamos precio_km
      PORCENTAJE_SENIA_LARGA: dbConfig.porcentaje_senia || 50, // Reutilizamos porcentaje_senia
      LIMITE_KM_CORTA: dbConfig.umbral_km || 1, // Reutilizamos umbral_km
    };
  }

  /**
   * (M15) Obtiene las reglas de precios desde la fila ÚNICA
   * de la tabla 'config' de Supabase.
   */
  async getPricingRules(): Promise<PricingRules> {
    console.log("[ConfigService] Obteniendo reglas de precios (Optimizado)");

    const { data, error } = await supabase
      .from("config")
      .select("*")
      .limit(1) // Tomamos la primera (y única) fila
      .single();
    
    if (error || !data) {
      console.error("[ConfigService] Error al obtener reglas. Usando valores por defecto.", error?.message);
      // Creamos un objeto 'ConfigRow' por defecto para el mapeador
      const defaultDbConfig: ConfigRow = {
        id: 'default',
        umbral_km: 1,
        porcentaje_senia: 50,
        tarifa_base: 20000,
        precio_km: 300,
        extras_json: {
          COMBO_MUDANZA_COMPLETA: 80000,
          COMBO_MINI_MUDANZA_LARGA: 40000,
          COMBO_MINI_MUDANZA_CORTA: 30000,
          COMBO_FLETE_LIVIANO_LARGO: 25000,
          COMBO_FLETE_LIVIANO_CORTO: 20000,
          EXTRA_PISO_ESCALERA: 10000
        }
      };
      return this.mapRowToRules(defaultDbConfig);
    }
    
    return this.mapRowToRules(data as ConfigRow);
  }

  // (La función savePricingRules necesitará una lógica inversa de mapeo)
}

export const configService = new ConfigService();