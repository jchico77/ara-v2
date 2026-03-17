import type { Metadata } from 'next'
import { ResultFlow } from '@/components/ResultFlow'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ archetype?: string; multiplier?: string; title?: string; ref?: string }>
}

function titleCase(str: string): string {
  const minor = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'en', 'y', 'e', 'o', 'u', 'a'])
  return str
    .split(' ')
    .map((w, i) => (i > 0 && minor.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ')
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const sp = await searchParams

  const rawTitle = sp.title ? decodeURIComponent(sp.title) : slug.replace(/-/g, ' ')
  const displayTitle = titleCase(rawTitle)
  const archetype = sp.archetype ?? 'acelerado'
  const multiplier = sp.multiplier ?? '2.5'

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3333'
  const ogUrl = `${baseUrl}/api/og?title=${encodeURIComponent(rawTitle)}&archetype=${encodeURIComponent(archetype)}&multiplier=${multiplier}`

  const description = `Descubre el impacto de la IA en el rol de ${displayTitle}. Potencial de amplificación: ${multiplier}×`

  return {
    title: `${displayTitle} · Análisis IA`,
    description,
    openGraph: {
      title: `${displayTitle} · Análisis de Impacto IA`,
      description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 627,
          alt: `Perfil IA: ${displayTitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayTitle} · Análisis IA`,
      description,
      images: [ogUrl],
    },
  }
}

export default async function ResultadoPage({ params }: Props) {
  const { slug } = await params
  return <ResultFlow slug={slug} />
}
