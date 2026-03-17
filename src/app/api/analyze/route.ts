import { NextResponse } from 'next/server'
import { mapRoleToCatalog } from '@/lib/mapper'
import { narrateBlocks, applyNarration } from '@/lib/narrator'
import { findRole } from '@/lib/catalog'
import type { RoleProfile, FunctionalBlock } from '@/lib/types'

// Simple in-memory cache (survives within a single serverless invocation)
const cache = new Map<string, { data: RoleProfile; ts: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const roleInput = (body.role_input as string)?.trim()

    if (!roleInput || roleInput.length < 2) {
      return NextResponse.json({ error: 'role_input is required (min 2 chars)' }, { status: 400 })
    }

    if (roleInput.length > 200) {
      return NextResponse.json({ error: 'role_input too long (max 200 chars)' }, { status: 400 })
    }

    // Check cache
    const cacheKey = roleInput.toLowerCase()
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    // Step 1: Map input to catalog role(s)
    const mapping = await mapRoleToCatalog(roleInput)

    // Step 2: Get catalog data (weighted merge if multiple matches)
    let profile: RoleProfile
    if (mapping.matches.length === 1) {
      profile = findRole(mapping.matches[0].slug)
    } else {
      profile = mergeProfiles(mapping.matches)
    }

    // Override the title with a display-friendly version of the input
    profile = { ...profile, title: titleCase(roleInput) }

    // Step 3: Personalize narratives via LLM
    try {
      const narrated = await narrateBlocks({
        title: profile.title,
        seniority: mapping.detected_seniority,
        sector: mapping.detected_sector,
        blocks: profile.blocks,
      })
      profile = applyNarration(profile, narrated)
    } catch {
      // If narrator fails, keep the pre-calculated narratives from catalog
    }

    // Step 4: Generate slug for the result URL
    const slug = roleInput
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const result: RoleProfile = { ...profile, slug }

    // Cache the result
    cache.set(cacheKey, { data: result, ts: Date.now() })

    return NextResponse.json(result)
  } catch (err) {
    console.error('Analyze API error:', err)
    return NextResponse.json(
      { error: 'Error analyzing role. Please try again.' },
      { status: 500 }
    )
  }
}

/** Merge multiple catalog profiles using weighted average for scores/multiplier */
function mergeProfiles(matches: { slug: string; weight: number }[]): RoleProfile {
  const profiles = matches.map(m => ({ profile: findRole(m.slug), weight: m.weight }))

  // Use the highest-weighted profile as base
  const base = profiles.sort((a, b) => b.weight - a.weight)[0].profile

  // Weighted average for multiplier
  const multiplier = profiles.reduce((sum, p) => sum + p.profile.multiplier * p.weight, 0)

  // Merge blocks: use base blocks but adjust scores with weighted average
  const blocks: FunctionalBlock[] = base.blocks.map((block, i) => {
    const weightedScore = profiles.reduce((sum, p) => {
      const correspondingBlock = p.profile.blocks[i]
      return sum + (correspondingBlock?.score ?? block.score) * p.weight
    }, 0)
    return { ...block, score: Math.round(weightedScore) }
  })

  return {
    ...base,
    multiplier: Math.round(multiplier * 10) / 10,
    blocks,
  }
}

function titleCase(str: string): string {
  const minorWords = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'en', 'y', 'e', 'o', 'u', 'a'])
  return str
    .toLowerCase()
    .split(' ')
    .map((word, i) => {
      if (i > 0 && minorWords.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
