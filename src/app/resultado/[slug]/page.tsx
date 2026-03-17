import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ResultadoPage({ params }: Props) {
  const { slug } = await params
  const role = slug.replace(/-/g, ' ')

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-5 py-16 text-center"
      style={{ background: '#0B0E1A' }}
    >
      <p
        className="text-sm font-medium tracking-widest uppercase mb-6"
        style={{ color: '#8895B0', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Analizando
      </p>
      <h1
        className="mb-4 capitalize"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
          fontWeight: 700,
          color: '#E8ECF4',
          letterSpacing: '-0.02em',
        }}
      >
        {role}
      </h1>
      <p className="mb-10 text-lg" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
        Esta pantalla está en construcción. El análisis de tu rol llegará pronto.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200"
        style={{
          background: 'rgba(110,92,255,0.15)',
          border: '1px solid rgba(110,92,255,0.3)',
          color: '#A89BFF',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        ← Volver al inicio
      </Link>
    </main>
  )
}
