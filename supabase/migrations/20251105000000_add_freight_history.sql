-- Create freight_history table
CREATE TABLE public.freight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL,
  fecha_flete DATE NOT NULL,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  peso DECIMAL(10,2),
  volumen DECIMAL(10,2),
  precio DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'completado',
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on freight_history table
ALTER TABLE public.freight_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for freight_history
CREATE POLICY "Users can view their own freight history" ON public.freight_history
  FOR SELECT USING (
    auth.uid() IS NULL OR 
    client_id IN (SELECT id FROM public.clients WHERE auth.uid() IS NOT NULL)
  );

CREATE POLICY "Anyone can insert freight history" ON public.freight_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update freight history" ON public.freight_history
  FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX idx_freight_history_client_id ON public.freight_history(client_id);
CREATE INDEX idx_freight_history_fecha ON public.freight_history(fecha_flete);
CREATE INDEX idx_freight_history_estado ON public.freight_history(estado);

-- Create trigger for timestamp updates
CREATE TRIGGER update_freight_history_updated_at
  BEFORE UPDATE ON public.freight_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create history entry when request is completed
CREATE OR REPLACE FUNCTION public.create_freight_history_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create history when request status changes to 'Completada'
  IF OLD.estado != 'Completada' AND NEW.estado = 'Completada' THEN
    INSERT INTO public.freight_history (
      client_id,
      request_id,
      fecha_flete,
      origen,
      destino,
      precio,
      estado,
      observaciones
    )
    SELECT 
      NEW.client_id,
      NEW.id,
      NEW.fecha,
      NEW.origen,
      NEW.destino,
      COALESCE(q.total, 0),
      'completado',
      NEW.notas
    FROM public.quotes q
    WHERE q.request_id = NEW.id
    ORDER BY q.created_at DESC
    LIMIT 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add to history when request is completed
CREATE TRIGGER auto_create_freight_history
  AFTER UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.create_freight_history_on_completion();