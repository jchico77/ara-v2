# PROMPT MASTER PARA CLAUDE CODE
# Copiar y pegar esto como primer mensaje en Claude Code.
# Antes: tener la carpeta docs/ con los 9 archivos .md en el directorio de trabajo.

---

Eres un ingeniero senior full-stack implementando una web app desde cero.
Tienes la documentación completa en la carpeta `docs/`. Léela TODA antes
de escribir una sola línea de código.

## QUÉ ESTÁS CONSTRUYENDO

AI Role Analyzer: una web app B2C donde el usuario escribe su rol profesional
y recibe un "Perfil IA" con:
- Un ARQUETIPO profesional (El Orquestador, El Estratega, El Acelerado, 
  El Conector, El Pionero) — como un MBTI pero para tu relación con la IA
- Un MULTIPLICADOR (ej: 3.2×) — cuánto puede amplificarse tu productividad con IA
- 6 BLOQUES FUNCIONALES de tu día a día con indicadores de impacto
- Un PLAN DE ACCIÓN con 3 competencias a desarrollar, cada una con itinerario
  de 3 pasos (entiende → pruébalo → domínalo) que incluye cursos de pago

Monetización: afiliación a cursos (Udemy, Coursera, LinkedIn Learning).
Viralización: card compartible en LinkedIn con arquetipo + multiplicador.

## STACK OBLIGATORIO

- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS v4 (NO v3)
- Framer Motion para TODAS las animaciones
- @vercel/og (Satori) para generación de share cards
- Anthropic SDK (@anthropic-ai/sdk) para llamadas LLM en runtime
- Despliegue: Vercel (serverless)
- NO base de datos — catálogo en JSON estáticos
- NO shadcn/ui, NO MUI, NO component libraries — todo custom

## CÓMO EJECUTAR

Vas a trabajar en 3 GRANDES PASOS. Después de cada paso, para y muestra
un resumen de lo que has hecho para que yo valide.

### PASO 1: Proyecto + Datos + Landing (hazlo TODO antes de parar)

1. Inicializar proyecto Next.js 15 con App Router, TypeScript, Tailwind v4
2. Instalar dependencias: framer-motion, @vercel/og, @anthropic-ai/sdk
3. Configurar Tailwind con el tema oscuro y colores de docs/03-FRONTEND-SPEC.md
4. Descargar e instalar tipografías: usa Clash Display (bold) para display
   y General Sans para body. Si no puedes descargarlas, usa alternativas
   similares de Google Fonts como Space Grotesk (display) + DM Sans (body).
   NUNCA Inter, Roboto, ni Arial.
5. Generar data/catalog.json con 30 roles precalculados. Cada rol debe tener:
   - slug, title_es, title_en, aliases_es (3-5 sinónimos)
   - archetype (distribuidos: ~6 por arquetipo)
   - multiplier (rango 1.3 a 4.8, realista según el rol)
   - 6 bloques funcionales con: title, brief (8-12 palabras), description
     (2-3 frases), category (presion_ia/zona_transformacion/ventaja_humana),
     direction (automatizacion/aumentacion), score (0-100)
   - Para cada bloque: 2 tareas detalladas (statement + exposure E0/E1/E2)
   - summary_message personalizado
   - 3 competencias emergentes para el plan de acción
   
   Roles a incluir (asegúrate de cubrir los 5 arquetipos):
   Orquestadores: Product Manager, Director de Operaciones, CTO, 
     Scrum Master, Project Manager, Director de TI
   Estrategas: CFO, Abogado corporativo, Director médico,
     Auditor senior, Director de compliance, Juez
   Acelerados: Data Analyst, Desarrollador Full-Stack, Diseñador UX,
     Content Creator, Data Engineer, Investigador de mercado
   Conectores: Comercial B2B, HRBP, Account Manager, Periodista,
     Consultor inmobiliario, Psicólogo organizacional
   Pioneros: Customer Service Manager, Paralegal, Traductor,
     Operador de data entry, Community Manager, Asistente administrativo

6. Generar data/courses.json con ~60 cursos (2 por rol), con estructura:
   id, title, platform (Udemy/Coursera/LinkedIn), url (placeholder: "#"),
   affiliate_url (placeholder: "#"), skills [], level, pitch_es

7. Generar data/resources.json con ~90 recursos gratuitos (3 por rol):
   id, title, type (video/article/talk), url (URLs REALES de YouTube/TED),
   skill_area, description_es

8. Implementar página landing (src/app/page.tsx):
   - Hero con título grande en tipografía display: "¿Cuál es tu Perfil IA?"
   - Subtítulo muted
   - Input con placeholder rotativo (rota entre roles cada 3s)
   - Botón CTA "Descubrir"
   - Pills de roles ejemplo clicables (6-8 roles populares)
   - Footer discreto de credibilidad
   - Animación de entrada staggered (título → subtítulo → input → pills)
   - MOBILE FIRST: diseñar para 375px, escalar a desktop

PARA después de completar todo el Paso 1. Muéstrame qué has hecho.

### PASO 2: Flujo completo con datos mock (hazlo TODO antes de parar)

1. Implementar LoadingSequence.tsx:
   - 3 fases de texto ("Analizando tu rol...", "Cruzando con datos de
     900+ ocupaciones...", "Calculando tu Perfil IA...")
   - Animación visual sofisticada (NO un spinner genérico)
   - Duración ~3-4 segundos, independiente de la API
   
2. Implementar página de resultado (src/app/resultado/[slug]/page.tsx):
   - Revelación PROGRESIVA (no todo de golpe):
     a) Primero el arquetipo: icono + nombre ("EL CONECTOR") + tagline
     b) 0.5s después: multiplicador con countUp animado (1.0 → 2.8)
     c) 0.5s después: mensaje resumen personalizado
     d) 0.5s después: grid de 6 bloques con staggered fade-in
     e) Al final del scroll: CTA del Plan de Acción
   
3. Implementar ProfileCard.tsx (arquetipo + multiplicador):
   - Icono grande del arquetipo (usa emoji o SVG simple)
   - Nombre en CAPS, tipografía display, color del arquetipo
   - Tagline debajo
   - Multiplicador grande con animación countUp
   
4. Implementar BlockGrid.tsx + BlockCard.tsx:
   - Grid responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
   - Cada card: indicador de color (rojo/amarillo/verde), título, brief,
     categoría badge, flecha "Ver detalle"
   - Staggered entrance animation
   
5. Implementar BlockDetail.tsx (drawer/bottom sheet):
   - En mobile: sube desde abajo con backdrop blur
   - En desktop: panel lateral derecho
   - Contenido: score con barra visual, categoría, dirección,
     descripción completa, lista de tareas expandible
   
6. Implementar ActionPlanCTA.tsx:
   - Card prominente al final del resultado
   - "Tu Plan de Acción: cómo pasar de {multiplier}x a {target}x"
   - Botón CTA "Ver mi plan"

7. Implementar página Plan de Acción (src/app/plan/[slug]/page.tsx):
   - Header: "Los profesionales de tu perfil que más se adaptan
     están desarrollando estas 3 competencias:"
   - 3 CompetenceCards, cada una con:
     - Nombre de la competencia
     - 3 pasos:
       * Paso 1 "Entiende": recurso gratuito (vídeo/artículo/charla)
       * Paso 2 "Pruébalo": acción concreta gratuita
       * Paso 3 "Domínalo": curso de pago con enlace
     - Visual diferente para cada paso (iconos, colores distintos)
   - El curso (Paso 3) tiene badge de plataforma y botón "Ver curso →"

8. Implementar ShareButton.tsx:
   - Botón prominente "Comparte tu Perfil IA"
   - Al tocar: sheet con opciones (LinkedIn, WhatsApp, Copiar enlace)
   - Texto precargado para LinkedIn:
     "Mi Perfil IA como {rol}: {arquetipo}, {multiplier}× de potencial
     de amplificación. Ya sé en qué áreas activarlo. ¿Cuál es el tuyo?
     👉 {url}"
   
9. Implementar edge function /api/og/[slug]/route.ts:
   - Genera imagen PNG 1200×627 con @vercel/og
   - Contenido: fondo oscuro, icono arquetipo, nombre arquetipo,
     multiplicador grande, rol, CTA "Descubre tu Perfil IA"
   - Cacheable 24h

10. Implementar meta tags OG dinámicos en página de resultado

11. Implementar landing de share (cuando ?ref=share en URL):
    - Muestra datos del share (arquetipo + multiplicador)
    - CTA: "¿Cuál es tu Perfil IA?" con input

12. Conectar TODO el flujo con datos del catálogo JSON:
    - Escribir rol → buscar en catálogo (fuzzy match por título + aliases)
    - Si match → loading → resultado con datos del catálogo
    - Si no match → mostrar "Rol no encontrado, prueba con otro"

PARA después de completar todo el Paso 2. Muéstrame qué has hecho.

### PASO 3: API con LLM real + pulido (hazlo TODO antes de parar)

1. Implementar lib/llm.ts: cliente Anthropic API
   - Usar Claude Sonnet 4.6 (claude-sonnet-4-6)
   - API key desde variable de entorno ANTHROPIC_API_KEY

2. Implementar lib/mapper.ts:
   - Prompt que recibe el texto libre del usuario y la lista de slugs+títulos
     del catálogo, y devuelve el match más cercano (1-3 roles con pesos)
   - Debe manejar sinónimos, variaciones de idioma, seniority
   
3. Implementar lib/narrator.ts:
   - Prompt que recibe los datos precalculados de un rol y el contexto
     del usuario, y genera narrativas personalizadas para cada bloque
   - Tono: segunda persona, específico, sin jerga académica
   - Ver docs/02-RUNTIME-API.md para el prompt completo

4. Implementar API route /api/analyze/route.ts:
   - Paso 1: LLM mapea input → rol del catálogo (~1s)
   - Paso 2: Lee datos precalculados del catálogo (<0.1s)
   - Paso 3: LLM genera narrativas personalizadas (~2s)
   - Paso 4: Ensambla response JSON
   - Manejo de errores: timeout, rol no mappeable, LLM falla

5. Conectar frontend con API real (reemplazar búsqueda local por API call)

6. Implementar caché: si el mismo slug se consulta en <1 hora, servir
   resultado cacheado sin llamar al LLM

7. PULIDO FINAL:
   - Verificar responsive en 375px, 768px, 1200px
   - Verificar que todas las animaciones funcionan en Safari iOS
   - Verificar que los meta tags OG se renderizan correctamente
   - Verificar que el share de LinkedIn genera preview con imagen
   - Añadir página /metodologia con descripción del rigor (O*NET,
     Anthropic Economic Index, Eloundou et al.)
   - Lighthouse mobile: apuntar a >85
   - Asegurar que TODO funciona sin JavaScript (SSR fallback)

PARA después de completar todo el Paso 3. Muéstrame el resultado final.

## CRITERIOS DE CALIDAD (tu juicio debe seguir estos)

### Diseño
- NUNCA se debe ver genérico o "hecho por IA". Debe sentirse editorial,
  con personalidad, como una revista digital premium.
- Tema OSCURO (#0B0E1A base). Los colores de los arquetipos son los
  protagonistas sobre fondo oscuro.
- Tipografía display GRANDE en títulos. Espacios generosos.
- Las animaciones deben sentirse como "revelación", no como decoración.
- Mobile first SIEMPRE. Si tienes duda de layout, prioriza mobile.

### Código
- TypeScript estricto: no `any`, no `as unknown`
- Componentes pequeños (<100 líneas). Si supera, dividir.
- Server Components por defecto. "use client" solo donde haya interactividad.
- Tailwind para TODOS los estilos. No CSS modules.
- Framer Motion para TODA animación. No CSS @keyframes manuales.
- Variables de entorno: ANTHROPIC_API_KEY (nunca hardcodeada)

### Datos
- Los 30 roles del catálogo deben ser REALISTAS para el mercado laboral
  español. Títulos en español.
- Los multiplicadores deben seguir esta lógica:
  - Roles muy manuales/físicos (enfermera, electricista): 1.3-1.8x
  - Roles de juicio/relación (abogado, consultor, médico): 1.8-2.5x
  - Roles de análisis/gestión (PM, analista, HRBP): 2.5-3.5x
  - Roles de contenido/datos (developer, data analyst, copywriter): 3.5-4.8x
- Los arquetipos deben asignarse por PATRÓN, no por nivel de exposición.
- Las 6 categorías de bloques de cada rol deben ser MIXTAS: no todos
  rojos ni todos verdes. Distribución realista.

### Producto
- El resultado NUNCA debe sentirse negativo o alarmista.
- El frame es SIEMPRE aspiracional: potencial, amplificación, oportunidad.
- El Plan de Acción es donde están los cursos, NO en el diagnóstico.
- La share card debe ser algo que un profesional QUIERA publicar en LinkedIn.

## DOCUMENTACIÓN DE REFERENCIA

Lee estos archivos en la carpeta docs/ ANTES de empezar:
- 00-ARCHITECTURE.md → Visión general, arquetipos, multiplicador, stack, estructura
- 01-DATA-PIPELINE.md → Cómo se calculan los datos del catálogo
- 02-RUNTIME-API.md → Especificación de las APIs y prompts del LLM
- 03-FRONTEND-SPEC.md → Diseño y wireframes del frontend
- 04-SHARE-CARD.md → Sistema de cards compartibles
- 05-COURSES.md → Catálogo de cursos y monetización
- ai-capability-map.md → Referencia de capacidades IA (contexto para datos)

NO necesitas leer 06-ITERATIONS.md ni 07-IMPLEMENTATION-PLAN.md (son para
flujo Cursor paso a paso, no para tu ejecución).

## EMPIEZA

Lee toda la documentación y ejecuta el PASO 1. Cuando termines, para
y muéstrame un resumen.
