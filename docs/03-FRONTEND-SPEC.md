# 03 — Frontend Spec: Diseño y Experiencia de Usuario

## Principios de diseño

### Estética
- **Mobile-first.** Diseñar para 375px, escalar a desktop.
- **Oscuro con acentos de color.** Base dark (#0B0E1A), textos claros,
  los colores de los arquetipos como protagonistas.
- **Editorial, no dashboard.** Esto no es un panel de control. Es una experiencia
  que revela algo sobre ti. Tipografía grande, espacios generosos, animaciones
  que construyen anticipación.
- **Tipografía con personalidad.** Display font para títulos (ej: Cabinet Grotesk,
  Clash Display, o Satoshi). Body font limpia (ej: General Sans, Plus Jakarta Sans).
  NUNCA Inter, Roboto, o Arial.
- **Micro-animaciones con propósito.** Cada transición debe sentirse como
  "desvelar" algo nuevo, no como una carga de página.

### UX
- **De input a resultado en <5 segundos.** La animación de loading cuenta como
  experiencia, no como espera.
- **El resultado se revela progresivamente.** No todo de golpe: primero el
  arquetipo, luego el multiplicador, luego los bloques. Storytelling visual.
- **El curso aparece en contexto.** Nunca como banner lateral o sección separada.
  Siempre dentro del flujo de cada bloque, como "siguiente paso natural".
- **Share con un toque.** El botón de compartir es prominente y la card se
  genera sin fricción.

---

## Pantalla 1: Landing / Hero

### Layout mobile (375px)
```
┌─────────────────────────┐
│                         │
│   [Logo pequeño]        │
│                         │
│   ¿Cuál es tu           │
│   Perfil IA?            │  ← Título grande, tipografía display
│                         │
│   Descubre cómo la IA   │
│   amplifica tu rol      │  ← Subtítulo en color muted
│   profesional            │
│                         │
│   ┌───────────────────┐ │
│   │ Ej: Product Mgr   │ │  ← Input con placeholder animado
│   └───────────────────┘ │     que rota entre roles
│   ┌─────────────────┐   │
│   │    Descubrir     │   │  ← Botón CTA principal, color accent
│   └─────────────────┘   │
│                         │
│   Roles populares:      │
│   [PM] [Abogado] [CFO]  │  ← Pills clickables
│   [Periodista] [Dev]    │
│                         │
│   ─────────────────     │
│   o analiza desde       │
│   tu perfil LinkedIn    │  ← Solo si está autenticado
│                         │
│   Basado en O*NET y     │
│   metodología de        │
│   Harvard/MIT/Stanford  │  ← Footer de credibilidad, discreto
│                         │
└─────────────────────────┘
```

### Interacciones
- El placeholder del input rota cada 3s: "Product Manager", "Abogado corporativo",
  "Director financiero", "Arquitecto", "Data Engineer"...
- Al escribir, si hay match parcial con el catálogo, mostrar sugerencias
  debajo del input (autocomplete ligero).
- Al pulsar Enter o botón, transición a pantalla de loading.

---

## Pantalla 2: Loading / Análisis

### Concepto
No es una pantalla de espera. Es una secuencia de "revelación" con 3 pasos
que construyen anticipación. Duración total: 3-5 segundos (real) pero se siente
como experiencia, no como lag.

### Secuencia
```
Paso 1 (0-1.5s):
"Analizando tu rol..."
[Animación: partículas/ondas que se forman alrededor de una silueta profesional]

Paso 2 (1.5-3s):
"Cruzando con datos de 900+ ocupaciones y 19.000 tareas..."
[Animación: las partículas se organizan en bloques]

Paso 3 (3-4.5s):
"Calculando tu Perfil IA..."
[Animación: los bloques convergen en el resultado]
```

### Nota técnica
La llamada API se lanza inmediatamente al entrar en esta pantalla.
Las animaciones son independientes de la API — si la API responde en 2s,
la animación se acelera suavemente. Si tarda 5s, la animación se extiende.
Nunca se muestra un spinner genérico.

---

## Pantalla 3: Resultado

### Revelación progresiva
El resultado NO aparece todo de golpe. Se desvela en secuencia:

#### Momento 1: El Arquetipo (staggered fade-in, 0.3s)
```
┌─────────────────────────┐
│                         │
│   Tu Perfil IA          │  ← Label pequeña, muted
│                         │
│   ┌───────────────────┐ │
│   │  🔶                │ │  ← Icono del arquetipo, grande
│   │  EL CONECTOR       │ │  ← Nombre en caps, tipografía display
│   │                    │ │
│   │  Conectas mundos   │ │  ← Tagline del arquetipo
│   │  que la IA no      │ │
│   │  puede conectar    │ │
│   └───────────────────┘ │
│                         │
```

#### Momento 2: El Multiplicador (aparece 0.5s después)
```
│         2.8×            │  ← Número grande, animado contando
│   potencial de          │     desde 1.0 hasta 2.8
│   amplificación         │
│                         │
│   "4 de tus 6           │  ← Mensaje resumen personalizado
│   actividades se        │
│   potencian con IA"     │
│                         │
```

#### Momento 3: Los Bloques (aparecen 0.5s después, staggered)
```
│   Tu día a día          │  ← Section header
│                         │
│   ┌───────────────────┐ │
│   │ 🟢 Negociación    │ │  ← Verde = ventaja humana
│   │ y cierre           │ │
│   │ "Aquí eres          │ │
│   │ irremplazable"     │ │
│   │              → Ver │ │
│   └───────────────────┘ │
│   ┌───────────────────┐ │
│   │ 🟡 Análisis de    │ │  ← Amarillo = zona transformación
│   │ mercado            │ │
│   │ "La IA acelera tu  │ │
│   │ investigación 4x"  │ │
│   │              → Ver │ │
│   └───────────────────┘ │
│   ┌───────────────────┐ │
│   │ 🔴 Preparación    │ │  ← Rojo = presión IA
│   │ de informes        │ │
│   │ "Esto ya lo hace   │ │
│   │ la IA igual"       │ │
│   │              → Ver │ │
│   └───────────────────┘ │
│   ... (3-4 bloques más) │
│                         │
```

#### Momento 4: CTA de compartir (aparece al final del scroll)
```
│   ┌───────────────────┐ │
│   │  Comparte tu       │ │
│   │  Perfil IA         │ │
│   │                    │ │
│   │  [LinkedIn] [Copy] │ │
│   │  [WhatsApp] [X]   │ │
│   └───────────────────┘ │
│                         │
│   Ya sé en qué áreas   │  ← Texto aspiracional
│   activar mi potencial. │
│   ¿Has analizado        │
│   el tuyo?              │
│                         │
```

---

## Pantalla 4: Detalle de bloque (drawer desde abajo en mobile)

### Layout
```
┌─────────────────────────┐
│   ✕                     │  ← Cerrar
│                         │
│   Análisis de datos     │  ← Título del bloque
│   y mercado             │
│   ──────────── 68       │  ← Score con barra visual
│                         │
│   🟡 Zona de            │  ← Categoría con badge
│   transformación         │
│                         │
│   La IA te potencia     │  ← Dirección
│                         │
│   Cuando preparas       │  ← Descripción personalizada
│   valoraciones y        │     (del LLM, Paso 5)
│   comparables de        │
│   mercado...            │
│                         │
│   ─────────────────     │
│                         │
│   Detalle por           │  ← Expandible: tareas individuales
│   actividades ▼         │
│                         │
│   ─────────────────     │
│                         │
│   Tu siguiente paso     │  ← Sección de curso
│                         │
│   ┌───────────────────┐ │
│   │ [Coursera logo]   │ │
│   │ AI-Powered Real   │ │  ← Título del curso
│   │ Estate Analytics  │ │
│   │                   │ │
│   │ El curso que más  │ │  ← Pitch contextualizado
│   │ usan los          │ │
│   │ consultores que   │ │
│   │ ya analizan       │ │
│   │ mercado con IA    │ │
│   │                   │ │
│   │ [Ver curso →]     │ │  ← Enlace de afiliado
│   └───────────────────┘ │
│                         │
│   ┌───────────────────┐ │
│   │ [LinkedIn logo]   │ │  ← Segundo curso alternativo
│   │ Data Analysis     │ │
│   │ for Real Estate   │ │
│   │ [Ver curso →]     │ │
│   └───────────────────┘ │
│                         │
└─────────────────────────┘
```

---

## Pantalla 5: Landing de share (cuando alguien abre un enlace compartido)

### URL: /resultado/consultor-inmobiliario-senior?ref=share

### Layout
```
┌─────────────────────────┐
│                         │
│   María se ha           │  ← Si tenemos nombre (LinkedIn)
│   analizado como        │     Si no: "Un profesional ha analizado..."
│   Consultora            │
│   Inmobiliaria Senior   │
│                         │
│   Su perfil IA:         │
│   El Conector · 2.8×    │  ← Datos del share
│                         │
│   ─────────────────     │
│                         │
│   ¿Cuál es tu           │
│   Perfil IA?            │  ← CTA prominente
│                         │
│   ┌───────────────────┐ │
│   │ Escribe tu rol    │ │
│   └───────────────────┘ │
│   ┌─────────────────┐   │
│   │    Descubrir     │   │
│   └─────────────────┘   │
│                         │
│   +42.000 profesionales │  ← Social proof (cuando haya datos)
│   ya conocen su         │
│   Perfil IA             │
│                         │
└─────────────────────────┘
```

---

## Colores

```css
--bg: #0B0E1A;
--surface: rgba(255,255,255,0.04);
--border: rgba(255,255,255,0.08);
--text: #E8ECF4;
--muted: #8895B0;

/* Categorías de bloques */
--presion: #EF4060;
--transformacion: #E8A830;
--ventaja: #22C088;

/* Arquetipos */
--orquestador: #6E5CFF;
--estratega: #0A66C2;
--acelerado: #22C088;
--conector: #E8A830;
--pionero: #EF4060;
```

---

## Responsividad

### Mobile (375-768px)
- Layout vertical, bloques apilados
- Drawer de detalle sube desde abajo (sheet)
- Tipografía display: 32px título principal, 48px multiplicador

### Tablet (768-1024px)
- Bloques en grid de 2 columnas
- Drawer lateral derecho

### Desktop (1024px+)
- Arquetipo y multiplicador a la izquierda (sticky), bloques a la derecha
- Drawer lateral derecho con más espacio
- Max-width: 1200px

---

## Animaciones clave (Framer Motion)

1. **Entrada de resultado:** staggered reveal — arquetipo, multiplicador, bloques
   aparecen en secuencia con spring animation (stiffness: 100, damping: 15)
2. **Multiplicador:** countUp animado de 1.0 a valor final (duration: 1.2s, ease: easeOut)
3. **Bloques:** fade-in + slide-up con delay incremental (0.1s entre bloques)
4. **Drawer de detalle:** slide-up from bottom con backdrop blur
5. **Share button:** pulse animation sutil para llamar la atención después de
   que el usuario haya scrolleado los bloques
