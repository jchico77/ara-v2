import { NextResponse } from 'next/server'
import { llm } from '@/lib/llm'
import type { FunctionalBlock } from '@/lib/types'

// Edge runtime: 30s timeout on Hobby plan (vs 10s for Node serverless)
export const runtime = 'edge'

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

    const system = `Genera un plan de acción profesional para adaptarse a la IA. Para cada competencia, genera 3 pasos. Responde SOLO JSON válido, sin markdown.

Formato exacto:
[{"blockId":"id","steps":[
{"type":"entiende","title":"máx 7 palabras","description":"2 frases sobre cómo la IA cambia esta área"},
{"type":"pruebalo","title":"máx 7 palabras","description":"ejercicio concreto","tool":"Claude|ChatGPT|Perplexity|GitHub Copilot|Notion AI","prompt":"prompt listo para copiar, máx 100 chars"},
{"type":"dominalo","title":"máx 7 palabras","description":"qué formación buscar","courseQuery":"término de búsqueda","platform":"Coursera|Udemy|LinkedIn Learning"}
]}]

Reglas: segunda persona, específico al rol, accionable. Cada plan debe ser ÚNICO para la competencia concreta, no genérico.`

    const user = `Rol: ${title}
Competencias (id, nombre, categoría, dirección, score):
${parsedBlocks.map(b => `- id:${b.id} "${b.name}" ${b.category} ${b.direction} ${b.score}/100`).join('\n')}`

    const raw = await llm(system, user, { maxTokens: 2500 })

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plans = JSON.parse(cleaned) as CompetencyPlan[]

    cache.set(cacheKey, { data: plans, ts: Date.now() })
    return NextResponse.json(plans)
  } catch (err) {
    console.error('Plan API error:', err)
    return NextResponse.json(
      { error: 'Plan generation failed', detail: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
