# 📧 Sistema de Notificaciones por Email - Fletestereo

## Flujo de Notificaciones

### 1. Cliente Confirma Flete
```mermaid
Cliente confirma solicitud → FreightService.createFreightRequest() 
                          ↓
                    Guardar en BD
                          ↓
                    Notificar Admin por Email
```

**Trigger**: Cuando se ejecuta `FreightService.createFreightRequest()`
**Email enviado a**: `masdeu398@gmail.com` (Admin)
**Contenido**: 
- Datos del cliente (nombre, teléfono, email)
- Detalles del flete (origen, destino, fecha, tipo de servicio)
- Cotización completa
- Enlace directo al dashboard

### 2. Admin Confirma Flete
```mermaid
Admin confirma en Dashboard → FreightService.updateFreightStatus('Confirmada')
                            ↓
                      Actualizar BD
                            ↓
                      Email al Cliente
```

**Trigger**: Cuando el admin confirma desde `OwnerDashboard`
**Email enviado a**: Email del cliente (si lo proporcionó)
**Contenido**:
- Confirmación del servicio
- Detalles del flete confirmado
- Próximos pasos
- Información de contacto

### 3. Admin Rechaza Flete
```mermaid
Admin rechaza en Dashboard → FreightService.updateFreightStatus('Rechazada', motivo)
                           ↓
                     Actualizar BD
                           ↓
                     Email al Cliente
```

**Trigger**: Cuando el admin rechaza desde `OwnerDashboard`
**Email enviado a**: Email del cliente (si lo proporcionó)
**Contenido**:
- Información sobre el rechazo
- Motivo del rechazo
- Alternativas disponibles
- Información de contacto

## Configuración Técnica

### Variables de Entorno
```env
EMAIL_USER=masdeu398@gmail.com
EMAIL_PASSWORD=tu_app_password_gmail
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Archivos Involucrados

#### Servicio de Notificaciones
- **Archivo**: `/src/lib/services/notification.service.ts`
- **Función**: Maneja el envío de emails usando nodemailer
- **Métodos**:
  - `notifyAdminNewFreight(freightRequest)`
  - `notifyClientFreightConfirmed(freightRequest)`
  - `notifyClientFreightRejected(freightRequest, reason)`

#### API Endpoint
- **Archivo**: `/src/app/api/notifications/route.ts`
- **Endpoint**: `POST /api/notifications`
- **Parámetros**:
  ```json
  {
    "freightId": "uuid",
    "type": "admin_new_freight" | "client_confirmed" | "client_rejected",
    "reason": "string" // Solo para rechazos
  }
  ```

#### FreightService Modificado
- **Archivo**: `/src/modules/freight/FreightService.ts`
- **Nuevos métodos**:
  - `notifyAdminNewFreight(freightId)` - Privado
  - `notifyClientFreightConfirmed(freightId)` - Privado
  - `notifyClientFreightRejected(freightId, reason)` - Privado

## Templates de Email

### Para Admin (Nueva Solicitud)
- **Subject**: `🚛 Nueva solicitud de flete #${id}`
- **Diseño**: Profesional con datos del cliente y cotización
- **CTA**: Botón "Ver en Dashboard"

### Para Cliente (Confirmación)
- **Subject**: `✅ ¡Tu flete ha sido confirmado! - Fletestereo`
- **Diseño**: Amigable con detalles del servicio
- **Info**: Próximos pasos y contacto

### Para Cliente (Rechazo)
- **Subject**: `❌ Información sobre tu solicitud de flete - Fletestereo`
- **Diseño**: Empático con explicación y alternativas
- **Info**: Motivo del rechazo y opciones de contacto

## Manejo de Errores

- ✅ **No bloquea el flujo principal**: Si falla el envío de email, no afecta la funcionalidad core
- ✅ **Logging detallado**: Todos los éxitos y errores se registran en console
- ✅ **Fallback graceful**: Si no hay email del cliente, se omite la notificación sin error

## Dependencias

```json
{
  "nodemailer": "^7.0.10",
  "@types/nodemailer": "^7.0.3"
}
```

## Testing Local

1. Configurar variables de entorno en `.env.local`
2. Usar App Password de Gmail (no la contraseña normal)
3. Probar el flujo completo:
   - Crear solicitud de flete → Admin recibe email
   - Confirmar en dashboard → Cliente recibe email
   - Rechazar en dashboard → Cliente recibe email