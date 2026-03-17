import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Metodología · AI Role Analyzer',
  description: 'Cómo calculamos el Multiplicador IA y los arquetipos profesionales. Basado en O*NET, Anthropic Economic Index y metodología Eloundou et al. (2023).',
}

const SOURCES = [
  {
    name: 'Eloundou et al. (2023) — GPTs are GPTs',
    url: 'https://arxiv.org/abs/2303.10130',
    description: 'Marco de referencia para calcular la exposición de tareas profesionales a la IA generativa (E0, E1, E2). Base del modelo de scoring de bloques funcionales.',
  },
  {
    name: 'O*NET OnLine (v29.1)',
    url: 'https://www.onetonline.org/',
    description: 'Base de datos de ocupaciones del Departamento de Trabajo de EEUU. 900+ ocupaciones con descripciones detalladas de tareas, skills y actividades de trabajo.',
  },
  {
    name: 'Anthropic Economic Index',
    url: 'https://www.anthropic.com/news/the-anthropic-economic-index',
    description: 'Datos observacionales de cómo se usa Claude en el trabajo real. Categorías ocupacionales con speedup medio observado, base del cálculo del Multiplicador IA.',
  },
  {
    name: 'WORKBank / SBTF (Stanford)',
    url: 'https://workbank.stanford.edu/',
    description: 'Clasificación de tareas por exposición tecnológica y capacidades requeridas. Usado para identificar barreras de automatización (accountability, fisicalidad, relacionalidad).',
  },
  {
    name: 'LinkedIn Skills on the Rise 2025',
    url: 'https://www.linkedin.com/business/talent/blog/talent-strategy/linkedin-most-in-demand-hard-and-soft-skills',
    description: 'Informe de habilidades más demandadas por el mercado laboral. Usado para identificar las competencias emergentes del Plan de Acción.',
  },
]

const FAQ = [
  {
    q: '¿Qué es el Multiplicador IA?',
    a: 'Un número ≥1.0× que indica cuánto podría amplificarse la productividad de un profesional si adoptase las herramientas de IA adecuadas para su rol. Se calcula como 1 / (1 - β × factor_speedup), donde β es la exposición ponderada del rol y el factor_speedup se calibra con datos del Anthropic Economic Index. Rango típico: 1.2× a 5.0×.',
  },
  {
    q: '¿Qué son los 5 arquetipos?',
    a: 'Los arquetipos no son una clasificación del nivel de amenaza de la IA, sino del patrón de adaptación más natural para cada perfil. Se determinan por la distribución de scores entre los 6 bloques funcionales, la dirección dominante (automatización vs aumentación) y el nivel de barreras humanas. Un mismo título puede dar diferentes arquetipos según el contexto.',
  },
  {
    q: '¿Por qué el Multiplicador siempre es positivo?',
    a: 'Incluso un rol con baja exposición directa a la IA tiene un multiplicador >1.0× porque alguna parte de su trabajo (documentación, búsqueda de información, comunicación escrita) se acelera con IA. Un multiplicador bajo se interpreta como "tu trabajo es tan humano que la IA tiene poco que añadir" — que también es una ventaja competitiva.',
  },
  {
    q: '¿Con qué frecuencia se actualiza el catálogo?',
    a: 'El catálogo base de roles se actualiza trimestralmente. En cada actualización revisamos los anuncios de los principales laboratorios de IA, las publicaciones del Anthropic Economic Index, y los informes sectoriales de McKinsey, BCG y WEF para reflejar el estado actual de las capacidades de la IA.',
  },
  {
    q: '¿Es el análisis personalizado o genérico?',
    a: 'El catálogo base es precalculado (datos reales de O*NET y Anthropic Economic Index). En runtime, un LLM (Claude Sonnet) personaliza las narrativas al contexto específico: nivel de seniority, sector, y variaciones del rol. El Plan de Acción es generado en tiempo real para tu perfil específico.',
  },
]

export default function MetodologiaPage() {
  return (
    <div style={{ background: '#0B0E1A', minHeight: '100dvh' }}>
      <main className="flex flex-col items-center px-5 py-12 pb-20">
        <div className="w-full max-w-xl">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium mb-10"
            style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Volver al inicio
          </Link>

          {/* Header */}
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Metodología
          </h1>
          <p
            className="text-base leading-relaxed mb-12"
            style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
          >
            El análisis combina datos de ocupaciones de O*NET con el marco de exposición de Eloundou et al. (2023),
            calibrado con datos observacionales del Anthropic Economic Index. Las narrativas se personalizan
            en tiempo real mediante Claude Sonnet.
          </p>

          {/* The multiplier */}
          <section className="mb-12">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              El Multiplicador IA
            </h2>
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#C0C8DC', fontFamily: 'DM Sans, sans-serif' }}>
                Partimos del score β de Eloundou: exposición ponderada de las tareas del rol a la IA generativa (E1 + 0.5×E2).
              </p>
              <div
                className="rounded-xl px-4 py-3 mb-3 text-sm"
                style={{ background: 'rgba(110,92,255,0.08)', border: '1px solid rgba(110,92,255,0.15)', color: '#A89BFF', fontFamily: 'DM Mono, monospace' }}
              >
                Multiplicador = 1 / (1 − β × factor_speedup)
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#C0C8DC', fontFamily: 'DM Sans, sans-serif' }}>
                El <em>factor_speedup</em> se calibra con datos del Anthropic Economic Index: speedup medio observado
                por categoría ocupacional en sesiones reales de trabajo con Claude. Rango típico: 1.2× (roles altamente humanos)
                a 5.0× (roles de producción de información).
              </p>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Fuentes de datos
            </h2>
            <div className="space-y-3">
              {SOURCES.map(s => (
                <div
                  key={s.name}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold mb-1 block hover:underline"
                    style={{ color: '#A89BFF', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {s.name} ↗
                  </a>
                  <p className="text-sm leading-relaxed" style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}>
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <div key={q}>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: '#E8ECF4', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {q}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#8895B0', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer note */}
          <p
            className="text-xs leading-relaxed text-center"
            style={{ color: 'rgba(136,149,176,0.5)', fontFamily: 'DM Sans, sans-serif' }}
          >
            El análisis es orientativo y educativo. Los datos base se actualizan trimestralmente.
            No representa asesoramiento profesional sobre empleo o carrera.
          </p>
        </div>
      </main>
    </div>
  )
}
