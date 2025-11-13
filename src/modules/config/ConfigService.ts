// src/modules/config/ConfigService.ts
import type { PricingRules } from "./config.types";
import { supabase } from '@/src/integrations/supabase/client';

class ConfigService {
  private readonly STORAGE_KEY = 'fletestereo_config';
  private readonly CONFIG_KEY = 'active_config';

  // Configuración por defecto (fallback si no hay conexión a BD)
  private defaultRules: PricingRules = {
    // Variables dinámicas
    PRECIO_MINIMO_FLETE: 20000,
    EXTRA_PISO_ESCALERA: 10000,
    PRECIO_COMBUSTIBLE_KM: 300,
    PORCENTAJE_SENIA_LARGA: 50,
    LIMITE_KM_CORTA: 1,
    
    // Combos locales (legacy - ya no se usan, se manejan desde vista de tarifas)
    COMBO_MUDANZA_COMPLETA: 80000,
    COMBO_MINI_MUDANZA_LARGA: 40000,
    COMBO_MINI_MUDANZA_CORTA: 30000,
    COMBO_FLETE_LIVIANO_LARGO: 25000,
    COMBO_FLETE_LIVIANO_CORTO: 20000,
  };

  /**
   * (M15) Obtiene las reglas de precios desde Supabase.
   * Si falla, intenta desde localStorage como fallback.
   */
  async getPricingRules(): Promise<PricingRules> {
    console.log("[ConfigService] Obteniendo reglas de precios desde Supabase");
    
    try {
      // Obtener reglas desde Supabase
      const { data, error } = await supabase
        .from('pricing_rules' as any)
        .select('*')
        .eq('config_key', this.CONFIG_KEY)
        .single();

      if (error) {
        console.error("[ConfigService] Error al obtener reglas desde Supabase:", error);
        // Fallback a localStorage
        return this.getPricingRulesFromLocalStorage();
      }

      if (data) {
        console.log("[ConfigService] Reglas obtenidas desde Supabase");
        
        // Mapear nombres de columnas de snake_case a camelCase
        const dbData = data as any;
        const rules: PricingRules = {
          PRECIO_MINIMO_FLETE: Number(dbData.precio_minimo_flete),
          PRECIO_COMBUSTIBLE_KM: Number(dbData.precio_combustible_km),
          EXTRA_PISO_ESCALERA: Number(dbData.extra_piso_escalera),
          PORCENTAJE_SENIA_LARGA: Number(dbData.porcentaje_senia_larga),
          LIMITE_KM_CORTA: Number(dbData.limite_km_corta),
          // Combos se manejan desde vista de tarifas, pero los necesitamos para cálculos
          COMBO_MUDANZA_COMPLETA: this.defaultRules.COMBO_MUDANZA_COMPLETA,
          COMBO_MINI_MUDANZA_LARGA: this.defaultRules.COMBO_MINI_MUDANZA_LARGA,
          COMBO_MINI_MUDANZA_CORTA: this.defaultRules.COMBO_MINI_MUDANZA_CORTA,
          COMBO_FLETE_LIVIANO_LARGO: this.defaultRules.COMBO_FLETE_LIVIANO_LARGO,
          COMBO_FLETE_LIVIANO_CORTO: this.defaultRules.COMBO_FLETE_LIVIANO_CORTO,
        };

        // Guardar en localStorage como cache
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rules));
        }

        return rules;
      }

      // Si no hay datos, usar valores por defecto
      console.log("[ConfigService] No se encontraron reglas, usando valores por defecto");
      return this.defaultRules;
      
    } catch (error) {
      console.error("[ConfigService] Error al cargar configuración:", error);
      // Fallback a localStorage o valores por defecto
      return this.getPricingRulesFromLocalStorage();
    }
  }

  /**
   * Fallback: Obtiene las reglas desde localStorage
   */
  private getPricingRulesFromLocalStorage(): PricingRules {
    console.log("[ConfigService] Intentando cargar desde localStorage (fallback)");
    
    try {
      if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem(this.STORAGE_KEY);
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          console.log("[ConfigService] Configuración cargada desde localStorage");
          return { ...this.defaultRules, ...parsedConfig };
        }
      }
    } catch (error) {
      console.error("[ConfigService] Error al leer localStorage:", error);
    }
    
    console.log("[ConfigService] Usando configuración por defecto");
    return this.defaultRules;
  }

  /**
   * (M15) Guarda las reglas de precios en Supabase.
   */
  async savePricingRules(rules: PricingRules): Promise<void> {
    console.log("[ConfigService] Guardando reglas de precios en Supabase...");

    try {
      // Mapear de camelCase a snake_case para la BD (solo variables dinámicas)
      const dbRules = {
        config_key: this.CONFIG_KEY,
        precio_minimo_flete: rules.PRECIO_MINIMO_FLETE,
        precio_combustible_km: rules.PRECIO_COMBUSTIBLE_KM,
        extra_piso_escalera: rules.EXTRA_PISO_ESCALERA,
        porcentaje_senia_larga: rules.PORCENTAJE_SENIA_LARGA,
        limite_km_corta: rules.LIMITE_KM_CORTA,
        // Combos NO se guardan aquí, se manejan desde vista de tarifas
      };

      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();

      // Actualizar o insertar las reglas
      const { error } = await supabase
        .from('pricing_rules' as any)
        .upsert({
          ...dbRules,
          updated_by: user?.id
        } as any, {
          onConflict: 'config_key'
        });

      if (error) {
        console.error("[ConfigService] Error al guardar en Supabase:", error);
        throw new Error(`Error al guardar reglas: ${error.message}`);
      }

      console.log("[ConfigService] Reglas guardadas exitosamente en Supabase");

      // También guardar en localStorage como cache
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rules));
      }
      
    } catch (error) {
      console.error("[ConfigService] Error al guardar reglas:", error);
      throw new Error("No se pudieron guardar las reglas de configuración");
    }
  }
}

export const configService = new ConfigService();