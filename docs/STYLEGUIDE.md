# Guía de Estilo de UI para Fletestereo

Esta guía describe el diseño visual, los componentes y los principios de la interfaz de la aplicación Fletestereo. El objetivo es crear una experiencia de usuario limpia, moderna y confiable que refleje el profesionalismo y la fiabilidad de nuestra marca.

### 1. Identidad de Marca

* **Personalidad**: Profesional, confiable, amigable y eficiente.
* **Logo**: El logo de Fletestereo debe usarse en el encabezado y otras áreas clave de la marca. El color principal del logo es nuestro color de acento principal.

### 2. Paleta de Colores

Nuestro sistema de colores se basa en valores HSL para facilitar la personalización y la creación de temas.

| Rol | Tema Claro (HSL) | Tema Oscuro (HSL) | Uso |
| :--- | :--- | :--- | :--- |
| **Primary** | `222.2 47.4% 11.2%` | `210 40% 98%` | Texto principal, botones primarios, encabezados clave. |
| **Primary Deep**| `222.2 84% 25%` | `217.2 91.2% 59.8%` | Degradados, estados `hover` para elementos primarios. |
| **Accent Yellow**| `48 100% 60%` | `48 100% 60%` | Botones de llamada a la acción (CTA), iconos, elementos destacados. |
| **Background** | `0 0% 100%` | `222.2 84% 4.9%` | Fondo principal de la página. |
| **Secondary** | `220 13% 96%` | `217.2 32.6% 17.5%`| Botones secundarios, fondos de tarjetas. |
| **Muted** | `220 13% 96%` | `217.2 32.6% 17.5%`| Texto atenuado, bordes, separadores. |
| **Destructive** | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Mensajes de error, botones de eliminación, advertencias. |

---

### 3. Tipografía

* **Fuentes de Títulos**: **Fredoka One** (o una fuente sans-serif redondeada y en negrita como alternativa).
* **Fuentes de Cuerpo**: Fuentes sans-serif predeterminadas del sistema.
* **Encabezados**:
    * **H1 (Títulos de página, Hero)**: `text-4xl` a `text-6xl`, `font-bold`, `text-primary`.
    * **H2 (Títulos de sección)**: `text-3xl` a `text-4xl`, `font-bold`, `text-primary`.
    * **H3 (Títulos de tarjeta)**: `text-xl`, `font-semibold`, `text-primary`.
* **Texto Principal**: `text-base` o `text-lg`, `text-foreground` para contenido principal y `text-muted-foreground` para descripciones.
* **Etiquetas (Labels)**: `text-sm`, `font-medium`.

---

### 4. Estilo de Componentes

#### Botones

Basado en `src/components/ui/button.tsx`, tenemos varias variantes clave:

* **`hero`**: Es el botón principal de llamada a la acción (CTA).
    * **Estilo**: Degradado de `--accent-yellow` a `yellow-500`, texto `primary`, `font-semibold`.
    * **Uso**: Para las acciones más importantes, como "Solicitar Flete Ahora" en la sección Hero.
* **`cta`**: Un botón CTA secundario pero fuerte.
    * **Estilo**: Fondo sólido de `--primary`, texto blanco, `font-medium`.
    * **Uso**: Para acciones principales de formularios, como "Calcular Cotización".
* **`outline`**: Para acciones secundarias.
    * **Estilo**: Fondo transparente con un borde.
* **`ghost`**: Para acciones terciarias que no necesitan un gran énfasis.
* **`destructive`**: Para acciones que implican eliminación o cancelación.

#### Tarjetas (Cards)

Las tarjetas (`src/components/ui/card.tsx`) son los contenedores principales para las secciones de contenido.

* **Estilo**: Esquinas redondeadas (`rounded-lg`), un borde ligero y una sombra sutil (`shadow-sm` o `shadow-lg` al pasar el mouse).
* **Uso**: Para agrupar información relacionada, como en `ServicesSection`, o para formularios.

#### Formularios

Los elementos de formulario (`Input`, `Select`, `Textarea`, `Label`) deben ser consistentes.

* **Estilo**: Usan una altura estándar de `h-10`. El color del borde es `--input`. Al enfocarse, deben tener un anillo visible usando `--ring`.
* **Etiquetas**: Deben colocarse encima del campo de entrada.
* **Estado de Error**: Las etiquetas y los mensajes de formulario deben usar el color `destructive` cuando ocurre un error de validación.

#### Iconos

* **Biblioteca**: **Lucide React** (`lucide-react`) es la biblioteca de iconos estándar.
* **Uso**: Los iconos se utilizan con frecuencia para proporcionar contexto visual. A menudo se colocan dentro de fondos circulares de colores para darles énfasis, como se ve en `ServicesSection.tsx` y `Hero.tsx`.

---

### 5. Layout y Espaciado

* **Grid**: Usa el sistema de grid de Tailwind para los layouts (ej. `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
* **Contenedor**: El contenido principal se envuelve en un `container` con un `max-w-4xl` o similar para mantener el contenido centrado y legible.
* **Espaciado**: Utiliza la escala de espaciado de Tailwind. Los espacios entre elementos suelen ser `gap-8`. El espacio vertical entre secciones es `py-16` o `py-24`.
* **Radio de Borde**: Usa variables CSS: `--radius` (0.5rem) para `lg`, `calc(var(--radius) - 2px)` para `md`, etc. Esto asegura consistencia en todos los componentes.

---

### 6. Tono de Voz

* **Claridad**: Usa un lenguaje claro y conciso. Por ejemplo, "Solicitar Flete" es preferible a "Enviar una Solicitud de Flete".
* **Profesionalismo**: El tono debe ser profesional pero accesible.
* **Orientación**: Ayuda a los usuarios a entender qué hacer a continuación. Los placeholders y descripciones de los formularios deben ser útiles (ej. "Dirección completa de donde retirar").