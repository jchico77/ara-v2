# 07 — Plan de Implementación Detallado + Prompt para el Equipo + Modelos Recomendados

---

## CAMBIOS DE DISEÑO A INCORPORAR (antes de implementar)

### Cambio 1: Plan de Acción como segundo producto
El resultado ya NO es una sola pantalla. Son dos momentos:

**Momento 1 — Diagnóstico (gratuito, compartible, viral):**
Arquetipo + Multiplicador + 6 Bloques funcionales con indicadores visuales.
NO incluye cursos. Es el gancho.

**Momento 2 — Plan de Acción (el paso con intent alto, donde monetizamos):**
CTA al final del diagnóstico: "Tu Plan de Acción: cómo pasar de 2.8x a 4.1x"
El usuario hace clic y accede a:
- Las 3 competencias emergentes que debe desarrollar (basadas en datos reales:
  WORKBank, LinkedIn Skills on the Rise, Anthropic Economic Index)
- Para cada competencia, un itinerario de 3 pasos:
  - Paso 1: "Entiende" → recurso gratuito (vídeo YouTube, charla TED, artículo)
  - Paso 2: "Pruébalo" → acción concreta gratuita ("abre ChatGPT y prueba X")
  - Paso 3: "Domínalo" → curso de pago (enlace de afiliado)

Frame: "Si cultivas estos 3 skills, tu potencial de amplificación pasa de 2.8x a 4.1x."
NO ponemos plazos temporales. El usuario pone su ritmo.

### Cambio 2: Competencias emergentes basadas en datos, no títulos inventados
En vez de un "nombre de rol futuro" (descartado por restar rigor), mostramos:
"Los profesionales de tu perfil que más se están adaptando están desarrollando
estas 3 competencias: [competencia 1], [competencia 2], [competencia 3]."

Fuentes para las competencias:
- WORKBank: skills con alta demanda de automatización + alta capacidad técnica
- LinkedIn Skills on the Rise 2026: categorías de crecimiento rápido
- Anthropic Economic Index: tareas donde la IA tiene mayor speedup

### Cambio 3: Fuentes del AI Capability Map actualizadas
Reemplazar dependencia de informes anuales por fuentes de tres velocidades:

**Diaria/semanal:**
- Blogs oficiales: anthropic.com/news, openai.com/blog, deepmind.google/blog, ai.meta.com/blog
- X/Twitter: @swyx, @emaborevko, @kaborel (hispano), @NathanLambert, @simonw
- Newsletters: The Rundown AI (diaria), Ben's Bites (diaria), TLDR AI (diaria)
- Substacks: Nathan Lambert, Simon Willison, Lenny's Newsletter (AI product)

**Mensual/trimestral:**
- Anthropic Economic Index (trimestral, datos observacionales)
- McKinsey / BCG / PwC reportes de adopción IA (cada 2-3 meses)
- Papers nuevos en arxiv sobre exposición laboral

**Semestral/anual (baseline):**
- State of AI Report (anual, octubre)
- Stanford AI Index Report (anual, abril)
- WEF Future of Jobs Report (anual, enero Davos)

Actualización trimestral del AI Capability Map: revisar anuncios de los labs
de los últimos 3 meses, actualizar niveles de madurez, añadir capacidades nuevas.

---

## Archivos a actualizar para implementar estos cambios

Los siguientes documentos deben actualizarse ANTES de empezar la implementación:

### 00-ARCHITECTURE.md
- Añadir sección "Plan de Acción" como segundo momento del producto
- Actualizar flujo de datos (diagnóstico → plan de acción)
- Añadir nueva ruta /api/action-plan/[slug]
- Añadir componentes: ActionPlanCTA, ActionPlanPage, CompetenceCard, StepCard

### 02-RUNTIME-API.md
- Añadir endpoint POST /api/action-plan con prompt para generar itinerario
- Definir schema JSON del plan de acción

### 03-FRONTEND-SPEC.md
- Añadir Pantalla 3b: CTA del Plan de Acción (al final del resultado)
- Añadir Pantalla 6: Página del Plan de Acción con itinerario de 3 competencias
- Cada competencia tiene los 3 pasos (entiende, pruébalo, domínalo)

### 05-COURSES.md
- Reestructurar: los cursos ya NO aparecen en los bloques del diagnóstico
- Aparecen solo en el Paso 3 del itinerario del Plan de Acción
- Añadir estructura para recursos gratuitos (Paso 1 y Paso 2)

### 06-ITERATIONS.md
- Mover cursos de Iteración 4 a una sub-fase dentro del Plan de Acción
- Añadir iteración específica para el Plan de Acción

### ai-capability-map.md
- Actualizar sección NOTAS DE MANTENIMIENTO con las fuentes de tres velocidades

---

## PLAN DE IMPLEMENTACIÓN DETALLADO (paso a paso)

### FASE 1: Setup del proyecto (2-3 horas)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 1.1 | Crear proyecto Next.js 15 con App Router, Tailwind v4, Framer Motion | Claude Sonnet 4.6 (plan Pro normal) | Scaffolding estándar, no necesita reasoning profundo |
| 1.2 | Configurar estructura de carpetas según 00-ARCHITECTURE.md | Claude Sonnet 4.6 | Tarea mecánica |
| 1.3 | Instalar dependencias: framer-motion, @vercel/og, anthropic SDK | Claude Sonnet 4.6 | Tarea mecánica |
| 1.4 | Configurar Tailwind con paleta de colores, fuentes custom (descargar tipografía display como Clash Display o Cabinet Grotesk), tema oscuro base | Claude Sonnet 4.6 | CSS/config, no requiere reasoning |
| 1.5 | Configurar despliegue en Vercel (conectar repo) | Manual (Javier) | Requiere credenciales |
| 1.6 | Crear archivo data/mock-catalog.json con 3 roles hardcodeados completos | Claude Opus 4.6 (Max Mode) | Aquí sí: generar datos realistas con la estructura completa requiere entender toda la arquitectura y producir JSON extenso y coherente |

**PARAR — Validar: proyecto arranca, se despliega, estructura correcta.**

---

### FASE 2: Landing / Hero (3-4 horas)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 2.1 | Implementar layout.tsx raíz: fuentes, metadata, theme provider | Claude Sonnet 4.6 | Layout estándar Next.js |
| 2.2 | Implementar componente Hero.tsx: título con tipografía display, subtítulo, animación de entrada | Claude Sonnet 4.6 | CSS + Framer Motion básico |
| 2.3 | Implementar RoleInput.tsx: input con placeholder rotativo animado, autocomplete contra mock-catalog | Claude Sonnet 4.6 | Componente interactivo estándar |
| 2.4 | Implementar pills de roles ejemplo clicables | Claude Sonnet 4.6 | UI simple |
| 2.5 | Revisar diseño mobile-first (375px), ajustar spacing, tipografía, touch targets | Claude Sonnet 4.6 | Responsive tweaks |
| 2.6 | Pulir animaciones de entrada: staggered fade-in del título, input, pills | Claude Sonnet 4.6 | Framer Motion |

**PARAR — Validar: landing se ve espectacular en mobile y desktop, input funciona.**

---

### FASE 3: Loading + Resultado con datos hardcodeados (4-5 horas)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 3.1 | Implementar LoadingSequence.tsx: 3 pasos con animaciones de partículas/ondas | Claude Opus 4.6 (Max Mode) | Animación compleja: partículas que se organizan en bloques. Requiere creatividad y código elaborado |
| 3.2 | Implementar ProfileCard.tsx: card principal con icono de arquetipo, nombre, tagline, multiplicador animado (countUp) | Claude Sonnet 4.6 | Componente visual pero estructuralmente simple |
| 3.3 | Implementar BlockGrid.tsx: grid de 6 bloques con indicadores de color, brief, categoría | Claude Sonnet 4.6 | Grid responsive con cards |
| 3.4 | Implementar revelación progresiva: ProfileCard → multiplicador → bloques con staggered delay | Claude Sonnet 4.6 | Framer Motion orchestration |
| 3.5 | Implementar BlockDetail.tsx: drawer/sheet desde abajo en mobile con detalle del bloque (sin cursos aún) | Claude Sonnet 4.6 | Bottom sheet pattern |
| 3.6 | Implementar ActionPlanCTA.tsx: card prominente al final "Tu Plan de Acción: pasa de X a Y" | Claude Sonnet 4.6 | UI card con CTA |
| 3.7 | Conectar flujo completo: escribir uno de los 3 roles mock → loading → resultado | Claude Sonnet 4.6 | Wiring de estado |
| 3.8 | Ajustar responsive: verificar todo el flujo en 375px, 768px, 1200px | Claude Sonnet 4.6 | CSS tweaks |

**PARAR — Validar: flujo completo funciona con datos mock. Javier evalúa: ¿el diseño engancha? ¿La revelación genera emoción? ¿Los arquetipos se entienden? ¿El CTA del plan de acción genera curiosidad?**

---

### FASE 4: API con LLM + catálogo mínimo (4-5 horas)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 4.1 | Crear catálogo precalculado con 30 roles (data/catalog.json). Usar script Python + Claude Opus para generar datos cruzando O*NET | Claude Opus 4.6 (Max Mode) | Generar 30 roles con bloques, scores, arquetipos coherentes. Tarea compleja de datos |
| 4.2 | Implementar lib/catalog.ts: funciones para leer y buscar en catálogo JSON | Claude Sonnet 4.6 | Lógica simple de búsqueda |
| 4.3 | Implementar lib/llm.ts: cliente para Anthropic API (Claude Sonnet 4.6 runtime) | Claude Sonnet 4.6 | API client estándar |
| 4.4 | Implementar lib/mapper.ts: prompt para mapear input → rol del catálogo (ver 02-RUNTIME-API.md) | Claude Opus 4.6 (Max Mode) | Diseño de prompt crítico — necesita reasoning para generar un prompt robusto que maneje edge cases |
| 4.5 | Implementar lib/narrator.ts: prompt para generar narrativas personalizadas (ver 02-RUNTIME-API.md) | Claude Opus 4.6 (Max Mode) | Otro prompt crítico — el tono y la personalización determinan la calidad percibida |
| 4.6 | Implementar API route /api/analyze/route.ts: orquesta mapper → catalog → narrator → response | Claude Sonnet 4.6 | Wiring de funciones, lógica lineal |
| 4.7 | Conectar frontend con API real, reemplazar mock data | Claude Sonnet 4.6 | Fetch + state management |
| 4.8 | Implementar manejo de errores y estados edge (rol no encontrado, timeout LLM) | Claude Sonnet 4.6 | Error handling estándar |
| 4.9 | Implementar caché simple (si mismo slug se consulta 2 veces, servir desde caché) | Claude Sonnet 4.6 | Lógica de caché básica |

**PARAR — Validar: escribir 15 roles diferentes. ¿Los resultados son creíbles? ¿Las narrativas son específicas? ¿Los arquetipos tienen sentido? ¿Latencia <5s?**

---

### FASE 5: Sistema de Share (3-4 horas)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 5.1 | Diseñar card visual para LinkedIn (1200×627) en Figma o directamente en JSX | Claude Opus 4.6 (Max Mode) | Diseño visual creativo — la card es el activo más importante de viralización |
| 5.2 | Implementar edge function /api/og/[slug]/route.ts con @vercel/og | Claude Sonnet 4.6 | Implementación técnica de Satori |
| 5.3 | Añadir meta tags OG dinámicos en página de resultado | Claude Sonnet 4.6 | HTML meta tags |
| 5.4 | Implementar ShareButton.tsx: opciones LinkedIn, WhatsApp, copiar enlace, descargar imagen | Claude Sonnet 4.6 | Componente con share APIs |
| 5.5 | Implementar landing de share: /resultado/[slug]?ref=share con CTA para analizar propio rol | Claude Sonnet 4.6 | Página simple con CTA |
| 5.6 | Verificar preview de LinkedIn: compartir un enlace real y ver que la card se renderiza correctamente | Manual (Javier) | Requiere cuenta LinkedIn real |

**PARAR — Validar: ¿la card es algo que Javier compartiría en LinkedIn? ¿El mensaje proyecta lo que queremos?**

---

### FASE 6: Plan de Acción + Cursos (4-5 horas)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 6.1 | Crear catálogo de recursos gratuitos: 30-50 vídeos YouTube, charlas TED, artículos mapeados a competencias | Claude Opus 4.6 (Max Mode) | Curación de contenido — necesita reasoning para seleccionar recursos relevantes y de calidad |
| 6.2 | Crear catálogo inicial de cursos: data/courses.json con ~50 cursos con enlaces de afiliado | Claude Opus 4.6 (Max Mode) | Curación de contenido |
| 6.3 | Implementar API route /api/action-plan/[slug]: genera itinerario de 3 competencias × 3 pasos | Claude Opus 4.6 (Max Mode) | Prompt complejo que combina datos del catálogo + competencias emergentes + recursos + cursos |
| 6.4 | Implementar ActionPlanPage.tsx: página con 3 CompetenceCards, cada una con 3 StepCards | Claude Sonnet 4.6 | Componentes UI |
| 6.5 | Implementar StepCard.tsx: diferente visual para Entiende (azul), Pruébalo (verde), Domínalo (accent) | Claude Sonnet 4.6 | UI cards |
| 6.6 | Conectar CTA del resultado con página del plan de acción | Claude Sonnet 4.6 | Routing |
| 6.7 | Añadir tracking: impression y click en cada recurso/curso | Claude Sonnet 4.6 | Event tracking |

**PARAR — Validar: ¿el plan de acción es valioso? ¿Los recursos gratuitos son buenos? ¿El paso al curso se siente natural? ¿Javier haría clic?**

---

### FASE 7: Expansión + Pulido + Lanzamiento (2-3 días)

| Paso | Tarea | Modelo Cursor | Razón |
|------|-------|---------------|-------|
| 7.1 | Expandir catálogo a 200 roles con script batch | Claude Opus 4.6 (via API, no Cursor) | Batch processing de datos |
| 7.2 | Expandir catálogo de cursos a ~150 | Claude Opus 4.6 (Max Mode) | Curación |
| 7.3 | Implementar autocomplete en input con sugerencias del catálogo | Claude Sonnet 4.6 | Componente UI |
| 7.4 | Pulir animaciones, transiciones, micro-interacciones | Claude Sonnet 4.6 | CSS/Motion tweaks |
| 7.5 | Testing mobile: iPhone SE, iPhone 15, Samsung Galaxy S24 | Manual | Requiere dispositivos |
| 7.6 | Lighthouse audit: objetivo >90 mobile | Claude Sonnet 4.6 | Performance optimization |
| 7.7 | Crear página /metodologia para credibilidad (footer link) | Claude Sonnet 4.6 | Página estática |
| 7.8 | Configurar dominio custom en Vercel | Manual (Javier) | Requiere DNS |
| 7.9 | Configurar Vercel Analytics | Claude Sonnet 4.6 | Setup estándar |
| 7.10 | Preparar 3-5 posts de lanzamiento para LinkedIn de Javier | Claude Opus 4.6 (Max Mode) | Copywriting estratégico |

**LANZAMIENTO**

---

## RESUMEN DE MODELOS POR FASE

| Fase | Sonnet 4.6 (Pro plan) | Opus 4.6 (Max Mode) | Notas |
|------|----------------------|---------------------|-------|
| 1. Setup | 5 de 6 pasos | 1 paso (mock data) | Opus solo para generar datos coherentes |
| 2. Landing | 6 de 6 pasos | 0 | Todo es UI estándar |
| 3. Resultado | 7 de 8 pasos | 1 paso (loading animation) | Opus para animación creativa compleja |
| 4. API + LLM | 6 de 9 pasos | 3 pasos (catálogo + prompts) | Opus para datos + diseño de prompts |
| 5. Share | 5 de 6 pasos | 1 paso (diseño visual card) | Opus para creatividad visual |
| 6. Plan Acción | 4 de 7 pasos | 3 pasos (curación + prompt) | Opus para contenido + prompt complejo |
| 7. Expansión | 6 de 10 pasos | 2 pasos (datos + copy) | Opus para batch y copywriting |

**Regla general:**
- **Claude Sonnet 4.6 (plan Pro normal):** 80% del trabajo. UI, componentes, wiring, APIs, responsive, testing. Es rápido, barato, y sobrado para código frontend/backend estándar.
- **Claude Opus 4.6 (Max Mode):** 20% del trabajo. Reservar para: (1) generar datos complejos y coherentes (catálogos), (2) diseñar prompts críticos que definen la calidad del producto, (3) animaciones creativas complejas, (4) diseño visual de la share card, (5) curación de contenido.

**NUNCA usar Opus para:** scaffolding, instalación de dependencias, configuración, responsive tweaks, error handling, routing, fetch calls. Es tirar dinero.

---

## PROMPT PARA EL EQUIPO DE IMPLEMENTACIÓN

Copiar y pegar esto al inicio de una sesión de Cursor cuando se empiece a implementar:

---

```
# CONTEXTO DEL PROYECTO

Estás implementando AI Role Analyzer v2, una web app B2C que analiza el impacto
de la IA en roles profesionales y monetiza con afiliación a cursos.

## Documentación
Lee estos archivos en orden antes de escribir código:
1. docs/00-ARCHITECTURE.md — Visión general, arquetipos, multiplicador, stack, estructura
2. docs/06-ITERATIONS.md — Plan de iteraciones con paradas de validación
3. docs/03-FRONTEND-SPEC.md — Diseño y UX del frontend
4. docs/02-RUNTIME-API.md — APIs del runtime
5. docs/07-IMPLEMENTATION-PLAN.md — Plan detallado paso a paso (estás aquí)

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion para animaciones
- @vercel/og (Satori) para generación de share cards
- Anthropic SDK para llamadas a Claude Sonnet 4.6
- Despliegue en Vercel (serverless)
- NO base de datos — catálogo precalculado en JSON estático

## Principios de código
- Mobile-first: diseñar para 375px, escalar a desktop
- Componentes pequeños y reutilizables
- TypeScript estricto: no usar `any`
- Tailwind para estilos: no CSS modules ni styled-components
- Framer Motion para toda animación: no CSS animations manuales
- Server Components por defecto, "use client" solo donde haya interactividad
- API routes son edge functions cuando sea posible
- Catálogo se lee de JSON estático, NO de base de datos

## Principios de diseño
- Tema oscuro base (#0B0E1A), textos claros, colores de arquetipo como protagonistas
- Tipografía con personalidad: fuente display para títulos (Clash Display o Cabinet Grotesk),
  body limpia (General Sans o Plus Jakarta Sans). NUNCA Inter, Roboto, o Arial
- Editorial, no dashboard: esto revela algo sobre ti, no es un panel de control
- Revelación progresiva: el resultado no aparece todo de golpe
- El curso aparece SOLO en el Plan de Acción, nunca en el diagnóstico

## Qué NO hacer
- No instalar base de datos
- No crear sistema de autenticación (excepto LinkedIn OAuth en fase 7)
- No crear admin panel
- No sobreoptimizar prompts antes de tener datos reales
- No usar componentes genéricos de librerías UI (no shadcn, no MUI) — diseñar custom
- No usar Inter, Roboto, ni ninguna fuente genérica
- No usar gradientes violeta sobre blanco (es la estética "AI slop" que evitamos)

## Proceso
Implementa fase por fase según docs/07-IMPLEMENTATION-PLAN.md.
Después de cada FASE, para y genera un resumen de lo implementado para
que Javier pueda validar antes de continuar.
```

---

## NOTAS PARA JAVIER

### Antes de empezar necesitas:
1. **Anthropic API Key** para las llamadas runtime a Claude Sonnet 4.6
2. **Cuenta de Vercel** (free tier es suficiente para empezar)
3. **Repositorio Git** (GitHub o similar) conectado a Vercel
4. **Tipografías:** descargar Clash Display (o Cabinet Grotesk) + General Sans de fontsource o directamente del sitio del diseñador
5. **Cuentas de afiliados** de Udemy y/o Coursera (puedes empezar sin esto y añadir enlaces después)

### Coste estimado
- **Vercel:** gratis (hobby plan) para empezar, ~$20/mes si hay tráfico
- **Anthropic API (runtime):** ~$0.003-0.01 por análisis (2 llamadas a Sonnet 4.6)
  → 1.000 análisis/día = ~$3-10/día
- **Cursor:** tu suscripción actual. Usar Max Mode con moderación (solo en los pasos marcados)
- **Dominio:** ~$12/año

### Cuándo usar Claude Code en vez de Cursor
Para la Fase 4 paso 4.1 (generar catálogo de 30 roles) y Fase 7 paso 7.1
(expandir a 200 roles), puede ser más eficiente usar Claude Code directamente
con un script Python largo que procese datos en batch, en vez de hacerlo
dentro de Cursor. Claude Code con Opus 4.6 tiene mejor contexto para
operaciones de datos masivas.
