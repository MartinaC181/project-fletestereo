# 🚚 Fletestereo - Sistema de Gestión de Fletes

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?style=flat-square&logo=tailwindcss)

> **Trabajo Final Integrador - Universidad Tecnológica Nacional**

## 📋 Descripción del Proyecto

**Fletestereo** es una aplicación web moderna para la gestión integral de servicios de flete y mudanzas en Corrientes Capital, desarrollada como Trabajo Final Integrador (TFI) para la UTN.

### 🏢 Sobre la Empresa

Fletestereo es un emprendimiento con **10 años de trayectoria** en Corrientes y localidades cercanas, especializado en servicios de flete y mudanzas. Dirigido por **Daniel Acevedo**, se caracteriza por brindar un servicio responsable, económico y de calidad.

## 🎯 Problemática y Solución

### ❌ **Problemática Actual**
- **Gestión manual** de solicitudes de flete
- **Falta de centralización** en confirmaciones/rechazos
- **Dificultades** en programación de agenda
- **Gestión compleja** de señas para viajes largos  
- **Información dispersa** para clientes
- **Ausencia de métricas** operativas

### ✅ **Solución Propuesta**
Sistema web con **arquitectura dual**:
- **🧑‍💼 Perfil Cliente**: Solicitudes, cotizaciones automáticas y seguimiento
- **👨‍💼 Perfil Propietario**: Dashboard administrativo, agenda y métricas

## ⚡ Funcionalidades Principales

### 👥 **Módulo Cliente**
- **🔐 Autenticación Opcional** - Registro o uso como invitado
- **📍 Solicitud de Servicio** - Origen, destino, fecha, horario y detalles
- **💰 Cotización Automática** - Cálculo transparente con desglose de costos
- **💳 Pago de Seña** - Integración Mercado Pago para viajes largos
- **📱 Notificaciones** - Confirmaciones y recordatorios automáticos
- **ℹ️ Información Pública** - Tarifas, zonas, políticas y contacto

### 👨‍💼 **Módulo Propietario**
- **📋 Bandeja de Solicitudes** - Confirmar/rechazar con registro de motivos
- **📅 Agenda Operativa** - Vista calendario sin solapamientos
- **👥 Gestión de Clientes** - CRUD completo y fusión de perfiles
- **📊 Dashboard de Métricas** - Estadísticas de viajes e ingresos
- **⚙️ Configuración Avanzada** - Tarifas, reglas y plantillas personalizables

## 🔧 Requerimientos Funcionales
| **ID** | **Funcionalidad** 
| **RF-01** | Alta y autenticación opcional de clientes 
| **RF-02** | Solicitud como invitado (guest) 
| **RF-03** | Solicitud completa de servicio 
| **RF-04** | Geocodificación y cálculo de distancia
| **RF-05** | Sistema de cotización transparente 
| **RF-06** | Regla de seña para viajes largos
| **RF-07** | Integración de pago de seña
| **RF-08** | Confirmación y bloqueo de agenda 
| **RF-09** | Bandeja administrativa del propietario 
| **RF-10** | Agenda operativa con calendario 
| **RF-11** | Gestión de clientes y recursos 
| **RF-12** | Sistema de notificaciones automáticas 
| **RF-13** | Información pública del servicio 
| **RF-14** | Dashboard con métricas operativas
| **RF-15** | Configuración de reglas de negocio

## 🛠️ Stack Tecnológico

### **Frontend**
| Tecnología | Versión | Función |
|------------|---------|---------|
| **Next.js** | 14.2.33 | Framework React con App Router |
| **React** | 18+ | Biblioteca para interfaces de usuario |
| **TypeScript** | 5+ | Tipado estático para JavaScript |
| **Tailwind CSS** | 3.4+ | Framework de estilos utilitarios |
| **shadcn/ui** | Latest | Componentes UI reutilizables |
| **Framer Motion** | Latest | Animaciones y transiciones |

### **Backend**
| Tecnología | Función |
|------------|---------|
| **Supabase** | Backend como servicio (BaaS) |
| **PostgreSQL** | Base de datos relacional |
| **Supabase Auth** | Autenticación y autorización |
| **Supabase Realtime** | Actualizaciones en tiempo real |

### **Servicios Externos**
| Servicio | Función |
|----------|---------|
| **Google Maps API** | Geocodificación y cálculo de distancias |
| **Mercado Pago** | Pasarela de pagos para señas |
| **Twilio/Nodemailer** | Notificaciones por email/SMS |

## 🚀 Instalación y Desarrollo

### **Prerrequisitos**
```bash
Node.js >= 18.0.0
npm o yarn
Cuenta de Supabase
Google Maps API Key
```

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/MartinaC181/project-fletestereo.git

# Instalar dependencias
cd project-fletestereo
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en modo desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
npm run dev          # Desarrollo local
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
npm run lint         # Análisis de código
npm run type-check   # Verificación TypeScript
```

## 📁 Estructura del Proyecto

```
project-fletestereo/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Rutas de autenticación
│   ├── admin/              # Dashboard administrativo
│   ├── api/                # API routes
│   └── globals.css         # Estilos globales
├── components/             # Componentes React
│   ├── pages/              # Componentes de páginas
│   └── ui/                 # Componentes UI reutilizables
├── lib/                    # Utilidades y configuraciones
├── types/                  # Definiciones TypeScript
├── modules/                # Módulos de lógica de negocio
│   ├── freight/            # Gestión de fletes
│   ├── payments/           # Procesamiento de pagos
│   └── notifications/      # Sistema de notificaciones
├── integrations/           # Integraciones externas
│   └── supabase/           # Configuración Supabase
└── public/                 # Archivos estáticos
```

## 📈 Plan de Desarrollo (Sprints)

### **Sprint 1 - Análisis y Diseño** (45hs) ✅
- ✅ Levantamiento de requerimientos completo
- ✅ Modelo ER y diseño de base de datos
- ✅ Prototipo UI/UX en Canva
- ✅ Arquitectura conceptual validada

### **Sprint 2 - Backend Básico** (75hs) ✅
- ✅ Configuración inicial de Supabase
- ⏳ Sistema de autenticación opcional
- ⏳ API de cotización automática
- ⏳ Reglas de seña configurables

### **Sprint 3 - Frontend Cliente** (60hs) ✅
- ⏳ Formularios de solicitud completos
- ✅ Integración frontend-backend
- ✅ Sección de información pública
- ⏳ Sistema de validaciones

### **Sprint 4 - Módulos Críticos** (60hs) ⏳
- ⏳ Integración Mercado Pago
- ⏳ Agenda operativa sin solapamientos
- ⏳ Sistema de notificaciones
- ⏳ Bandeja administrativa

### **Sprint 5 - Dashboard y Cierre** (45hs) ⏳
- ⏳ Dashboard con métricas operativas
- ⏳ Configuración avanzada de reglas
- ⏳ Pruebas integradas
- ⏳ Documentación final

## 👥 Equipo de Desarrollo

### **Martina Canteros** 
### **Máximo Masdeu** - 
### **Esteban Cardozo** 


### 🎓 **Institución Académica**
- **Universidad**: Universidad Tecnológica Nacional (UTN)
- **Facultad**: Facultad Regional Resistencia (FRRe)
- **Carrera**: Tecnicatura Superior en Programación
- **Año**: 2025

<div align="center">

**Desarrollado con ❤️ por el equipo CodeRRientes**

</div>
























