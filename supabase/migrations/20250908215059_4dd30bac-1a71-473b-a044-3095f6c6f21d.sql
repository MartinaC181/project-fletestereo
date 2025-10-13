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

CREATE POLICY "Authenticated users can view zones" ON public.zones
  FOR SELECT USING (true);







-- Create indexes for performance
CREATE INDEX idx_requests_status ON public.requests(estado);
CREATE INDEX idx_requests_fecha ON public.requests(fecha);
CREATE INDEX idx_requests_client_id ON public.requests(client_id);
CREATE INDEX idx_quotes_request_id ON public.quotes(request_id);
CREATE INDEX idx_payments_request_id ON public.payments(request_id);




-- Insert sample zones
INSERT INTO public.zones (nombre, geo_json) VALUES 
('CABA', '{"type": "Polygon", "coordinates": []}'),
('GBA Norte', '{"type": "Polygon", "coordinates": []}'),
('GBA Sur', '{"type": "Polygon", "coordinates": []}'),
('GBA Oeste', '{"type": "Polygon", "coordinates": []}');





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

