-- Migration: Add pricing_rules table for dynamic pricing configuration
-- Date: 2025-11-13
-- Description: Creates a table to store pricing rules that can be modified from the admin dashboard

-- Create pricing_rules table
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificador único para asegurar que solo hay un registro activo
  config_key TEXT NOT NULL UNIQUE DEFAULT 'active_config',
  
  -- Variables dinámicas para cálculo de precios
  precio_minimo_flete DECIMAL(10,2) NOT NULL DEFAULT 20000.00,
  precio_combustible_km DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  extra_piso_escalera DECIMAL(10,2) NOT NULL DEFAULT 10000.00,
  porcentaje_senia_larga DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  limite_km_corta DECIMAL(8,2) NOT NULL DEFAULT 1.00,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insertar configuración por defecto
INSERT INTO public.pricing_rules (
  config_key,
  precio_minimo_flete,
  precio_combustible_km,
  extra_piso_escalera,
  porcentaje_senia_larga,
  limite_km_corta
) VALUES (
  'active_config',
  20000.00,
  300.00,
  10000.00,
  50.00,
  1.00
) ON CONFLICT (config_key) DO NOTHING;

-- Crear índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_pricing_rules_config_key ON public.pricing_rules(config_key);

-- Función para actualizar el timestamp automáticamente
CREATE OR REPLACE FUNCTION update_pricing_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS set_pricing_rules_updated_at ON public.pricing_rules;
CREATE TRIGGER set_pricing_rules_updated_at
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_rules_updated_at();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Cualquiera puede leer las reglas de precios (necesarias para cotizaciones públicas)
CREATE POLICY "Anyone can read pricing rules"
  ON public.pricing_rules
  FOR SELECT
  USING (true);

-- Policy: Solo admins pueden actualizar las reglas
CREATE POLICY "Only admins can update pricing rules"
  ON public.pricing_rules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = auth.uid()
      AND clients.role = 'admin'
    )
  );

-- Policy: Solo admins pueden insertar nuevas reglas
CREATE POLICY "Only admins can insert pricing rules"
  ON public.pricing_rules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = auth.uid()
      AND clients.role = 'admin'
    )
  );

-- Comentarios para documentación
COMMENT ON TABLE public.pricing_rules IS 'Tabla de configuración dinámica de precios y reglas de negocio';
COMMENT ON COLUMN public.pricing_rules.config_key IS 'Clave única para identificar la configuración activa';
COMMENT ON COLUMN public.pricing_rules.precio_minimo_flete IS 'Precio mínimo del servicio de flete en ARS';
COMMENT ON COLUMN public.pricing_rules.precio_combustible_km IS 'Precio por kilómetro de combustible en ARS';
COMMENT ON COLUMN public.pricing_rules.extra_piso_escalera IS 'Cargo extra por cada piso con escalera en ARS';
COMMENT ON COLUMN public.pricing_rules.porcentaje_senia_larga IS 'Porcentaje de seña requerida para viajes interurbanos (ej: 50 = 50%)';
COMMENT ON COLUMN public.pricing_rules.limite_km_corta IS 'Límite en KM para considerar un recorrido como corto';
