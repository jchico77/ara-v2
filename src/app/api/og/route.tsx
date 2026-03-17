import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const ARCHETYPE_COLORS: Record<string, string> = {
  orquestador: '#6E5CFF',
  estratega: '#0A66C2',
  acelerado: '#22C088',
  conector: '#E8A830',
  pionero: '#EF4060',
}

const ARCHETYPE_NAMES: Record<string, string> = {
  orquestador: 'El Orquestador',
  estratega: 'El Estratega',
  acelerado: 'El Acelerado',
  conector: 'El Conector',
  pionero: 'El Pionero',
}

const ARCHETYPE_TAGLINES: Record<string, string> = {
  orquestador: 'Diriges equipos humano-IA',
  estratega: 'Tu valor está en las decisiones que la IA no puede tomar',
  acelerado: 'La IA multiplica tu productividad',
  conector: 'Conectas mundos que la IA no puede conectar',
  pionero: 'En la frontera del cambio',
}

const ARCHETYPE_ICONS: Record<string, string> = {
  orquestador: '🎭',
  estratega: '♟',
  acelerado: '⚡',
  conector: '🔗',
  pionero: '🚀',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const rawTitle = searchParams.get('title') ?? 'Mi Rol Profesional'
  const archetype = searchParams.get('archetype') ?? 'acelerado'
  const multiplier = parseFloat(searchParams.get('multiplier') ?? '2.5')

  // Capitalize title
  const title = rawTitle
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const color = ARCHETYPE_COLORS[archetype] ?? '#6E5CFF'
  const archetypeName = ARCHETYPE_NAMES[archetype] ?? archetype
  const tagline = ARCHETYPE_TAGLINES[archetype] ?? ''
  const icon = ARCHETYPE_ICONS[archetype] ?? '🤖'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '627px',
          background: '#0B0E1A',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 72px',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow behind archetype color */}
        <div
          style={{
            position: 'absolute',
            top: '-180px',
            right: '-120px',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: color,
            opacity: 0.1,
            filter: 'blur(90px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: color,
            opacity: 0.06,
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />

        {/* Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#8895B0',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Análisis de Impacto IA
          </div>
          <div style={{ width: '1px', height: '16px', background: '#8895B030', display: 'flex' }} />
          <div
            style={{
              fontSize: '13px',
              color: `${color}99`,
              letterSpacing: '0.1em',
              display: 'flex',
            }}
          >
            ara.ai
          </div>
        </div>

        {/* Role title */}
        <div
          style={{
            fontSize: title.length > 30 ? '44px' : '54px',
            fontWeight: 700,
            color: '#E8ECF4',
            lineHeight: 1.1,
            marginBottom: '28px',
            maxWidth: '750px',
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Archetype badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 22px',
              borderRadius: '100px',
              background: `${color}18`,
              border: `1px solid ${color}40`,
            }}
          >
            <span style={{ fontSize: '22px', display: 'flex' }}>{icon}</span>
            <span style={{ fontSize: '20px', fontWeight: 600, color, display: 'flex' }}>
              {archetypeName}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '18px',
            color: '#8895B0',
            marginBottom: 'auto',
            display: 'flex',
          }}
        >
          {tagline}
        </div>

        {/* Bottom row: multiplier + CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                fontSize: '13px',
                color: '#8895B0',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              Potencial de amplificación
            </div>
            <div
              style={{
                fontSize: '80px',
                fontWeight: 700,
                color,
                lineHeight: 1,
                display: 'flex',
              }}
            >
              {multiplier.toFixed(1)}×
            </div>
          </div>

          <div
            style={{
              padding: '18px 36px',
              borderRadius: '100px',
              background: `${color}18`,
              border: `1px solid ${color}40`,
              fontSize: '17px',
              color: '#E8ECF4',
              display: 'flex',
            }}
          >
            Analiza tu perfil →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 627,
    }
  )
}
