import { llm } from './llm'
import type { RoleProfile } from './types'

/**
 * Generate a complete role profile dynamically via Claude
 * when the role doesn't exist in the static catalog.
 */
export async function generateDynamicProfile(roleInput: string): Promise<RoleProfile> {
  const slug = roleInput
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const system = `Eres un analista experto en impacto de IA en profesiones. Genera un perfil profesional completo que analice cómo la inteligencia artificial afecta al rol que te indique el usuario.

Debes devolver un JSON con esta estructura exacta:

{
  "slug": "${slug}",
  "title": "Título del Rol",
  "archetype": "orquestador|estratega|acelerado|conector|pionero",
  "multiplier": 1.2-5.0,
  "summary": "Frase personalizada de 1-2 líneas sobre el impacto de IA en este rol",
  "blocks": [
    {
      "id": "${slug}-1",
      "name": "Nombre del bloque funcional",
      "category": "presion|transformacion|ventaja",
      "direction": "automatizacion|aumentacion",
      "score": 0-100,
      "brief": "Frase gancho de 8-15 palabras",
      "detail": "2-3 frases explicativas, máx 60 palabras",
      "tasks": [
        {"name": "Tarea específica", "exposure": 0-100, "direction": "automatizacion|aumentacion"}
      ]
    }
  ]
}

REGLAS:
- Genera exactamente 6 bloques funcionales que representen las actividades principales del rol
- Cada bloque tiene 2-4 tareas
- Los scores reflejan el nivel REAL de exposición a la IA (0=nada, 100=totalmente automatizable)
- category se determina por el score: presion (70-100), transformacion (40-69), ventaja (0-39)
- direction: "automatizacion" si la IA reemplaza la tarea, "aumentacion" si la potencia
- archetype: elige según el perfil general:
  - "orquestador": roles de gestión que coordinan equipos y IA
  - "estratega": roles donde el valor está en decisiones que la IA no toma
  - "acelerado": roles donde la IA multiplica enormemente la productividad
  - "conector": roles centrados en relaciones humanas
  - "pionero": roles en la frontera del cambio tecnológico
- multiplier: cuánto puede multiplicar la IA la productividad de este rol (1.2× a 5.0×)
  - Roles muy manuales/físicos: 1.2-1.8×
  - Roles mixtos: 2.0-3.0×
  - Roles de conocimiento: 3.0-5.0×
- Habla en segunda persona, en español de España
- Sé realista: un mozo de almacén no es un orquestador ni tiene 3.2× de multiplicador

Responde SOLO el JSON, sin markdown ni explicaciones.`

  const user = `Rol: "${roleInput}"`

  const raw = await llm(system, user, { maxTokens: 4500 })
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned) as RoleProfile
}
