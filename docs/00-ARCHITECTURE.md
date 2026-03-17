# AI Role Analyzer v2 — Arquitectura Completa

## Qué es esto

Web app B2C que analiza el impacto de la IA en cualquier rol profesional y monetiza
con afiliación a cursos. El usuario escribe su rol, recibe un "Perfil IA" con un
número multiplicador y un arquetipo profesional, y comparte el resultado en LinkedIn
generando viralización orgánica.

## Concepto de producto

### Lo que ve el usuario (análisis completo, privado)
6 bloques funcionales de su día a día, cada uno con indicador de impacto IA,
si la IA sustituye o potencia, y cursos recomendados con enlace de afiliado.

### Lo que comparte (card viral)
- **Número:** "Mi Multiplicador IA: 3.2x" (cuánto puede amplificarse tu productividad)
- **Identidad:** "Soy El Orquestador" (arquetipo profesional IA)
- **Acción:** "Ya sé en qué 3 áreas activar mi potencial. ¿Has analizado el tuyo?"

### Lo que ve el receptor (landing de conversión)
"María se ha analizado como Consultora Inmobiliaria. Descubre tu Perfil IA →"

### Por qué funciona la viralización
- El multiplicador siempre es positivo. Alto = mucho potencial por desbloquear.
  Bajo = tu trabajo ya es altamente humano y diferencial.
- El arquetipo no tiene tipo malo. Todos proyectan una fortaleza profesional.
- El mensaje de acción genera FOMO: "yo ya me he movido, ¿y tú?"

---

## Los 5 Arquetipos Profesionales IA

Los arquetipos se determinan por el PATRÓN de scores, no por el nivel.

### El Orquestador
- Perfil: Alta exposición E2 (necesita herramientas/sistemas), bloques funcionales
  orientados a coordinación y gestión.
- Significado: Tu rol evoluciona hacia dirigir equipos humano-IA. Eres el director
  de orquesta de agentes.
- Color: Violeta (#6E5CFF)
- Roles típicos: Project Manager, Director de Operaciones, CTO, Product Manager.

### El Estratega
- Perfil: Baja exposición en tareas de decisión + alta en tareas de ejecución.
  Bloques con barreras altas (accountability, relacional).
- Significado: Tu valor está en las decisiones que la IA no puede tomar. Juicio,
  riesgo, visión. La IA ejecuta, tú decides.
- Color: Azul profundo (#0A66C2)
- Roles típicos: CFO, Abogado senior, Consultor estratégico, Médico especialista.

### El Acelerado
- Perfil: Alta exposición E1 (beneficio directo del LLM) + dirección dominante
  aumentación. Máximo potencial de multiplicación con upskilling.
- Significado: La IA multiplica tu productividad más que en casi ningún otro perfil.
  Cada hora invertida en aprender herramientas IA te devuelve 3.
- Color: Verde (#22C088)
- Roles típicos: Data Analyst, Desarrollador, Diseñador, Content Creator, Recruiter.

### El Conector
- Perfil: Exposición mixta + barreras altas de confianza relacional. Bloques
  funcionales centrados en interacción humana, negociación, relaciones.
- Significado: Conectas mundos que la IA no puede conectar. Tu red, tu empatía
  y tu criterio relacional son tu superpoder diferencial.
- Color: Naranja cálido (#E8A830)
- Roles típicos: Comercial B2B, HRBP, Account Manager, Periodista, Terapeuta.

### El Pionero
- Perfil: Exposición total muy alta + sector de cambio rápido. El rol está
  siendo redefinido. Los que se adaptan primero ganan enormemente.
- Significado: Tu profesión está en la frontera del cambio. Los pioneros que
  dominan las nuevas reglas ahora capturan una ventaja desproporcionada.
- Color: Rojo energético (#EF4060)
- Roles típicos: Customer Service, Data Entry, Marketing Analyst, Paralegal.

### Lógica de asignación
No es un mapping fijo rol→arquetipo. Se calcula a partir de:
1. Distribución de scores E0/E1/E2 entre los bloques funcionales
2. Distribución de dirección (automatización vs aumentación) entre bloques
3. Nivel de barreras (accountability, relacional, fisicalidad)
4. Patrón dominante → arquetipo

Un mismo título de rol puede dar diferentes arquetipos según el contexto
(un "Director Financiero" en una startup tech puede ser Acelerado mientras
que en un banco regulado puede ser Estratega).

---

## El Multiplicador IA

### Qué es
Un número ≥1.0x que indica cuánto podría amplificarse la productividad del
profesional si adoptase las herramientas IA adecuadas para su rol.

### Cómo se calcula
Base: score β de Eloundou (E1 + 0.5×E2) ponderado por importancia de tareas.
Conversión a multiplicador: 1 / (1 - β × factor_de_speedup)

Donde factor_de_speedup se calibra con datos del Anthropic Economic Index
(speedup medio observado por categoría ocupacional).

Rango típico: 1.2x a 5.0x
- 1.2x-1.5x: rol altamente humano, poco acelerado por IA
- 1.5x-2.5x: rol con potencial moderado de amplificación
- 2.5x-4.0x: rol con alto potencial de amplificación
- 4.0x-5.0x: rol masivamente amplificable (programadores, analistas de datos)

### Por qué siempre es positivo
Incluso un rol con baja exposición (enfermera, terapeuta) tiene un multiplicador
>1.0x porque ALGUNA parte de su trabajo (documentación, búsqueda de información)
se acelera con IA. Y un multiplicador bajo se lee como "tu trabajo es tan humano
que la IA tiene poco que añadir" — que también es positivo.

---

## Stack técnico

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion
- **Despliegue frontend:** Vercel (serverless, edge functions)
- **Backend:** API Routes de Next.js (serverless, no servidor dedicado)
- **Base de datos:** Archivos JSON estáticos con catálogo precalculado (no necesita DB)
- **LLM runtime:** Anthropic API (Claude Sonnet 4.6 para mapeo + narrativa)
- **LLM batch:** Claude Opus 4.6 para generación del catálogo offline
- **Datos base:** O*NET v29.1 + Anthropic Economic Index + WORKBank
- **Cursos:** Catálogo curado JSON mapeado a skills con enlaces de afiliados
- **Share cards:** Generación de imagen con @vercel/og (Satori) en edge function
- **Analytics:** Vercel Analytics + eventos custom de clics en cursos

## Estructura de archivos
```
ai-role-analyzer-v2/
├── docs/                           # Documentación (estos archivos)
│   ├── 00-ARCHITECTURE.md          # Este archivo
│   ├── 01-DATA-PIPELINE.md         # Generación del catálogo offline
│   ├── 02-RUNTIME-API.md           # APIs del runtime
│   ├── 03-FRONTEND-SPEC.md         # Especificación del frontend
│   ├── 04-SHARE-CARD.md            # Sistema de cards compartibles
│   ├── 05-COURSES.md               # Catálogo y recomendación de cursos
│   └── 06-ITERATIONS.md            # Plan de implementación iterativo
│
├── scripts/                        # Scripts batch (Python)
│   ├── build_catalog.py            # Genera catálogo de roles
│   ├── score_tasks.py              # Cruza datos y calcula scores
│   └── assign_archetypes.py        # Asigna arquetipos a roles
│
├── data/                           # Datos offline
│   ├── raw/                        # Datasets descargados
│   ├── catalog.json                # Catálogo precalculado (output principal)
│   ├── courses.json                # Catálogo de cursos curado
│   └── ai-capability-map.md        # Referencia de capacidades IA
│
├── src/                            # App Next.js
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Landing / hero / input
│   │   ├── resultado/[slug]/
│   │   │   └── page.tsx            # Resultado completo
│   │   └── api/
│   │       ├── analyze/route.ts    # POST: mapeo + narrativa
│   │       └── og/[slug]/route.ts  # GET: genera imagen OG para share
│   │
│   ├── components/
│   │   ├── Hero.tsx                # Pantalla de entrada
│   │   ├── RoleInput.tsx           # Input con sugerencias
│   │   ├── LoadingSequence.tsx     # Animación de análisis
│   │   ├── ProfileCard.tsx         # Card principal (arquetipo + multiplicador)
│   │   ├── BlockGrid.tsx           # Grid de bloques funcionales
│   │   ├── BlockDetail.tsx         # Drawer/modal de detalle de bloque
│   │   ├── CourseCard.tsx          # Card de curso recomendado
│   │   └── ShareButton.tsx         # Botón de compartir con generación de card
│   │
│   ├── lib/
│   │   ├── catalog.ts              # Lee y busca en catálogo precalculado
│   │   ├── llm.ts                  # Cliente Anthropic API
│   │   ├── mapper.ts               # Mapea texto libre a rol del catálogo
│   │   ├── narrator.ts             # Genera narrativas personalizadas
│   │   ├── archetypes.ts           # Lógica de arquetipos
│   │   └── multiplier.ts           # Cálculo del multiplicador
│   │
│   └── styles/
│       └── globals.css             # Estilos base Tailwind
│
├── public/
│   ├── fonts/                      # Tipografías custom
│   └── icons/                      # Iconos de arquetipos
│
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## Flujo de datos

### Offline (trimestral, con scripts Python)
```
O*NET (tareas, ratings, DWAs, skills) ─────┐
Anthropic Economic Index (HuggingFace) ─────├─→ build_catalog.py ─→ catalog.json
WORKBank Stanford (GitHub) ─────────────────┘         │
                                                      ├─→ 500 roles precalculados
APIs afiliados / curación manual ─→ courses.json ─────┘    con bloques, scores,
                                                           arquetipos y cursos
```

### Runtime (por request, <4 segundos)
```
Usuario escribe "Consultor inmobiliario senior"
  │
  ▼
API /analyze (serverless)
  │
  ├─ 1. LLM mapea texto → rol más cercano del catálogo ──→ ~1s
  │     (o combinación ponderada de 2-3 roles)
  │
  ├─ 2. Recupera datos precalculados del catálogo ──→ <0.1s
  │     (bloques, scores, arquetipo base, cursos)
  │
  ├─ 3. LLM personaliza narrativas ──→ ~2s
  │     (adapta descripciones al contexto: seniority, sector,
  │      datos de LinkedIn si disponibles)
  │
  └─ 4. Calcula multiplicador y confirma arquetipo ──→ <0.1s
        (ajuste por contexto del usuario)
  │
  ▼
JSON al frontend → renderiza resultado
```

### Share (on-demand)
```
Usuario toca "Compartir"
  │
  ▼
Edge function /api/og/[slug]
  │
  ├─ Genera imagen PNG (1200×627 para LinkedIn, 1080×1920 para Stories)
  │  con: arquetipo + multiplicador + rol + CTA
  │
  └─ Meta tags OG en la página de resultado para preview automático
```

---

## Documentos de referencia

Leer en este orden para implementar:
1. `01-DATA-PIPELINE.md` — Cómo generar el catálogo offline
2. `02-RUNTIME-API.md` — Las 2 API routes del runtime
3. `03-FRONTEND-SPEC.md` — Diseño y componentes del frontend
4. `04-SHARE-CARD.md` — Sistema de cards compartibles
5. `05-COURSES.md` — Catálogo de cursos y monetización
6. `06-ITERATIONS.md` — Plan de iteraciones (empezar por aquí si se quiere implementar)
