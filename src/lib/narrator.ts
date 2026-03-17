import { llm } from './llm'
import type { RoleProfile, FunctionalBlock } from './types'

interface NarratorInput {
  title: string
  seniority: string | null
  sector: string | null
  blocks: FunctionalBlock[]
}

interface NarratedBlock {
  id: string
  brief: string
  detail: string
}

export async function narrateBlocks(input: NarratorInput): Promise<NarratedBlock[]> {
  const blocksForPrompt = input.blocks.map(b => ({
    id: b.id,
    name: b.name,
    score: b.score,
    category: b.category,
    direction: b.direction,
    tasks: b.tasks.map(t => t.name).join(', '),
  }))

  const system = `Genera descripciones personalizadas para cada bloque funcional de un análisis de impacto de IA en un rol profesional.

Para cada bloque recibirás datos precalculados (score, categoría, dirección). NO cambies los scores ni la categoría. Solo genera el texto descriptivo.

REGLAS DE TONO:
- Habla en segunda persona: "Cuando analizas el mercado...", "Tu negociación..."
- Sé específico: menciona herramientas y situaciones concretas del sector
- NO uses jerga académica (nada de E0/E1/E2, ONET, exposure)
- Para bloques con categoría "presion": tono de oportunidad, no de amenaza
- Para bloques con categoría "ventaja": tono de reafirmación y potenciación
- Para bloques con categoría "transformacion": tono de aceleración y colaboración humano-IA
- brief: frase gancho de 8-15 palabras (para la card del bloque), entre comillas narrativas
- detail: exactamente 2-3 frases, máximo 60 palabras, en español de España

Responde SOLO un JSON array, sin markdown ni explicaciones:
[{"id": "...", "brief": "...", "detail": "..."}, ...]`

  const senioritySector = [
    input.seniority && `seniority: ${input.seniority}`,
    input.sector && `sector: ${input.sector}`,
  ].filter(Boolean).join(', ')

  const user = `Rol: ${input.title}${senioritySector ? ` (${senioritySector})` : ''}

Bloques a describir:
${JSON.stringify(blocksForPrompt, null, 2)}`

  const raw = await llm(system, user, { maxTokens: 1024 })

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned) as NarratedBlock[]
  } catch {
    // Return original briefs/details as fallback
    return input.blocks.map(b => ({ id: b.id, brief: b.brief, detail: b.detail }))
  }
}

/** Apply narrated text to a role profile, returning a new profile with updated narratives */
export function applyNarration(profile: RoleProfile, narrated: NarratedBlock[]): RoleProfile {
  const narrationMap = new Map(narrated.map(n => [n.id, n]))

  return {
    ...profile,
    blocks: profile.blocks.map(block => {
      const narration = narrationMap.get(block.id)
      if (!narration) return block
      return { ...block, brief: narration.brief, detail: narration.detail }
    }),
  }
}
