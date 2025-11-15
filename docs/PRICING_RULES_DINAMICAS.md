# Implementación de Reglas de Precios Dinámicas - Guía Completa

## 📋 Resumen
Este sistema permite modificar las reglas de precios desde el dashboard administrativo y almacenarlas en Supabase, afectando automáticamente todas las cotizaciones.

## 🗄️ Paso 1: Ejecutar Migración SQL en Supabase

### Opción A: Desde el Dashboard de Supabase
1. Ve a tu proyecto en https://supabase.com
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido del archivo:
   `supabase/migrations/20251113000002_add_pricing_rules.sql`
5. Ejecuta la query
6. Verifica que la tabla `pricing_rules` fue creada correctamente

### Opción B: Desde CLI (si tienes Supabase CLI instalado)
```bash
# En la raíz del proyecto
supabase db push

# O si prefieres aplicar solo esta migración
supabase migration up
```

## ✅ Verificación de la Tabla

Después de ejecutar la migración, verifica que existe:

```sql
-- Verificar que la tabla existe
SELECT * FROM pricing_rules WHERE config_key = 'active_config';

-- Deberías ver un registro con los valores por defecto:
-- precio_minimo_flete: 20000
-- precio_combustible_km: 300
-- extra_piso_escalera: 10000
-- porcentaje_senia_larga: 50
-- limite_km_corta: 1
-- (NOTA: Los combos NO están en esta tabla, se manejan desde la vista de tarifas)
```

## 🔄 Paso 2: Regenerar Tipos de TypeScript (Opcional pero Recomendado)

Para eliminar los warnings de TypeScript, regenera los tipos de Supabase:

### Opción A: Con Supabase CLI
```bash
supabase gen types typescript --project-id TU_PROJECT_ID > src/integrations/supabase/types.ts
```

### Opción B: Manualmente desde Supabase Dashboard
1. Ve a **Settings** → **API**
2. Copia el **Project URL** y **anon/public key**
3. Ejecuta:
```bash
npx supabase gen types typescript --project-ref TU_PROJECT_REF --schema public > src/integrations/supabase/types.ts
```

## 🎯 Características Implementadas

### 1. **Tabla `pricing_rules` en Supabase**
- ✅ Almacena todas las reglas de precios dinámicas
- ✅ Un solo registro activo identificado por `config_key = 'active_config'`
- ✅ Actualización automática del timestamp `updated_at`
- ✅ Tracking de quién modificó (campo `updated_by`)
- ✅ Row Level Security (RLS) configurado:
  - Cualquiera puede leer (necesario para cotizaciones públicas)
  - Solo admins pueden modificar

### 2. **ConfigService Actualizado**
- ✅ Lee reglas desde Supabase
- ✅ Fallback a localStorage si falla la conexión
- ✅ Cache local para mejor rendimiento
- ✅ Mapeo automático entre snake_case (DB) y camelCase (código)

### 3. **Dashboard Administrativo**
- ✅ El formulario ya existente ahora guarda en Supabase
- ✅ Los campos de "Combos Locales" fueron removidos (se manejan desde /tarifas)
- ✅ Campos editables:
  - Precio Mínimo (ARS)
  - Precio Combustible (ARS por KM)
  - Extra por Escalera (ARS por Piso)
  - % Seña Interurbana
  - Límite KM Recorrido Corto

### 4. **Sistema de Cotizaciones**
- ✅ Usa automáticamente las reglas de Supabase
- ✅ Si falla la conexión, usa valores en cache
- ✅ Valores por defecto como último fallback

## 📊 Estructura de la Tabla

```sql
pricing_rules
├── id (UUID, PK)
├── config_key (TEXT, UNIQUE) = 'active_config'
├── precio_minimo_flete (DECIMAL)
├── precio_combustible_km (DECIMAL)
├── extra_piso_escalera (DECIMAL)
├── porcentaje_senia_larga (DECIMAL)
├── limite_km_corta (DECIMAL)
├── created_at (TIMESTAMPTZ)
├── updated_at (TIMESTAMPTZ)
└── updated_by (UUID, FK → auth.users)

NOTA: Los precios de combos (mudanza completa, mini mudanza, etc.) 
se manejan desde la vista /tarifas, NO desde esta tabla.
```

## 🔒 Políticas de Seguridad (RLS)

```sql
-- Lectura pública (necesaria para cotizaciones)
CREATE POLICY "Anyone can read pricing rules"
  ON pricing_rules FOR SELECT USING (true);

-- Solo admins pueden actualizar
CREATE POLICY "Only admins can update pricing rules"
  ON pricing_rules FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = auth.uid()
    AND clients.role = 'admin'
  ));
```

## 🧪 Pruebas

### 1. Probar Lectura
```typescript
// En consola del navegador (página pública)
import { configService } from '@/src/modules/config/ConfigService';
const rules = await configService.getPricingRules();
console.log(rules);
```

### 2. Probar Actualización (como admin)
1. Inicia sesión como administrador
2. Ve al Dashboard → Tarifas y Reglas
3. Modifica un valor (ej: Precio Mínimo)
4. Guarda
5. Verifica en Supabase que se actualizó

### 3. Probar Cotización
1. Ve a "Solicitar Flete"
2. Completa origen, destino y otros datos
3. Calcula cotización
4. Verifica que use los nuevos valores

## 🐛 Troubleshooting

### Error: "No se pudieron cargar las tarifas"
- **Causa**: La tabla aún no existe en Supabase
- **Solución**: Ejecuta la migración SQL (Paso 1)

### Error: "Permission denied for table pricing_rules"
- **Causa**: Políticas RLS no configuradas correctamente
- **Solución**: Verifica que las policies se crearon correctamente

### Los cambios no se reflejan
- **Causa**: Cache en localStorage desactualizado
- **Solución**: Limpia localStorage o recarga la página

### Warnings de TypeScript
- **Causa**: Los tipos de Supabase no incluyen la nueva tabla
- **Solución**: Regenera los tipos (Paso 2) o ignora temporalmente con `as any`

## 📝 Flujo de Datos

```
┌─────────────────┐
│  Dashboard      │
│  (Admin)        │
└────────┬────────┘
         │
         │ ConfigService.savePricingRules()
         ▼
┌─────────────────┐
│  Supabase       │
│  pricing_rules  │
└────────┬────────┘
         │
         │ ConfigService.getPricingRules()
         ▼
┌─────────────────┐      ┌─────────────────┐
│ Sistema         │      │  Formulario     │
│ Cotizaciones    │◄─────┤  Solicitar      │
│ (FreightService)│      │  Flete          │
└─────────────────┘      └─────────────────┘
```

## 🚀 Próximos Pasos Recomendados

1. ✅ Ejecutar la migración SQL
2. ✅ Verificar la tabla en Supabase
3. ⏳ Regenerar tipos de TypeScript (opcional)
4. ⏳ Probar modificación desde el dashboard
5. ⏳ Verificar que las cotizaciones usan los nuevos valores
6. ⏳ Documentar los valores actuales de producción

## 📞 Soporte

Si encuentras algún problema:
1. Verifica los logs de la consola del navegador
2. Revisa los logs de Supabase (Dashboard → Logs)
3. Verifica que el usuario sea admin (`role = 'admin'` en tabla `clients`)
