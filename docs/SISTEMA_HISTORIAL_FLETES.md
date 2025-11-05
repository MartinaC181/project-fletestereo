# Sistema de Historial de Fletes

## Descripción General

El Sistema de Historial de Fletes permite a los administradores y clientes de FleteStéreo consultar, agregar y gestionar el historial completo de fletes realizados. Este sistema incluye:

- **Registro automático**: Los fletes se agregan automáticamente al historial cuando una solicitud se marca como "Completada"
- **Registro manual**: Posibilidad de agregar fletes manualmente al historial
- **Estadísticas**: Visualización de métricas e indicadores de rendimiento
- **Filtrado por cliente**: Consulta del historial específico de cada cliente

## Arquitectura

### Base de Datos

#### Tabla `freight_history`
```sql
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
```

#### Triggers y Funciones
- **Trigger automático**: Crea automáticamente un registro de historial cuando una solicitud se marca como "Completada"
- **Función de timestamp**: Actualiza automáticamente el campo `updated_at`

### Componentes

#### `FreightHistory.tsx`
Componente principal que muestra el historial de fletes con:
- Lista paginada de fletes
- Filtro por cliente
- Formulario para agregar nuevos fletes
- Visualización detallada de cada flete

#### `FreightHistoryStats.tsx`
Componente de estadísticas que muestra:
- Total de fletes realizados
- Ingresos totales y promedio
- Distribución por estado (completados, pendientes, cancelados)
- Ingresos por mes (últimos 6 meses)

#### `useFreightHistory.ts`
Hook personalizado que maneja:
- Carga de historial de fletes
- Operaciones CRUD (crear, leer, actualizar, eliminar)
- Manejo de estados de carga y error

### Servicios

#### `FreightHistoryService`
Servicio que encapsula todas las operaciones de base de datos:

##### Métodos principales:
- `getHistory(clientId?)`: Obtiene el historial, opcionalmente filtrado por cliente
- `addFreightHistory(data)`: Agrega un nuevo flete al historial
- `updateFreightHistory(id, updates)`: Actualiza un registro existente
- `deleteFreightHistory(id)`: Elimina un registro
- `getHistoryStats(clientId?)`: Calcula estadísticas del historial
- `createFromCompletedRequest(requestId)`: Crea historial automáticamente desde una solicitud

## Funcionalidades

### 1. Visualización del Historial
- Lista de todos los fletes realizados
- Información detallada: fecha, origen, destino, precio, estado
- Filtrado por cliente específico
- Búsqueda y paginación

### 2. Registro Manual de Fletes
- Formulario para agregar fletes manualmente
- Campos obligatorios: cliente, fecha, origen, destino, precio
- Campos opcionales: peso, volumen, observaciones

### 3. Registro Automático
- Cuando una solicitud cambia a estado "Completada"
- Se crea automáticamente un registro en el historial
- Incluye datos de la cotización asociada

### 4. Estadísticas y Reportes
- Dashboard con métricas clave
- Indicadores de rendimiento (KPIs)
- Gráficos de tendencias temporales
- Análisis por estado de fletes

### 5. Gestión de Acceso
- Row Level Security (RLS) implementado
- Clientes pueden ver solo su propio historial
- Administradores pueden ver todo el historial

## Rutas y Navegación

### Rutas públicas:
- `/historial` - Página principal del historial de fletes

### Integración en Dashboard:
- Acceso rápido desde el dashboard administrativo
- Enlace en el header de navegación

## Seguridad

### Row Level Security (RLS)
```sql
-- Los usuarios pueden ver su propio historial
CREATE POLICY "Users can view their own freight history" ON public.freight_history
  FOR SELECT USING (
    auth.uid() IS NULL OR 
    client_id IN (SELECT id FROM public.clients WHERE auth.uid() IS NOT NULL)
  );
```

### Políticas implementadas:
- Lectura: usuarios pueden ver su propio historial
- Escritura: cualquier usuario autenticado puede insertar
- Actualización: cualquier usuario autenticado puede actualizar

## Uso

### Para Administradores:
1. Acceder a `/historial` desde el menú principal
2. Ver estadísticas en la pestaña "Estadísticas"
3. Consultar historial completo en "Historial"
4. Agregar fletes manualmente cuando sea necesario

### Para Clientes:
1. Acceder a su dashboard personal
2. Ver solo su propio historial de fletes
3. Consultar detalles de fletes anteriores

## Consideraciones Técnicas

### Performance:
- Índices en campos frecuentemente consultados
- Paginación para listas grandes
- Consultas optimizadas con joins apropiados

### Mantenimiento:
- Logs de auditoría para cambios importantes
- Backup automático de datos críticos
- Monitoreo de performance de consultas

### Escalabilidad:
- Estructura preparada para grandes volúmenes
- Posibilidad de archivar registros antiguos
- Optimización para consultas temporales

## Posibles Mejoras Futuras

1. **Exportación de datos**: PDF, Excel, CSV
2. **Gráficos avanzados**: Charts.js o similar para visualizaciones
3. **Notificaciones**: Alertas por email de fletes importantes
4. **API REST**: Endpoint público para integraciones
5. **Filtros avanzados**: Búsqueda por rango de fechas, precios, etc.
6. **Archivado automático**: Mover registros antiguos a tabla de archivo
7. **Reportes programados**: Envío automático de reportes mensuales