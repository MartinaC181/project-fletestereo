# 🧪 Pruebas del Sistema de Pricing Rules Dinámicas

## ✅ Lista de Verificación Post-Migración

### 1. Verificar que la tabla existe en Supabase

```sql
-- Ejecuta esto en Supabase SQL Editor
SELECT * FROM pricing_rules WHERE config_key = 'active_config';
```

**Resultado esperado:**
- Debe retornar 1 fila con los valores por defecto:
  - precio_minimo_flete: 20000
  - precio_combustible_km: 300
  - extra_piso_escalera: 10000
  - porcentaje_senia_larga: 50
  - limite_km_corta: 1

---

### 2. Verificar Políticas RLS

```sql
-- Verificar que las políticas existen
SELECT * FROM pg_policies WHERE tablename = 'pricing_rules';
```

**Resultado esperado:**
- Debe mostrar 3 políticas:
  1. "Anyone can read pricing rules" (SELECT)
  2. "Only admins can update pricing rules" (UPDATE)
  3. "Only admins can insert pricing rules" (INSERT)

---

### 3. Probar Dashboard Administrativo

#### 3.1. Acceso al Dashboard
1. Inicia sesión como usuario administrador
2. Ve a `/dashboard`
3. Haz clic en la pestaña **"Tarifas y Reglas"**

**✅ Debe mostrar:**
- Un formulario con 5 campos editables:
  - Precio Mínimo (ARS)
  - Precio Combustible (ARS por KM)
  - Extra por Escalera (ARS por Piso)
  - % Seña Interurbana
  - Límite KM Recorrido Corto

#### 3.2. Cargar Valores desde BD
**✅ Verifica:**
- Los campos deben cargarse con los valores actuales de la BD
- Si ves "Cargando..." y luego se muestran los valores = ✅ CORRECTO
- Si ves error = ❌ Ver sección de Troubleshooting

#### 3.3. Modificar y Guardar
1. Cambia el valor de **"Precio Mínimo"** a `25000`
2. Haz clic en **"Guardar Cambios"**

**✅ Verifica:**
- Debe mostrar un toast de éxito: "¡Guardado!"
- El botón debe mostrar "Guardando..." temporalmente

#### 3.4. Verificar en BD
```sql
SELECT precio_minimo_flete FROM pricing_rules WHERE config_key = 'active_config';
```

**✅ Debe mostrar:** `25000.00` (el nuevo valor)

---

### 4. Probar Sistema de Cotizaciones

#### 4.1. Solicitar un Flete
1. Ve a `/solicitar-flete`
2. Completa los datos:
   - Origen: "Av. 3 de Abril 1500, Corrientes"
   - Destino: "San Lorenzo 1200, Corrientes"
   - Fecha: [cualquier fecha futura]
   - Franja horaria: "Mañana"
   - Tipo de servicio: "Flete Liviano"
   - Pisos por escalera: 2

3. Haz clic en **"Calcular Ruta"**
4. Haz clic en **"Calcular Cotización"**

**✅ Verifica:**
- La cotización debe usar el nuevo valor de precio mínimo (25000)
- El extra por escalera debe aplicarse (2 pisos × valor configurado)
- El precio por km debe calcularse según el valor configurado

#### 4.2. Verificar Cálculo
**Fórmula esperada (viajes interurbanos):**
```
Total = MAX(
  PRECIO_MINIMO_FLETE,
  (PRECIO_COMBUSTIBLE_KM × km)
) + (EXTRA_PISO_ESCALERA × pisos)
```

**Con los valores modificados:**
- Precio Mínimo: 25000 (se usa si km × PRECIO_COMBUSTIBLE_KM < 25000)
- Si distancia es 10 km: 10 × 300 = 3000 → **se cobra 25000** (el mínimo)
- Si distancia es 100 km: 100 × 300 = 30000 → **se cobra 30000** (supera el mínimo)
- Extra por escalera: 2 pisos × 10000 = 20000 (se suma al total)

---

### 5. Probar Fallback (Opcional)

#### 5.1. Simular Fallo de Conexión
1. En DevTools (F12) → Network → Throttling → Offline
2. Recarga la página del dashboard
3. Ve a "Tarifas y Reglas"

**✅ Verifica:**
- Debe cargar los valores desde localStorage (cache)
- Si nunca se guardó cache, usará valores por defecto

---

## 🐛 Troubleshooting

### Error: "No se pudieron cargar las tarifas"

**Posibles causas:**

1. **La tabla no existe**
   ```sql
   -- Verifica que la tabla existe
   SELECT * FROM information_schema.tables WHERE table_name = 'pricing_rules';
   ```
   - Si no existe: Re-ejecuta la migración

2. **No hay datos en la tabla**
   ```sql
   -- Verifica que hay datos
   SELECT COUNT(*) FROM pricing_rules;
   ```
   - Si count = 0: Ejecuta el INSERT de la migración manualmente

3. **Políticas RLS bloquean lectura**
   ```sql
   -- Desactiva temporalmente RLS para probar
   ALTER TABLE pricing_rules DISABLE ROW LEVEL SECURITY;
   -- Luego prueba cargar
   -- Y vuelve a activar
   ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
   ```

---

### Error: "No se pudieron guardar los cambios"

**Posibles causas:**

1. **Usuario no es admin**
   ```sql
   -- Verifica tu rol
   SELECT id, nombre, apellido, role FROM clients WHERE id = 'TU_USER_ID';
   ```
   - Si role ≠ 'admin': Actualiza el rol
   ```sql
   UPDATE clients SET role = 'admin' WHERE id = 'TU_USER_ID';
   ```

2. **Políticas RLS bloquean UPDATE**
   ```sql
   -- Verifica las políticas
   SELECT * FROM pg_policies WHERE tablename = 'pricing_rules';
   ```
   - Asegúrate de que la policy UPDATE existe

---

### Los cambios no se reflejan en cotizaciones

**Solución:**

1. **Limpia el cache del navegador**
   - F12 → Application → Local Storage → Elimina todo
   - Recarga la página

2. **Verifica en consola del navegador**
   ```javascript
   // En la consola del navegador (F12)
   const rules = await configService.getPricingRules();
   console.log(rules);
   ```
   - Verifica que los valores sean los correctos

3. **Verifica logs del servidor**
   - Abre la consola de Node.js donde corre el servidor
   - Busca logs como: `[ConfigService] Reglas obtenidas desde Supabase`

---

## 📊 Registro de Pruebas

### Checklist de Verificación

- [ ] Tabla `pricing_rules` existe en Supabase
- [ ] Registro con `config_key = 'active_config'` existe
- [ ] Políticas RLS están activas y funcionan
- [ ] Dashboard carga valores correctamente
- [ ] Dashboard guarda cambios en Supabase
- [ ] Cotizaciones usan los nuevos valores
- [ ] Cache (localStorage) funciona como fallback
- [ ] Trigger `updated_at` actualiza automáticamente
- [ ] Campo `updated_by` guarda el ID del admin

### Resultados de Pruebas

| Prueba | Fecha | Estado | Notas |
|--------|-------|--------|-------|
| Crear tabla | ______ | ⬜ | |
| Cargar valores | ______ | ⬜ | |
| Guardar cambios | ______ | ⬜ | |
| Cotización usa nuevos valores | ______ | ⬜ | |
| RLS funciona correctamente | ______ | ⬜ | |

**Estados:** ✅ Éxito | ❌ Fallo | ⚠️ Parcial | ⬜ No probado

---

## 🎯 Valores Actuales de Producción

Documenta aquí los valores reales que decides usar:

```
PRECIO_MINIMO_FLETE: __________ ARS
PRECIO_COMBUSTIBLE_KM: __________ ARS
EXTRA_PISO_ESCALERA: __________ ARS
PORCENTAJE_SENIA_LARGA: __________ %
LIMITE_KM_CORTA: __________ km
```

**Última actualización:** __________  
**Actualizado por:** __________

---

## 📞 Próximos Pasos

Si todas las pruebas pasan:

1. ✅ Documenta los valores de producción
2. ✅ Haz backup de la BD
3. ✅ Commit y push de los cambios
4. ✅ Monitorea logs por 24-48 horas
5. ✅ Capacita a otros admins sobre cómo usar el sistema

Si alguna prueba falla:
- Revisa la sección de Troubleshooting
- Verifica logs de Supabase
- Contacta soporte si es necesario
