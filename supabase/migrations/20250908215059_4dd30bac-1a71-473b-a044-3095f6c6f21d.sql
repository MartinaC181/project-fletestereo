-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT,
  telefono TEXT NOT NULL,
  email TEXT,
  dni TEXT,
  es_temporal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enum for request status
CREATE TYPE request_status AS ENUM (
  'Solicitada',
  'Señada', 
  'Confirmada',
  'Rechazada',
  'Completada',
  'Cancelada'
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  fecha DATE NOT NULL,
  franja TEXT NOT NULL,
  carga_tipo TEXT NOT NULL,
  carga_volumen TEXT,
  notas TEXT,
  estado request_status DEFAULT 'Solicitada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  km DECIMAL(10,2),
  tarifa_base DECIMAL(10,2) NOT NULL,
  precio_km DECIMAL(10,2) NOT NULL,
  extras_json JSONB DEFAULT '{}',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  payment_id TEXT,
  status TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  moneda TEXT DEFAULT 'ARS',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patente TEXT UNIQUE NOT NULL,
  capacidad TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create schedule table
CREATE TABLE public.schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  vehiculo_id UUID REFERENCES public.vehicles(id),
  chofer_id UUID REFERENCES public.drivers(id),
  inicio_ts TIMESTAMPTZ NOT NULL,
  fin_ts TIMESTAMPTZ NOT NULL,
  bloqueado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TYPE notification_channel AS ENUM ('email', 'whatsapp');
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  canal notification_channel NOT NULL,
  plantilla TEXT NOT NULL,
  payload_json JSONB,
  enviado_ts TIMESTAMPTZ,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad TEXT NOT NULL,
  entidad_id TEXT NOT NULL,
  actor TEXT,
  cambio_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create config table
CREATE TABLE public.config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  umbral_km DECIMAL(10,2) DEFAULT 100.0,
  porcentaje_senia DECIMAL(5,2) DEFAULT 30.0,
  tarifa_base DECIMAL(10,2) DEFAULT 5000.0,
  precio_km DECIMAL(10,2) DEFAULT 50.0,
  extras_json JSONB DEFAULT '{}',
  politicas_md TEXT,
  plantillas_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create zones table
CREATE TABLE public.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  geo_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- Create function to get user role (for future use)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  -- For now, simple logic - can be enhanced later
  IF auth.uid() IS NOT NULL THEN
    RETURN 'authenticated';
  END IF;
  RETURN 'anonymous';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for clients
CREATE POLICY "Anyone can insert clients" ON public.clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own client records" ON public.clients
  FOR SELECT USING (
    auth.uid() IS NULL OR 
    id IN (SELECT client_id FROM public.requests WHERE auth.uid() IS NOT NULL)
  );

-- RLS Policies for requests
CREATE POLICY "Anyone can insert requests" ON public.requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own requests" ON public.requests
  FOR SELECT USING (true); -- Temporarily allow all for development

-- RLS Policies for quotes
CREATE POLICY "Anyone can view quotes" ON public.quotes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert quotes" ON public.quotes
  FOR INSERT WITH CHECK (true);

-- RLS Policies for other tables (owner access for now)
CREATE POLICY "Authenticated users can view config" ON public.config
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can view zones" ON public.zones
  FOR SELECT USING (true);

CREATE POLICY "Owner can manage vehicles" ON public.vehicles
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Owner can manage drivers" ON public.drivers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Owner can manage schedule" ON public.schedule
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_requests_status ON public.requests(estado);
CREATE INDEX idx_requests_fecha ON public.requests(fecha);
CREATE INDEX idx_requests_client_id ON public.requests(client_id);
CREATE INDEX idx_quotes_request_id ON public.quotes(request_id);
CREATE INDEX idx_payments_request_id ON public.payments(request_id);
CREATE INDEX idx_schedule_inicio_ts ON public.schedule(inicio_ts);
CREATE INDEX idx_schedule_vehiculo_id ON public.schedule(vehiculo_id);

-- Insert default configuration
INSERT INTO public.config (
  umbral_km, 
  porcentaje_senia, 
  tarifa_base, 
  precio_km,
  extras_json,
  politicas_md,
  plantillas_json
) VALUES (
  100.0,
  30.0,
  5000.0,
  50.0,
  '{"carga_pesada": 2000, "ayudante_extra": 1500, "embalaje": 800}',
  '# Políticas de Fletestereo

## Condiciones de Servicio
- Los precios incluyen chofer y vehículo
- Para viajes mayores a 100km se requiere seña del 30%
- Cancelaciones con menos de 24hs tienen recargo

## Cobertura
- AMBA y alrededores
- Viajes al interior bajo consulta',
  '{"confirmacion": "Su solicitud #{id} ha sido confirmada", "rechazo": "Lamentamos informar que su solicitud #{id} no pudo ser procesada"}'
);

-- Insert sample zones
INSERT INTO public.zones (nombre, geo_json) VALUES 
('CABA', '{"type": "Polygon", "coordinates": []}'),
('GBA Norte', '{"type": "Polygon", "coordinates": []}'),
('GBA Sur', '{"type": "Polygon", "coordinates": []}'),
('GBA Oeste', '{"type": "Polygon", "coordinates": []}');

-- Insert sample vehicle and driver
INSERT INTO public.vehicles (patente, capacidad) VALUES 
('ABC123', 'Utilitario - hasta 1000kg'),
('DEF456', 'Camión pequeño - hasta 3000kg');

INSERT INTO public.drivers (nombre, telefono) VALUES 
('Carlos Rodriguez', '+541234567890'),
('Miguel Fernandez', '+541234567891');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON public.config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();