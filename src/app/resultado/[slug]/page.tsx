import { ResultFlow } from '@/components/ResultFlow'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ResultadoPage({ params }: Props) {
  const { slug } = await params
  return <ResultFlow slug={slug} />
}
