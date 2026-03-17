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
- Responde SOLO JSON válido, sin markdown ni explicaciones

CATÁLOGO DE ROLES DISPONIBLES:
${catalogList}`

  const user = `Rol: "${roleInput}"`

  const raw = await llm(system, user, { maxTokens: 256 })

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned) as MapperResult

    // Validate that all slugs exist in catalog
    const validMatches = parsed.matches.filter(m => slugs.includes(m.slug))
    if (validMatches.length === 0) {
      // Fallback: return first catalog entry
      return { matches: [{ slug: slugs[0], weight: 1.0 }], detected_seniority: null, detected_sector: null }
    }

    // Renormalize weights
    const totalWeight = validMatches.reduce((sum, m) => sum + m.weight, 0)
    validMatches.forEach(m => { m.weight = m.weight / totalWeight })

    return { ...parsed, matches: validMatches }
  } catch {
    // If JSON parsing fails, try simple slug matching
    const normalizedInput = roleInput.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const directMatch = slugs.find(s => normalizedInput.includes(s.replace(/-/g, ' ')))

    return {
      matches: [{ slug: directMatch ?? slugs[0], weight: 1.0 }],
      detected_seniority: null,
      detected_sector: null,
    }
  }
}
