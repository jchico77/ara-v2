# 05 — Cursos: Catálogo y Monetización

## Modelo de negocio
Afiliación a cursos de Udemy, Coursera y LinkedIn Learning.
El usuario completa el análisis → ve cursos recomendados en cada bloque →
hace clic → compra → comisión.

---

## Principio: el curso es el destino, el análisis es el vehículo

El análisis existe para generar la confianza y el contexto necesarios
para que el clic en el curso sea una decisión natural, no un impulso.

La conexión análisis → curso debe ser tan fuerte que el usuario piense
"obviamente necesito aprender esto" sin sentir que le están vendiendo.

---

## Estructura del catálogo de cursos

### Archivo: data/courses.json
```json
[
  {
    "id": "course-001",
    "title": "AI-Powered Real Estate Analytics",
    "platform": "coursera",
    "url": "https://www.coursera.org/learn/...",
    "affiliate_url": "https://click.linksynergy.com/...",
    "language": "en",
    "level": "intermediate",
    "skills": ["market-analysis-ai", "data-visualization", "real-estate-analytics"],
    "archetype_affinity": ["accelerated", "connector"],
    "impact_type": ["zona_transformacion", "presion_ia"],
    "description_es": "Aprende a analizar mercados inmobiliarios con herramientas de IA.",
    "last_verified": "2026-03-01",
    "active": true
  }
]
```

### Campos clave para matching
- **skills**: lista de skills O*NET/ESCO que el curso desarrolla
  (mapeadas a las skill_recommendations de cada bloque funcional)
- **archetype_affinity**: arquetipos para los que este curso es más relevante
- **impact_type**: categorías de bloque donde este curso se recomienda
  (presion_ia, zona_transformacion, ventaja_humana)

---

## Lógica de recomendación

### Para cada bloque funcional de un resultado:
1. Obtener skill_recommendations del bloque
2. Buscar cursos cuyo campo skills intersecte con las del bloque
3. Filtrar por: idioma (preferir español, fallback inglés),
   archetype_affinity (preferir cursos afines al arquetipo del usuario),
   impact_type (match con categoría del bloque)
4. Ordenar por relevancia (número de skills que matchean)
5. Devolver top 2 cursos

### Fallback si no hay match de skills:
Buscar por keywords del título del bloque + categoría ocupacional general.
Si aún así no hay match: no mostrar curso (mejor nada que algo irrelevante).

---

## Framing del curso según categoría del bloque

### Bloque con "Presión IA" (rojo)
- Frame: urgencia positiva
- Pitch template: "Los profesionales que lideran esta transición están dominando {skill}. 
  Este es el curso más directo para ponerte al día."
- CTA: "Adelántate al cambio →"

### Bloque con "Zona de transformación" (amarillo)
- Frame: oportunidad competitiva
- Pitch template: "Dominar {skill} con IA te posiciona por delante del 80% de tu sector."
- CTA: "Activar esta ventaja →"

### Bloque con "Ventaja humana" (verde)
- Frame: potenciación de fortaleza
- Pitch template: "Tu ventaja en {area} se multiplica cuando la combinas con {skill}."
- CTA: "Potenciar tu ventaja →"

---

## Tamaño del catálogo

### MVP (Iteración 1): ~100 cursos
- 20 cursos de habilidades transversales de IA (prompt engineering, AI tools,
  data literacy, automation workflows)
- 80 cursos específicos por sector/función (legal, finanzas, marketing, RRHH,
  tech, salud, educación, comercial, inmobiliario, etc.)

### Objetivo v1: ~300 cursos
- Cobertura completa de las ~50 skills más recomendadas del catálogo
- Al menos 2 cursos por skill (diferentes plataformas/idiomas)

### Objetivo v2: ~500+ cursos
- Múltiples opciones por skill y nivel
- Inclusión de certificaciones profesionales
- Tracks secuenciales (curso 1 → curso 2 → certificación)

---

## Fuentes de cursos

### Udemy
- Programa de afiliados: Udemy Affiliate Program (via Rakuten/Awin)
- Comisión típica: 10-15% por venta
- API: Udemy Affiliate API permite búsqueda por keyword
- Ventaja: precios bajos, alta conversión
- Desventaja: calidad variable

### Coursera
- Programa: Coursera Affiliate Program (via Linkshare/Rakuten)
- Comisión típica: 10-45% por suscripción
- Ventaja: credibilidad académica alta (universidades reales)
- Desventaja: modelo de suscripción puede reducir conversión

### LinkedIn Learning
- Programa: LinkedIn Marketing Solutions / Impact
- Comisión típica: variable
- Ventaja: integración natural con el perfil de LinkedIn del usuario
- Desventaja: requiere suscripción Premium

---

## Mantenimiento del catálogo

### Mensual
- Verificar enlaces activos (script automático que prueba URLs)
- Marcar cursos inactivos (active: false)
- Revisar nuevos cursos relevantes en las plataformas

### Trimestral (con la actualización del catálogo de roles)
- Añadir cursos para nuevas skills que aparezcan
- Reordenar por relevancia basándose en CTR (si hay datos)
- Eliminar cursos con baja calidad o malas reviews

---

## Métricas de monetización

### Tracking por evento
- `course_impression`: un curso se muestra al usuario (bloque abierto)
- `course_click`: el usuario hace clic en el enlace del curso
- `course_platform`: en qué plataforma ha hecho clic

### KPIs principales
- **CTR por bloque:** % de usuarios que abren un bloque y hacen clic en curso
- **CTR por categoría:** ¿los bloques de presión convierten más que los de ventaja?
- **CTR por arquetipo:** ¿los Acelerados hacen más clic que los Estrategas?
- **Revenue por análisis:** ingresos totales / número de análisis completados

### Optimización
- A/B testing de pitch templates (copy)
- Ordenación de cursos por CTR histórico
- Test de número de cursos por bloque (1, 2, o 3)
- Test de posición del curso en el drawer (arriba vs abajo)
