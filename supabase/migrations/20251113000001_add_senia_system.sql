-- Migración para agregar sistema de señas
-- Fecha: 2025-11-13

-- Agregar nuevos estados para el sistema de señas
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'Pendiente_Seña';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'Seña_Solicitada'; 
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'Seña_Pagada';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'Confirmada_Final';

-- Agregar campos para manejar señas
ALTER TABLE requests ADD COLUMN IF NOT EXISTS requiere_senia BOOLEAN DEFAULT false;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS monto_senia DECIMAL(10,2);
ALTER TABLE requests ADD COLUMN IF NOT EXISTS link_pago_senia TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS fecha_pago_senia TIMESTAMP WITH TIME ZONE;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS metodo_pago_senia TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS referencia_pago TEXT;

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_requests_requiere_senia ON requests(requiere_senia);
CREATE INDEX IF NOT EXISTS idx_requests_estado_senia ON requests(estado) WHERE estado IN ('Pendiente_Seña', 'Seña_Solicitada', 'Seña_Pagada');

-- Comentarios para documentación
COMMENT ON COLUMN requests.requiere_senia IS 'Indica si este flete requiere pago de seña';
COMMENT ON COLUMN requests.monto_senia IS 'Monto de la seña requerida';
COMMENT ON COLUMN requests.link_pago_senia IS 'Link de MercadoPago u otra plataforma para pagar la seña';
COMMENT ON COLUMN requests.fecha_pago_senia IS 'Fecha cuando se confirmó el pago de la seña';
COMMENT ON COLUMN requests.metodo_pago_senia IS 'Método usado para el pago (MercadoPago, transferencia, etc)';
COMMENT ON COLUMN requests.referencia_pago IS 'ID de transacción o referencia del pago';