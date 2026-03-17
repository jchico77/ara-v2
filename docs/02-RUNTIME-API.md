# 02 — Runtime API: Las 2 rutas del backend

## Principio
El runtime es mínimo. Dos API routes serverless, dos llamadas LLM, cero APIs
externas. Todo lo pesado está precalculado en catalog.json.

---

## POST /api/analyze

### Request
```json
{
  "role_input": "Consultor inmobiliario senior",
  "linkedin_profile": null  // opcional, objeto con datos de LinkedIn
}
```

### Proceso interno (< 4 segundos)

#### 1. Mapeo a catálogo (~1s)
Llamada LLM (Claude Sonnet 4.6, sin thinking extendido):

```
SYSTEM:
Eres un clasificador de roles profesionales. Tienes un catálogo de {N} roles.
Para el rol que te dé el usuario, devuelve los 1-3 roles del catálogo más
cercanos con un peso de relevancia (sumando 1.0).

IMPORTANTE:
- Si hay un match exacto o casi exacto, devuelve solo ese con peso 1.0
- Si el rol es híbrido, combina hasta 3 roles del catálogo
- Considera sinónimos, variaciones de seniority, y contexto de sector
- Responde SOLO JSON válido

CATÁLOGO DE ROLES DISPONIBLES:
{lista de slugs + titles + aliases del catálogo}

USER:
Rol: "{role_input}"
Contexto adicional: {seniority, sector, LinkedIn data si disponible}
```

Output esperado:
```json
{
  "matches": [
    {"slug": "consultor-inmobiliario", "weight": 0.8},
    {"slug": "analista-de-mercado", "weight": 0.2}
  ],
  "detected_seniority": "senior",
  "detected_sector": "real-estate"
}
```

#### 2. Recuperar datos precalculados (<0.1s)
Leer catalog.json, recuperar datos de los roles matched, fusionar si hay
múltiples matches (ponderado por weight).

#### 3. Personalizar narrativas (~2s)
Llamada LLM (Claude Sonnet 4.6):

```
SYSTEM:
Genera descripciones personalizadas para cada bloque funcional de un análisis
de impacto de IA en un rol profesional.

Para cada bloque recibirás datos precalculados (score, dirección, barreras).
NO cambies los scores ni la categoría. Solo genera el texto descriptivo.

REGLAS DE TONO:
- Habla en segunda persona: "Cuando analizas el mercado...", "Tu negociación..."
- Sé específico: menciona herramientas y situaciones concretas del sector
- NO uses jerga académica (nada de E0/E1/E2, ONET, exposure)
- Para bloques con presión IA: tono de oportunidad, no de amenaza
- Para bloques con ventaja humana: tono de reafirmación y potenciación
- Cada descripción: exactamente 2-3 frases, máximo 60 palabras
- En español de España

Para cada bloque también genera:
- brief: frase gancho de 8-12 palabras (para la card del bloque)
- course_pitch: frase de 10-15 palabras que conecta el bloque con el curso
  recomendado, con framing positivo (no miedo)

USER:
Rol: {title_es} (seniority: {seniority}, sector: {sector})
{si hay LinkedIn: "Último puesto: {title} en {company}. Skills: {skills}"}

Bloques a describir:
{JSON con bloques: id, title, score, category, direction, barriers, tasks}
```

#### 4. Calcular multiplicador y confirmar arquetipo (<0.1s)
- Si hay un solo match: usar multiplicador y arquetipo precalculados
- Si hay múltiples matches: recalcular como media ponderada
- Ajustar por seniority si aplica (seniors tienden más a Estratega/Orquestador)

### Response
```json
{
  "slug": "consultor-inmobiliario",
  "role_display": "Consultor Inmobiliario Senior",
  "archetype": {
    "id": "connector",
    "name_es": "El Conector",
    "tagline": "Conectas mundos que la IA no puede conectar",
    "color": "#E8A830"
  },
  "multiplier": 2.8,
  "multiplier_label": "2.8x",
  "summary_message": "4 de tus 6 actividades principales se potencian con IA, y tus 2 ventajas de negociación y relación son más valiosas que nunca.",
  "blocks": [
    {
      "id": "analisis-mercado",
      "title": "Análisis de datos y mercado",
      "brief": "La IA acelera tu investigación 4x, tú decides qué significa",
      "description": "Cuando preparas valoraciones y comparables de mercado, herramientas de IA ya procesan datos de transacciones, generan informes y detectan tendencias en minutos. Tu valor no está en recopilar datos sino en interpretarlos para tu cliente.",
      "category": "zona_transformacion",
      "category_label": "Zona de transformación",
      "direction": "augmentation",
      "direction_label": "La IA te potencia",
      "score_display": 68,
      "barriers": "low",
      "courses": [
        {
          "title": "AI-Powered Real Estate Analytics",
          "platform": "Coursera",
          "url": "https://...",
          "affiliate_url": "https://...",
          "pitch": "El curso que más usan los consultores que ya analizan mercado con IA"
        }
      ],
      "course_pitch": "Dominar análisis de mercado con IA te posiciona por delante del 80% de tu sector."
    }
    // ... 5-6 bloques más
  ],
  "share": {
    "text": "Mi Perfil IA como Consultor Inmobiliario: El Conector, 2.8x de potencial de amplificación. Ya sé en qué áreas activarlo. ¿Cuál es tu Perfil IA?",
    "url": "https://airoleanalyzer.com/resultado/consultor-inmobiliario-senior?ref=share",
    "og_image_url": "https://airoleanalyzer.com/api/og/consultor-inmobiliario-senior"
  },
  "methodology_note": "Análisis basado en O*NET (US Dept. of Labor), Anthropic Economic Index (2026), y metodología Eloundou et al. (Science, 2024)."
}
```

---

## GET /api/og/[slug]

Edge function que genera imagen PNG para Open Graph / share cards.
Ver `04-SHARE-CARD.md` para especificación completa.

### Parámetros (query string)
- `format`: "linkedin" (1200×627) | "story" (1080×1920) — default: linkedin
- `role`: título del rol (para overlay en la imagen)
- `archetype`: id del arquetipo
- `multiplier`: número multiplicador

### Response
- Content-Type: image/png
- Cache: public, max-age=86400 (24h)
- Generada con @vercel/og (Satori + Resvg)
