-- Agregar columna ip_address a la tabla resources
-- Este script debe ejecutarse en Supabase SQL Editor

ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Crear índice para optimizar búsquedas por IP
CREATE INDEX IF NOT EXISTS idx_resources_ip_address 
ON resources(ip_address);

-- Agregar comentario a la columna
COMMENT ON COLUMN resources.ip_address IS 'Dirección IP del usuario que propuso el recurso (para límite de propuestas)';

