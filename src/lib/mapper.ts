import { llm } from './llm'
import { allSlugs, findRole } from './catalog'

interface MapperResult {
  matches: { slug: string; weight: number }[]
  detected_seniority: string | null
  detected_sector: string | null
}

export async function mapRoleToCatalog(roleInput: string): Promise<MapperResult> {
  const slugs = allSlugs()
  const catalogList = slugs
    .map(slug => {
      const role = findRole(slug)
      return `- ${slug}: ${role.title}`
    })
    .join('\n')

  const system = `Eres un clasificador de roles profesionales. Tienes un catálogo de ${slugs.length} roles.
Para el rol que te dé el usuario, devuelve los 1-3 roles del catálogo más cercanos con un peso de relevancia (sumando 1.0).

IMPORTANTE:
- Si hay un match exacto o casi exacto, devuelve solo ese con peso 1.0
- Si el rol es híbrido, combina hasta 3 roles del catálogo
- Considera sinónimos, variaciones de seniority, y contexto de sector
- Responde SOLO con este formato JSON exacto, sin markdown ni explicaciones:

{"matches":[{"slug":"slug-del-rol","weight":1.0}],"detected_seniority":"junior|mid|senior|null","detected_sector":"nombre-sector|null"}

Ejemplo de respuesta para "Ingeniero de datos senior":
{"matches":[{"slug":"data-analyst","weight":0.7},{"slug":"desarrollador-software","weight":0.3}],"detected_seniority":"senior","detected_sector":"tech"}

CATÁLOGO DE ROLES DISPONIBLES:
${catalogList}`

  const user = `Rol: "${roleInput}"`

  try {
    const raw = await llm(system, user, { maxTokens: 256 })

    // Clean markdown wrapping if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Try to parse, handling alternative key names the LLM might use
    const obj = JSON.parse(cleaned)

    // Normalize: accept various key names
    const matchesArray: { slug: string; weight: number }[] = []
    const rawMatches = obj.matches ?? obj.roles ?? obj.results ?? []

    for (const m of rawMatches) {
      const slug = m.slug ?? m.codigo ?? m.role ?? m.id ?? ''
      const weight = m.weight ?? m.peso ?? m.relevance ?? m.relevancia ?? 1.0
      if (slug) matchesArray.push({ slug: String(slug), weight: Number(weight) })
    }

    // Validate that slugs exist in catalog
    const validMatches = matchesArray.filter(m => slugs.includes(m.slug))

    if (validMatches.length === 0) {
      return fallbackMatch(roleInput, slugs)
    }

    // Renormalize weights
    const totalWeight = validMatches.reduce((sum, m) => sum + m.weight, 0)
    if (totalWeight > 0) {
      validMatches.forEach(m => { m.weight = m.weight / totalWeight })
    }

    return {
      matches: validMatches,
      detected_seniority: obj.detected_seniority ?? obj.seniority ?? null,
      detected_sector: obj.detected_sector ?? obj.sector ?? null,
    }
  } catch {
    return fallbackMatch(roleInput, slugs)
  }
}

/** Fallback: try substring matching against catalog slugs */
function fallbackMatch(roleInput: string, slugs: string[]): MapperResult {
  const normalizedInput = roleInput
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const directMatch = slugs.find(s =>
    normalizedInput.includes(s.replace(/-/g, ' '))
  )

  return {
    matches: [{ slug: directMatch ?? slugs[0], weight: 1.0 }],
    detected_seniority: null,
    detected_sector: null,
  }
}
