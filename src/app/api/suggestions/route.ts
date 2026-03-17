import { NextResponse } from 'next/server'
import { allSlugs, findRole } from '@/lib/catalog'

// Pre-built list so we don't recompute per request
let suggestions: { slug: string; title: string }[] | null = null

function getSuggestions() {
  if (!suggestions) {
    suggestions = allSlugs().map(slug => ({
      slug,
      title: findRole(slug).title,
    }))
  }
  return suggestions
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase() ?? ''

  if (q.length < 2) return NextResponse.json([])

  const all = getSuggestions()

  // Normalize query for accent-insensitive matching
  const normalized = q
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const matches = all.filter(({ title }) => {
    const norm = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    return norm.includes(normalized)
  })

  return NextResponse.json(matches.slice(0, 6))
}
