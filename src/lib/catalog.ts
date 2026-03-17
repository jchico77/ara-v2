import type { RoleProfile } from './types'
import mockCatalog from '@/data/mock-catalog.json'

const catalog = mockCatalog as RoleProfile[]

/** Find a role by exact slug match, or return the first entry as fallback */
export function findRole(slug: string): RoleProfile {
  return catalog.find(r => r.slug === slug) ?? catalog[0]
}

/** List all available slugs (for autocomplete later) */
export function allSlugs(): string[] {
  return catalog.map(r => r.slug)
}
