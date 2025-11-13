-- Add quote fields directly to requests table (simplified structure)
ALTER TABLE public.requests 
ADD COLUMN km DECIMAL(10,2),
ADD COLUMN tarifa_base DECIMAL(10,2),
ADD COLUMN precio_km DECIMAL(10,2),
ADD COLUMN extras_json JSONB DEFAULT '{}',
ADD COLUMN total DECIMAL(10,2);

-- Add index for performance
CREATE INDEX idx_requests_total ON public.requests(total);

-- Update existing requests to have default values (if any exist)
UPDATE public.requests 
SET km = 0, 
    tarifa_base = 0, 
    precio_km = 150, 
    extras_json = '{}', 
    total = 0 
WHERE km IS NULL;