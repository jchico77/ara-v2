import type { Metadata } from 'next'
import { PlanFlow } from '@/components/PlanFlow'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return {
    title: `Plan de Acción · ${title}`,
    description: `Tu plan personalizado de 3 competencias para dominar la IA como ${title}.`,
  }
}

export default async function PlanPage({ params }: Props) {
  const { slug } = await params
  return <PlanFlow slug={slug} />
}
