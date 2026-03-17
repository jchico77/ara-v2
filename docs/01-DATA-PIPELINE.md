# 01 — Data Pipeline: Generación del Catálogo Offline

## Objetivo
Generar un archivo `catalog.json` con ~500 roles profesionales precalculados,
cada uno con: ocupaciones O*NET mapeadas, tareas con scores de exposición,
bloques funcionales agrupados, arquetipo asignado, multiplicador calculado,
y cursos recomendados.

Este archivo se genera UNA VEZ y se actualiza trimestralmente. El runtime
lo lee como archivo estático, sin consultar APIs externas.

---

## Paso 1: Descargar datasets

### O*NET v29.1
- URL: https://www.onetcenter.org/database.html
- Descargar: "All files" en formato Text (tab-delimited)
- Archivos necesarios:
  - `Task Statements.txt` — textos de tareas por ocupación
  - `Task Ratings.txt` — importancia, frecuencia, relevancia por tarea
  - `Tasks to DWAs.txt` — mapeo tarea → Detailed Work Activity
  - `DWA Reference.txt` — catálogo de DWAs
  - `IWA Reference.txt` — catálogo de IWAs (para agrupación)
  - `Occupation Data.txt` — títulos y descripciones de ocupaciones
  - `Skills.txt` — skills por ocupación con ratings
  - `Work Context.txt` — contexto laboral (fisicalidad, interacción, etc.)
- Licencia: CC BY 4.0 (uso comercial OK con atribución)

### Anthropic Economic Index
- URL: https://huggingface.co/datasets/Anthropic/EconomicIndex
- Descargar: todos los releases (2025-02, 2025-03, 2025-09, 2026-01)
- Archivos clave:
  - Mapeo conversaciones → tareas O*NET
  - Colaboración mode (automatización vs aumentación)
  - Task coverage por ocupación
  - Success rates por tarea
- Licencia: CC-BY (datos), MIT (código)

### WORKBank Stanford
- URL: https://github.com/SALT-NLP/workbank
- Descargar: dataset completo
- Datos clave:
  - Deseo de automatización por tarea (1-5 Likert, 844 tareas, 104 ocupaciones)
  - Capacidad técnica evaluada por expertos IA
  - Clasificación en 4 zonas (Green Light, Red Light, R&D, Low Priority)
  - Human Agency Scale (H1-H5) por tarea
- Licencia: Open access académico

### Crosswalk ESCO ↔ O*NET
- URL: https://esco.ec.europa.eu/en/about-esco/data-science-and-esco/crosswalk-between-esco-and-onet
- Descargar: CSV con mapeo ESCO URI → O*NET-SOC code
- Incluye tipo de relación: exact, broad, narrow, close
- Licencia: EU Open Data

### ESCO (para títulos en español)
- URL: https://esco.ec.europa.eu/en/use-esco/download
- Descargar: CSV con ocupaciones + preferred/non-preferred terms en español
- Sirve para enriquecer el catálogo con sinónimos en español

---

## Paso 2: Seleccionar roles para el catálogo

### Criterio de selección
Empezar con los ~500 roles más comunes, priorizando:
1. Ocupaciones con datos en Anthropic Economic Index (tienen datos observacionales)
2. Ocupaciones con datos en WORKBank (tienen preferencias de trabajadores)
3. Ocupaciones de alta frecuencia en el mercado laboral español
   (usar datos de INE + LinkedIn España como referencia)

### Estructura de cada rol en el catálogo
```json
{
  "slug": "consultor-inmobiliario",
  "title_es": "Consultor Inmobiliario",
  "title_en": "Real Estate Consultant",
  "aliases_es": ["asesor inmobiliario", "agente inmobiliario", "broker inmobiliario"],
  "onet_codes": [
    {"code": "13-2020.01", "title": "Property Appraisers", "weight": 0.5},
    {"code": "41-9022.00", "title": "Real Estate Agents", "weight": 0.3},
    {"code": "13-1111.00", "title": "Management Analysts", "weight": 0.2}
  ],
  "esco_uri": "http://data.europa.eu/esco/occupation/...",
  "blocks": [...],          // 5-7 bloques funcionales (ver Paso 4)
  "archetype": "connector", // ver Paso 5
  "multiplier": 2.8,        // ver Paso 6
  "scores": {
    "alpha": 0.28,           // E1 ponderado
    "beta": 0.47,            // E1 + 0.5*E2 ponderado
    "zeta": 0.66             // E1 + E2 ponderado
  },
  "course_skills": ["negotiation", "market-analysis-ai", "data-visualization"]
}
```

---

## Paso 3: Calcular scores de exposición por tarea

Para cada tarea de cada rol, asignar E0/E1/E2 usando tres capas:

### Capa 1: Datos observacionales (Anthropic Economic Index)
Si la tarea aparece en el dataset de Anthropic:
- task_coverage > 0 → la tarea está siendo usada con IA
- collaboration_mode → automatización o aumentación
- success_rate → fiabilidad de la IA en esa tarea
- Asignar: E1 si coverage alta + success alta, E2 si coverage media o success media

### Capa 2: Datos de preferencia (WORKBank)
Si la tarea aparece en WORKBank:
- automation_desire alta + capability alta → confirmar E1/E2
- automation_desire baja + capability alta → "Red Light" → añadir barrera
- Usar Human Agency Scale para determinar dirección (auto vs augment)

### Capa 3: LLM como anotador (fallback)
Para tareas sin datos observacionales ni de WORKBank:
- Usar Claude Opus 4.6 con rubric de Eloundou adaptado a 2026
- Inyectar ai-capability-map.md como contexto
- Incluir 20 tareas ancla como few-shot examples
- Ejecutar 3 veces y usar votación mayoritaria

### Score numérico por tarea
```
task_score = E_value × importance × core_weight
donde:
  E_value = 0 (E0), 1 (E1), 0.5 (E2)
  importance = rating O*NET (1-5), normalizado a 0-1
  core_weight = 2.0 (core) o 1.0 (supplemental)
```

### Dirección por tarea
- "automatización" si: Anthropic collaboration_mode = automated, o WORKBank HAS ≤ H2
- "aumentación" si: collaboration_mode = augmented, o HAS ≥ H3
- "mixto" si: datos contradictorios o sin datos claros

### Barreras por tarea
Evaluar contra Work Context de O*NET:
- Accountability: profesión regulada, requiere firma/atestación
- Confianza relacional: "Face-to-Face Discussions" alto en Work Context
- Fisicalidad: "Performing General Physical Activities" alto en Work Context
- Nivel: alta / media / baja (basado en combinación de factores)

---

## Paso 4: Agrupar tareas en bloques funcionales

### Lógica de agrupación
1. Cada tarea de O*NET está enlazada a una o más DWAs
2. Las DWAs pertenecen a IWAs (Intermediate Work Activities)
3. Agrupar tareas que comparten IWA en un bloque funcional
4. Nombrar cada bloque con un título comprensible derivado de la IWA
   (ej: IWA "Analyzing Data or Information" → "Análisis de datos y mercado")

### Reglas de agrupación
- Mínimo 5 bloques, máximo 7 por rol
- Si un bloque tiene solo 1 tarea → fusionar con el bloque más cercano
- Si un bloque tiene más de 5 tareas → subdividir por DWA
- Calcular score del bloque como media ponderada de sus tareas

### Estructura de un bloque
```json
{
  "id": "analisis-mercado",
  "title_es": "Análisis de datos y mercado",
  "iwa_codes": ["4.A.2.a"],
  "tasks": [
    {
      "onet_task_id": "T1234",
      "statement_en": "Analyze market conditions to determine property values",
      "statement_es": "Analizar condiciones del mercado para valorar inmuebles",
      "exposure": "E1",
      "direction": "augmentation",
      "barriers": "low",
      "importance": 0.85,
      "core": true,
      "score": 0.85,
      "anthropic_coverage": 0.62,
      "anthropic_success": 0.78,
      "workbank_desire": 4.2,
      "workbank_zone": "green_light"
    }
  ],
  "block_score_alpha": 0.35,
  "block_score_beta": 0.52,
  "block_score_zeta": 0.68,
  "dominant_direction": "augmentation",
  "dominant_barrier": "low",
  "ui_category": "zona_transformacion",
  "skill_recommendations": ["market-analysis-ai", "data-visualization"]
}
```

---

## Paso 5: Asignar arquetipo

### Inputs para el cálculo
- Distribución de E0/E1/E2 entre bloques
- Distribución de dirección (automatización/aumentación) entre bloques
- Nivel promedio de barreras
- Score β global

### Lógica de asignación
```python
def assign_archetype(role):
    pct_e2 = % de tareas E2 / total tareas E1+E2
    pct_automation = % de bloques con dirección "automatización"
    pct_augmentation = % de bloques con dirección "aumentación"
    avg_barriers = promedio de barreras (alta=3, media=2, baja=1)
    beta = score β global

    if pct_e2 > 0.5 and pct_automation > 0.4:
        return "orchestrator"     # Mucho E2 + automatización → dirige agentes
    if avg_barriers > 2.0 and beta < 0.4:
        return "strategist"       # Altas barreras + baja exposición → juicio humano
    if pct_augmentation > 0.6 and beta > 0.5:
        return "accelerated"      # Mucha aumentación + alta exposición → multiplicación
    if avg_barriers > 1.8 and pct_augmentation > 0.4:
        return "connector"        # Barreras relacionales + aumentación → conecta mundos
    if beta > 0.6:
        return "pioneer"          # Exposición muy alta → frontera del cambio
    # Fallback: el arquetipo con mayor afinidad por distancia
    return closest_archetype_by_score(...)
```

---

## Paso 6: Calcular multiplicador

### Fórmula
```
multiplier = 1 / (1 - beta * speedup_factor)
```

Donde:
- `beta` = score β del rol (0-1)
- `speedup_factor` = factor de aceleración medio para la categoría ocupacional,
  derivado del Anthropic Economic Index (speedup mediano observado)
  Típicamente entre 0.4 y 0.7

### Calibración
- Anthropic reporta speedups de 12x-15x en tareas individuales, pero eso es
  por tarea, no por rol completo.
- Para el multiplicador de rol, usar un factor conservador que represente
  el speedup ponderado por tiempo.
- Calibrar contra datos reales: si un programador (β≈0.75) puede ser
  ~3x más productivo con IA, el factor de speedup debe ser ~0.55.

### Rangos finales
- Cap mínimo: 1.2x (nadie tiene 1.0x, siempre hay algo que la IA mejora)
- Cap máximo: 5.0x (evitar números absurdos)

---

## Paso 7: Generar catalog.json

### Script principal: build_catalog.py
```
Input: datos raw de O*NET + Anthropic + WORKBank + lista de roles
Output: catalog.json con ~500 roles completos

Proceso:
1. Para cada rol en la lista:
   a. Recuperar tareas de O*NET para los códigos SOC asociados
   b. Calcular scores de exposición (Paso 3)
   c. Agrupar en bloques funcionales (Paso 4)
   d. Asignar arquetipo (Paso 5)
   e. Calcular multiplicador (Paso 6)
   f. Mapear skills y cursos
2. Generar catalog.json
3. Generar estadísticas de validación
```

### Validación post-generación
- Verificar que todos los roles tienen entre 5 y 7 bloques
- Verificar que los multiplicadores están en rango [1.2, 5.0]
- Verificar que los 5 arquetipos tienen representación razonable (~15-25% cada uno)
- Verificar que ningún rol tiene 100% E0 ni 100% E1
- Spot-check manual de 20 roles (4 por arquetipo)

---

## Frecuencia de actualización

- **Trimestral:** Regenerar catálogo completo con nuevos datos de Anthropic
  Economic Index (publican cada ~3 meses) y actualizar AI Capability Map.
- **Mensual:** Actualizar catálogo de cursos (nuevos cursos, enlaces rotos).
- **Ad-hoc:** Añadir roles nuevos al catálogo cuando haya demanda (analytics).
