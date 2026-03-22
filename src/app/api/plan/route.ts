import { NextResponse } from 'next/server'
import { llm } from '@/lib/llm'
import type { FunctionalBlock } from '@/lib/types'

export interface PlanStep {
  type: 'entiende' | 'pruebalo' | 'dominalo'
  title: string
  description: string
  tool?: string
  prompt?: string
  courseQuery?: string
  platform?: 'Coursera' | 'Udemy' | 'LinkedIn Learning'
}

export interface CompetencyPlan {
  blockId: string
  steps: PlanStep[]
}

const cache = new Map<string, { data: CompetencyPlan[]; ts: number }>()
const CACHE_TTL = 1000 * 60 * 60

export async function POST(request: Request) {
  // Parse body early so it's available in catch
  let parsedBlocks: FunctionalBlock[] = []
  let title = ''

  try {
    const body = await request.json()
    title = (body.title as string)?.trim()
    parsedBlocks = body.blocks as FunctionalBlock[]

    if (!title || !parsedBlocks?.length) {
      return NextResponse.json({ error: 'title and blocks are required' }, { status: 400 })
    }

    const cacheKey = `${title.toLowerCase()}-${parsedBlocks.map(b => b.id).join(',')}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    const blocksForPrompt = parsedBlocks.map(b => ({
      id: b.id,
      name: b.name,
      category: b.category,
      score: b.score,
      direction: b.direction,
    }))

    const system = `Eres un coach de desarrollo profesional especializado en adaptación a la IA. Genera un plan de acción de 3 pasos para cada competencia profesional con alto impacto de IA.

Para cada bloque funcional, crea exactamente estos 3 pasos:
1. "entiende": Explica en 2 frases cómo la IA está cambiando esta área y qué debe cambiar el profesional
2. "pruebalo": Un ejercicio concreto con una herramienta específica. Incluye un prompt listo para copiar
3. "dominalo": Recomienda el tipo de formación y el término de búsqueda exacto para encontrar el curso

REGLAS DE TONO:
- Segunda persona: "Tu proceso de...", "Cuando uses..."
- Específico y accionable, sin teoría abstracta
- El campo "prompt" en pruebalo: prompt listo para copiar al portapapeles (máx 120 chars)
- courseQuery: término de búsqueda específico para encontrar el curso ideal
- Elige tool entre: Claude, ChatGPT, Perplexity, Midjourney, Runway, Notion AI, GitHub Copilot
- Elige platform entre: Coursera, Udemy, LinkedIn Learning

Responde SOLO un JSON array, sin markdown ni explicaciones:
[{"blockId":"string","steps":[{"type":"entiende","title":"5-7 palabras","description":"2 frases"},{"type":"pruebalo","title":"5-7 palabras","description":"descripción","tool":"Claude","prompt":"prompt listo para copiar"},{"type":"dominalo","title":"5-7 palabras","description":"descripción","courseQuery":"término específico","platform":"Coursera"}]}]`

    const user = `Rol: ${title}

Competencias a desarrollar:
${JSON.stringify(blocksForPrompt, null, 2)}`

    const raw = await llm(system, user, { maxTokens: 4500 })

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plans = JSON.parse(cleaned) as CompetencyPlan[]

    cache.set(cacheKey, { data: plans, ts: Date.now() })
    return NextResponse.json(plans)
  } catch (err) {
    console.error('Plan API error:', err)

    // Fallback: generate static plans so the user always sees something
    const fallbackPlans = generateFallbackPlans(parsedBlocks)
    return NextResponse.json(fallbackPlans)
  }
}

function generateFallbackPlans(blocks: FunctionalBlock[]): CompetencyPlan[] {
  return blocks.map(block => ({
    blockId: block.id,
    steps: [
      {
        type: 'entiende' as const,
        title: `Cómo la IA transforma ${block.name.toLowerCase()}`,
        description: `La inteligencia artificial está cambiando cómo se aborda ${block.name.toLowerCase()}. Investiga qué tareas ya pueden automatizarse y cuáles requieren tu criterio profesional.`,
      },
      {
        type: 'pruebalo' as const,
        title: `Experimenta con IA en ${block.name.toLowerCase()}`,
        description: `Usa una herramienta de IA para resolver un caso real de tu día a día relacionado con ${block.name.toLowerCase()}.`,
        tool: 'Claude',
        prompt: `Ayúdame a mejorar mi proceso de ${block.name.toLowerCase()} paso a paso`,
      },
      {
        type: 'dominalo' as const,
        title: `Formación especializada en IA aplicada`,
        description: `Busca formación que combine ${block.name.toLowerCase()} con herramientas de inteligencia artificial para profesionales.`,
        courseQuery: `${block.name} artificial intelligence`,
        platform: 'Coursera' as const,
      },
    ],
  }))
}
