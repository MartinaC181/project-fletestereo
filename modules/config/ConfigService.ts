// src/modules/config/ConfigService.ts
import { supabase } from "@/integrations/supabase/client";
import type { PricingRules } from "./config.types";

class ConfigService {

  /**
   * (M15) Obtiene las reglas de precios desde la tabla 'config' de Supabase.
   */
  async getPricingRules(): Promise<PricingRules> {
    console.log("[ConfigService] Obteniendo reglas de precios...");

    const { data, error } = await supabase
      .from("config")
      .select("*")
      .single();
    
    if (error || !data) {
      console.warn("[ConfigService] Error al obtener reglas. Usando valores por defecto.", error?.message);
      return this.getDefaultRules();
    }
    
    // Mapear los campos de la BD a nuestra estructura PricingRules
    const extras = data.extras_json as any || {};
    return {
      COMBO_MUDANZA_COMPLETA: extras.COMBO_MUDANZA_COMPLETA || 80000,
      COMBO_MINI_MUDANZA_LARGA: extras.COMBO_MINI_MUDANZA_LARGA || 40000,
      COMBO_MINI_MUDANZA_CORTA: extras.COMBO_MINI_MUDANZA_CORTA || 30000,
      COMBO_FLETE_LIVIANO_LARGO: extras.COMBO_FLETE_LIVIANO_LARGO || 25000,
      COMBO_FLETE_LIVIANO_CORTO: extras.COMBO_FLETE_LIVIANO_CORTO || 20000,
      PRECIO_COMBUSTIBLE_KM: data.precio_km || 300,
      EXTRA_PISO_ESCALERA: extras.EXTRA_PISO_ESCALERA || 10000,
      PRECIO_MINIMO_FLETE: data.tarifa_base || 20000,
      LIMITE_KM_CORTA: data.umbral_km || 1,
      PORCENTAJE_SENIA_LARGA: data.porcentaje_senia || 50
    };
  }

  /**
   * (M15) Guarda las reglas de precios en Supabase.
   * Esto lo usará el formulario de admin.
   */
  async savePricingRules(rules: PricingRules): Promise<void> {
    console.log("[ConfigService] Guardando reglas de precios...");

    // Preparar los datos para actualizar
    const extras = {
      COMBO_MUDANZA_COMPLETA: rules.COMBO_MUDANZA_COMPLETA,
      COMBO_MINI_MUDANZA_LARGA: rules.COMBO_MINI_MUDANZA_LARGA,
      COMBO_MINI_MUDANZA_CORTA: rules.COMBO_MINI_MUDANZA_CORTA,
      COMBO_FLETE_LIVIANO_LARGO: rules.COMBO_FLETE_LIVIANO_LARGO,
      COMBO_FLETE_LIVIANO_CORTO: rules.COMBO_FLETE_LIVIANO_CORTO,
      EXTRA_PISO_ESCALERA: rules.EXTRA_PISO_ESCALERA
    };

    const { error } = await supabase
      .from("config")
      .update({
        precio_km: rules.PRECIO_COMBUSTIBLE_KM,
        tarifa_base: rules.PRECIO_MINIMO_FLETE,
        umbral_km: rules.LIMITE_KM_CORTA,
        porcentaje_senia: rules.PORCENTAJE_SENIA_LARGA,
        extras_json: extras
      });
      
    if (error) {
      console.error("[ConfigService] Error al guardar reglas.", error);
      throw new Error(error.message);
    }
  }

  /**
   * (M15) Valores por defecto que coinciden con la simulación.
   * Se usan como fallback si la BD falla.
   */
  private getDefaultRules(): PricingRules {
    return {
      COMBO_MUDANZA_COMPLETA: 80000,
      COMBO_MINI_MUDANZA_LARGA: 40000,
      COMBO_MINI_MUDANZA_CORTA: 30000,
      COMBO_FLETE_LIVIANO_LARGO: 25000,
      COMBO_FLETE_LIVIANO_CORTO: 20000,
      PRECIO_COMBUSTIBLE_KM: 300, // Variable única
      EXTRA_PISO_ESCALERA: 10000,
      PRECIO_MINIMO_FLETE: 20000,
      LIMITE_KM_CORTA: 1,
      PORCENTAJE_SENIA_LARGA: 50
    };
  }
}

export const configService = new ConfigService();